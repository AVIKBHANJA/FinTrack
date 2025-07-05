import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBudget } from "../redux/budget/budgetSlice.js";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Trash2, Edit, Target, AlertCircle, CheckCircle } from "lucide-react";

export default function BudgetList({
  budgets,
  budgetComparison,
  onEdit,
  month,
  year,
}) {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteBudget(id)).unwrap();
      } catch (error) {
        console.error("Error deleting budget:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "over":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "under":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "over":
        return "text-red-600 dark:text-red-400";
      case "under":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Combine budget and comparison data
  const combinedData = budgetComparison.map((comparison) => {
    const budget = budgets.find((b) => b.category === comparison.category);
    return {
      ...comparison,
      budgetId: budget?._id,
      hasBudget: budget !== undefined,
    };
  });

  // Filter to show only categories with budgets or spending
  const filteredData = combinedData.filter(
    (item) => item.hasBudget || item.actualAmount > 0
  );

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Budget Summary - {month} {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No budgets set</p>
            <p className="text-sm">Set your first budget to start tracking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Budget Summary - {month} {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredData.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <h4 className="font-medium text-sm">{item.category}</h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.actualAmount)}
                      </span>
                      <span className="text-sm font-medium">
                        / {formatCurrency(item.budgetAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === "over"
                            ? "bg-red-500"
                            : item.status === "under"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                        style={{
                          width: `${Math.min(
                            item.budgetAmount > 0
                              ? (item.actualAmount / item.budgetAmount) * 100
                              : 0,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.budgetAmount > 0
                        ? `${item.percentage.toFixed(1)}%`
                        : "No budget"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {item.transactionCount} transaction
                      {item.transactionCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {item.hasBudget && (
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onEdit({
                        _id: item.budgetId,
                        category: item.category,
                        amount: item.budgetAmount,
                        month: parseInt(month),
                        year: parseInt(year),
                      })
                    }
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(item.budgetId)}
                    disabled={deletingId === item.budgetId}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
