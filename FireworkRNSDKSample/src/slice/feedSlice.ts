import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FeedState {
  enablePictureInPicture: boolean;
}

const initialState: FeedState = {
  enablePictureInPicture: true,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateEnablePictureInPicture: (state, action: PayloadAction<boolean>) => {
      state.enablePictureInPicture = action.payload;
    },
  },
});

export const { updateEnablePictureInPicture } = feedSlice.actions;

export default feedSlice.reducer;
