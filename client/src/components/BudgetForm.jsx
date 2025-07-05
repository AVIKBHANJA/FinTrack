import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateBudget } from "../redux/budget/budgetSlice.js";
import { fetchCategories } from "../redux/transaction/transactionSlice.js";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { AlertCircle } from "lucide-react";

export default function BudgetForm({
  editBudget,
  onClose,
  selectedMonth,
  selectedYear,
}) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.budgets);
  const { categories } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    category: editBudget?.category || "",
    amount: editBudget?.amount || "",
    month: selectedMonth,
    year: selectedYear,
  });

  const [formErrors, setFormErrors] = useState({});

  // Update form data when selectedMonth/selectedYear changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      month: selectedMonth,
      year: selectedYear,
    }));
  }, [selectedMonth, selectedYear]);

  const validateForm = () => {
    const errors = {};

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      errors.amount = "Amount must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month,
      year: formData.year,
    };

    try {
      await dispatch(createOrUpdateBudget(budgetData)).unwrap();

      // Reset form
      setFormData({
        category: "",
        amount: "",
        month: selectedMonth,
        year: selectedYear,
      });
      setFormErrors({});

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{editBudget ? "Edit Budget" : "Set New Budget"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={editBudget} // Don't allow changing category when editing
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                formErrors.category ? "border-destructive" : ""
              }`}
            >
              <option value="">Select a category</option>
              {categories.expense?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <span className="text-sm text-destructive">
                {formErrors.category}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter budget amount"
              value={formData.amount}
              onChange={handleChange}
              className={formErrors.amount ? "border-destructive" : ""}
            />
            {formErrors.amount && (
              <span className="text-sm text-destructive">
                {formErrors.amount}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Month & Year</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={formData.month}
                disabled
                className="flex-1"
              />
              <Input
                type="number"
                value={formData.year}
                disabled
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use the month/year selector above to change the period
            </p>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? "Saving..."
                : editBudget
                ? "Update Budget"
                : "Set Budget"}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
