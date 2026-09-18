// src/scripts/seedSchemes.js
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "../modules/scheme/scheme.model.js";

dotenv.config();

const seedSchemes = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Scheme.deleteMany({}); // clears existing schemes first

  await Scheme.create({
    name: "The Gold Wallet (11+1)",
    description: "Pay a fixed monthly amount for 11 months and get 1 bonus month from the shop.",
    imageUrl: "lib/assets/images/banners/Banner_01.png",
    detailImageUrl: "lib/assets/images/banners/theGoldWallet-3.png",
    installmentAmounts: [5000, 10000, 20000],
    maturityText:
      "At the time of maturity, customer will get 50% of single installment amount extra on purchase of gold jewellery and 50% extra discount voucher of single installment amount on purchase of diamond jewellery.",
    benefits: [
      "The Gold Wallet is the smart, secured, and easiest way to purchase your desired jewellery.",
      "You can start with a minimum amount or choose your own.",
      "Flexible installment options are available for customers.",
      "Special maturity benefits are provided after successful completion.",
    ],
    schemeType: "11+1",
    totalMonths: 11,
    bonusMonths: 1,
    minStartAmount: null,
    installmentType: "fixed",
    isActive: true,
  });

  await Scheme.create({
    name: "Book My Gold Scheme",
    description: "Start with any amount from ₹5,000 onwards. Pay more or less each month — never below your starting amount.",
    imageUrl: "lib/assets/images/banners/Banner_02.png",
    detailImageUrl: "lib/assets/images/banners/Banner_03.png",
    installmentAmounts: [],
    maturityText:
      "At the time of maturity, customer will get 50% of single installment amount extra on purchase of gold jewellery and 50% extra discount voucher of single installment amount on purchase of diamond jewellery.",
    benefits: [
      "You decide how much to pay each month — no fixed commitment.",
      "Your first payment sets your minimum; you can always pay more, never less.",
      "No maximum limit — pay as much as you want in any month.",
      "Flexible savings that adjust to your monthly budget.",
      "Special maturity benefits are provided after successful completion.",
    ],
    schemeType: "Flexible",
    totalMonths: 11,
    bonusMonths: 0,
    minStartAmount: 5000,
    installmentType: "flexible",
    isActive: true,
  });

  console.log("✅ Both schemes seeded successfully");
  process.exit(0);
};

seedSchemes().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});