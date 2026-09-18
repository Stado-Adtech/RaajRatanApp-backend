import SchemeEnrollment from "./schemeEnrollment.model.js";
import User from "../user/user.model.js";
import { createNotification } from "../notification/notification.service.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const sendDueSchemeReminders = async () => {
  const tomorrow = addDays(new Date(), 1);

  const dueStart = startOfDay(tomorrow);
  const dueEnd = endOfDay(tomorrow);

  const enrollments = await SchemeEnrollment.find({
    status: "active",
    installments: {
      $elemMatch: {
        status: "pending",
        dueDate: {
          $gte: dueStart,
          $lte: dueEnd,
        },
      },
    },
  });

  for (const enrollment of enrollments) {
    const user = await User.findById(enrollment.userId);

    if (!user) continue;

    const dueInstallment = enrollment.installments.find((item) => {
      return (
        item.status === "pending" &&
        item.dueDate >= dueStart &&
        item.dueDate <= dueEnd
      );
    });

    if (!dueInstallment) continue;

    await createNotification({
      userId: user._id,
      title: "Scheme Payment Reminder",
      message: `Your ${enrollment.schemeName} installment of ₹${dueInstallment.amount} is due tomorrow.`,
      type: "scheme_reminder",
      data: {
        enrollmentId: enrollment._id.toString(),
        installmentId: dueInstallment._id.toString(),
      },
      sendPush: true,
    });
  }

  return enrollments.length;
};