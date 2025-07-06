import express from "express";
import {
  createOrUpdateBudget,
  getBudgets,
  getBudgetComparison,
  deleteBudget,
  getSpendingInsights,
} from "../controllers/budget.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All budget routes require authentication
router.use(verifyToken);

router.post("/", createOrUpdateBudget);
router.get("/", getBudgets);
router.get("/comparison", getBudgetComparison);
router.get("/insights", getSpendingInsights);
router.delete("/:id", deleteBudget);

export default router;
