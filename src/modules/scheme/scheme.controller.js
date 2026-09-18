import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import {
    createScheme,
    deleteScheme,
    getAllSchemes,
    getSchemeById,
    updateScheme,
} from "./scheme.service.js";

export const addScheme = asyncHandler(async (req, res) => {
    const data = await createScheme(req.body);
    return sendSuccess(res, "Scheme created successfully", data, 201);
});

export const fetchSchemes = asyncHandler(async (req, res) => {
    const data = await getAllSchemes();
    return sendSuccess(res, "Schemes fetched successfully", data, 200);
});

export const fetchSchemeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return sendError(res, "Scheme id is required", 400);
    }

    const data = await getSchemeById(id);
    return sendSuccess(res, "Scheme fetched successfully", data, 200);
});

export const editScheme = asyncHandler(async (req, res) => {
    const data = await updateScheme(req.params.id, req.body);
    return sendSuccess(res, "Scheme updated successfully", data, 200);
});

export const removeScheme = asyncHandler(async (req, res) => {
    await deleteScheme(req.params.id);
    return sendSuccess(res, "Scheme deleted successfully", null, 200);
});