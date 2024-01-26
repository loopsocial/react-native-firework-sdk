import type {
  Product,
  UpdateProductDetailsCallback,
  UpdateProductDetailsEvent,
  CustomClickCartIconCallback,
  CustomCTAClickCallback,
  ShoppingCTACallback,
  ShoppingCTAEvent,
  CustomTapProductCardCallback,
} from 'react-native-firework-sdk';
import FireworkSDK from 'react-native-firework-sdk';
import * as RootNavigation from '../RootNavigation';
import type CartItem from '../models/CartItem';
import { addCartItem } from '../slice/shoppingSlice';
import { store } from '../store';
import ShopifyClient from './ShopifyClient';
import { shopifyDomain } from '../config/Shopify.json';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import { topName as topAppName } from '../../app.json';
import { Platform } from 'react-native';

export default class HostAppService {
  private static _instance?: HostAppService;

  public onShopNow?: ShoppingCTACallback = async (event: ShoppingCTAEvent) => {
    console.log('onShopNow event', event);

    await this.closePlayerOrStartFloatingPlayer();
    this.navigate('LinkContent', { url: event.url });

    return {
      res: 'success',
    };
  };

  public onAddToCart?: ShoppingCTACallback = async (
    event: ShoppingCTAEvent
  ) => {
    console.log('onAddToCart event', event);
    if (!this.shouldShowCart()) {
      await this.closePlayerOrStartFloatingPlayer();
      this.navigate('LinkContent', { url: event.url });
      return {
        res: 'success',
      };
    }

    try {
      const shopifyProduct = await ShopifyClient.getInstance().fetchProduct(
        event.productId
      );
      if (!shopifyProduct) {
        console.log('[example] fetchProduct error: product is empty.');
        await this.closePlayerOrStartFloatingPlayer();
        this.navigate('LinkContent', { url: event.url });
        return {
          res: 'success',
        };
      }

      const variant = shopifyProduct.variants.find(
        (v) => ShopifyClient.getInstance().parseId(`${v.id}`) === event.unitId
      );
      if (!variant) {
        console.log('[example] fetchProduct error: variant is empty.');
        await this.closePlayerOrStartFloatingPlayer();
        this.navigate('LinkContent', { url: event.url });
        return {
          res: 'success',
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
      const cartItemCount = store.getState().shopping.cartItems.length;
      console.log('cartItemCount', cartItemCount, 'type', typeof cartItemCount);
      return {
        res: 'success',
        tips: 'Added to cart',
      };
    } catch (e) {
      console.log('[example] fetchProduct error', e);
      await this.closePlayerOrStartFloatingPlayer();
      this.navigate('LinkContent', { url: event.url });
      return {
        res: 'success',
      };
    }
  };

  public onCustomClickCartIcon?: CustomClickCartIconCallback = async (
    event
  ) => {
    console.log('[example] onCustomClickCartIcon event', event);
    await this.closePlayerOrStartFloatingPlayer();
    if (this.shouldShowCart()) {
      this.navigate('Cart');
    }
  };

  public onCustomCTAClick?: CustomCTAClickCallback = (event) => {
    if (event.url) {
      console.log('[example] onCustomCTAClick event', event);
      if (store.getState().navigation.enablePausePlayer) {
        if (Platform.OS === 'ios') {
          event.playerHandler?.pause();
        }
      }
      this.closePlayerOrStartFloatingPlayer().then(() => {
        this.navigate('LinkContent', {
          url: event.url,
          playerHandler: event.playerHandler,
        });
      });
    }
  };

  public onCustomTapProductCard?: CustomTapProductCardCallback = async (
    event
  ) => {
    console.log('[example] onCustomTapProductCard event', event);

    if (store.getState().navigation.enablePausePlayer) {
      if (Platform.OS === 'ios') {
        event.playerHandler?.pause();
      }
    }
    HostAppService.getInstance().closePlayerOrStartFloatingPlayer();
    HostAppService.getInstance().navigate('LinkContent', {
      url: event.url,
      playerHandler: event.playerHandler,
    });
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

  public static getInstance() {
    if (!HostAppService._instance) {
      HostAppService._instance = new HostAppService();
    }

    return HostAppService._instance!;
  }

  public async closePlayerOrStartFloatingPlayer() {
    if (store.getState().navigation.enablePushingRNContainer) {
      return;
    }
    if (store.getState().navigation.enableNativeNavigation) {
      return;
    }
    const result =
      await FireworkSDK.getInstance().navigator.startFloatingPlayer();
    if (!result) {
      await FireworkSDK.getInstance().navigator.popNativeContainer();
    }
  }

  public async navigate(routeName: keyof RootStackParamList, params?: any) {
    if (store.getState().navigation.enablePushingRNContainer) {
      FireworkSDK.getInstance().navigator.pushRNContainer({
        appKey: topAppName,
        appProps: {
          initialRouteName: routeName,
          initialParams: params,
        },
      });
    } else if (store.getState().navigation.enableNativeNavigation) {
      RootNavigation.navigate(routeName, {
        ...params,
        isFromNativeNavigation: true,
      });
      await FireworkSDK.getInstance().navigator.bringRNContainerToTop();
    } else {
      RootNavigation.navigate(routeName, params);
    }
  }

  public shouldShowCart() {
    return !!shopifyDomain;
  }

  private constructor() {}
}
