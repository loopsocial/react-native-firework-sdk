# CHANGELOG

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
