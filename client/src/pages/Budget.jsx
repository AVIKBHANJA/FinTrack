import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgets,
  fetchBudgetComparison,
  createOrUpdateBudget,
  deleteBudget,
} from "../redux/budget/budgetSlice.js";
import BudgetForm from "../components/BudgetForm.jsx";
import BudgetComparisonChart from "../components/BudgetComparisonChart.jsx";
import BudgetList from "../components/BudgetList.jsx";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Plus, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function Budget() {
  const dispatch = useDispatch();
  const { budgets, budgetComparison, loading } = useSelector(
    (state) => state.budgets
  );
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));
    dispatch(
      fetchBudgetComparison({ month: selectedMonth, year: selectedYear })
    );
  }, [dispatch, selectedMonth, selectedYear]);

  const handleEdit = (budget) => {
    setEditBudget(budget);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditBudget(null);
  };

  const handleMonthYearChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setSelectedMonth(parseInt(value));
    } else if (name === "year") {
      setSelectedYear(parseInt(value));
    }
  };

  // Calculate summary statistics
  const totalBudget = budgetComparison.reduce(
    (sum, item) => sum + item.budgetAmount,
    0
  );
  const totalActual = budgetComparison.reduce(
    (sum, item) => sum + item.actualAmount,
    0
  );
  const overBudgetCategories = budgetComparison.filter(
    (item) => item.status === "over"
  ).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground mt-2">
            Set and track your monthly category budgets
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Set Budget</span>
        </Button>
      </div>

      {/* Month/Year Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Month & Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <select
                name="month"
                value={selectedMonth}
                onChange={handleMonthYearChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                name="year"
                value={selectedYear}
                onChange={handleMonthYearChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Form */}
      {showForm && (
        <div className="mb-8">
          <BudgetForm
            editBudget={editBudget}
            onClose={handleCloseForm}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              For {months[selectedMonth - 1]} {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actual Spending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(totalActual)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0
                ? `${((totalActual / totalBudget) * 100).toFixed(1)}% of budget`
                : "No budget set"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {overBudgetCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              {overBudgetCategories === 1 ? "Category" : "Categories"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Comparison Chart and List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetComparisonChart
          budgetComparison={budgetComparison}
          month={months[selectedMonth - 1]}
          year={selectedYear}
        />
        <BudgetList
          budgets={budgets}
          budgetComparison={budgetComparison}
          onEdit={handleEdit}
          month={months[selectedMonth - 1]}
          year={selectedYear}
        />
      </div>
    </div>
  );
}
