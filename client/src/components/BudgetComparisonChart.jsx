import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Target } from "lucide-react";

export default function BudgetComparisonChart({
  budgetComparison,
  month,
  year,
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p) => p.dataKey === "budgetAmount");
      const actual = payload.find((p) => p.dataKey === "actualAmount");

      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {budget && (
            <p className="text-blue-600 dark:text-blue-400">
              Budget: {formatCurrency(budget.value)}
            </p>
          )}
          {actual && (
            <p className="text-orange-600 dark:text-orange-400">
              Actual: {formatCurrency(actual.value)}
            </p>
          )}
          {budget && actual && (
            <p className="text-muted-foreground text-sm">
              {budget.value > 0
                ? `${((actual.value / budget.value) * 100).toFixed(
                    1
                  )}% of budget`
                : "No budget set"}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Filter out categories with no budget and no actual spending
  const chartData = budgetComparison.filter(
    (item) => item.budgetAmount > 0 || item.actualAmount > 0
  );

  const hasData = chartData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>
            Budget vs Actual - {month} {year}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Target className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No budget data</p>
            <p className="text-sm">
              Set some budgets and track expenses to see the comparison
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="budgetAmount"
                  fill="hsl(var(--primary))"
                  name="Budget"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="actualAmount"
                  fill="hsl(var(--destructive))"
                  name="Actual"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
