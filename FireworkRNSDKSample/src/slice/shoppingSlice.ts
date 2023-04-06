import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingCTAButtonConfiguration } from 'react-native-firework-sdk';
import type CartItem from '../models/CartItem';

export interface CartState {
  cartItems: CartItem[];
  cartIconVisible: boolean;
  defaultCartIconVisible: boolean;
  ctaButtonConfiguration: ShoppingCTAButtonConfiguration;
  defaultCtaButtonConfiguration: ShoppingCTAButtonConfiguration;
  linkButtonHidden: boolean;
  defaultLinkButtonHidden: boolean;
  enableCustomClickLinkButton: boolean;
  defaultEnableCustomClickLinkButton: boolean;
}

const initialState: CartState = {
  cartItems: [],
  cartIconVisible: true,
  defaultCartIconVisible: true,
  ctaButtonConfiguration: {
    text: 'addToCart',
  },
  defaultCtaButtonConfiguration: {
    text: 'addToCart',
  },
  linkButtonHidden: false,
  defaultLinkButtonHidden: false,
  enableCustomClickLinkButton: false,
  defaultEnableCustomClickLinkButton: false,
};

export const shoppingSlice = createSlice({
  name: 'shopping',
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
    setCTAButtonConfiguration: (
      state,
      action: PayloadAction<ShoppingCTAButtonConfiguration>
    ) => {
      state.ctaButtonConfiguration = action.payload;
    },
    changeLinkButtonVisibility: (state, action: PayloadAction<boolean>) => {
      state.linkButtonHidden = action.payload;
    },
    changeCustomClickLinkButtonAbility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableCustomClickLinkButton = action.payload;
    },
  },
});

export const {
  addCartItem,
  removeAllCartItems,
  changeCartIconVisibility,
  setCTAButtonConfiguration,
  changeLinkButtonVisibility,
  changeCustomClickLinkButtonAbility,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
