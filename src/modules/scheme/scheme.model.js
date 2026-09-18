// import mongoose from "mongoose";

// const schemeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     imageUrl: {
//       type: String,
//       required: true,
//     },
//     detailImageUrl: {
//       type: String,
//       required: true,
//     },
//     // add this field to schemeSchema
//     installmentType: {
//       type: String,
//       enum: ["fixed", "flexible"],
//       default: "fixed",
//     },
//     installmentAmounts: {
//       type: [Number],
//       required: true,
//       validate: {
//         validator: (arr) => Array.isArray(arr) && arr.length > 0,
//         message: "installmentAmounts must have at least one value",
//       },
//     },
//     maturityText: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     benefits: {
//       type: [String],
//       default: [],
//     },
//     schemeType: {
//       type: String,
//       default: "11+1",
//     },
//     totalMonths: {
//       type: Number,
//       required: true,
//     },
//     bonusMonths: {
//       type: Number,
//       default: 1,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Scheme = mongoose.model("Scheme", schemeSchema);
// export default Scheme;
import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    detailImageUrl: { type: String, required: true },
    installmentAmounts: {
      type: [Number],
      default: [],
      // required only for fixed schemes — validated in the service layer
    },
    minStartAmount: {
      type: Number,
      default: null, // only meaningful for flexible schemes
    },
    maturityText: { type: String, required: true, trim: true },
    benefits: { type: [String], default: [] },
    schemeType: { type: String, default: "11+1" },
    totalMonths: { type: Number, required: true },
    bonusMonths: { type: Number, default: 1 },
    installmentType: {
      type: String,
      enum: ["fixed", "flexible"],
      default: "fixed",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Scheme = mongoose.model("Scheme", schemeSchema);
export default Scheme;