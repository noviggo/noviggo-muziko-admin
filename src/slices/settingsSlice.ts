import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type Settings = { remoteLibraryUrl: string };
const initialState: Settings = { remoteLibraryUrl: 'http://192.168.0.101:5000' };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state: Settings, action: PayloadAction<Settings>) => {
      state = action.payload;
      return (state = action.payload);
    },
    setRemoteLibraryUrl: (state: Settings, action: PayloadAction<string>) => {
      state.remoteLibraryUrl = action.payload;
      return state;
    },
  },
});

export const { setSettings, setRemoteLibraryUrl } = settingsSlice.actions;

export const getSettings = (state: RootState) => state.settings;

export const settingsReducer = settingsSlice.reducer;
