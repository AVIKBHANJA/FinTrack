import React from "react";
import { Card, CardContent } from "./ui/card.jsx";

/**
 * Reusable Loading Component
 * Used across the application to show consistent loading states
 *
 * @param {Object} props
 * @param {string} props.message - Loading message to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showCard - Whether to wrap in a card (default: true)
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 */
const Loading = ({
  message = "Loading...",
  className = "",
  showCard = true,
  size = "md",
}) => {
  // Define spinner sizes
  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const loadingContent = (
    <div
      className={`flex flex-col items-center justify-center py-8 text-muted-foreground ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${spinnerSizes[size]} mb-4`}
      ></div>
      <p className="text-center">{message}</p>
    </div>
  );

  if (!showCard) {
    return loadingContent;
  }

  return (
    <Card>
      <CardContent>{loadingContent}</CardContent>
    </Card>
  );
};

export default Loading;
