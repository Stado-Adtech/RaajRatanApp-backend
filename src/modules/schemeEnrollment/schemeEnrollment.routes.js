import express from "express";
import {
  startSchemeEnrollment,
  getMySchemeEnrollments,
  getSchemeEnrollmentById,
} from "./schemeEnrollment.controller.js";

import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", protect, startSchemeEnrollment);
router.get("/my", protect, getMySchemeEnrollments);
router.get("/:id", protect, getSchemeEnrollmentById);

export default router;