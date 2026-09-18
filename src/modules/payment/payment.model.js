// src/modules/payment/payment.model.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchemeEnrollment",
      required: true,
    },
    installmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,       // Razorpay order_id e.g. "order_Pxxxxxxxxxx"
    },
    amount: {
      type: Number,
      required: true,     // stored in ₹ (not paise)
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Razorpay specific fields
    razorpayOrderId: {
      type: String,
      default: null,      // same as orderId but kept for clarity
    },
    razorpayPaymentId: {
      type: String,
      default: null,      // returned after payment success e.g. "pay_Pxxxxxxxxxx"
    },
    razorpaySignature: {
      type: String,
      default: null,      // HMAC-SHA256 signature for verification
    },
    paymentMode: {
      type: String,
      default: null,      // "upi" | "card" | "netbanking" | "wallet"
    },
    failureReason: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "cancelled"],
      default: "created",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);