import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ShoppingCTAButtonConfiguration,
  ProductCardConfiguration,
} from 'react-native-firework-sdk';
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
  productCardConfiguration: ProductCardConfiguration;
  defaultProductCardConfiguration: ProductCardConfiguration;
  enableCustomTapProductCard: boolean;
  defaultEnableCustomTapProductCard: boolean;
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
  productCardConfiguration: {
    ctaButtonText: 'shopNow',
    theme: 'dark',
    priceConfiguration: {
      isHidden: false,
    },
    isCtaButtonHidden: false,
  },
  defaultProductCardConfiguration: {
    ctaButtonText: 'shopNow',
    theme: 'dark',
    priceConfiguration: {
      isHidden: false,
    },
    isCtaButtonHidden: false,
  },
  enableCustomTapProductCard: false,
  defaultEnableCustomTapProductCard: false,
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
    setProductCardConfiguration: (
      state,
      action: PayloadAction<ProductCardConfiguration>
    ) => {
      state.productCardConfiguration = action.payload;
    },
    changeLinkButtonVisibility: (state, action: PayloadAction<boolean>) => {
      state.linkButtonHidden = action.payload;
    },
    updateEnableCustomClickLinkButton: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableCustomClickLinkButton = action.payload;
    },
    updateEnableCustomTapProductCard: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableCustomTapProductCard = action.payload;
    },
  },
});

export const {
  addCartItem,
  removeAllCartItems,
  changeCartIconVisibility,
  setCTAButtonConfiguration,
  setProductCardConfiguration,
  changeLinkButtonVisibility,
  updateEnableCustomClickLinkButton,
  updateEnableCustomTapProductCard,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
