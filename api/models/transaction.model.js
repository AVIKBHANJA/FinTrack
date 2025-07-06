import mongoose from "mongoose";

/**
 * Transaction Model
 * Represents financial transactions (income and expenses) for users
 * Each transaction belongs to a specific user and has predefined categories
 */

// Predefined expense categories for consistency
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Personal Care",
  "Insurance",
  "Gifts & Donations",
  "Other",
];

// Predefined income categories for consistency
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Gift",
  "Other",
];

const transactionSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this transaction
    // Ensures data isolation between users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Transaction amount (must be positive)
    amount: {
      type: Number,
      required: true,
      min: 0.01, // Minimum 1 cent
    },
    // Description of the transaction
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    // Date when the transaction occurred
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Type of transaction: income or expense
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
      default: "expense",
    },
    // Category must match the transaction type
    category: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (this.type === "expense") {
            return EXPENSE_CATEGORIES.includes(value);
          } else if (this.type === "income") {
            return INCOME_CATEGORIES.includes(value);
          }
          return false;
        },
        message: "Invalid category for transaction type",
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Index for efficient queries by user and date
transactionSchema.index({ userId: 1, date: -1 });

// Index for efficient category-based queries
transactionSchema.index({ userId: 1, type: 1, category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
