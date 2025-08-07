import { configureStore } from '@reduxjs/toolkit';
import { CounterSlice } from './slices/CouterSlice';
import { DeviceSlice } from './slices/DeviceSlice';
import { AssetSlice } from './slices/AssetSlice';

export const store = configureStore({
  reducer: {
    assets: AssetSlice.reducer,
    couter: CounterSlice.reducer,
    device: DeviceSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
