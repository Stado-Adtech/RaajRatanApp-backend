import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createSchemeEnrollment,
  getMySchemeEnrollmentsService,
  getSchemeEnrollmentByIdService,
} from "./schemeEnrollment.service.js";

export const startSchemeEnrollment = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const data = await createSchemeEnrollment(userId, req.body);

  return sendSuccess(
    res,
    "Scheme enrollment started successfully",
    data,
    201
  );
});

export const getMySchemeEnrollments = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  const data = await getMySchemeEnrollmentsService(userId);

  return sendSuccess(
    res,
    "Scheme enrollments fetched successfully",
    data,
    200
  );
});

export const getSchemeEnrollmentById = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const enrollmentId = req.params.id;

  const data = await getSchemeEnrollmentByIdService(userId, enrollmentId);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Scheme enrollment not found",
    });
  }

  return sendSuccess(
    res,
    "Scheme enrollment fetched successfully",
    data,
    200
  );
});