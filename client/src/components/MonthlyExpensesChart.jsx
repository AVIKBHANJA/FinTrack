import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyExpenses } from "../redux/transaction/transactionSlice.js";
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
import { TrendingDown } from "lucide-react";

export default function MonthlyExpensesChart() {
  const dispatch = useDispatch();
  const { monthlyExpenses, loading } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchMonthlyExpenses());
  }, [dispatch]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`${label} 2025`}</p>
          <p className="text-red-600 dark:text-red-400">
            {`Expenses: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-muted-foreground text-sm">
            {`${payload[0].payload.count} transaction${
              payload[0].payload.count !== 1 ? "s" : ""
            }`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5" />
            <span>Monthly Expenses</span>
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

  const hasData = monthlyExpenses.some((month) => month.amount > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="h-5 w-5" />
          <span>Monthly Expenses - 2025</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No expense data yet</p>
            <p className="text-sm">
              Add some expense transactions to see your monthly spending
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyExpenses}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--destructive))"
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
