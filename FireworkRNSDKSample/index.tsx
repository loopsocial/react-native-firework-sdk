import { AppRegistry } from 'react-native';
import FireworkSDK from 'react-native-firework-sdk';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { name as appName } from './app.json';
import App from './src/App';
import HostAppShoppingService from './src/utils/HostAppShoppingService';

Ionicons.loadFont().catch((e) => {
  console.log('[example] Ionicons.loadFont error', e);
});
FontAwesome.loadFont().catch((e) => {
  console.log('[example] FontAwesome.loadFont error', e);
});
MaterialIcons.loadFont().catch((e) => {
  console.log('[example] MaterialIcons.loadFont error', e);
});

AppRegistry.registerComponent(appName, () => App);

FireworkSDK.getInstance().debugLogsEnabled = false;

FireworkSDK.getInstance().appComponentName = appName;

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
  HostAppShoppingService.getInstance().onAddToCart;
// deprecated
// FireworkSDK.getInstance().shopping.productInfoViewConfiguration = {
//   addToCartButton: { backgroundColor: '#c0c0c0' },
// };

// FireworkSDK.getInstance().shopping.onClickCartIcon =
//   HostAppShoppingService.getInstance().onClickCartIcon;

FireworkSDK.getInstance().shopping.onCustomClickCartIcon =
  HostAppShoppingService.getInstance().onCustomClickCartIcon;

FireworkSDK.getInstance().shopping.onUpdateProductDetails =
  HostAppShoppingService.getInstance().onUpdateProductDetails;

FireworkSDK.getInstance().onCustomCTAClick =
  HostAppShoppingService.getInstance().onCustomCTAClick;

FireworkSDK.getInstance().liveStream.onLiveStreamEvent = (event) => {
  console.log('[example] onLiveStreamEvent', event);
};

FireworkSDK.getInstance().liveStream.onLiveStreamChatEvent = (event) => {
  console.log('[example] onLiveStreamChatEvent', event);
};

FireworkSDK.getInstance().shopping.cartIconVisible =
  HostAppShoppingService.getInstance().shouldShowCart();

FireworkSDK.getInstance().shareBaseURL = 'https://fw.tv';

// init FireworkSDK
FireworkSDK.getInstance().init();
