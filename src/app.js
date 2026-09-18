import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import priceRoutes from "./modules/price/price.routes.js";
import schemeRoutes from "./modules/scheme/scheme.routes.js";
import schemeEnrollmentRoutes from "./modules/schemeEnrollment/schemeEnrollment.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { startCronJobs } from "./utils/cron.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Raaj Ratan Jewellers API is running",
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/scheme-enrollments", schemeEnrollmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", walletRoutes);

app.use(notFound);
app.use(errorHandler);

// Start scheduled jobs (payment reminders, etc.)
startCronJobs();

export default app;