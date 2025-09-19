import { useEffect, useRef, useState } from 'react';

import {
  Platform,
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
  type IStoryBlockMethods,
  type StoryBlockConfiguration,
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
import StoryBlockConfigurationModal from '../components/StoryBlockConfigurationModal';

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
  };
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
  const defaultStoryBlockConfiguration: StoryBlockConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
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
    },
    shouldExtendMediaOutsideSafeArea: false,
    statusBarHidden: false,
    statusBarStyle: 'light',
  };
  const [storyBlockConfiguration, setStoryBlockConfiguration] = useState<
    StoryBlockConfiguration | undefined
  >(defaultStoryBlockConfiguration);
  const [mode, setMode] = useState<VideoFeedMode>('row');
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
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => {
                storyBlockRef.current?.play();
              }}
              style={styles.headerIconWrapper}
            >
              <Ionicons
                name="play-circle-outline"
                size={24}
                color={tintColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                storyBlockRef.current?.pause();
              }}
              style={styles.headerIconWrapper}
            >
              <Ionicons
                name="pause-circle-outline"
                size={24}
                color={tintColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowStoryBlockConfiguration(true);
              }}
              style={styles.headerIconWrapper}
            >
              <Ionicons name="settings-outline" size={24} color={tintColor} />
            </TouchableOpacity>
          </View>
        ),
    });
  }, [navigation, source, feedComponentType]);

  const renderVideoFeed = () => {
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
        <VideoFeed
          style={{
            height: '100%',
            width:
              Platform.OS === 'android' && mode === 'column' ? 150 : '100%',
            backgroundColor:
              feedConfiguration.titlePosition === 'stacked'
                ? '#A9A9A9'
                : undefined,
          }}
          source={source}
          channel={channel}
          playlist={playlist}
          playlistGroup={playlistGroup}
          dynamicContentParameters={dynamicContentParameters}
          hashtagFilterExpression={hashtagFilterExpression}
          productIds={productIds}
          contentId={contentId}
          mode={mode}
          videoFeedConfiguration={{
            ...feedConfiguration,
            aspectRatio: mode === 'column' ? 1 : undefined,
            titlePadding:
              feedConfiguration.titlePosition === 'stacked'
                ? { top: 8, right: 8, bottom: 0, left: 8 }
                : undefined,
            itemSpacing: 10,
          }}
          videoPlayerConfiguration={playerConfiguration}
          adConfiguration={feedAdConfiguration}
          enablePictureInPicture={enablePictureInPicture}
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
  headerRight: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerIconWrapper: { marginLeft: 10 },
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
  storyBlockWrapper: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  storyBlockActionButton: {
    width: 100,
  },
  storyBlock: { flex: 1, width: '80%' },
});

export default Feed;
