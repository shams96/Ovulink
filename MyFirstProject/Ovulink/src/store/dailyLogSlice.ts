import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyLogState, DailyLog } from '../types';

const initialState: DailyLogState = {
  logs: {},
  loading: false,
  error: null,
};

const dailyLogSlice = createSlice({
  name: 'dailyLog',
  initialState,
  reducers: {
    fetchLogsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLogsSuccess: (state, action: PayloadAction<DailyLog[]>) => {
      const logsMap: Record<string, DailyLog> = {};
      action.payload.forEach(log => {
        logsMap[`${log.userId}-${log.date}`] = log;
      });
      state.logs = logsMap;
      state.loading = false;
    },
    fetchLogsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLogStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addLogSuccess: (state, action: PayloadAction<DailyLog>) => {
      const log = action.payload;
      state.logs[`${log.userId}-${log.date}`] = log;
      state.loading = false;
    },
    addLogFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateLogStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLogSuccess: (state, action: PayloadAction<DailyLog>) => {
      const log = action.payload;
      state.logs[`${log.userId}-${log.date}`] = log;
      state.loading = false;
    },
    updateLogFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLogStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLogSuccess: (state, action: PayloadAction<{ userId: string; date: string }>) => {
      const { userId, date } = action.payload;
      delete state.logs[`${userId}-${date}`];
      state.loading = false;
    },
    deleteLogFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDailyLogError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
  addLogStart,
  addLogSuccess,
  addLogFailure,
  updateLogStart,
  updateLogSuccess,
  updateLogFailure,
  deleteLogStart,
  deleteLogSuccess,
  deleteLogFailure,
  clearDailyLogError,
} = dailyLogSlice.actions;

export default dailyLogSlice.reducer;
