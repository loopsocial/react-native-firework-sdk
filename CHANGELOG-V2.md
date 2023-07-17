# CHANGELOG

## [2.4.0]

### Added

- Support SKU feed and story block
- Support polls and questions in short videos on the iOS side

### Changed

- Update Firework iOS SDK version to 1.11.0
- Update Firework Android SDK version to 6.3.4

## [2.3.1]

### Changed

- Update `FireworkVideo` library version that is used to build `FireworkVideoUI` library

## [2.3.0]

### Added

- Support 'Select Replay' feature which allows us to choose from which moment users will see the video being played when opening the live stream
- Support configuring the width of the CTA button
- Support configuring the number of feed item title lines on the iOS side
- Support configuring feed item title padding on the iOS side
- Support app-level language setting on the Android side
- Support story block configuration on the Android side
- Support configuring feed item spacing on the Android side
- Support polls and questions in livestream and short videos on the Android side

## Changed

- Change cart icon from default display to default hidden on the iOS side

## [2.2.0]

### Added

- Support hashtag playlist
- Support livestream callbacks on the Android side
- Support playback event on the Android side
- Add `shareBaseURL` property in `VideoPlayerConfiguration` interface

### Breaking Changes

- Remove support for passing `shareBaseURL` in `FireworkSDK` class `init` method. Please use `FireworkSDK.getInstance().shareBaseURL` instead.
- Remove `getShareBaseURL` method in `FireworkSDK` class. Please use `FireworkSDK.getInstance().shareBaseURL` instead.
- Remove `getAdBadgeConfiguration` method in `FireworkSDK` class. Please use `FireworkSDK.getInstance().adBadgeConfiguration` instead.
- Remove `addToCartButton` property in `ProductInfoViewConfiguration` interface
- Remove `AddToCartButtonConfiguration` interface

## [2.1.0]

### Added

- Support app-level language setting on the iOS side
- Add `onShoppingCTA` callback in `VideoShopping` class
- Support customizing shopping CTA button text to "Add to cart" or "Shop now"
- Add `onCustomClickLinkButton` callback in `VideoShopping` class
- Add `StoryBlock` component on the Android side
- Support play and pause function on the `StoryBlock` component

### Breaking Changes

- Remove `AddToCartCallback` type
- Remove `AddToCartResult` interface
- Remove `AddToCartEvent` interface

## [2.0.0]

### Added

- Add `getShareBaseURL` method in `FireworkSDK` class
- Add `getAdBadgeConfiguration` method in `FireworkSDK` class(Only supported on iOS)
- Add `setAdBadgeConfiguration` method in `FireworkSDK` class(Only supported on iOS)
- Add `getVideoLaunchBehavior` method in `FireworkSDK` class
- Add the ability to programmatically start or stop the floating player on the Android side
- Support passing `shareBaseURL` and `videoLaunchBehavior` in `FireworkSDK` class `init` method
- Support configuring feed title Android font info(only supported on Android)

### Changed

- Upgrade Firework Android SDK from V5 to V6

### Breaking Changes

- Remove support for story block on the Android side
- Remove support for playlist group video feed source on the Android side
- Remove support for app-level language setting
- Change the parameter and return value in `FireworkSDK` class `init` method
- Remove support for custom layout name on the Android side
- Remove `customCTALinkContentPageRouteName` property in `FireworkSDK` class
- Remove set and get accessors of `shareBaseURL` property in `FireworkSDK` class
- Remove set and get accessors of `adBadgeConfiguration` property in `FireworkSDK` class
- Remove `appComponentName` property in `FireworkSDK` class
- Remove `pushNativeContainer` method in `FWNavigator` class
- Remove `canPopNativeContainer` method in `FWNavigator` class
- Remove support for `onLiveStreamEvent` callback in `FWNavigator` class on the Android side
- Remove support for `onLiveStreamChatEvent` callback in `FWNavigator` class on the Android side
- Remove support for `onVideoFeedLoadFinished` callback in `VideoFeed` component on the Android side
- Remove `enablePictureInPicture` property in `VideoFeedConfiguration` interface
- Remove `launchBehavior` property in `VideoPlayerConfiguration` interface
- Remove `onClickCartIcon` callback in `VideoShopping` class
- Remove `onWillDisplayProduct` callback in `VideoShopping` class
- Remove `FWNativeContainerProps` type
- Remove `ClickCartIconCallback` type
- Remove `WillDisplayProductCallback` type
- Remove `WillDisplayProductEvent` interface
- Remove `NewNativeContainerProps` type

## [1.8.0]

### Added

- Add the ability to programmatically start or stop the floating player(only supported on iOS)
- Updates Firework Branding on the iOS Side
- Improves player accessibility on the iOS side
- Support configuring feed title iOS font name(only supported on iOS)
- Support configuring CTA button iOS font name(only supported on iOS)
- Support configuring the "Add to cart" button iOS font name(only supported on iOS)
- Add set and get accessors of `productInfoViewConfiguration` in `VideoShopping` class(only supported on iOS)
- Support hiding link next to "Add to Cart" button(only supported on iOS)
- Support customizing the click event processing logic of the link button next to the "Add to cart" button(only supported on Android)

## [1.7.0]

### Added

- Support the configuration of CTA delay time(only supported on iOS)
- Support the configuration of CTA highlight delay time(only supported on iOS)
- Support app-level language setting(only supported on Android)

## [1.6.0]

### Added

- Support Picture in Picture for story block(only supported on iOS)
- Support floating player(only supported on iOS)
- Support sharing and opening universal links(only supported on iOS)

## [1.5.5]

### Fixed

- The product image isn't updated when changing product variant on the Android side
- The currency isn't displayed correctly on the Android side when the device language is Arabic

## [1.5.4]

### Fixed

- The audio still exists when closing player on the iOS side
- The videos alignment is incorrect on the Android side when the device language is Arabic

## [1.5.3]

### Fixed

- Unexpected Space between the section title and video feed under certain conditions on the iOS side

## [1.5.2]

### Fixed

- Clicking the cart icon doesn't close the player when enabling the custom click cart icon callback on the iOS side

## [1.5.1]

### Fixed

- The users are navigated to the trailer video when opening the share link of the active live stream on the Android side.

## [1.5.0]

### Added

- Multiple product pinning(only supported on iOS)
- Picture In Picture functionality(only supported on iOS)
- Purchase sale tracking API(only supported on iOS)
- Custom VAST attributes support(only supported on iOS)
- In feed ad support(only supported on iOS)

## [1.4.3]

### Removed

- Remove `jcenter()`

## [1.4.1]

### Changed

- Change the `onAddToCart` callback timeout to 10s on the Android side to keep the parity with iOS side

### Fixed

- The cart icon is missing on the iOS side when `cartIconVisible` is `true`

## [1.4.0]

### Added

- Support for story block

### Fixed

- Hydration API doesn't work in the release package when setting `minifyEnabled` to `true`

## [1.3.0]

### Added

- Support for RTL and Arabic translations
- Support for autoplay video in thumbnails
- Add `imageUrl` and `options` to `ProductUnit` interface
- Add `gridColumns` to `VideoFeedConfiguration` interface

## [1.2.8]

### Added

- Add `onCustomClickCartIcon` callback in `VideoShopping` class

## [1.2.7]

### Added

- Add `showBranding` property in `VideoPlayerConfiguration` interface

## [1.2.6]

### Added

- Add new properties in `VideoFeedConfiguration` interface

## [1.2.5]

### Changed

- Fix the issue that JSON serialization is unsuccessful in certain conditions on the Android platform

## [1.2.3]

### Changed

- Fix the issue that the video sound does not stop when the video player is closed in certain scenarios
- Fix the issue that the video sound does not stop when the new native container is displayed in certain scenarios

## [1.2.2]

### Added

- Add new properties in `FeedItemDetails` interface

## [1.2.1]

### Added

- Add `canPopNativeContainer` method in `FWNavigator` class

### Changed

- `popNativeContainer` method also can pop the video or live stream player

## [1.2.0]

### Added

- Add a new video feed source: `dynamicContent`
- Support for navigating from native page to RN page

### Breaking Changes

- Remove `AdConfig` interface
- Remove `adConfig` parameter from `init` method of `FireworkSDK` class
- Modify the return type of `onClickCartIcon` callback
- Remove `exitCartPage` method from `VideoShopping` class

## [1.1.0]

### Added

- Support live stream playback
- Support live stream event callbacks
- Add playlist group source for video feed
- Configurable Ad badge
- Configurable playback button on video player
- Configurable mute button on video player

## [1.0.3]

### Added

- Support 0.61.3 version of React Native

## [1.0.0]

### Added

- FireworkSDK RN module, which supports the sdk initialization and global configuration
- Video Feed UI Component
- Video Shopping module
- Ad support
- Event callback notification
