import Transaction, {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../models/transaction.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Get categories
export const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      expense: EXPENSE_CATEGORIES,
      income: INCOME_CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    const { amount, description, date, type, category } = req.body;
    const userId = req.user.id;

    // Validation
    if (!amount || !description || !type || !category) {
      return next(
        errorHandler(
          400,
          "Amount, description, type, and category are required"
        )
      );
    }

    if (amount <= 0) {
      return next(errorHandler(400, "Amount must be greater than 0"));
    }

    if (!["income", "expense"].includes(type)) {
      return next(errorHandler(400, "Type must be either income or expense"));
    }

    // Validate category based on type
    const validCategories =
      type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!validCategories.includes(category)) {
      return next(
        errorHandler(400, `Invalid category for ${type} transaction`)
      );
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      description,
      date: date ? new Date(date) : new Date(),
      type,
      category,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    next(error);
  }
};

// Get all transactions
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get a single transaction
export const getTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId,
    });

    if (!transaction) {
      return next(errorHandler(404, "Transaction not found"));
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction
export const updateTransaction = async (req, res, next) => {
  try {
    const { amount, description, date, type, category } = req.body;
    const userId = req.user.id;

    // Validation
    if (amount !== undefined && amount <= 0) {
      return next(errorHandler(400, "Amount must be greater than 0"));
    }

    if (type && !["income", "expense"].includes(type)) {
      return next(errorHandler(400, "Type must be either income or expense"));
    }

    // Validate category if provided
    if (category && type) {
      const validCategories =
        type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
      if (!validCategories.includes(category)) {
        return next(
          errorHandler(400, `Invalid category for ${type} transaction`)
        );
      }
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        ...(amount && { amount }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(type && { type }),
        ...(category && { category }),
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return next(errorHandler(404, "Transaction not found"));
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedTransaction) {
      return next(errorHandler(404, "Transaction not found"));
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get monthly expenses for chart
export const getMonthlyExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create array for all 12 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = months.map((month, index) => {
      const monthData = monthlyExpenses.find((item) => item._id === index + 1);
      return {
        month,
        amount: monthData ? monthData.totalAmount : 0,
        count: monthData ? monthData.count : 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get category-wise breakdown
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { type = "expense" } = req.query;
    const userId = req.user.id;

    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type,
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    // Include categories with 0 amounts
    const allCategories =
      type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const result = allCategories.map((category) => {
      const categoryData = categoryBreakdown.find(
        (item) => item._id === category
      );
      return {
        category,
        amount: categoryData ? categoryData.totalAmount : 0,
        count: categoryData ? categoryData.count : 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
