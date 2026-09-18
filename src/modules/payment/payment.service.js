// // // src/modules/payment/payment.service.js
import crypto from "crypto";
import getRazorpay from "../../config/razorpay.js";
import Payment from "./payment.model.js";
import SchemeEnrollment from "../schemeEnrollment/schemeEnrollment.model.js";
import { createNotification } from "../notification/notification.service.js";

const createOrderId = () =>
  `JLSL_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export const createRazorpayPaymentService = async ({
  user,
  enrollmentId,
  installmentId,
  amount,
}) => {
  const enrollment = await SchemeEnrollment.findOne({
    _id: enrollmentId,
    userId: user._id,
    status: "active",
  });

  if (!enrollment) {
    const error = new Error("Scheme enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  const installment = enrollment.installments.id(installmentId);

  if (!installment) {
    const error = new Error("Installment not found");
    error.statusCode = 404;
    throw error;
  }

  if (installment.status === "paid") {
    const error = new Error("Installment already paid");
    error.statusCode = 400;
    throw error;
  }

  let payAmount;

  if (enrollment.installmentType === "flexible") {
    if (!amount || amount <= 0) {
      const error = new Error("A valid amount is required");
      error.statusCode = 400;
      throw error;
    }

    const isFirstInstallment = installment.monthNumber === 1;

    if (isFirstInstallment) {
      if (enrollment.minStartAmount && amount < enrollment.minStartAmount) {
        const error = new Error(
          `Minimum starting amount is ₹${enrollment.minStartAmount}`
        );
        error.statusCode = 400;
        throw error;
      }
    } else {
      if (enrollment.minimumAmount == null) {
        const error = new Error("Pay your first installment before this one");
        error.statusCode = 400;
        throw error;
      }
      if (amount < enrollment.minimumAmount) {
        const error = new Error(
          `Amount must be at least ₹${enrollment.minimumAmount} (your month 1 amount)`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    payAmount = amount;
  } else {
    payAmount = installment.amount;
  }

  const internalOrderId = createOrderId();
  const razorpay = getRazorpay();

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(payAmount * 100),
    currency: "INR",
    receipt: internalOrderId,
    notes: {
      enrollmentId: enrollment._id.toString(),
      installmentId: installment._id.toString(),
      userId: user._id.toString(),
      schemeName: enrollment.schemeName,
      monthNumber: installment.monthNumber.toString(),
    },
  });

  await Payment.create({
    userId: user._id,
    enrollmentId: enrollment._id,
    installmentId: installment._id,
    orderId: internalOrderId,
    razorpayOrderId: razorpayOrder.id,
    amount: payAmount,
    currency: "INR",
    status: "created",
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    orderId: internalOrderId,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    schemeName: enrollment.schemeName,
    monthNumber: installment.monthNumber,
    userName: user.name || "Customer",
    userEmail: user.email || "",
    userPhone: user.phone || "",
  };
};

export const verifyRazorpayPaymentService = async ({
  user,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    const error = new Error("Payment signature verification failed");
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.findOne({ razorpayOrderId, userId: user._id });

  if (!payment) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === "paid") {
    const error = new Error("Payment already verified");
    error.statusCode = 400;
    throw error;
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "paid";
  payment.paidAt = new Date();

  try {
    const razorpay = getRazorpay();
    const rzpPayment = await razorpay.payments.fetch(razorpayPaymentId);
    payment.paymentMode = rzpPayment.method;
  } catch (err) {
    console.error("Could not fetch payment mode:", err.message);
  }

  await payment.save();

  const enrollment = await SchemeEnrollment.findOne({
    _id: payment.enrollmentId,
    userId: user._id,
  });

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  const installment = enrollment.installments.id(payment.installmentId);

  if (installment && installment.status !== "paid") {
    installment.status = "paid";
    installment.paidAt = new Date();
    installment.transactionId = payment._id;
    installment.amount = payment.amount;

    enrollment.paidInstallments += 1;
    enrollment.totalPaid += payment.amount;

    if (
      enrollment.installmentType === "flexible" &&
      enrollment.minimumAmount == null &&
      installment.monthNumber === 1
    ) {
      enrollment.minimumAmount = payment.amount;
    }

    const nextPending = enrollment.installments.find(
      (item) => item.status === "pending"
    );

    if (nextPending) {
      enrollment.nextDueDate = nextPending.dueDate;
    } else {
      enrollment.status = "completed";
      enrollment.nextDueDate = null;
    }

    await enrollment.save();

    await createNotification({
      userId: payment.userId,
      title: "Payment Successful 🎉",
      message: `Your scheme installment of ₹${payment.amount} has been received successfully.`,
      type: "payment",
      data: {
        enrollmentId: enrollment._id.toString(),
        installmentId: installment._id.toString(),
        paymentId: payment._id.toString(),
      },
      sendPush: true,
    });
  }

  return { payment, enrollment };
};

export const getPaymentStatusService = async ({ orderId, userId }) => {
  const payment = await Payment.findOne({ orderId, userId });

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    orderId: payment.orderId,
    razorpayOrderId: payment.razorpayOrderId,
    status: payment.status,
    amount: payment.amount,
    paymentMode: payment.paymentMode,
    paidAt: payment.paidAt,
    failureReason: payment.failureReason,
  };
};

export const getMyPaymentsService = async ({ userId, enrollmentId }) => {
  const filter = { userId };
  if (enrollmentId) filter.enrollmentId = enrollmentId;

  const payments = await Payment.find(filter).sort({ createdAt: -1 }).limit(50);

  return payments.map((p) => ({
    orderId: p.orderId,
    status: p.status,
    amount: p.amount,
    currency: p.currency,
    paymentMode: p.paymentMode,
    paidAt: p.paidAt,
    createdAt: p.createdAt,
    enrollmentId: p.enrollmentId,
  }));
};

export const recordFailedPaymentService = async ({ user, orderId, reason }) => {
  const payment = await Payment.findOne({ orderId, userId: user._id });

  if (!payment) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  if (payment.status !== "paid") {
    payment.status = "failed";
    payment.failureReason = reason || "Payment failed";
    await payment.save();
  }

  await createNotification({
    userId: user._id,
    title: "Payment Failed",
    message: `Your payment of ₹${payment.amount} could not be completed. Please try again.`,
    type: "payment_failed",
    data: {
      orderId: payment.orderId,
      enrollmentId: payment.enrollmentId?.toString(),
    },
    sendPush: true,
  });


  return payment;
};