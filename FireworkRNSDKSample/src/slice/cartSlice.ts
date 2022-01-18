import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type CartItem from '../models/CartItem';

export interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const foundItem = state.cartItems.find(
        (e) =>
          e.productId === action.payload.productId &&
          e.unitId === action.payload.unitId
      );
      if (foundItem) {
        if (foundItem.quantity) {
          foundItem.quantity += 1;
        } else {
          foundItem.quantity = 1;
        }
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeAllCartItems: (state) => {
      state.cartItems = [];
    }
  },
});

export const { addCartItem, removeAllCartItems } = cartSlice.actions;

export default cartSlice.reducer;
