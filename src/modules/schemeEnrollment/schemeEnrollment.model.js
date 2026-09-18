import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema(
  {
    monthNumber: { type: Number, required: true },
    amount: { type: Number, default: null }, // null until paid, for flexible
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date, default: null },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  { _id: true }
);

const schemeEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    schemeId: { type: String, required: true },
    schemeName: { type: String, required: true },
    schemeDescription: { type: String, default: "" },
    schemeImage: { type: String, default: "" },

    installmentType: {
      type: String,
      enum: ["fixed", "flexible"],
      default: "fixed",
    },

    // Fixed schemes: the locked monthly amount. Flexible schemes: null.
    monthlyAmount: { type: Number, default: null },

    // Flexible schemes only: set once month 1 is paid, acts as the floor.
    minimumAmount: { type: Number, default: null },

    // Flexible schemes only: minimum required to start (e.g. ₹5000).
    minStartAmount: { type: Number, default: null },

    // Snapshot from Scheme at enrollment time — so editing the scheme later
    // doesn't retroactively change bonus rules for existing enrollments.
    // 0 for schemes like "Book My Gold Scheme" that have no bonus month.
    bonusMonths: { type: Number, default: 1 },

    totalInstallments: { type: Number, default: 11 },
    paidInstallments: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    startDate: { type: Date, required: true },
    nextDueDate: { type: Date, required: true },
    maturityDate: { type: Date, required: true },
    installments: [installmentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("SchemeEnrollment", schemeEnrollmentSchema);