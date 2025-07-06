import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiDelete } from "../../utils/api.js";

/**
 * Budget Redux Slice
 * Manages all budget-related state and API calls
 * All API calls are authenticated and user-scoped
 */

// Async thunks for budget API calls with authentication
export const createOrUpdateBudget = createAsyncThunk(
  "budgets/createOrUpdateBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      return await apiPost("/api/budgets", budgetData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      return await apiGet(`/api/budgets?month=${month}&year=${year}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBudgetComparison = createAsyncThunk(
  "budgets/fetchBudgetComparison",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      return await apiGet(
        `/api/budgets/comparison?month=${month}&year=${year}`
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSpendingInsights = createAsyncThunk(
  "budgets/fetchSpendingInsights",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      return await apiGet(`/api/budgets/insights?month=${month}&year=${year}`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      await apiDelete(`/api/budgets/${id}`);
      return id; // Return ID for state update
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    budgets: [],
    budgetComparison: [],
    spendingInsights: null,
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
      // Create or update budget
      .addCase(createOrUpdateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateBudget.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add budget in the list
        const index = state.budgets.findIndex(
          (b) =>
            b.category === action.payload.category &&
            b.month === action.payload.month &&
            b.year === action.payload.year
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        } else {
          state.budgets.push(action.payload);
        }
      })
      .addCase(createOrUpdateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch budget comparison
      .addCase(fetchBudgetComparison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetComparison = action.payload;
      })
      .addCase(fetchBudgetComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch spending insights
      .addCase(fetchSpendingInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpendingInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.spendingInsights = action.payload;
      })
      .addCase(fetchSpendingInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer;
