import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  enablePushingRNContainer: boolean;
}

const initialState: NavigationState = {
  enablePushingRNContainer: false,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    updateEnablePushingRNContainer: (state, action: PayloadAction<boolean>) => {
      state.enablePushingRNContainer = action.payload;
    },
  },
});

export const { updateEnablePushingRNContainer } = navigationSlice.actions;

export default navigationSlice.reducer;
