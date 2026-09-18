import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  adminMobile: process.env.ADMIN_MOBILE || "",

  smsApiUrl: process.env.SMS_API_URL,
  smsApiUser: process.env.SMS_API_USER,
  smsApiPassword: process.env.SMS_API_PASSWORD,
  smsSenderId: process.env.SMS_SENDER_ID,
  smsChannel: process.env.SMS_CHANNEL,
  smsDcs: process.env.SMS_DCS,
  smsFlashSms: process.env.SMS_FLASHSMS,
  smsRoute: process.env.SMS_ROUTE,
  smsDltTemplateId: process.env.SMS_DLT_TEMPLATE_ID,
  smsPeid: process.env.SMS_PEID,


  playStoreReviewMode: process.env.PLAY_STORE_REVIEW_MODE,
  reviewUserPhone: process.env.REVIEW_USER_PHONE,
  reviewUserOtp: process.env.REVIEW_USER_OTP,
  reviewAdminPhone: process.env.REVIEW_ADMIN_PHONE,
  reviewAdminOtp: process.env.REVIEW_ADMIN_OTP,
};