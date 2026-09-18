import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  getAllPrices,
  upsertPrice,
  updatePriceById,
} from "./price.service.js";

export const fetchAllPrices = asyncHandler(async (req, res) => {
  const data = await getAllPrices();
  return sendSuccess(res, "Prices fetched successfully", data, 200);
});

export const createOrUpdatePrice = asyncHandler(async (req, res) => {
  const { metal, price, unit } = req.body;

  const data = await upsertPrice(
    {
      metal,
      price,
      unit,
    },
    req.user._id
  );

  return sendSuccess(res, "Price saved successfully", data, 200);
});

export const updatePrice = asyncHandler(async (req, res) => {
  const { price } = req.body;

  const data = await updatePriceById(req.params.id, price, req.user._id);

  return sendSuccess(res, "Price updated successfully", data, 200);
});