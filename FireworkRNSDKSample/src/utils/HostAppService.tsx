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
    let productList: Product[] = [];
    const productIds = event.productIds ?? [];
    // Umcomment if need test
    // try {
    //   for (let index = 0; index < productIds.length; index++) {
    //     const productId = productIds[index]!;
    //     // const shopifyProduct =
    //     //   await ShopifyClient.getInstance().fetchProduct(productId);
    //     const imageId = 10 + index * 10;
    //     let product: Product = { productId: productId };
    //     product.name = `[Hydrated] ${productId} - Flash Sale`;
    //     product.subtitle = 'Save up to 50% today';
    //     product.currency = 'EUR';
    //     product.description = `[Hydrated] Limited time offer on ${productId}. Get it before it's gone!`;
    //     product.isAvailable = true;
    //     product.mainProductImage = `https://picsum.photos/id/${imageId}/600/600`;
    //     product.hidePrice = false;
    //     product.customCTATitleTranslation = 'Shop Now';
    //     product.hidePrimaryCTA = false;
    //     product.customCTATarget = '_blank';
    //     product.customCTAUrl = `https://www.firework.com/shop/${productId}`;
    //     product.customCTATitle = 'Add to Cart';
    //     product.hidden = false;
    //     product.units = [0, 1, 2].map((unitIndex) => {
    //       const unitId = `unit-${index}-${unitIndex}`;
    //       const unitImageId = imageId + unitIndex + 1;
    //       const variantPrice = 19.99 + unitIndex * 15;
    //       const variantOriginalPrice = variantPrice * 2.5;
    //       return {
    //         unitId,
    //         name: `[Hydrated] Unit ${unitIndex + 1} - Limited Edition`,
    //         price: {
    //           amount: variantPrice,
    //           currencyCode: 'EUR',
    //         },
    //         originalPrice: {
    //           amount: variantOriginalPrice,
    //           currencyCode: 'EUR',
    //         },
    //         url: `https://www.firework.com/shop/${productId}/units/${unitId}`,
    //         imageUrl: `https://picsum.photos/id/${unitImageId}/400/400`,
    //         isAvailable: unitIndex !== 2,
    //       };
    //     });
    //     productList.push(product);
    //   }
    //   return productList;
    // } catch (e) {}
    try {
      for (let productId of productIds) {
        const shopifyProduct =
          await ShopifyClient.getInstance().fetchProduct(productId);
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
            price: {
              amount: amount ? parseFloat(amount) : 0,
              currencyCode,
            },
          };
        });
        productList.push(product);
      }
      return productList;
    } catch (e) {}
    return [];
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
