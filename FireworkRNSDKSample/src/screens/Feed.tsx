import { useEffect, useRef, useState } from 'react';

import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import {
  type FWError,
  StoryBlock,
  type StoryBlockSource,
  VideoFeed,
  type AdConfiguration,
  type VideoFeedConfiguration,
  type VideoFeedMode,
  type VideoPlayerConfiguration,
  type VideoPlaybackDetails,
  type IStoryBlockMethods,
  type StoryBlockConfiguration,
  PipPlacement,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import FeedConfigurationModal from '../components/FeedConfigurationModal';
import PlayerConfigurationModal from '../components/PlayerConfigurationModal';
import VideoFeedForm, {
  type AutosizingContainer,
} from '../components/VideoFeedForm';
import type { RootStackParamList } from './paramList/RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  updateEnablePictureInPicture,
  updateEnableSystemPictureInPicture,
} from '../slice/feedSlice';
import StoryBlockConfigurationModal from '../components/StoryBlockConfigurationModal';

type FeedScreenRouteProp = RouteProp<RootStackParamList, 'Feed'>;
type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>;

type FeedComponentType = 'VideoFeed' | 'StoryBlock';
const feedComponentTypeList = ['VideoFeed', 'StoryBlock'];

/**
 * Filler content placed above and below the autosizing feed, so the feed can be
 * scrolled in and out of the screen to check that autoplay follows the screen
 * viewport instead of the feed's own bounds.
 */
const PlaceholderBlock = ({ label }: { label: string }) => (
  <View style={styles.placeholderBlock}>
    <Text style={styles.placeholderText}>{label}</Text>
  </View>
);

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
  const hashtagFilterExpression = route.params?.hashtagFilterExpression;
  const productIds = route.params?.productIds;
  const contentId = route.params?.contentId;

  const feedRef = useRef<VideoFeed>(null);
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);
  const storyBlockRef = useRef<IStoryBlockMethods>(null);
  const defaultFeedConfiguration: VideoFeedConfiguration = {
    title: { hidden: false, fontSize: 14 },
    titlePosition: 'nested',
    showAdBadge: true,
    itemSpacing: 10,
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
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );
  const dispatch = useAppDispatch();

  const [feedAdConfiguration, setFeedAdConfiguration] =
    useState<AdConfiguration>(defaultFeedAdConfiguration);

  const defaultPlayerConfiguration: VideoPlayerConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    feedCompleteAction: 'dismiss',
    showShareButton: true,
    showMuteButton: true,
    showPlaybackButton: true,
    ctaButtonStyle: {
      fontSize: 14,
      iOSFontInfo: { systemFontWeight: 'bold' },
      shape: 'roundRectangle',
    },
    ctaDelay: {
      type: 'constant',
      value: 3,
    },
    ctaHighlightDelay: {
      type: 'constant',
      value: 2,
    },
    ctaWidth: 'fullWidth',
    showVideoDetailTitle: true,
    videoPlayerLogoConfiguration: {
      option: 'disabled',
      isClickable: true,
    },
    countdownTimerConfiguration: {
      isHidden: false,
      appearance: 'dark',
    },
    shouldExtendMediaOutsideSafeArea: false,
    statusBarHidden: false,
    statusBarStyle: 'light',
    pipPlacement: PipPlacement.BottomRight,
    scrollDirection: 'horizontal',
    isArrowButtonVisible: true,
    showMoreButton: true,
  };
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
  const defaultStoryBlockConfiguration: StoryBlockConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    feedCompleteAction: 'loop',
    showShareButton: true,
    showPlaybackButton: true,
    showMuteButton: true,
    ctaDelay: {
      type: 'constant',
      value: 3,
    },
    ctaHighlightDelay: {
      type: 'constant',
      value: 2,
    },
    showVideoDetailTitle: true,
    ctaWidth: 'fullWidth',
    videoPlayerLogoConfiguration: {
      option: 'disabled',
      isClickable: true,
    },
    countdownTimerConfiguration: {
      isHidden: false,
      appearance: 'dark',
    },
    additionalControlsInset: {
      top: 0,
      bottom: 0,
    },
    shouldExtendMediaOutsideSafeArea: false,
    statusBarHidden: false,
    statusBarStyle: 'light',
    pipPlacement: PipPlacement.BottomRight,
    scrollDirection: 'horizontal',
    isArrowButtonVisible: true,
    isFullscreenArrowButtonVisible: true,
    showMoreButton: true,
  };
  const [storyBlockConfiguration, setStoryBlockConfiguration] = useState<
    StoryBlockConfiguration | undefined
  >(defaultStoryBlockConfiguration);
  const [mode, setMode] = useState<VideoFeedMode>('row');
  // Autosizing example: the feed sizes itself to its content and is hosted in a
  // scroll container. Use grid mode + maxVideos 6 to reproduce the customer
  // set-up; maxVideos 50 checks the 20-video clamp of an autosized grid.
  const [autosizing, setAutosizing] = useState<boolean>(false);
  const [autosizingContainer, setAutosizingContainer] =
    useState<AutosizingContainer>('ScrollView');
  const [maxVideos, setMaxVideos] = useState<number | undefined>(undefined);
  const [showFeedConfiguration, setShowFeedConfiguration] =
    useState<boolean>(false);
  const [showPlayerConfiguration, setShowPlayerConfiguration] =
    useState<boolean>(false);
  const [showStoryBlockConfiguration, setShowStoryBlockConfiguration] =
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
        ) : (
          <TouchableOpacity
            onPress={() => {
              setShowStoryBlockConfiguration(true);
            }}
          >
            <Ionicons name="settings-outline" size={24} color={tintColor} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, source, feedComponentType]);

  // Mirrors the SDK contract: Android autosizes a grid feed only. Switching mode away from
  // grid there falls back to the fixed-height layout instead of leaving the feed in a scroll
  // container it cannot size itself in.
  const autosizingActive =
    autosizing && (Platform.OS !== 'android' || mode === 'grid');

  const renderVideoFeedElement = (autosizingEnabled: boolean) => {
    return (
      <VideoFeed
        style={
          autosizingEnabled
            ? {
                // No height: the feed reports its own height while autosizing.
                width: '100%',
                backgroundColor:
                  feedConfiguration.titlePosition === 'stacked'
                    ? '#A9A9A9'
                    : undefined,
              }
            : {
                height: '100%',
                width:
                  Platform.OS === 'android' && mode === 'column' ? 150 : '100%',
                backgroundColor:
                  feedConfiguration.titlePosition === 'stacked'
                    ? '#A9A9A9'
                    : undefined,
              }
        }
        source={source}
        channel={channel}
        playlist={playlist}
        playlistGroup={playlistGroup}
        dynamicContentParameters={dynamicContentParameters}
        hashtagFilterExpression={hashtagFilterExpression}
        productIds={productIds}
        contentId={contentId}
        mode={mode}
        autosizing={autosizingEnabled}
        maxVideos={maxVideos}
        videoFeedConfiguration={{
          ...feedConfiguration,
          aspectRatio: mode === 'column' ? 1 : undefined,
          titlePadding:
            feedConfiguration.titlePosition === 'stacked'
              ? { top: 8, right: 8, bottom: 0, left: 8 }
              : undefined,
        }}
        videoPlayerConfiguration={playerConfiguration}
        adConfiguration={feedAdConfiguration}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
        onVideoFeedLoadFinished={(error?: FWError) => {
          console.log('[example] onVideoFeedLoadFinished error', error);
          setFeedError(error);
        }}
        onVideoFeedEmpty={(error?: FWError) => {
          console.log('[example] onVideoFeedEmpty error', error);
        }}
        onVideoFeedDidStartPictureInPicture={(error?: FWError) => {
          console.log(
            '[example] onVideoFeedDidStartPictureInPicture error',
            error
          );
        }}
        onVideoFeedDidStopPictureInPicture={(error?: FWError) => {
          console.log(
            '[example] onVideoFeedDidStopPictureInPicture error',
            error
          );
        }}
        onVideoFeedGetFeedId={(feedId: string) => {
          console.log('[example] onVideoFeedGetFeedId feedId', feedId);
        }}
        onVideoFeedVideosLoaded={(videos: VideoPlaybackDetails[]) => {
          console.log(
            `[example] onVideoFeedVideosLoaded ${videos.length} videos`,
            videos.map((video) => ({
              videoId: video.videoId,
              hashtags: video.hashtags,
            }))
          );
        }}
        ref={feedRef}
      />
    );
  };

  const renderFeedError = () => {
    if (!feedError) {
      return null;
    }
    return (
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
    );
  };

  const renderAutosizingVideoFeed = () => {
    const children = [
      <PlaceholderBlock key="above-1" label="Placeholder above 1" />,
      <PlaceholderBlock key="above-2" label="Placeholder above 2" />,
      <View key="feed">
        {renderVideoFeedElement(true)}
        {renderFeedError()}
      </View>,
      <PlaceholderBlock key="below-1" label="Placeholder below 1" />,
      <PlaceholderBlock key="below-2" label="Placeholder below 2" />,
      <PlaceholderBlock key="below-3" label="Placeholder below 3" />,
    ];
    if (autosizingContainer === 'FlatList') {
      return (
        <FlatList
          style={styles.autosizingContainer}
          data={children}
          keyExtractor={(_, index) => `autosizing_item_${index}`}
          renderItem={({ item }) => item}
        />
      );
    }
    return (
      <ScrollView style={styles.autosizingContainer}>{children}</ScrollView>
    );
  };

  const renderVideoFeed = () => {
    if (autosizingActive) {
      return renderAutosizingVideoFeed();
    }
    return (
      <View
        style={
          mode === 'row'
            ? {
                height: 220,
                paddingHorizontal: Platform.OS === 'android' ? 10 : 0,
              }
            : {
                flex: 1,
                alignItems: 'center',
              }
        }
      >
        {renderVideoFeedElement(false)}
        {renderFeedError()}
      </View>
    );
  };

  const renderStoryBlock = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          marginBottom: 20,
        }}
        edges={['bottom']}
      >
        <View style={styles.storyBlockWrapper}>
          <StoryBlock
            ref={storyBlockRef}
            style={styles.storyBlock}
            source={source as StoryBlockSource}
            channel={channel}
            playlist={playlist}
            dynamicContentParameters={dynamicContentParameters}
            hashtagFilterExpression={hashtagFilterExpression}
            productIds={productIds}
            contentId={contentId}
            enablePictureInPicture
            enableSystemPictureInPicture={enableSystemPictureInPicture}
            cornerRadius={30}
            adConfiguration={{ requiresAds: false, adsFetchTimeout: 10 }}
            storyBlockConfiguration={storyBlockConfiguration}
            onStoryBlockLoadFinished={(error?: FWError) => {
              console.log('[example] onStoryBlockLoadFinished error', error);
              setFeedError(error);
            }}
            onStoryBlockEmpty={(error?: FWError) => {
              console.log('[example] onStoryBlockEmpty error', error);
            }}
            onStoryBlockDidStartPictureInPicture={(error?: FWError) => {
              console.log(
                '[example] onStoryBlockDidStartPictureInPicture error',
                error
              );
            }}
            onStoryBlockDidStopPictureInPicture={(error?: FWError) => {
              console.log(
                '[example] onStoryBlockDidStopPictureInPicture error',
                error
              );
            }}
            onStoryBlockGetFeedId={(feedId: string) => {
              console.log('[example] onStoryBlockGetFeedId feedId', feedId);
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
        </View>
      </SafeAreaView>
    );
  };

  const renderFeedComponent = () => {
    if (feedComponentType === 'VideoFeed') {
      return renderVideoFeed();
    }
    return renderStoryBlock();
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
            autosizing={autosizing}
            autosizingContainer={autosizingContainer}
            maxVideos={maxVideos}
            onChangeMode={(newMode) => {
              setMode(newMode);
            }}
            onChangeAutosizing={(newAutosizing) => {
              setAutosizing(newAutosizing);
            }}
            onChangeAutosizingContainer={(newContainer) => {
              setAutosizingContainer(newContainer);
            }}
            onChangeMaxVideos={(newMaxVideos) => {
              setMaxVideos(newMaxVideos);
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
      {feedComponentType === 'StoryBlock' && (
        <View style={styles.storyBlockControlsWrapper}>
          <TouchableOpacity
            onPress={() => {
              storyBlockRef.current?.play();
            }}
            style={styles.storyBlockControlButton}
          >
            <Ionicons name="play-circle-outline" size={28} color="#000" />
            <Text style={styles.storyBlockControlLabel}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              storyBlockRef.current?.pause();
            }}
            style={styles.storyBlockControlButton}
          >
            <Ionicons name="pause-circle-outline" size={28} color="#000" />
            <Text style={styles.storyBlockControlLabel}>Pause</Text>
          </TouchableOpacity>
        </View>
      )}
      {renderFeedComponent()}
      <FeedConfigurationModal
        visible={showFeedConfiguration}
        feedConfiguration={feedConfiguration}
        defaultFeedConfiguration={defaultFeedConfiguration}
        feedAdConfiguration={feedAdConfiguration}
        defaultFeedAdConfiguration={defaultFeedAdConfiguration}
        enablePiP={enablePictureInPicture}
        defaultEnablePiP={true}
        enableSystemPiP={enableSystemPictureInPicture}
        defaultEnableSystemPiP={true}
        onRequestClose={() => {
          setShowFeedConfiguration(false);
        }}
        onSubmit={(
          newFeedConfiguration,
          newFeedAdConfiguration,
          enablePiP,
          enableSystemPiP
        ) => {
          setFeedConfiguration(newFeedConfiguration);
          setFeedAdConfiguration(newFeedAdConfiguration);
          dispatch(updateEnablePictureInPicture(enablePiP));
          dispatch(updateEnableSystemPictureInPicture(enableSystemPiP));
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
      <StoryBlockConfigurationModal
        visible={showStoryBlockConfiguration}
        storyBlockConfiguration={storyBlockConfiguration}
        defaultStoryBlockConfiguration={defaultStoryBlockConfiguration}
        onRequestClose={() => {
          setShowStoryBlockConfiguration(false);
        }}
        onSubmit={(newStoryBlockConfiguration) => {
          setStoryBlockConfiguration(newStoryBlockConfiguration);
          setTimeout(() => {
            setShowStoryBlockConfiguration(false);
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
  storyBlockControlsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  storyBlockControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  storyBlockControlLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
  },
  videoFeed: {
    height: '100%',
  },
  autosizingContainer: {
    flex: 1,
  },
  placeholderBlock: {
    height: 240,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#555555',
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
  storyBlockWrapper: {
    width: '100%',
    marginBottom: Platform.OS === 'android' ? 70 : 0,
    alignItems: 'center',
    flex: 1,
  },
  storyBlockActionButton: {
    width: 100,
  },
  storyBlock: { flex: 1, width: '80%' },
});

export default Feed;
