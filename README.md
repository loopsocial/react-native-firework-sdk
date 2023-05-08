# Firework React Native SDK

The integration guide is https://docs.firework.tv/react-native-sdk/integration-guide-v2

## How to run example app

### Set up Firework app Id

 1. Get the Firework app ID from our business team.
 2. In `./FireworkRNSDKSample/ios/FireworkSdkExample/info.plist`, set the value of `FireworkVideoAppID` key to the Firework app ID.
 3. In `./FireworkRNSDKSample/android/app/build.gradle`, set the value of `fw_appid_production` to the Firework app ID.

### Install dependencies

 1. `cd FireworkRNSDKSample`
 2. `npm install`
 3. `npm run ios_pod_install`

### Set Up Default Shopping Playlist(optional)
 1. Get the channel id and playlist id for the shopping playlist.
 2. In `./FireworkRNSDKSample/src/config/Feed.json`, use the channel id and playlist id to update the value of `defaultShoppingPlaylist`

### Run IOS Exmaple App
 
`npm run ios`

### Run Android exmaple app
 
`npm run android`
