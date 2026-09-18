import express from "express";
import {
  addScheme,
  editScheme,
  fetchSchemeById,
  fetchSchemes,
  removeScheme,
} from "./scheme.controller.js";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public — used by Flutter app to browse schemes
router.get("/", fetchSchemes);
router.get("/:id", fetchSchemeById);

// Admin only — manage schemes
router.post("/", protect, adminOnly, addScheme);
router.put("/:id", protect, adminOnly, editScheme);
router.delete("/:id", protect, adminOnly, removeScheme);

export default router;