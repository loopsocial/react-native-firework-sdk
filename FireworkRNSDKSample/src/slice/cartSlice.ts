import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AddToCartButtonConfiguration } from 'react-native-firework-sdk';
import type CartItem from '../models/CartItem';

export interface CartState {
  cartItems: CartItem[];
  cartIconVisible: boolean;
  defaultCartIconVisible: boolean;
  addToCartButtonStyle: AddToCartButtonConfiguration;
  defaultAddToCartButtonStyle: AddToCartButtonConfiguration;
}

const initialState: CartState = {
  cartItems: [],
  cartIconVisible: true,
  defaultCartIconVisible: true,
  addToCartButtonStyle: {},
  defaultAddToCartButtonStyle: {},
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
    },
    changeCartIconVisibility: (state, action: PayloadAction<boolean>) => {
      state.cartIconVisible = action.payload;
    },
    setAddToCartButtonStyle: (
      state,
      action: PayloadAction<AddToCartButtonConfiguration>
    ) => {
      state.addToCartButtonStyle = action.payload;
    },
  },
});

export const {
  addCartItem,
  removeAllCartItems,
  changeCartIconVisibility,
  setAddToCartButtonStyle,
} = cartSlice.actions;

export default cartSlice.reducer;
