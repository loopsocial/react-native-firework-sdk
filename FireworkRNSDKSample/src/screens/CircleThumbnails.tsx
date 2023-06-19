import React from 'react';

import { StyleSheet, View } from 'react-native';
import type { VideoFeedConfiguration } from 'react-native-firework-sdk';
import { VideoFeed, VideoFeedPadding } from 'react-native-firework-sdk';

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
