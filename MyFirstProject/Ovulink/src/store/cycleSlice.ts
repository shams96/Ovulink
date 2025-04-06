import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CycleState, Cycle, CycleDay } from '../types';

const initialState: CycleState = {
  cycles: [],
  currentCycle: null,
  loading: false,
  error: null,
};

const cycleSlice = createSlice({
  name: 'cycle',
  initialState,
  reducers: {
    fetchCyclesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCyclesSuccess: (state, action: PayloadAction<Cycle[]>) => {
      state.cycles = action.payload;
      state.loading = false;
      
      // Set current cycle to the most recent one
      if (action.payload.length > 0) {
        const sortedCycles = [...action.payload].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        state.currentCycle = sortedCycles[0];
      }
    },
    fetchCyclesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createCycleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCycleSuccess: (state, action: PayloadAction<Cycle>) => {
      state.cycles.push(action.payload);
      state.currentCycle = action.payload;
      state.loading = false;
    },
    createCycleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCycleDayStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCycleDaySuccess: (state, action: PayloadAction<{ cycleId: string; day: CycleDay }>) => {
      const { cycleId, day } = action.payload;
      const cycleIndex = state.cycles.findIndex(cycle => cycle.id === cycleId);
      
      if (cycleIndex !== -1) {
        const dayIndex = state.cycles[cycleIndex].days.findIndex(d => d.date === day.date);
        
        if (dayIndex !== -1) {
          state.cycles[cycleIndex].days[dayIndex] = day;
        } else {
          state.cycles[cycleIndex].days.push(day);
        }
        
        // Update current cycle if it's the one being modified
        if (state.currentCycle?.id === cycleId) {
          state.currentCycle = state.cycles[cycleIndex];
        }
      }
      
      state.loading = false;
    },
    updateCycleDayFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentCycle: (state, action: PayloadAction<string>) => {
      const cycleId = action.payload;
      const cycle = state.cycles.find(c => c.id === cycleId);
      if (cycle) {
        state.currentCycle = cycle;
      }
    },
    updatePredictions: (state, action: PayloadAction<{ cycleId: string; ovulationDate: string; periodDate: string }>) => {
      const { cycleId, ovulationDate, periodDate } = action.payload;
      const cycleIndex = state.cycles.findIndex(cycle => cycle.id === cycleId);
      
      if (cycleIndex !== -1) {
        state.cycles[cycleIndex].predictedOvulationDate = ovulationDate;
        state.cycles[cycleIndex].predictedPeriodDate = periodDate;
        
        // Update current cycle if it's the one being modified
        if (state.currentCycle?.id === cycleId) {
          state.currentCycle = state.cycles[cycleIndex];
        }
      }
    },
    clearCycleError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCyclesStart,
  fetchCyclesSuccess,
  fetchCyclesFailure,
  createCycleStart,
  createCycleSuccess,
  createCycleFailure,
  updateCycleDayStart,
  updateCycleDaySuccess,
  updateCycleDayFailure,
  setCurrentCycle,
  updatePredictions,
  clearCycleError,
} = cycleSlice.actions;

export default cycleSlice.reducer;
