import { AppRegistry } from 'react-native';
import FireworkSDK from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { name as appName } from './app.json';
import App from './src/App';
import HostAppShoppingService from './src/utils/HostAppShoppingService';

Ionicons.loadFont();
FontAwesome.loadFont();
MaterialIcons.loadFont();

AppRegistry.registerComponent(appName, () => App);

FireworkSDK.getInstance().appComponentName = appName;

FireworkSDK.getInstance().onSDKInit = (event) => {
  console.log('[example] onSDKInit', event);
};

// FireworkSDK.getInstance().onVideoPlayback = (event) => {
//   console.log('[example] onVideoPlayback', event);
// };

FireworkSDK.getInstance().onVideoFeedClick = (event) => {
  console.log('[example] onVideoFeedClick', event);
};

FireworkSDK.getInstance().shopping.onAddToCart =
  HostAppShoppingService.getInstance().onAddToCart;

FireworkSDK.getInstance().shopping.onClickCartIcon =
  HostAppShoppingService.getInstance().onClickCartIcon;

// FireworkSDK.getInstance().shopping.onCustomClickCartIcon =
//   HostAppShoppingService.getInstance().onCustomClickCartIcon;

FireworkSDK.getInstance().shopping.onUpdateProductDetails =
  HostAppShoppingService.getInstance().onUpdateProductDetails;

FireworkSDK.getInstance().shopping.onWillDisplayProduct =
  HostAppShoppingService.getInstance().onWillDisplayProduct;

// FireworkSDK.getInstance().onCustomCTAClick = (event) => {

// };

FireworkSDK.getInstance().liveStream.onLiveStreamEvent = (event) => {
  console.log('[example] onLiveStreamEvent', event);
};

FireworkSDK.getInstance().liveStream.onLiveStreamChatEvent = (event) => {
  console.log('[example] onLiveStreamChatEvent', event);
};

// init FireworkSDK
FireworkSDK.getInstance().init();
