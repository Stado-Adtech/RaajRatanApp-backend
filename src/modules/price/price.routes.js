import express from "express";
import {
  fetchAllPrices,
  createOrUpdatePrice,
  updatePrice,
} from "./price.controller.js";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", fetchAllPrices);
router.post("/", protect, adminOnly, createOrUpdatePrice);
router.put("/:id", protect, adminOnly, updatePrice);

export default router;