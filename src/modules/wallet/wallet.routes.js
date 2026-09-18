import express from "express";
import {
  createWalletTopup,
  verifyWalletTopup,
  getWalletBalance,
  getWalletTransactions,
} from "./wallet.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/topup/create",   protect, createWalletTopup);
router.post("/topup/verify",   protect, verifyWalletTopup);
router.get("/balance",         protect, getWalletBalance);
router.get("/transactions",    protect, getWalletTransactions);

export default router;