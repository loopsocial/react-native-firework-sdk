import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import {
  FWError,
  VideoFeed,
  VideoFeedConfiguration,
  VideoFeedMode,
  VideoPlayerConfiguration,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FeedConfigurationModal from '../components/FeedConfigurationModal';
import PlayerConfigurationModal from '../components/PlayerConfigurationModal';
import VideoFeedForm from '../components/VideoFeedForm';
import type { RootStackParamList } from './paramList/RootStackParamList';

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
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);

  const defaultFeedConfiguration: VideoFeedConfiguration = {
    title: { hidden: false },
    titlePosition: 'nested',
  };
  const [feedConfiguration, setFeedConfiguration] = useState<
    VideoFeedConfiguration | undefined
  >(defaultFeedConfiguration);

  const defaultPlayerConfiguration: VideoPlayerConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
  };
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
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
      <View style={mode === 'row' ? { height: 200 } : { flex: 1 }}>
        <VideoFeed
          style={{ height: '100%', width: '100%' }}
          source={source}
          channel={channel}
          playlist={playlist}
          mode={mode}
          videoFeedConfiguration={feedConfiguration}
          videoPlayerConfiguration={playerConfiguration}
          onVideoFeedLoadFinished={(error?: FWError) => {
            console.log('[example] onVideoFeedLoadFinished error', error);
            setFeedError(error);
          }}
          ref={feedRef}
        />
        {feedError && (
          <View style={styles.errorView}>
            <Button
              title="Refresh"
              onPress={() => {
                setFeedError(undefined);
                feedRef.current?.refresh();
              }}
            />
            <Text style={styles.errorText}>
              {feedError.reason ?? 'Fail to load video feed'}
            </Text>
          </View>
        )}
      </View>
      <FeedConfigurationModal
        visible={showFeedConfiguration}
        feedConfiguration={feedConfiguration}
        defaultFeedConfiguration={defaultFeedConfiguration}
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
        visible={showPlayerConfiguration}
        playerConfiguration={playerConfiguration}
        defaultPlayerConfiguration={defaultPlayerConfiguration}
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
  videoFeed: {
    height: '100%',
  },
  errorView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    padding: 20,
    marginTop: 10,
    fontSize: 14,
    color: 'red',
  },
});

export default Feed;
