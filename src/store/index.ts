import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import mapSlice from './slices/mapSlice';
import uiSlice from './slices/uiSlice';
import configSlice from './slices/configSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    map: mapSlice,
    ui: uiSlice,
    config: configSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
