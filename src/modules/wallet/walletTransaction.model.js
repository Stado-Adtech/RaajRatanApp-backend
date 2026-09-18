import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: { type: Number, required: true },
    source: {
      type: String,
      enum: ["razorpay_topup", "scheme_payment", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    orderId: String,           // internal order id
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    balanceAfter: Number,      // wallet balance snapshot after this txn
  },
  { timestamps: true }
);

export default mongoose.model("WalletTransaction", walletTransactionSchema);