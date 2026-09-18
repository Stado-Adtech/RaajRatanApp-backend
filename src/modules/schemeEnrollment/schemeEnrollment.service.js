import SchemeEnrollment from "./schemeEnrollment.model.js";
import Scheme from "../scheme/scheme.model.js";
import { createNotification } from "../notification/notification.service.js";

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const createSchemeEnrollment = async (userId, payload) => {
  const { schemeId, monthlyAmount } = payload;

  if (!schemeId) {
    const error = new Error("schemeId is required");
    error.statusCode = 400;
    throw error;
  }

  const scheme = await Scheme.findOne({ _id: schemeId, isActive: true });

  if (!scheme) {
    const error = new Error("Scheme not found or no longer active");
    error.statusCode = 404;
    throw error;
  }

  let resolvedMonthlyAmount = null;

  if (scheme.installmentType === "fixed") {
    if (!monthlyAmount || monthlyAmount <= 0) {
      const error = new Error("A valid monthlyAmount is required for this scheme");
      error.statusCode = 400;
      throw error;
    }
    resolvedMonthlyAmount = monthlyAmount;
  } else {
    // Flexible scheme: enforce the scheme's minimum starting amount, if the
    // caller already sent one at enrollment time. If not sent here, it gets
    // enforced later at the Month 1 payment step instead — either is fine,
    // this is just an early fail-fast when possible.
    if (
      monthlyAmount &&
      scheme.minStartAmount &&
      monthlyAmount < scheme.minStartAmount
    ) {
      const error = new Error(
        `Minimum starting amount for this scheme is ₹${scheme.minStartAmount}`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const activeEnrollment = await SchemeEnrollment.findOne({
    userId,
    schemeId,
    status: "active",
  });

  if (activeEnrollment) {
    const error = new Error(
      "You already have an active enrollment for this scheme. Complete or cancel it before starting a new one."
    );
    error.statusCode = 409;
    error.existingEnrollmentId = activeEnrollment._id;
    throw error;
  }

  const now = new Date();
  const maturityDate = addMonths(now, scheme.totalMonths);

  const installments = Array.from({ length: scheme.totalMonths }, (_, index) => ({
    monthNumber: index + 1,
    amount: scheme.installmentType === "flexible" ? null : resolvedMonthlyAmount,
    status: "pending",
    dueDate: addMonths(now, index),
    paidAt: null,
    transactionId: null,
  }));

  const enrollment = await SchemeEnrollment.create({
    userId,
    schemeId,
    schemeName: scheme.name,
    schemeDescription: scheme.description,
    schemeImage: scheme.imageUrl,
    installmentType: scheme.installmentType,
    monthlyAmount: resolvedMonthlyAmount,
    minimumAmount: null,
    minStartAmount: scheme.installmentType === "flexible" ? scheme.minStartAmount : null,
    bonusMonths: scheme.bonusMonths, // snapshot so a later scheme edit doesn't retroactively change past enrollments
    totalInstallments: scheme.totalMonths,
    paidInstallments: 0,
    totalPaid: 0,
    status: "active",
    startDate: now,
    nextDueDate: now,
    maturityDate,
    installments,
  });

  // Notify — scheme activated
  await createNotification({
    userId,
    title: "Scheme Activated 🎉",
    message: `Your ${scheme.name} has been activated successfully. Start paying your monthly installments!`,
    type: "scheme_created",
    data: {
      enrollmentId: enrollment._id.toString(),
      schemeId: scheme._id.toString(),
    },
    sendPush: true,
  });

  return enrollment;
};

export const getMySchemeEnrollmentsService = async (userId) => {
  return SchemeEnrollment.find({ userId }).sort({ createdAt: -1 });
};

export const getSchemeEnrollmentByIdService = async (userId, enrollmentId) => {
  return SchemeEnrollment.findOne({ _id: enrollmentId, userId });
};