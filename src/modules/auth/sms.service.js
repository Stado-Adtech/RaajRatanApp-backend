import axios from "axios";
import { env } from "../../config/env.js";

const normalizePhone = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);

  throw new Error("Please enter a valid 10-digit mobile number");
};

const buildOtpMessage = (otp) => {
  return `${otp} is your OTP to login to the JAGMOHAN LAL SHIVRATAN LAL JEWELLERS mobile application. OTP is valid for 5 minutes. Please do not share the OTP.`;
};

export const sendSmsOtp = async ({ phone, otp }) => {
  const normalizedPhone = normalizePhone(phone);

  console.log("========== SMS DEBUG START ==========");
  console.log("SMS API URL:", env.smsApiUrl || "MISSING");
  console.log("SMS API USER:", env.smsApiUser || "MISSING");
  console.log("SMS SENDER ID:", env.smsSenderId || "MISSING");
  console.log("SMS CHANNEL:", env.smsChannel || "MISSING");
  console.log("SMS ROUTE:", env.smsRoute || "MISSING");
  console.log("SMS DLT TEMPLATE ID:", env.smsDltTemplateId || "MISSING");
  console.log("SMS PEID:", env.smsPeid || "MISSING");
  console.log("SMS PASSWORD EXISTS:", !!env.smsApiPassword);
  console.log("PHONE:", normalizedPhone);
  console.log("OTP:", otp);

  if (!env.smsApiUrl) throw new Error("SMS API URL is not configured");
  if (!env.smsApiUser) throw new Error("SMS API user is not configured");
  if (!env.smsApiPassword) throw new Error("SMS API password is not configured");
  if (!env.smsSenderId) throw new Error("SMS sender ID is not configured");
  if (!env.smsDltTemplateId) throw new Error("SMS DLT Template ID is not configured");
  if (!env.smsPeid) throw new Error("SMS PEID is not configured");

  const message = buildOtpMessage(otp);

  console.log("SMS MESSAGE:", message);

  const requestParams = {
    user: env.smsApiUser,
    password: env.smsApiPassword,
    senderid: env.smsSenderId,
    channel: env.smsChannel || "Trans",
    DCS: env.smsDcs || "0",
    flashsms: env.smsFlashSms || "0",
    number: normalizedPhone,
    text: message,
    route: env.smsRoute || "01",
    DLTTemplateId: env.smsDltTemplateId,
    PEID: env.smsPeid,
  };

  console.log("SMS REQUEST PARAMS:", {
    ...requestParams,
    password: requestParams.password ? "****" : "MISSING",
  });

  try {
    const response = await axios.get(env.smsApiUrl, {
      params: requestParams,
      timeout: 15000,
    });

    console.log("SMS PROVIDER STATUS:", response.status);
    console.log("SMS PROVIDER RESPONSE:", response.data);
    console.log("========== SMS DEBUG END ==========");

    return {
      success: true,
      raw: response.data,
    };
  } catch (error) {
    console.log("SMS ERROR MESSAGE:", error.message);
    console.log("SMS ERROR STATUS:", error.response?.status || "NO_STATUS");
    console.log("SMS ERROR DATA:", error.response?.data || "NO_RESPONSE_DATA");
    console.log("========== SMS DEBUG END ==========");

    const providerError =
      error.response?.data
        ? typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data)
        : error.message;

    throw new Error(`SMS sending failed: ${providerError}`);
  }
};

export const sendSchemeReminderSms = async (phone, message) => {
  console.log("Scheme reminder SMS:", phone, message);

  // Add your SMS provider API here.
  // Example:
  // await axios.post("SMS_PROVIDER_URL", {
  //   apiKey: process.env.SMS_API_KEY,
  //   sender: process.env.SMS_SENDER_ID,
  //   mobile: phone,
  //   message,
  // });

  return true;
};