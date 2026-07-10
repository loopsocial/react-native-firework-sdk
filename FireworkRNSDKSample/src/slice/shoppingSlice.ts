import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ShoppingCTAButtonConfiguration,
  ProductCardConfiguration,
  ProductCardV2Configuration,
  ProductHydrationConfiguration,
} from 'react-native-firework-sdk';
import type CartItem from '../models/CartItem';

export type ProductCardConfigurationVersion = 'v1' | 'v2';

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
  productCardConfigurationVersion: ProductCardConfigurationVersion;
  defaultProductCardConfigurationVersion: ProductCardConfigurationVersion;
  productCardConfiguration: ProductCardConfiguration;
  defaultProductCardConfiguration: ProductCardConfiguration;
  productCardV2Configuration: ProductCardV2Configuration;
  defaultProductCardV2Configuration: ProductCardV2Configuration;
  enableCustomTapProductCard: boolean;
  defaultEnableCustomTapProductCard: boolean;
  hydrationConfiguration: ProductHydrationConfiguration;
  defaultHydrationConfiguration: ProductHydrationConfiguration;
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
  productCardConfigurationVersion: 'v1',
  defaultProductCardConfigurationVersion: 'v1',
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
  productCardV2Configuration: {},
  defaultProductCardV2Configuration: {},
  enableCustomTapProductCard: false,
  defaultEnableCustomTapProductCard: false,
  hydrationConfiguration: {
    variantsHydrationStrategy: 'merge',
  },
  defaultHydrationConfiguration: {
    variantsHydrationStrategy: 'merge',
  },
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
    setProductCardV2Configuration: (
      state,
      action: PayloadAction<ProductCardV2Configuration>
    ) => {
      state.productCardV2Configuration = action.payload;
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
    setProductCardConfigurationVersion: (
      state,
      action: PayloadAction<ProductCardConfigurationVersion>
    ) => {
      state.productCardConfigurationVersion = action.payload;
    },
    updateEnableCustomTapProductCard: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.enableCustomTapProductCard = action.payload;
    },
    setHydrationConfiguration: (
      state,
      action: PayloadAction<ProductHydrationConfiguration>
    ) => {
      state.hydrationConfiguration = action.payload;
    },
  },
});

export const {
  addCartItem,
  removeAllCartItems,
  changeCartIconVisibility,
  setCTAButtonConfiguration,
  setProductCardConfiguration,
  setProductCardV2Configuration,
  changeLinkButtonVisibility,
  updateEnableCustomClickLinkButton,
  setProductCardConfigurationVersion,
  updateEnableCustomTapProductCard,
  setHydrationConfiguration,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
