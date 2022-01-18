import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  VideoFeed,
  VideoFeedConfiguration,
  VideoFeedMode,
  VideoPlayerConfiguration,
} from 'react-native-firework-sdk';
import type { RouteProp } from '@react-navigation/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from './paramList/RootStackParamList';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VideoFeedForm from '../components/VideoFeedForm';
import FeedConfigurationModal from '../components/FeedConfigurationModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlayerConfigurationModal from '../components/PlayerConfigurationModal';

type FeedScreenRouteProp = RouteProp<RootStackParamList, 'Feed'>;
type FeedScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Feed'
>;

const Feed = () => {
  const route = useRoute<FeedScreenRouteProp>();
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const source = route.params?.source || 'discover';
  const channel = route.params?.channel;
  const playlist = route.params?.playlist;
  const feedRef = useRef<VideoFeed>(null);
  const [feedConfiguration, setFeedConfiguration] = useState<
    VideoFeedConfiguration | undefined
  >({ title: { hidden: false }, titlePosition: 'nested', });
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >({
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
  });
  const [mode, setMode] = useState<VideoFeedMode>('row');
  const [showFeedConfiguration, setShowFeedConfiguration] =
    useState<boolean>(false);
  const [showPlayerConfiguration, setShowPlayerConfiguration] =
    useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: ` ${
        source.length > 0
          ? source.charAt(0).toUpperCase() + source.slice(1)
          : ''
      } Feed`,
      headerRight: ({ tintColor }) => (
        <TouchableOpacity
          onPress={() => {
            feedRef.current?.refresh();
          }}
        >
          <Ionicons name="refresh-sharp" size={24} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.videoFormWrapper}>
        <VideoFeedForm
          mode={mode}
          onChangeMode={(mode) => {
            setMode(mode);
          }}
          onGoToFeedConfiguration={() => {
            setShowFeedConfiguration(true);
          }}
          onGoToPlayerConfiguration={() => {
            setShowPlayerConfiguration(true);
          }}
        />
      </View>
      <VideoFeed
        style={mode === 'row' ? { height: 200 } : { flex: 1 }}
        source={source}
        channel={channel}
        playlist={playlist}
        mode={mode}
        videoFeedConfiguration={feedConfiguration}
        videoPlayerConfiguration={playerConfiguration}
        onVideoFeedLoadFinished={(error) => {
          console.log('[example] onVideoFeedLoadFinished error', error);
        }}
        ref={feedRef}
      />
      <FeedConfigurationModal
        visible={showFeedConfiguration}
        feedConfiguration={feedConfiguration}
        onRequestClose={() => {
          setShowFeedConfiguration(false);
        }}
        onSubmit={(feedConfiguration) => {
          setFeedConfiguration(feedConfiguration);
          setTimeout(() => {
            setShowFeedConfiguration(false);
          }, 0);
        }}
      />
      <PlayerConfigurationModal
        playerConfiguration={playerConfiguration}
        visible={showPlayerConfiguration}
        onRequestClose={() => {
          setShowPlayerConfiguration(false);
        }}
        onSubmit={(playerConfiguration) => {
          setPlayerConfiguration(playerConfiguration);
          setTimeout(() => {
            setShowPlayerConfiguration(false);
          }, 0);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  videoFormWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default Feed;
