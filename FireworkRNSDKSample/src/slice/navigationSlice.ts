import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NavigationState {
  enablePausePlayer: boolean;
}

const initialState: NavigationState = {
  enablePausePlayer: false,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    updateEnablePausePlayer: (state, action: PayloadAction<boolean>) => {
      state.enablePausePlayer = action.payload;
    },
  },
});

export const { updateEnablePausePlayer } = navigationSlice.actions;

export default navigationSlice.reducer;
