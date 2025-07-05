import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryBreakdown } from "../redux/transaction/transactionSlice.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#87ceeb",
];

export default function CategoryPieChart({ type = "expense" }) {
  const dispatch = useDispatch();
  const { categoryBreakdown = [], loading } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchCategoryBreakdown(type));
  }, [dispatch, type]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.category}</p>
          <p
            className={
              type === "expense"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }
          >
            {formatCurrency(data.amount)}
          </p>
          <p className="text-muted-foreground text-sm">
            {data.count} transaction{data.count !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  // Filter out categories with 0 amounts for the chart
  const chartData = categoryBreakdown?.filter((item) => item.amount > 0) || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {type === "expense" ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
            <span>{type === "expense" ? "Expense" : "Income"} Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {type === "expense" ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
          <span>{type === "expense" ? "Expense" : "Income"} Categories</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            {type === "expense" ? (
              <TrendingDown className="h-12 w-12 mb-4" />
            ) : (
              <TrendingUp className="h-12 w-12 mb-4" />
            )}
            <p className="text-lg font-medium">No {type} data yet</p>
            <p className="text-sm">
              Add some {type} transactions to see category breakdown
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    percent > 5
                      ? `${category} ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>
                      {value}: {formatCurrency(entry.payload.amount)}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
