# CHANGELOG

## [2.17.1]

### Added

- Customize additional controls top inset for story block
- Support extending media outside the safe area in the full-screen player
- Add `tryStartFloatingOrCloseFullScreen` method in `FWNavigator` class
- Add additional parameters for `trackPurchase` method in `FireworkSDK` class

## [2.17.0]

### Added

- Show carousel slider below pinned products on livestream
- Support Trivia Giveaway
- Support coupon code message
- Support multiple winners for Giveaway and Trivia Giveaway
- AI Copilot support
- Adapt re-stream

## [2.17.0-beta.2]

- Beta release

## [2.17.0-beta.1]

### Changed

- Upgrade the versions of `react-native` and `react` used for building the library

## [2.16.0]

### Added

- Add `customCTA` property to `ShoppingCTAEvent` interface
- Support French
- Support Portuguese

### Changed

- Handle iOS and Android modern player differences

## [2.15.3]

- Bug fixes and improvements

## [2.15.2]

- Bug fixes and improvements

## [2.15.1]

- Bug fixes and improvements

## [2.15.0]

### Added

- New livestream player design
- Add `livestreamPlayerDesignVersion` property in `FireworkSDK` class

## [2.14.2]

### Changed

- [iOS] Disable bitcode

## [2.14.1]

### Added

- Make the copies for main entries consistent with Android.
- Display forward and backward arrows for the full-screen player.
- Hide or show the chat message when it's deleted or undeleted in business portal
- [Android] Display cta and product cards for short videos on story block

### Changed

- [iOS] Hide the product icon when the product list is empty
- [iOS] Show poll title when the user selects the poll option
- [Android] Show the mini-size icon when the short video/replay pauses
- [Android] Expand chat messages by default

### Fixed

- Keep product impression/click event reporting consistent with Web
- [iOS] Touchscreen is not working when video is playing in PIP mode on iPad
- [Android] Ensure that the PIP video remains unmuted even when another video is opened for playback
- [Android] Ensure that the product is displayed at the top when adding a new product to livestream

## [2.14.0]

### Added

- More language support
- Optimizations for RTL
- Expose more properties for many event callbacks
- Support configuring data tracking level
- [Android] Add the email field to the Question interactions

### Fixed

- [Android] "Host Will be right back" pop up message is missing in viewers mobile when the streamer paused the live stream

## [2.13.0]

### Added

- Support Digital Showroom
- [iOS] Add privacy manifest configuration on the iOS SDK to ensure compliance with Apple privacy guidelines and regulations

### Changed

- Replace livestream id with video id for event callbacks
- Change behaviour of product availability in Livestream Replay. The product availability is based on the last state of the product in the Livestream
- [Android] Upgrade the Android SDK's Kotlin version to 1.8.x

### Fixed

- [Android] Unmuting muted active livestream when user goes from PIP to fullscreen
- [Android] [SingleTask Activity is launched in their own affinities](https://groups.google.com/g/ima-sdk/c/PfAnye3Hhww/m/08N6YyFsBAAJ), which is caused by [the Google IMA SDK v3.32.0](https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/history)

## [2.12.1]

### Fixed

- [iOS] The full-screen player can't be launched on debug mode

## [2.12.0]

### Added

- [iOS] Support customizing feed item shadow
- [iOS] Support disabling tap action on custom logo

## [2.11.3]

### Fixed

- [Android] `stopFloatingPlayer` doesn't work when the video pauses

### Changed

- [Android] Upgrade Firework Android SDK to V6.9.3

## [2.11.2]

### Changed

- [Android] Upgrade Firework Android SDK to V6.9.2

## [2.11.1]

### Added

- Support showing countdown timer for the livestream trailer

## [2.11.0]

### Added

- Support initializing SDK on the native side
- Support getting feed id from VideoFeed and StoryBlock components
- Expose onViewportEntered and onViewportLeft API in StoryBlock component
- Add video model including feed id to some event models
- Support video feed and story block empty callback
- [Android] Support displaying custom logo instead of ellipsis on the player
- [Android] Add `trackPurchase` API

### Changed

- [iOS] Upgrade Firework iOS SDK to V1.18.0
- [Android] Upgrade Firework Android SDK to V6.9.1

## [2.10.1]

### Fixed

- [Android] Some event callbacks don't work

## [2.10.0]

### Changed

- [iOS] Upgrade Firework iOS SDK to V1.16.0

## [2.9.0]

### Added

- [Android] Show "Tap to enter livestream" in the story block collapsed mode
- [Android] Support multiple pinned products
- [Android] Update the UI for replays Product Highlight (key moments)

### Changed

- [Android] Upgrade Firework Android SDK to V6.8.1

## [2.8.6]

### Changed

- [iOS] Avoid unnecessary changes to video feed layout

## [2.8.5]

### Changed

- [iOS] Support dynamically enabling autoplay for `VideoFeed` component

## [2.8.4]

### Changed

- Recreate `StoryBlock` components when `productInfoViewConfiguration` property of `VideoShopping` class is changed

## [2.8.3]

### Fixed

- [Android] Fix the crash issue when feed is destroyed before init

## [2.8.2]

### Changed

- Export `PlayerHandler` interface
- Optimize `bringRNContainerToTop` and `bringRNContainerToBottom` methods

## [2.8.1]

### Changed

- [Android] Fix `openVideoPlayer` crash issue.

## [2.8.0]

### Added

- [iOS] Support showing and hiding product price based on API
- [iOS] Add more configurations for product card, including width and height, background color, price label style, etc.
- [iOS] Support displaying custom logo instead of ellipsis on the player
- [iOS] Support pausing and resuming video when handling product card and CTA button click events

### Deprecated

- [iOS] Deprecate isHidden property of `ProductCardPriceConfiguration` interface

## [2.7.2-beta.1]

### Fixed

- Fix native navigation issue

## [2.7.1]

### Changed

- Center video detail options

## [2.7.0]

### Added

- [iOS] Ability to customize product card by changing the corner radius, hiding price labels, and hiding CTA button.
- [iOS] Support reordering RN Container and Native Container

## [2.6.1]

### Changed

- [iOS] Upgrade Firework iOS SDK to V1.13.0
- [iOS] Dropped support for iOS 12.0 and below

## [2.6.0]

### Added

- [iOS] Add story block configuration
- [iOS] Ability to hide dual title
- [Android] New product card
- [Android] Ability to set a single video/live stream id as the source in story block and video feed

## [2.5.3]

### Fixed

- `changeAppLanguage` API doesn't work when app language layout direction is LTR(such as English) but system language layout direction is RTL(such as Arabic)

## [2.5.2]

### Fixed

- `changeAppLanguage` API affects rendering SVG images on iOS

## [2.5.1]

### Added

- Export `CustomTapProductCardEvent` interface
- Export `VideoPlayerButtonConfiguration` interface
- Export `Buttoninfo` interface

## [2.5.0]

### Added

- [iOS] New product card provided in short video
- [iOS] New content source for single video or live stream for video feed and story block
- [iOS] New product detail page
- [iOS] Ability to define custom navigation handling when user taps on product card
- [iOS] Ability to customize the images of the full screen player buttons namely: video detail button, mute/unmute button, close button, play/pause button

## [2.4.2]

### Fixed

- Fix the RTL issues on the iOS side

## [2.4.1]

### Added

- Support video feed click event callback on iOS when SDK init method is called on native side
- Support RN page overlaying full-screen player

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
