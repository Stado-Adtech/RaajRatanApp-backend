import crypto from "crypto";
import qs from "qs";

const getEncryptionKey = () => {
  return crypto.createHash("md5").update(process.env.CCA_WORKING_KEY).digest();
};

const getIv = () => {
  return Buffer.from([
    0x00, 0x01, 0x02, 0x03,
    0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);
};

export const encryptCcavenue = (plainText) => {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    getEncryptionKey(),
    getIv()
  );

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptCcavenue = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    getEncryptionKey(),
    getIv()
  );

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return qs.parse(decrypted);
};

export const buildCcavenueRequest = (payload) => {
  return qs.stringify(payload);
};