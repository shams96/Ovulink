import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MaleHealthState, SpermTest } from '../types';

const initialState: MaleHealthState = {
  spermTests: [],
  loading: false,
  error: null,
};

const maleHealthSlice = createSlice({
  name: 'maleHealth',
  initialState,
  reducers: {
    fetchSpermTestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSpermTestsSuccess: (state, action: PayloadAction<SpermTest[]>) => {
      state.spermTests = action.payload;
      state.loading = false;
    },
    fetchSpermTestsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSpermTestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addSpermTestSuccess: (state, action: PayloadAction<SpermTest>) => {
      state.spermTests.push(action.payload);
      state.loading = false;
    },
    addSpermTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSpermTestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSpermTestSuccess: (state, action: PayloadAction<SpermTest>) => {
      const index = state.spermTests.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.spermTests[index] = action.payload;
      }
      state.loading = false;
    },
    updateSpermTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSpermTestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSpermTestSuccess: (state, action: PayloadAction<string>) => {
      state.spermTests = state.spermTests.filter(test => test.id !== action.payload);
      state.loading = false;
    },
    deleteSpermTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearMaleHealthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSpermTestsStart,
  fetchSpermTestsSuccess,
  fetchSpermTestsFailure,
  addSpermTestStart,
  addSpermTestSuccess,
  addSpermTestFailure,
  updateSpermTestStart,
  updateSpermTestSuccess,
  updateSpermTestFailure,
  deleteSpermTestStart,
  deleteSpermTestSuccess,
  deleteSpermTestFailure,
  clearMaleHealthError,
} = maleHealthSlice.actions;

export default maleHealthSlice.reducer;
