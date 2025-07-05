import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../redux/transaction/transactionSlice.js";
import { fetchBudgetComparison } from "../redux/budget/budgetSlice.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import MonthlyExpensesChart from "../components/MonthlyExpensesChart.jsx";
import CategoryPieChart from "../components/CategoryPieChart.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
} from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { format } from "date-fns";

export default function Home() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const { budgetComparison } = useSelector((state) => state.budgets);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
    // Fetch budget comparison for current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    dispatch(fetchBudgetComparison({ month: currentMonth, year: currentYear }));
  }, [dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate summary statistics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Calculate budget statistics
  const totalBudget =
    budgetComparison?.reduce((sum, item) => sum + item.budgetAmount, 0) || 0;
  const totalActualCurrentMonth =
    budgetComparison?.reduce((sum, item) => sum + item.actualAmount, 0) || 0;
  const overBudgetCategories =
    budgetComparison?.filter((item) => item.status === "over").length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Personal Finance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your income and expenses
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <div className="mb-8">
          <TransactionForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">All time income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netBalance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month Budget
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalActualCurrentMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0
                ? `${((totalActualCurrentMonth / totalBudget) * 100).toFixed(
                    1
                  )}% of ${formatCurrency(totalBudget)}`
                : "No budget set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MonthlyExpensesChart />
        <CategoryPieChart type="expense" />

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading transactions...
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">
                  Add your first transaction to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p
                        className={`text-xs ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}

                {transactions.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/transactions">View All Transactions</a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Income Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart type="income" />
        <Card>
          <CardHeader>
            <CardTitle>Category Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">
                Track your spending patterns
              </p>
              <p className="text-sm">
                Categories help you understand where your money goes and
                identify areas for improvement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
