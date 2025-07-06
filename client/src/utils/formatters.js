/**
 * Utility functions for common formatting and calculations
 * Used across multiple components to maintain consistency
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

/**
 * Format a percentage value
 * @param {number} value - The percentage value
 * @returns {string} Formatted percentage string with + or - prefix
 */
export const formatPercentage = (value) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

/**
 * Get status color classes for budget comparison
 * @param {string} status - The status ("over", "under", "no-budget")
 * @returns {string} Tailwind CSS color classes
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "over":
      return "text-red-600 dark:text-red-400";
    case "under":
      return "text-green-600 dark:text-green-400";
    case "no-budget":
      return "text-gray-600 dark:text-gray-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

/**
 * Get the month name from month number
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Month name
 */
export const getMonthName = (monthNumber) => {
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
  return months[monthNumber - 1] || "";
};

/**
 * Get short month names for charts
 * @returns {string[]} Array of short month names
 */
export const getShortMonthNames = () => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
};

/**
 * Calculate the percentage of budget used
 * @param {number} actual - Actual amount spent
 * @param {number} budget - Budget amount
 * @returns {number} Percentage (0-100+)
 */
export const calculateBudgetPercentage = (actual, budget) => {
  if (budget <= 0) return 0;
  return (actual / budget) * 100;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
