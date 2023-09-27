import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  enablePushingRNContainer: boolean;
  enableNativeNavigation: boolean;
  enablePausePlayer: boolean;
}

const initialState: NavigationState = {
  enablePushingRNContainer: false,
  enableNativeNavigation: false,
  enablePausePlayer: false,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    updateEnablePushingRNContainer: (state, action: PayloadAction<boolean>) => {
      state.enablePushingRNContainer = action.payload;
    },
    updateEnableNativeNavigation: (state, action: PayloadAction<boolean>) => {
      state.enableNativeNavigation = action.payload;
    },
    updateEnablePausePlayer: (state, action: PayloadAction<boolean>) => {
      state.enablePausePlayer = action.payload;
    },
  },
});

export const {
  updateEnablePushingRNContainer,
  updateEnableNativeNavigation,
  updateEnablePausePlayer,
} = navigationSlice.actions;

export default navigationSlice.reducer;
