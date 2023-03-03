import logger from 'redux-logger';

import { configureStore } from '@reduxjs/toolkit';

import cartSlice from '../slice/cartSlice';
import feedSlice from '../slice/feedSlice';

export const store = configureStore({
  reducer: { cart: cartSlice, feed: feedSlice },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
