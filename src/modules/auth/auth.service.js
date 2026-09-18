import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { env } from "../../config/env.js";
import { sendSmsOtp } from "./sms.service.js";

const OTP_EXPIRY_MINUTES = 5;

const normalizePhone = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.length === 10) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  throw new Error("Please enter a valid 10-digit mobile number");
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const getNextScreen = (user) => {
  if (user.role === "admin") return "admin_dashboard";
  if (!user.isProfileComplete) return "personal_info";
  return "home";
};

const isReviewMode = env.playStoreReviewMode === "true";

const reviewAccounts = {
  user: {
    phone: env.reviewUserPhone || "9999999991",
    otp: env.reviewUserOtp || "123456",
    role: "user",
  },
  admin: {
    phone: env.reviewAdminPhone || "9999999992",
    otp: env.reviewAdminOtp || "123456",
    role: "admin",
  },
};

const getReviewAccountByPhone = (phone) => {
  const accounts = Object.values(reviewAccounts);
  return accounts.find((acc) => acc.phone === phone) || null;
};

export const sendOtpService = async ({ phone }) => {
  const normalizedPhone = normalizePhone(phone);
  const reviewAccount = isReviewMode ? getReviewAccountByPhone(normalizedPhone) : null;
  const otpCode = reviewAccount ? reviewAccount.otp : generateOtp();
  // const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  let user = await User.findOne({ phone: normalizedPhone });

  if (!user) {
    const role = reviewAccount
      ? reviewAccount.role
      : env.adminMobile && normalizedPhone === env.adminMobile
        ? "admin"
        : "user";
    // const role = env.adminMobile && normalizedPhone === env.adminMobile ? "admin" : "user";

    user = await User.create({
      phone: normalizedPhone,
      role,
      isProfileComplete: false,
      verified: false,
      otp: {
        code: otpCode,
        expiresAt,
      },
    });
  } else {
    user.otp = {
      code: otpCode,
      expiresAt,
    };

    if (reviewAccount) {
      user.role = reviewAccount.role;
    } else if (env.adminMobile && normalizedPhone === env.adminMobile) {
      user.role = "admin";
    }

    // if (env.adminMobile && normalizedPhone === env.adminMobile && user.role !== "admin") {
    //   user.role = "admin";
    // }

    await user.save();
  }

  // Skip real SMS for Play Store review accounts
  if (!reviewAccount) {
    await sendSmsOtp({
      phone: normalizedPhone,
      otp: otpCode,
    });
  }

  // Send OTP through SMS provider
  // await sendSmsOtp({
  //   phone: normalizedPhone,
  //   otp: otpCode,
  // });

  return {
    phone: normalizedPhone,
    otp:
      env.nodeEnv === "development" || reviewAccount
        ? otpCode
        : undefined,
    expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    isReviewAccount: !!reviewAccount,
  };
};

export const verifyOtpService = async ({ phone, otp }) => {
  const normalizedPhone = normalizePhone(phone);
  const cleanOtp = String(otp || "").trim();

  const user = await User.findOne({ phone: normalizedPhone });

  if (!user) {
    throw new Error("User not found. Please request OTP again");
  }

  if (!user.otp?.code || !user.otp?.expiresAt) {
    throw new Error("OTP not found. Please request a new OTP");
  }

  if (new Date() > new Date(user.otp.expiresAt)) {
    throw new Error("OTP expired. Please request a new OTP");
  }

  if (user.otp.code !== cleanOtp) {
    throw new Error("Invalid OTP");
  }

  user.otp = {
    code: null,
    expiresAt: null,
  };
  user.verified = true;
  await user.save();

  const token = generateToken(user._id);
  const nextScreen = getNextScreen(user);

  return {
    token,
    user: {
      _id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      isActive: user.isActive,
      verified: user.verified,
    },
    nextScreen,
  };
};