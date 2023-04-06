import { useEffect } from 'react';
import FireworkSDK from 'react-native-firework-sdk';
import { useAppSelector } from './reduxHooks';

export function useCartIconVisibilityEffect() {
  const cartIconVisible = useAppSelector(
    (state) => state.shopping.cartIconVisible
  );

  useEffect(() => {
    FireworkSDK.getInstance().shopping.cartIconVisible = cartIconVisible;
  }, [cartIconVisible]);
}

export function useCartItemCountEffect() {
  const cartItemCount = useAppSelector(
    (state) => state.shopping.cartItems.length
  );

  useEffect(() => {
    FireworkSDK.getInstance().shopping.setCartItemCount(cartItemCount);
  }, [cartItemCount]);
}
