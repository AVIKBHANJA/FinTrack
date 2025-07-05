import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpendingInsights } from "../redux/budget/budgetSlice.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

export default function SpendingInsights({ month, year }) {
  const dispatch = useDispatch();
  const { spendingInsights, loading } = useSelector((state) => state.budgets);

  useEffect(() => {
    dispatch(fetchSpendingInsights({ month, year }));
  }, [dispatch, month, year]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Spending Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading insights...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!spendingInsights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Spending Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No spending data available for this period
          </div>
        </CardContent>
      </Card>
    );
  }

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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(spendingInsights.totalSpending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total spending in {months[month - 1]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Month-over-Month
            </CardTitle>
            {spendingInsights.monthOverMonthChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                spendingInsights.monthOverMonthChange >= 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {formatPercentage(spendingInsights.monthOverMonthChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(spendingInsights.previousMonthSpending)} last
              month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {spendingInsights.topCategories.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No spending data for this month
            </div>
          ) : (
            <div className="space-y-3">
              {spendingInsights.topCategories.map((category, index) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold dark:bg-blue-900 dark:text-blue-300">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.count} transaction
                        {category.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(category.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg: {formatCurrency(category.avgTransaction)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle>Category Changes vs Last Month</CardTitle>
        </CardHeader>
        <CardContent>
          {spendingInsights.categoryComparisons.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No comparison data available
            </div>
          ) : (
            <div className="space-y-3">
              {spendingInsights.categoryComparisons
                .filter(
                  (comp) => comp.currentAmount > 0 || comp.previousAmount > 0
                )
                .slice(0, 8) // Show top 8 categories
                .map((comparison) => (
                  <div
                    key={comparison.category}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{comparison.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {comparison.transactionCount} transaction
                        {comparison.transactionCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(comparison.currentAmount)}
                      </p>
                      <div className="flex items-center space-x-1">
                        {comparison.change !== 0 && (
                          <>
                            {comparison.change > 0 ? (
                              <TrendingUp className="h-3 w-3 text-red-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-green-600" />
                            )}
                            <span
                              className={`text-xs ${
                                comparison.change > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              {formatPercentage(comparison.change)}
                            </span>
                          </>
                        )}
                        {comparison.change === 0 && (
                          <span className="text-xs text-muted-foreground">
                            No change
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
