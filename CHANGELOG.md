# CHANGELOG

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
