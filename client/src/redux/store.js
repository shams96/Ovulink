import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import femaleHealthReducer from './slices/femaleHealthSlice';
import maleHealthReducer from './slices/maleHealthSlice';
import calendarReducer from './slices/calendarSlice';
import educationReducer from './slices/educationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    femaleHealth: femaleHealthReducer,
    maleHealth: maleHealthReducer,
    calendar: calendarReducer,
    education: educationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// For TypeScript users, these would be:
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
