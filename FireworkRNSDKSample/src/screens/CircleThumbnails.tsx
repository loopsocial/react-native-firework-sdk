import { Platform, StyleSheet, View } from 'react-native';
import type { VideoFeedConfiguration } from 'react-native-firework-sdk';
import { VideoFeed, type VideoFeedPadding } from 'react-native-firework-sdk';

const CircleThumbnails = () => {
  const feedHeight = 200;
  const paddingTop = 10;
  const paddingRight = 10;
  const paddingBottom = 10;
  const paddingLeft = 10;

  const contentPadding: VideoFeedPadding = {
    top: paddingTop,
    right: paddingRight,
    bottom: paddingBottom,
    left: paddingLeft,
  };
  const aspectRatio = 1.0;
  let thumbnailHeight = feedHeight - paddingTop - paddingBottom;
  if (Platform.OS === 'android') {
    // We don't support content padding on Android now.
    // Hence, we use the feed height as the thumbnail height on Android.
    thumbnailHeight = feedHeight;
  }

  const videoFeedConfiguration: VideoFeedConfiguration = {
    aspectRatio: aspectRatio,
    contentPadding: Platform.OS === 'android' ? undefined : contentPadding, // We don't support content padding on Android now.
    cornerRadius: thumbnailHeight / 2,
    title: { hidden: true },
  };
  return (
    <View style={styles.container}>
      <VideoFeed
        style={{ height: feedHeight }}
        source="discover"
        mode="row"
        videoFeedConfiguration={videoFeedConfiguration}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
});

export default CircleThumbnails;
