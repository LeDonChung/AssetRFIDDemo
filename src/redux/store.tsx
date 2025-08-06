import { configureStore } from '@reduxjs/toolkit';
import { CounterSlice } from './slices/CouterSlice';

export const store = configureStore({
  reducer: {
    couter: CounterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
