import mongoose from "mongoose";

// Predefined categories
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
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
      default: "expense",
    },
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
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
