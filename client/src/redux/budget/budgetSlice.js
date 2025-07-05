import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for budget API calls
export const createOrUpdateBudget = createAsyncThunk(
  "budgets/createOrUpdateBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create/update budget");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/budgets?month=${month}&year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBudgetComparison = createAsyncThunk(
  "budgets/fetchBudgetComparison",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/budgets/comparison?month=${month}&year=${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budget comparison");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSpendingInsights = createAsyncThunk(
  "budgets/fetchSpendingInsights",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/budgets/insights?month=${month}&year=${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch spending insights");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete budget");
      }
      return id;
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
