import React, { useState } from "react";
import SpendingInsights from "../components/SpendingInsights.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { TrendingUp } from "lucide-react";

export default function Insights() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleMonthYearChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setSelectedMonth(parseInt(value));
    } else if (name === "year") {
      setSelectedYear(parseInt(value));
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Spending Insights</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your spending patterns and trends
        </p>
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

      {/* Spending Insights */}
      <SpendingInsights month={selectedMonth} year={selectedYear} />
    </div>
  );
}
