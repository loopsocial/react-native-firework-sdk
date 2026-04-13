import { AppRegistry } from 'react-native';
import FireworkSDK from 'react-native-firework-sdk';

import { name as appName, topName as topAppName } from './app.json';
import App from './src/App';
import HostAppService from './src/utils/HostAppService';
import TopApp from './src/TopApp';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(topAppName, () => TopApp);

FireworkSDK.getInstance().debugLogsEnabled = true;

FireworkSDK.getInstance().adBadgeConfiguration = { badgeTextType: 'ad' };

FireworkSDK.getInstance().onSDKInit = HostAppService.getInstance().onSDKInit;

// FireworkSDK.getInstance().onVideoPlayback = (event) => {
//   console.log('[example] onVideoPlayback', event);
// };

FireworkSDK.getInstance().onVideoFeedClick =
  HostAppService.getInstance().onVideoFeedClick;

FireworkSDK.getInstance().shopping.onShoppingCTA =
  HostAppService.getInstance().onShopNow;

FireworkSDK.getInstance().shopping.onCustomClickCartIcon =
  HostAppService.getInstance().onCustomClickCartIcon;

FireworkSDK.getInstance().shopping.onUpdateProductDetails =
  HostAppService.getInstance().onUpdateProductDetails;

FireworkSDK.getInstance().shopping.onClickProduct =
  HostAppService.getInstance().onClickProduct;

FireworkSDK.getInstance().onCustomCTAClick =
  HostAppService.getInstance().onCustomCTAClick;

FireworkSDK.getInstance().liveStream.onLiveStreamEvent =
  HostAppService.getInstance().onLiveStreamEvent;

FireworkSDK.getInstance().liveStream.onLiveStreamChatEvent =
  HostAppService.getInstance().onLiveStreamChatEvent;

FireworkSDK.getInstance().shopping.productInfoViewConfiguration = {
  ctaButton: { text: 'shopNow' },
};
FireworkSDK.getInstance().shopping.cartIconVisible =
  HostAppService.getInstance().shouldShowCart();

// init FireworkSDK
FireworkSDK.getInstance().markInitCalled();
