# react-native-firework-sdk

Firework React Native SDK

## Installation

```sh
npm install react-native-firework-sdk
# or
yarn add react-native-firework-sdk
```

## Usage

### SDK Initialization
```ts
/*
  Optional: set listener for SDK init
*/
FireworkSDK.getInstance().onSDKInit = (event) => {
  console.log('onSDKInit', event);
};

/* 
  It is recommended to call the init method when the application starts, 
  for example, in the index.tsx.
*/
FireworkSDK.getInstance().init();
```

### Video Feed Integration
```ts
import {
  VideoFeed,
} from 'react-native-firework-sdk';

<VideoFeed 
  style={{ height: 200 }} 
  source="discover" 
/>
```
