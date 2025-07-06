import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api.js";

/**
 * Transaction Redux Slice
 * Manages all transaction-related state and API calls
 * All API calls are authenticated and user-scoped
 */

// Async thunks for API calls with authentication
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet("/api/transactions");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      return await apiPost("/api/transactions", transactionData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiPut(`/api/transactions/${id}`, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await apiDelete(`/api/transactions/${id}`);
      return id; // Return ID for state update
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMonthlyExpenses = createAsyncThunk(
  "transactions/fetchMonthlyExpenses",
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet("/api/transactions/monthly-expenses");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch available categories
export const fetchCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet("/api/transactions/categories");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch category breakdown for charts
export const fetchCategoryBreakdown = createAsyncThunk(
  "transactions/fetchCategoryBreakdown",
  async (type = "expense", { rejectWithValue }) => {
    try {
      return await apiGet(`/api/transactions/category-breakdown?type=${type}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    monthlyExpenses: [],
    categories: { expense: [], income: [] },
    categoryBreakdown: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (t) => t._id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch monthly expenses
      .addCase(fetchMonthlyExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyExpenses = action.payload;
      })
      .addCase(fetchMonthlyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch category breakdown
      .addCase(fetchCategoryBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryBreakdown = action.payload;
      })
      .addCase(fetchCategoryBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
