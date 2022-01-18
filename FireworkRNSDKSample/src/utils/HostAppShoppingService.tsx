import React from 'react';

import type {
  AddToCartCallback,
  ClickCartIconCallback,
  Product,
  UpdateProductDetailsCallback,
  WillDisplayProductCallback,
} from 'react-native-firework-sdk';
import CartApp from '../CartApp';

import type CartItem from '../models/CartItem';
import { addCartItem } from '../slice/cartSlice';
import { store } from '../store';
import ShopifyClient from './ShopifyClient';

export default class HostAppShoppingService {
  private static _instance?: HostAppShoppingService;

  public onAddToCart?: AddToCartCallback = async (event) => {
    console.log('[example] onAddToCart', event);

    try {
      const shopifyProduct = await ShopifyClient.getInstance().fetchProduct(
        event.productId
      );
      const variant = shopifyProduct.variants.find(
        (v) => ShopifyClient.getInstance().parseId(`${v.id}`) === event.unitId
      );
      if (!variant) {
        return {
          res: 'fail',
          tips: 'Unable to locate the selected variant',
        };
      }

      const { amount, currencyCode }: { amount: string; currencyCode: string } =
        (variant as any).priceV2;

      let cartItem: CartItem = {
        productId: event.productId,
        unitId: event.unitId,
        name: shopifyProduct.title,
        price: {
          amount: parseFloat(amount),
          currencyCode,
        },
        description: variant.title,
        imageURL: variant.image.src,
      };
      store.dispatch(addCartItem(cartItem));
      return {
        res: 'success',
        tips: 'Add to cart successfully',
      };
    } catch (e) {
      return {
        res: 'fail',
        tips: 'Failed loading product information',
      };
    }
  };

  public onClickCartIcon?: ClickCartIconCallback = async () => {
    console.log('[example] onClickCartIcon');

    return <CartApp />;
  };

  public onUpdateProductDetails: UpdateProductDetailsCallback = async (
    event
  ) => {
    console.log('[example] onUpdateProductDetails', event);

    try {
      const shopifyProduct = await ShopifyClient.getInstance().fetchProduct(
        event.productId
      );
      let product: Product = { productId: event.productId };
      product.name = shopifyProduct.title;
      product.description = (shopifyProduct as any).descriptionHtml;
      product.units = shopifyProduct.variants.map((shopifyProductVariant) => {
        const {
          amount,
          currencyCode,
        }: { amount: string; currencyCode: string } = (
          shopifyProductVariant as any
        ).priceV2;

        return {
          unitId: ShopifyClient.getInstance().parseId(
            `${shopifyProductVariant.id}`
          ),
          name: shopifyProductVariant.title,
          price: { amount: parseFloat(amount), currencyCode },
        };
      });

      return product;
    } catch (e) {}
    return null;
  };

  public onWillDisplayProduct?: WillDisplayProductCallback = async (event) => {
    console.log('[example] onWillDisplayProduct', event);

    return {
      cartIcon: { isHidden: false },
    };
  };

  public static getInstance() {
    if (!HostAppShoppingService._instance) {
      HostAppShoppingService._instance = new HostAppShoppingService();
    }

    return HostAppShoppingService._instance!;
  }

  private constructor() {}
}
