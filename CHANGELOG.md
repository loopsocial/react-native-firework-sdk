# CHANGELOG

## [1.8.0]

### Added

- Add the ability to programmatically start or stop the floating player(only supported on iOS)
- Updates Firework Branding on the iOS Side
- Improves player accessibility on the iOS side
- Support configuring feed title iOS font name(only supported on iOS)
- Support configuring CTA button font name(only supported on iOS)
- Support configuring the "Add to cart" button font name(only supported on iOS)
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
