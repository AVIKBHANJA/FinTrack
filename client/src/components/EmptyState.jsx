import React from "react";
import { Card, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";

/**
 * Reusable Empty State Component
 * Used across the application to show consistent empty states when no data is available
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Main title text
 * @param {string} props.description - Description text
 * @param {string} props.actionText - Text for action button (optional)
 * @param {Function} props.onAction - Action button click handler (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showCard - Whether to wrap in a card (default: true)
 */
const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
  showCard = true,
}) => {
  const emptyStateContent = (
    <div
      className={`flex flex-col items-center justify-center py-8 text-center text-muted-foreground ${className}`}
    >
      {icon && <div className="mb-4 opacity-50">{icon}</div>}

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm max-w-md">{description}</p>}
      </div>

      {actionText && onAction && (
        <Button onClick={onAction} className="mt-4" variant="outline">
          {actionText}
        </Button>
      )}
    </div>
  );

  if (!showCard) {
    return emptyStateContent;
  }

  return (
    <Card>
      <CardContent>{emptyStateContent}</CardContent>
    </Card>
  );
};

export default EmptyState;
