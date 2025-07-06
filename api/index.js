/**
 * Personal Finance Tracker - Main Server File
 *
 * This application provides a complete personal finance management system with:
 * - User authentication (registration, login, logout)
 * - Transaction tracking (income and expenses)
 * - Budget management and comparison
 * - Financial insights and analytics
 *
 * IMPORTANT: All user data is isolated and secure
 * - Each user can only access their own transactions and budgets
 * - Authentication is required for all financial data endpoints
 * - JWT tokens are used for session management
 */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import budgetRoutes from "./routes/budget.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3001, () => {
  console.log("Server is running on port 3001!");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
