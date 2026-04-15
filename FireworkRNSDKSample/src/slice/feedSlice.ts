import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FeedState {
  enablePictureInPicture: boolean;
  enableSystemPictureInPicture: boolean;
}

const initialState: FeedState = {
  enablePictureInPicture: true,
  enableSystemPictureInPicture: true,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateEnablePictureInPicture: (state, action: PayloadAction<boolean>) => {
      state.enablePictureInPicture = action.payload;
    },
    updateEnableSystemPictureInPicture: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableSystemPictureInPicture = action.payload;
    },
  },
});

export const {
  updateEnablePictureInPicture,
  updateEnableSystemPictureInPicture,
} = feedSlice.actions;

export default feedSlice.reducer;
