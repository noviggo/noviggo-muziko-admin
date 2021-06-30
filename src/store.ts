import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import { muzikoApi } from './slices/muzikoApi';
import { settingsReducer } from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    [muzikoApi.reducerPath]: muzikoApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(muzikoApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
