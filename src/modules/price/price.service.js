import Price from "./price.model.js";

const DEFAULT_PRICES = [
  { metal: "Gold 18K", price: 0, unit: "per gm" },
  { metal: "Gold 22K", price: 0, unit: "per gm" },
  { metal: "Gold 24K", price: 0, unit: "per gm" },
  { metal: "Silver 999", price: 0, unit: "per gm" },
  { metal: "Silver 925", price: 0, unit: "per gm" },
  { metal: "Silver 800", price: 0, unit: "per gm" },
];

export const seedDefaultPricesIfEmpty = async () => {
  const count = await Price.countDocuments();

  if (count === 0) {
    await Price.insertMany(DEFAULT_PRICES);
  }
};

export const getAllPrices = async () => {
  await seedDefaultPricesIfEmpty();
  return await Price.find().sort({ metal: 1 });
};

export const upsertPrice = async ({ metal, price, unit }, userId) => {
  const updated = await Price.findOneAndUpdate(
    { metal: metal.trim() },
    {
      metal: metal.trim(),
      price,
      unit: unit?.trim() || "per gm",
      updatedBy: userId,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated;
};

export const updatePriceById = async (id, price, userId) => {
  const updated = await Price.findByIdAndUpdate(
    id,
    {
      price,
      updatedBy: userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updated) {
    throw new Error("Price not found");
  }

  return updated;
};