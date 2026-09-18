// src/config/razorpay.js
// Lazy initialization — created only when first called, not at import time
// This ensures process.env values are loaded before Razorpay reads them

import Razorpay from "razorpay";

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env"
      );
    }

    razorpayInstance = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
};

export default getRazorpay;