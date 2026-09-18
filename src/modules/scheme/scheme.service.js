// import Scheme from "./scheme.model.js";

// // ── CREATE ──────────────────────────────────────────────────
// export const createScheme = async (payload) => {
//   const {
//     name,
//     description,
//     imageUrl,
//     detailImageUrl,
//     installmentAmounts,
//     maturityText,
//     benefits,
//     schemeType,
//     totalMonths,
//     bonusMonths,
//     isActive,
//   } = payload;

//   if (!name || !description || !imageUrl || !detailImageUrl) {
//     const error = new Error(
//       "name, description, imageUrl and detailImageUrl are required"
//     );
//     error.statusCode = 400;
//     throw error;
//   }

//   if (!Array.isArray(installmentAmounts) || installmentAmounts.length === 0) {
//     const error = new Error("installmentAmounts must be a non-empty array");
//     error.statusCode = 400;
//     throw error;
//   }

//   if (!totalMonths || totalMonths <= 0) {
//     const error = new Error("totalMonths is required and must be > 0");
//     error.statusCode = 400;
//     throw error;
//   }

//   const scheme = await Scheme.create({
//     name,
//     description,
//     imageUrl,
//     detailImageUrl,
//     installmentAmounts,
//     maturityText,
//     benefits: benefits || [],
//     schemeType: schemeType || "11+1",
//     totalMonths,
//     bonusMonths: bonusMonths ?? 1,
//     isActive: isActive ?? true,
//   });

//   return scheme;
// };

// // ── READ (public — active schemes only) ───────────────────────
// export const getAllSchemes = async () => {
//   return await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
// };

// // ── READ ONE ────────────────────────────────────────────────
// export const getSchemeById = async (id) => {
//   const scheme = await Scheme.findById(id);

//   if (!scheme) {
//     const error = new Error("Scheme not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   return scheme;
// };

// // ── UPDATE ──────────────────────────────────────────────────
// export const updateScheme = async (id, payload) => {
//   const scheme = await Scheme.findById(id);

//   if (!scheme) {
//     const error = new Error("Scheme not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   const allowedFields = [
//     "name",
//     "description",
//     "imageUrl",
//     "detailImageUrl",
//     "installmentAmounts",
//     "maturityText",
//     "benefits",
//     "schemeType",
//     "totalMonths",
//     "bonusMonths",
//     "isActive",
//   ];

//   allowedFields.forEach((field) => {
//     if (payload[field] !== undefined) {
//       scheme[field] = payload[field];
//     }
//   });

//   await scheme.save();
//   return scheme;
// };

// // ── DELETE ──────────────────────────────────────────────────
// export const deleteScheme = async (id) => {
//   const scheme = await Scheme.findById(id);

//   if (!scheme) {
//     const error = new Error("Scheme not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   await scheme.deleteOne();
//   return scheme;
// };

import Scheme from "./scheme.model.js";

export const createScheme = async (payload) => {
  const {
    name,
    description,
    imageUrl,
    detailImageUrl,
    installmentAmounts,
    maturityText,
    benefits,
    schemeType,
    totalMonths,
    bonusMonths,
    installmentType,
    isActive,
  } = payload;

  if (!name || !description || !imageUrl || !detailImageUrl) {
    const error = new Error(
      "name, description, imageUrl and detailImageUrl are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!totalMonths || totalMonths <= 0) {
    const error = new Error("totalMonths is required and must be > 0");
    error.statusCode = 400;
    throw error;
  }

  const resolvedType = installmentType === "flexible" ? "flexible" : "fixed";

  if (
    resolvedType === "fixed" &&
    (!Array.isArray(installmentAmounts) || installmentAmounts.length === 0)
  ) {
    const error = new Error(
      "installmentAmounts must be a non-empty array for fixed schemes"
    );
    error.statusCode = 400;
    throw error;
  }

  const scheme = await Scheme.create({
    name,
    description,
    imageUrl,
    detailImageUrl,
    installmentAmounts: resolvedType === "fixed" ? installmentAmounts : [],
    maturityText,
    benefits: benefits || [],
    schemeType: schemeType || "11+1",
    totalMonths,
    bonusMonths: bonusMonths ?? 1,
    installmentType: resolvedType,
    isActive: isActive ?? true,
  });

  return scheme;
};

export const getAllSchemes = async () => {
  return await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getSchemeById = async (id) => {
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    const error = new Error("Scheme not found");
    error.statusCode = 404;
    throw error;
  }
  return scheme;
};

export const updateScheme = async (id, payload) => {
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    const error = new Error("Scheme not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    "name",
    "description",
    "imageUrl",
    "detailImageUrl",
    "installmentAmounts",
    "maturityText",
    "benefits",
    "schemeType",
    "totalMonths",
    "bonusMonths",
    "installmentType",
    "isActive",
  ];

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      scheme[field] = payload[field];
    }
  });

  await scheme.save();
  return scheme;
};

export const deleteScheme = async (id) => {
  const scheme = await Scheme.findById(id);
  if (!scheme) {
    const error = new Error("Scheme not found");
    error.statusCode = 404;
    throw error;
  }
  await scheme.deleteOne();
  return scheme;
};