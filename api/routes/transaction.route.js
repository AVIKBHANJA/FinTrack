import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyExpenses,
  getCategories,
  getCategoryBreakdown,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/categories", getCategories);
router.get("/monthly-expenses", getMonthlyExpenses);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
