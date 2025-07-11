import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransaction } from "../redux/transaction/transactionSlice.js";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Trash2, Edit, DollarSign } from "lucide-react";
import {
  formatCurrency,
  truncateText,
  formatDate,
} from "../utils/formatters.js";
import Loading from "./Loading.jsx";
import EmptyState from "./EmptyState.jsx";

/**
 * Transaction List Component
 * Displays a list of user's transactions with edit and delete functionality
 * Shows empty state when no transactions exist
 *
 * @param {Object} props
 * @param {Function} props.onEdit - Callback function when edit button is clicked
 */
export default function TransactionList({ onEdit }) {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Handle transaction deletion with confirmation
   * @param {string} id - Transaction ID to delete
   */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteTransaction(id)).unwrap();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        // You could add a toast notification here
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Show loading state while fetching transactions
  if (loading && transactions.length === 0) {
    return <Loading message="Loading transactions..." />;
  }

  // Show empty state when no transactions exist
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<DollarSign className="h-12 w-12" />}
        title="No transactions yet"
        description="Add your first transaction to get started tracking your finances"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    {truncateText(transaction.description, 30)}
                  </h4>
                  <span
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                    {transaction.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {transaction.category}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deletingId === transaction._id}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
