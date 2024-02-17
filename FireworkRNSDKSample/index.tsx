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

FireworkSDK.getInstance().onSDKInit = (event) => {
  console.log('[example] onSDKInit', event);
};

// FireworkSDK.getInstance().onVideoPlayback = (event) => {
//   console.log('[example] onVideoPlayback', event);
// };

FireworkSDK.getInstance().onVideoFeedClick = (event) => {
  console.log('[example] onVideoFeedClick', event);
};

FireworkSDK.getInstance().shopping.onShoppingCTA =
  HostAppService.getInstance().onShopNow;

FireworkSDK.getInstance().shopping.onCustomClickCartIcon =
  HostAppService.getInstance().onCustomClickCartIcon;

FireworkSDK.getInstance().shopping.onUpdateProductDetails =
  HostAppService.getInstance().onUpdateProductDetails;

FireworkSDK.getInstance().onCustomCTAClick =
  HostAppService.getInstance().onCustomCTAClick;

FireworkSDK.getInstance().liveStream.onLiveStreamEvent = (event) => {
  console.log('[example] onLiveStreamEvent', event);
};

FireworkSDK.getInstance().liveStream.onLiveStreamChatEvent = (event) => {
  console.log('[example] onLiveStreamChatEvent', event);
};

FireworkSDK.getInstance().shopping.productInfoViewConfiguration = {
  ctaButton: { text: 'shopNow' },
};
FireworkSDK.getInstance().shopping.cartIconVisible =
  HostAppService.getInstance().shouldShowCart();

// init FireworkSDK
FireworkSDK.getInstance().markInitCalled();
