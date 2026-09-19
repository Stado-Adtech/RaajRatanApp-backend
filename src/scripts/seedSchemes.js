// src/scripts/seedSchemes.js

import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "../modules/scheme/scheme.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const seedSchemes = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    // Clear existing schemes
    await Scheme.deleteMany({});

    // --------------------------------------------------
    // Scheme 1: Swarn Sanchay 11+1
    // --------------------------------------------------
    await Scheme.create({
      name: "Swarn Sanchay (11+1)",

      description:
        "Pay a fixed monthly installment for 11 months and enjoy an additional bonus benefit from Raaj Ratan Jewellers.",

      imageUrl: "lib/assets/images/banners/Banner_01.png",

      detailImageUrl:
        "lib/assets/images/banners/theGoldWallet-3.png",

      installmentAmounts: [3000],

      maturityText:
        "On maturity, get a benefit equivalent of one installment amount on the purchase of gold jewellery.",

      benefits: [
        "Fixed monthly installment options.",
        "Simple and disciplined jewellery savings.",
        "Special maturity benefit after successful completion.",
        "Plan your future gold or diamond jewellery purchase with ease.",
      ],

      schemeType: "11+1",

      totalMonths: 11,

      bonusMonths: 1,

      minStartAmount: null,

      installmentType: "fixed",

      isActive: true,
    });

    // --------------------------------------------------
    // Scheme 2: Swarn Sanchay 15+2
    // --------------------------------------------------
    await Scheme.create({
      name: "Swarn Sanchay (15+2)",

      description:
        "Pay a fixed monthly installment for 15 months and receive the benefit of 2 additional bonus months.",

      imageUrl: "lib/assets/images/banners/Banner_02.png",

      detailImageUrl:
        "lib/assets/images/banners/Banner_03.png",

      installmentAmounts: [10000],

      maturityText:
        "After successful completion of all 15 installments, enjoy a benefit equivalent to 2 additional monthly installments toward your jewellery purchase.",

      benefits: [
        "Fixed monthly installment plan.",
        "Pay for 15 months.",
        "Get the benefit of 2 additional months.",
        "Ideal for planning a higher-value jewellery purchase.",
        "Special maturity benefits on successful completion."
      ],

      schemeType: "15+2",

      totalMonths: 15,

      bonusMonths: 2,

      minStartAmount: null,

      installmentType: "fixed",

      isActive: true,
    });

    // --------------------------------------------------
    // Scheme 3: Swarn Sanchay 24 Months
    // --------------------------------------------------
    await Scheme.create({
      name: "Swarn Sanchay (24 Months)",

      description:
        "Start with ₹8,000 or more and enjoy the flexibility to increase your monthly payment according to your budget.",

      imageUrl: "lib/assets/images/banners/Swarn Sanchay.png",

      detailImageUrl:
        "lib/assets/images/banners/Gold Investment Scheme.png",

      installmentAmounts: [],

      maturityText:
        "Complete the 24-month scheme successfully and enjoy special maturity benefits along with applicable making-charge benefits.",

      benefits: [
        "Start from ₹8,000.",
        "Pay more whenever you wish.",
        "No maximum monthly payment limit.",
        "Flexible payment structure.",
        "Making charges free as per applicable scheme terms.",
        "Ideal for long-term jewellery planning.",
      ],

      schemeType: "Flexible",

      totalMonths: 24,

      bonusMonths: 0,

      minStartAmount: 8000,

      installmentType: "flexible",

      isActive: true,
    });

    console.log("✅ All 3 schemes seeded successfully");
  } catch (error) {
    console.error("❌ Scheme seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  }
};

seedSchemes();