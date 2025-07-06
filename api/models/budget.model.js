import mongoose from "mongoose";
import { EXPENSE_CATEGORIES } from "./transaction.model.js";

/**
 * Budget Model
 * Represents monthly budgets set by users for different expense categories
 * Each budget is specific to a user, category, month, and year combination
 */

const budgetSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this budget
    // Ensures data isolation between users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Budget category (must be from predefined expense categories)
    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },
    // Budget amount (must be positive)
    amount: {
      type: Number,
      required: true,
      min: 0.01, // Minimum 1 cent
    },
    // Month for this budget (1-12)
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    // Year for this budget (starting from 2020)
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Ensure unique budget per category per month/year per user
// This prevents duplicate budgets for the same category in the same time period
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

// Index for efficient queries by user and time period
budgetSchema.index({ userId: 1, month: 1, year: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
