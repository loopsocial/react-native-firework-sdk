import { StyleSheet, View } from 'react-native';
import type { VideoFeedConfiguration } from 'react-native-firework-sdk';
import { VideoFeed, type VideoFeedPadding } from 'react-native-firework-sdk';

const CircleThumbnails = () => {
  const feedHeight = 250;
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
  const thumbnailHeight = feedHeight - paddingTop - paddingBottom;

  const videoFeedConfiguration: VideoFeedConfiguration = {
    aspectRatio: aspectRatio,
    contentPadding: contentPadding,
    cornerRadius: thumbnailHeight / 2,
    title: { hidden: true },
  };
  return (
    <View style={styles.container}>
      <VideoFeed
        style={{ height: feedHeight, backgroundColor: '#ff0000' }}
        source="playlist"
        channel="m08mZk9"
        playlist="oPNeKr"
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
    backgroundColor: '#e8f5e9',
  },
});

export default CircleThumbnails;
