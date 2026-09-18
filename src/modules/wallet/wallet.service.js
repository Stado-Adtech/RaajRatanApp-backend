import crypto from "crypto";
import getRazorpay from "../../config/razorpay.js";
import Wallet from "./wallet.model.js";
import WalletTransaction from "./walletTransaction.model.js";

const createOrderId = () =>
  `WLT_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0 });
  }
  return wallet;
};

// ── STEP 1: POST /api/wallet/topup/create ─────────────────────
export const createWalletTopupService = async ({ user, amount }) => {
  if (!amount || amount <= 0) {
    const error = new Error("A valid amount is required");
    error.statusCode = 400;
    throw error;
  }

  const wallet = await getOrCreateWallet(user._id);
  const internalOrderId = createOrderId();

  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: internalOrderId,
    notes: {
      userId: user._id.toString(),
      purpose: "wallet_topup",
    },
  });

  await WalletTransaction.create({
    userId: user._id,
    type: "credit",
    amount,
    source: "razorpay_topup",
    status: "created",
    orderId: internalOrderId,
    razorpayOrderId: razorpayOrder.id,
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    orderId: internalOrderId,
    amount: razorpayOrder.amount,   // paise — Flutter SDK needs this
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    userName: user.name || "Customer",
    userEmail: user.email || "",
    userPhone: user.phone || "",
    currentBalance: wallet.balance,
  };
};

// ── STEP 2: POST /api/wallet/topup/verify ─────────────────────
export const verifyWalletTopupService = async ({
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

  const txn = await WalletTransaction.findOne({
    razorpayOrderId,
    userId: user._id,
  });

  if (!txn) {
    const error = new Error("Wallet transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (txn.status === "paid") {
    const error = new Error("Transaction already verified");
    error.statusCode = 400;
    throw error;
  }

  // Credit the wallet — this is the only place balance actually changes
  const wallet = await getOrCreateWallet(user._id);
  wallet.balance += txn.amount;
  await wallet.save();

  txn.razorpayPaymentId = razorpayPaymentId;
  txn.razorpaySignature = razorpaySignature;
  txn.status = "paid";
  txn.balanceAfter = wallet.balance;
  await txn.save();

  return { wallet, transaction: txn };
};

// ── GET /api/wallet/balance ────────────────────────────────────
export const getWalletBalanceService = async ({ userId }) => {
  const wallet = await getOrCreateWallet(userId);
  return { balance: wallet.balance };
};

// ── GET /api/wallet/transactions ──────────────────────────────
export const getWalletTransactionsService = async ({ userId }) => {
  const transactions = await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  return transactions.map((t) => ({
    orderId: t.orderId,
    type: t.type,
    amount: t.amount,
    source: t.source,
    status: t.status,
    balanceAfter: t.balanceAfter,
    createdAt: t.createdAt,
  }));
};