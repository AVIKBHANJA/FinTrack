import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../redux/transaction/transactionSlice.js";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { Button } from "../components/ui/button.jsx";
import { Plus } from "lucide-react";

export default function Transactions() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your income and expense transactions
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Form */}
        <div className="lg:col-span-1">
          {showForm && (
            <TransactionForm
              editTransaction={editTransaction}
              onClose={handleCloseForm}
            />
          )}
        </div>

        {/* Transaction List */}
        <div className="lg:col-span-2">
          <TransactionList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
