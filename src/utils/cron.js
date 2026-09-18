// src/utils/cron.js
import cron from "node-cron";
import { sendDueSchemeReminders } from "../modules/schemeEnrollment/schemeReminder.service.js";

export const startCronJobs = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      const count = await sendDueSchemeReminders();
      console.log(`✅ Sent ${count} scheme payment reminders`);
    } catch (err) {
      console.error("❌ Cron job failed:", err.message);
    }
  });

  console.log("⏰ Cron jobs scheduled");
};  