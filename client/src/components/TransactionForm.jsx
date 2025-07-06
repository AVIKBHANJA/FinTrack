import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  updateTransaction,
  fetchCategories,
} from "../redux/transaction/transactionSlice.js";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { AlertCircle } from "lucide-react";

export default function TransactionForm({ editTransaction, onClose }) {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    amount: editTransaction?.amount || "",
    description: editTransaction?.description || "",
    date: editTransaction?.date
      ? new Date(editTransaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    type: editTransaction?.type || "expense",
    category: editTransaction?.category || "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Safe access to categories with fallback - ensure we always have the structure
  const availableCategories =
    categories && typeof categories === "object"
      ? categories
      : { expense: [], income: [] };

  const validateForm = () => {
    const errors = {};

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      errors.amount = "Amount must be a positive number";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length > 255) {
      errors.description = "Description must be less than 255 characters";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      type: formData.type,
      category: formData.category,
    };

    try {
      if (editTransaction) {
        await dispatch(
          updateTransaction({
            id: editTransaction._id,
            data: transactionData,
          })
        ).unwrap();
      } else {
        await dispatch(createTransaction(transactionData)).unwrap();
      }

      // Reset form
      setFormData({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
        category: "",
      });
      setFormErrors({});

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
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

    // Reset category when type changes
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {editTransaction ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!categories ? (
          <div className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Loading categories...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount"
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className={formErrors.description ? "border-destructive" : ""}
              />
              {formErrors.description && (
                <span className="text-sm text-destructive">
                  {formErrors.description}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={formErrors.date ? "border-destructive" : ""}
              />
              {formErrors.date && (
                <span className="text-sm text-destructive">
                  {formErrors.date}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  formErrors.category ? "border-destructive" : ""
                }`}
              >
                <option value="">Select a category</option>
                {(availableCategories[formData.type] || []).map((category) => (
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

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading
                  ? "Saving..."
                  : editTransaction
                  ? "Update"
                  : "Add Transaction"}
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
