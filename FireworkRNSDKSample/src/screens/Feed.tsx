import React, { useEffect, useRef, useState } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import {
  FWError,
  StoryBlock,
  StoryBlockSource,
  VideoFeed,
  AdConfiguration,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { updateEnablePictureInPicture } from '../slice/feedSlice';

type FeedScreenRouteProp = RouteProp<RootStackParamList, 'Feed'>;
type FeedScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Feed'
>;

type FeedComponentType = 'VideoFeed' | 'StoryBlock';
const feedComponentTypeList = ['VideoFeed', 'StoryBlock'];

const Feed = () => {
  const route = useRoute<FeedScreenRouteProp>();
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const [feedComponentType, setFeedComponentType] =
    useState<FeedComponentType>('VideoFeed');
  const source = route.params?.source || 'discover';
  const channel = route.params?.channel;
  const playlist = route.params?.playlist;
  const playlistGroup = route.params?.playlistGroup;
  const dynamicContentParameters = route.params?.dynamicContentParameters;

  const feedRef = useRef<VideoFeed>(null);
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);

  const defaultFeedConfiguration: VideoFeedConfiguration = {
    title: { hidden: false, fontSize: 14 },
    titlePosition: 'nested',
    showAdBadge: true,
  };
  const [feedConfiguration, setFeedConfiguration] =
    useState<VideoFeedConfiguration>(defaultFeedConfiguration);
  const defaultFeedAdConfiguration: AdConfiguration = {
    requiresAds: false,
    adsFetchTimeout: 20,
  };

  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const dispatch = useAppDispatch();

  const [feedAdConfiguration, setFeedAdConfiguration] =
    useState<AdConfiguration>(defaultFeedAdConfiguration);

  const defaultPlayerConfiguration: VideoPlayerConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
    showMuteButton: true,
    showPlaybackButton: true,
    ctaButtonStyle: {
      fontSize: 14,
      iOSFontInfo: { systemFontWeight: 'bold' },
    },
    ctaDelay: {
      type: 'constant',
      value: 3,
    },
    ctaHighlightDelay: {
      type: 'constant',
      value: 2,
    },
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
      headerRight: ({ tintColor }) =>
        feedComponentType === 'VideoFeed' ? (
          <TouchableOpacity
            onPress={() => {
              feedRef.current?.refresh();
            }}
          >
            <Ionicons name="refresh-sharp" size={24} color={tintColor} />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, source, feedComponentType]);

  const renderVideoFeed = () => {
    return (
      <View
        style={
          mode === 'row' ? { height: 220 } : { flex: 1, alignItems: 'center' }
        }
      >
        <VideoFeed
          style={{
            height: '100%',
            width:
              Platform.OS === 'android' && mode === 'column' ? 150 : '100%',
          }}
          source={source}
          channel={channel}
          playlist={playlist}
          playlistGroup={playlistGroup}
          dynamicContentParameters={dynamicContentParameters}
          mode={mode}
          videoFeedConfiguration={{
            ...feedConfiguration,
            aspectRatio: mode === 'column' ? 1 : undefined,
          }}
          videoPlayerConfiguration={playerConfiguration}
          adConfiguration={feedAdConfiguration}
          enablePictureInPicture={enablePictureInPicture}
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
    );
  };

  const renderStoryBlock = () => {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
        <StoryBlock
          style={{ flex: 1, width: '80%', borderRadius: 30 }}
          source={source as StoryBlockSource}
          channel={channel}
          playlist={playlist}
          dynamicContentParameters={dynamicContentParameters}
          enablePictureInPicture
          onStoryBlockLoadFinished={(error?: FWError) => {
            console.log('[example] onStoryBlockLoadFinished error', error);
            setFeedError(error);
          }}
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
              {feedError.reason ?? 'Fail to load story block'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {source !== 'playlistGroup' && (
        <View style={styles.feedComponentTypeButtonGroupWrapper}>
          <ButtonGroup
            buttons={feedComponentTypeList}
            selectedIndex={feedComponentTypeList.indexOf(feedComponentType)}
            onPress={(value) => {
              setFeedComponentType(
                feedComponentTypeList[value] as FeedComponentType
              );
            }}
          />
        </View>
      )}
      {feedComponentType === 'VideoFeed' && (
        <View style={styles.videoFormWrapper}>
          <VideoFeedForm
            mode={mode}
            onChangeMode={(newMode) => {
              setMode(newMode);
            }}
            onGoToFeedConfiguration={() => {
              setShowFeedConfiguration(true);
            }}
            onGoToPlayerConfiguration={() => {
              setShowPlayerConfiguration(true);
            }}
          />
        </View>
      )}
      {feedComponentType === 'VideoFeed'
        ? renderVideoFeed()
        : renderStoryBlock()}
      <FeedConfigurationModal
        visible={showFeedConfiguration}
        feedConfiguration={feedConfiguration}
        defaultFeedConfiguration={defaultFeedConfiguration}
        feedAdConfiguration={feedAdConfiguration}
        defaultFeedAdConfiguration={defaultFeedAdConfiguration}
        enablePiP={enablePictureInPicture}
        defaultEnablePiP={true}
        onRequestClose={() => {
          setShowFeedConfiguration(false);
        }}
        onSubmit={(newFeedConfiguration, newFeedAdConfiguration, enablePiP) => {
          setFeedConfiguration(newFeedConfiguration);
          setFeedAdConfiguration(newFeedAdConfiguration);
          dispatch(updateEnablePictureInPicture(enablePiP));
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
        onSubmit={(newPlayerConfiguration) => {
          setPlayerConfiguration(newPlayerConfiguration);
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
  feedComponentTypeButtonGroupWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
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
