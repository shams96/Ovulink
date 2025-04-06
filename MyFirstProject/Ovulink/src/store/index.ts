import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import cycleReducer from './cycleSlice';
import maleHealthReducer from './maleHealthSlice';
import dailyLogReducer from './dailyLogSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cycle', 'maleHealth', 'dailyLog'], // Persist all reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  cycle: cycleReducer,
  maleHealth: maleHealthReducer,
  dailyLog: dailyLogReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
