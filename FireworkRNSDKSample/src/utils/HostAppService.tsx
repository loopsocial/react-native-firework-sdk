import type {
  Product,
  UpdateProductDetailsCallback,
  UpdateProductDetailsEvent,
  CustomClickCartIconCallback,
  CustomCTAClickCallback,
  ShoppingCTACallback,
  ShoppingCTAEvent,
  CustomTapProductCardCallback,
  VideoFeedClickCallback,
  onLiveStreamEventCallback,
  onLiveStreamChatEventCallback,
  ClickProductCallback,
  SDKInitCallback,
  CustomLinkInteractionClickCallback,
} from 'react-native-firework-sdk';
import FireworkSDK from 'react-native-firework-sdk';
import * as RootNavigation from '../RootNavigation';
import type CartItem from '../models/CartItem';
import { addCartItem } from '../slice/shoppingSlice';
import { store } from '../store';
import ShopifyClient from './ShopifyClient';
import { shopifyDomain } from '../config/Shopify.json';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import { Platform } from 'react-native';
import FWExampleLoggerUtil from './FWExampleLoggerUtil';
import { topName as topAppName } from '../../app.json';
import FWLoggerUtil from '../../../src/utils/FWLoggerUtil';

export default class HostAppService {
  private static _instance?: HostAppService;

  public onSDKInit?: SDKInitCallback = (event) => {
    FWExampleLoggerUtil.log({ shouldCache: true }, 'onSDKInit', event);
  };

  public onShopNow?: ShoppingCTACallback = async (event: ShoppingCTAEvent) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onShopNow event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.video.feedId ?? ''),
      'customCTA',
      event.customCTA ?? 'none',
      'videoType',
      event.video.videoType ?? 'none',
      'liveStreamStatus',
      event.video.liveStreamStatus ?? 'none'
    );

    await this.closePlayerOrStartFloatingPlayer();
    this.navigate('LinkContent', { url: event.url });

    return {
      res: 'success',
    };
  };

  public onAddToCart?: ShoppingCTACallback = async (
    event: ShoppingCTAEvent
  ) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onAddToCart event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.video.feedId ?? ''),
      'customCTA',
      event.customCTA ?? 'none',
      'videoType',
      event.video.videoType ?? 'none',
      'liveStreamStatus',
      event.video.liveStreamStatus ?? 'none'
    );
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
        FWExampleLoggerUtil.log(
          { shouldCache: true },
          'fetchProduct error: product is empty.'
        );
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
        FWExampleLoggerUtil.log(
          { shouldCache: true },
          'fetchProduct error: variant is empty.'
        );
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
          amount: amount ? parseFloat(amount) : 0,
          currencyCode,
        },
        description: variant.title,
        imageURL: variant.image.src,
      };
      store.dispatch(addCartItem(cartItem));
      const cartItemCount = store.getState().shopping.cartItems.length;
      FWExampleLoggerUtil.log(
        { shouldCache: true },
        'cartItemCount',
        cartItemCount,
        'type',
        typeof cartItemCount
      );
      return {
        res: 'success',
        tips: 'Added to cart',
      };
    } catch (e) {
      FWExampleLoggerUtil.log({ shouldCache: true }, 'fetchProduct error', e);
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
    FWExampleLoggerUtil.log(
      {},
      'onCustomClickCartIcon event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.video.feedId ?? '')
    );
    await this.closePlayerOrStartFloatingPlayer();
    if (this.shouldShowCart()) {
      this.navigate('Cart');
    }
  };

  public onCustomCTAClick?: CustomCTAClickCallback = (event) => {
    if (event.url) {
      FWExampleLoggerUtil.log(
        { shouldCache: true },
        'onCustomCTAClick event',
        event,
        'component type',
        FireworkSDK.getInstance().getComponentType(event.video.feedId ?? ''),
        'videoType',
        event.video.videoType ?? 'none',
        'liveStreamStatus',
        event.video.liveStreamStatus ?? 'none'
      );
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
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onCustomTapProductCard event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.video.feedId ?? ''),
      'videoType',
      event.video.videoType ?? 'none',
      'liveStreamStatus',
      event.video.liveStreamStatus ?? 'none'
    );

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
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onUpdateProductDetails event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.video.feedId ?? ''),
      'videoType',
      event.video.videoType ?? 'none',
      'liveStreamStatus',
      event.video.liveStreamStatus ?? 'none'
    );

    FWLoggerUtil.log(
      `Host app receive onUpdateProductDetails callback productIds: ${event.productIds}`
    );

    try {
      const updatedProducts: Product[] = [];

      if (Platform.OS === 'ios') {
        await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      } else {
        await Promise.resolve();
      }

      FWExampleLoggerUtil.log(
        { shouldCache: true },
        'Simulated network request completed'
      );

      for (const [index, productId] of event.productIds.entries()) {
        const isOnSale = Math.random() > 0.5;
        const productIndex = index % 3;

        // Product hidden: 1st product hidden, 2nd product explicitly not hidden, rest omit hidden
        const hidden =
          productIndex === 0 ? true : productIndex === 1 ? false : undefined;
        // Product isAvailable: 1st product available, 2nd product unavailable, rest omit (SDK keeps its value)
        const productIsAvailable =
          productIndex === 0 ? true : productIndex === 1 ? false : undefined;

        const product: Product = {
          productId,
          name: `Hydrated Product ${productId}`,
          subtitle: 'Latest version',
          description: `This is the hydrated product data for ${productId}. Updated at ${new Date().toLocaleTimeString()}`,
          isAvailable: productIsAvailable,
          mainProductImage:
            'https://cdn4.fireworktv.com/medias/2022/9/6/1662493723-camvuesx/720_720/7197ThQPZFL._AC_UX500_.jpg',
          currency: 'USD',
          hidePrice: false,
          hidden,
          units: [
            {
              unitId: `${productId}-hydration-variant-1`,
              name: 'Hydration variant 1',
              url: 'https://www.amazon.com/Soda-Glove-Ankle-Elastic-Chunky/dp/B07VXKVZTR/ref=sr_1_4?crid=UB0LJITJD8FZ&keywords=womens+heel+boots&qid=1662493690&sprefix=womens+heel+boots%2Caps%2C160&sr=8-4',
              imageUrl:
                'https://cdn4.fireworktv.com/medias/2022/9/6/1662493723-camvuesx/720_720/7197ThQPZFL._AC_UX500_.jpg',
              price: {
                amount: 100,
                currencyCode: 'USD',
              },
              originalPrice: isOnSale
                ? {
                    amount: 120,
                    currencyCode: 'USD',
                  }
                : undefined,
              isAvailable: true,
              options: [
                { name: 'Color', value: 'Black(hydrated)' },
                { name: 'Size', value: 'L(hydrated)' },
              ],
            },
            {
              // Unit with isAvailable explicitly false
              unitId: `${productId}-hydration-variant-2`,
              name: 'Hydration variant 2 (unavailable)',
              url: 'https://www.amazon.com/Soda-Glove-Ankle-Elastic-Chunky/dp/B08L479F2J/ref=sr_1_4?crid=UB0LJITJD8FZ&keywords=womens%2Bheel%2Bboots&qid=1662493690&sprefix=womens%2Bheel%2Bboots%2Caps%2C160&sr=8-4&th=1',
              imageUrl:
                'https://cdn4.fireworktv.com/medias/2024/8/28/1724837216-crjnidhk/720_720/WechatIMG124.jpg',
              price: {
                amount: 110,
                currencyCode: 'USD',
              },
              originalPrice: isOnSale
                ? {
                    amount: 130,
                    currencyCode: 'USD',
                  }
                : undefined,
              isAvailable: false,
              options: [
                { name: 'Color', value: 'White(hydrated)' },
                { name: 'Size', value: 'M(hydrated)' },
              ],
            },
            {
              // Unit with isAvailable omitted — SDK should keep its original value
              unitId: `${productId}-hydration-variant-3`,
              name: 'Hydration variant 3 (isAvailable omitted)',
              url: 'https://www.amazon.com/Soda-Glove-Ankle-Elastic-Chunky/dp/B07VXKVZTR/',
              imageUrl:
                'https://cdn4.fireworktv.com/medias/2022/9/6/1662493723-camvuesx/720_720/7197ThQPZFL._AC_UX500_.jpg',
              price: {
                amount: 95,
                currencyCode: 'USD',
              },
              options: [
                { name: 'Color', value: 'Red(hydrated)' },
                { name: 'Size', value: 'S(hydrated)' },
              ],
            },
          ],
        };

        updatedProducts.push(product);

        const hiddenLabel =
          hidden === true
            ? ' (hidden)'
            : hidden === false
              ? ' (visible)'
              : ' (hidden unchanged)';
        const availLabel =
          productIsAvailable === true
            ? ' (available)'
            : productIsAvailable === false
              ? ' (unavailable)'
              : ' (availability unchanged)';

        FWExampleLoggerUtil.log(
          { shouldCache: true },
          `Successfully hydrated product ${productId}${hiddenLabel}${availLabel}`,
          product
        );
      }

      return updatedProducts.length > 0 ? updatedProducts : null;
    } catch (error) {
      FWExampleLoggerUtil.log(
        { shouldCache: true },
        'Error in onUpdateProductDetails',
        error
      );
      return null;
    }
  };

  public onVideoFeedClick?: VideoFeedClickCallback = async (event) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onVideoFeedClick event',
      event,
      'component type',
      FireworkSDK.getInstance().getComponentType(event.info.feedId ?? ''),
      'videoType',
      event.info.videoType ?? 'none',
      'liveStreamStatus',
      event.info.liveStreamStatus ?? 'none'
    );
  };

  public onLiveStreamEvent?: onLiveStreamEventCallback = async (event) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onLiveStreamEvent',
      event,
      'videoType',
      event.info.videoType ?? 'none',
      'liveStreamStatus',
      event.info.liveStreamStatus ?? 'none'
    );
  };

  public onLiveStreamChatEvent?: onLiveStreamChatEventCallback = async (
    event
  ) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onLiveStreamChatEvent',
      event,
      'videoType',
      event.liveStream.videoType ?? 'none',
      'liveStreamStatus',
      event.liveStream.liveStreamStatus ?? 'none'
    );
  };

  public onCustomLinkInteractionClick?: CustomLinkInteractionClickCallback =
    async (event) => {
      FWExampleLoggerUtil.log(
        { shouldCache: true },
        'onCustomLinkInteractionClick',
        event
      );
      await this.closePlayerOrStartFloatingPlayer();
      this.navigate('LinkContent', { url: event.url });
    };

  public onClickProduct?: ClickProductCallback = async (event) => {
    FWExampleLoggerUtil.log(
      { shouldCache: true },
      'onClickProduct event',
      event
    );
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

    await FireworkSDK.getInstance().navigator.tryStartFloatingOrCloseFullScreen();
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
