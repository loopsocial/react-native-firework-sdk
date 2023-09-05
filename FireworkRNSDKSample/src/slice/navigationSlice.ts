import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  enablePushingRNContainer: boolean;
  enableNativeNavigation: boolean;
}

const initialState: NavigationState = {
  enablePushingRNContainer: false,
  enableNativeNavigation: false,
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
  },
});

export const { updateEnablePushingRNContainer, updateEnableNativeNavigation } =
  navigationSlice.actions;

export default navigationSlice.reducer;
