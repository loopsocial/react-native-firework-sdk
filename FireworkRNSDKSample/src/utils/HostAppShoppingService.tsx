import type {
  AddToCartCallback,
  AddToCartEvent,
  ClickCartIconCallback,
  Product,
  UpdateProductDetailsCallback,
  UpdateProductDetailsEvent,
  WillDisplayProductCallback,
  WillDisplayProductEvent,
  CustomClickCartIconCallback,
  CustomCTAClickCallback,
} from 'react-native-firework-sdk';
import FireworkSDK from 'react-native-firework-sdk';
import * as RootNavigation from '../RootNavigation';
import type CartItem from '../models/CartItem';
import { addCartItem } from '../slice/cartSlice';
import { store } from '../store';
import ShopifyClient from './ShopifyClient';

export default class HostAppShoppingService {
  private static _instance?: HostAppShoppingService;

  public onAddToCart?: AddToCartCallback = async (event: AddToCartEvent) => {
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
      const cartItemCount = store.getState().cart.cartItems.length;
      console.log('cartItemCount', cartItemCount, 'type', typeof cartItemCount);
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
    return {
      initialRouteName: 'Cart',
    };
  };

  public onCustomClickCartIcon?: CustomClickCartIconCallback = async () => {
    console.log('[example] onCustomClickCartIcon');
    FireworkSDK.getInstance().navigator.popNativeContainer();
    RootNavigation.navigate('Cart');
  };

  public onCustomCTAClick?: CustomCTAClickCallback = (event) => {
    if (event.url) {
      FireworkSDK.getInstance().navigator.popNativeContainer();
      RootNavigation.navigate('CTALinkContent', { url: event.url });
    }
  };

  public onUpdateProductDetails: UpdateProductDetailsCallback = async (
    event: UpdateProductDetailsEvent
  ) => {
    console.log('[example] onUpdateProductDetails event', event);
    let productList: Product[] = [];
    const productIds = event.productIds ?? [];
    try {
      for (let productId of productIds) {
        const shopifyProduct = await ShopifyClient.getInstance().fetchProduct(
          productId
        );
        let product: Product = { productId: productId };
        product.name = shopifyProduct.title;
        product.description = (shopifyProduct as any).descriptionHtml;
        product.units = shopifyProduct.variants.map((shopifyProductVariant) => {
          const {
            amount,
            currencyCode,
          }: { amount: string; currencyCode: string } = (
            shopifyProductVariant as any
          ).priceV2;
          const unitId = ShopifyClient.getInstance().parseId(
            `${shopifyProductVariant.id}`
          );
          return {
            unitId,
            name: shopifyProductVariant.title,
            price: { amount: parseFloat(amount), currencyCode },
          };
        });
        productList.push(product);
      }
      return productList;
    } catch (e) {}
    return [];
  };

  public onWillDisplayProduct?: WillDisplayProductCallback = async (
    event: WillDisplayProductEvent
  ) => {
    console.log('[example] onWillDisplayProduct', event);
    const addToCartButtonStyle = store.getState().cart.addToCartButtonStyle;
    return {
      addToCartButton: addToCartButtonStyle,
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
