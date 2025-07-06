import Budget from "../models/budget.model.js";
import Transaction from "../models/transaction.model.js";
import { EXPENSE_CATEGORIES } from "../models/transaction.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Create or update budget
export const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;
    const userId = req.user.id;

    // Validation
    if (!category || !amount || !month || !year) {
      return next(
        errorHandler(400, "Category, amount, month, and year are required")
      );
    }

    if (amount <= 0) {
      return next(errorHandler(400, "Amount must be greater than 0"));
    }

    if (!EXPENSE_CATEGORIES.includes(category)) {
      return next(errorHandler(400, "Invalid category"));
    }

    if (month < 1 || month > 12) {
      return next(errorHandler(400, "Month must be between 1 and 12"));
    }

    if (year < 2020) {
      return next(errorHandler(400, "Year must be 2020 or later"));
    }

    // Try to update existing budget or create new one
    const budget = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      { amount },
      { new: true, upsert: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    next(error);
  }
};

// Get budgets for a specific month/year
export const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    if (!month || !year) {
      return next(errorHandler(400, "Month and year are required"));
    }

    const budgets = await Budget.find({
      userId,
      month: parseInt(month),
      year: parseInt(year),
    }).sort({ category: 1 });

    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// Get budget vs actual comparison
export const getBudgetComparison = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return next(errorHandler(400, "Month and year are required"));
    }

    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    // Get budgets for the month
    const budgets = await Budget.find({ month: monthInt, year: yearInt });

    // Get actual expenses for the month
    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);

    const actualExpenses = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Combine budget and actual data
    const comparison = EXPENSE_CATEGORIES.map((category) => {
      const budget = budgets.find((b) => b.category === category);
      const actual = actualExpenses.find((a) => a._id === category);

      const budgetAmount = budget ? budget.amount : 0;
      const actualAmount = actual ? actual.totalAmount : 0;
      const transactionCount = actual ? actual.count : 0;

      return {
        category,
        budgetAmount,
        actualAmount,
        difference: budgetAmount - actualAmount,
        percentage: budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0,
        transactionCount,
        status:
          budgetAmount === 0
            ? "no-budget"
            : actualAmount <= budgetAmount
            ? "under"
            : "over",
      };
    });

    res.status(200).json(comparison);
  } catch (error) {
    next(error);
  }
};

// Delete budget
export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return next(errorHandler(404, "Budget not found"));
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get spending insights
export const getSpendingInsights = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return next(errorHandler(400, "Month and year are required"));
    }

    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    // Get current month data
    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);

    const currentMonthExpenses = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          avgTransaction: { $avg: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // Get previous month data for comparison
    const prevStartDate = new Date(yearInt, monthInt - 2, 1);
    const prevEndDate = new Date(yearInt, monthInt - 1, 0, 23, 59, 59);

    const prevMonthExpenses = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: prevStartDate, $lte: prevEndDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalCurrentMonth = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.totalAmount,
      0
    );
    const totalPrevMonth = prevMonthExpenses.reduce(
      (sum, expense) => sum + expense.totalAmount,
      0
    );

    const insights = {
      totalSpending: totalCurrentMonth,
      previousMonthSpending: totalPrevMonth,
      monthOverMonthChange:
        totalPrevMonth > 0
          ? ((totalCurrentMonth - totalPrevMonth) / totalPrevMonth) * 100
          : 0,
      topCategories: currentMonthExpenses.slice(0, 3),
      categoryComparisons: currentMonthExpenses.map((current) => {
        const previous = prevMonthExpenses.find(
          (prev) => prev._id === current._id
        );
        const prevAmount = previous ? previous.totalAmount : 0;

        return {
          category: current._id,
          currentAmount: current.totalAmount,
          previousAmount: prevAmount,
          change:
            prevAmount > 0
              ? ((current.totalAmount - prevAmount) / prevAmount) * 100
              : 0,
          transactionCount: current.count,
          avgTransaction: current.avgTransaction,
        };
      }),
    };

    res.status(200).json(insights);
  } catch (error) {
    next(error);
  }
};
