import { useCallback, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  type IStoryBlockMethods,
  StoryBlock,
  VideoFeed,
} from 'react-native-firework-sdk';
import { useAppSelector } from '../hooks/reduxHooks';

const CHANNEL_ID = 'm08mZk9';
const PLAYLIST_ID = 'oPNeKr';

type VideoFeedStackParamList = {
  VideoFeedHome: undefined;
  VideoFeedDetail: undefined;
};

const BottomTab = createBottomTabNavigator();
const VideoFeedStack = createNativeStackNavigator<VideoFeedStackParamList>();

function VideoFeedHome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<VideoFeedStackParamList>>();
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );

  // const [refreshKey, setRefreshKey] = useState(0);
  // useFocusEffect(
  //   useCallback(() => {
  //     setRefreshKey((prev) => prev + 1);
  //     console.log('[VideoFeedHome] focus → refresh VideoFeed');
  //   }, [])
  // );

  return (
    <View style={styles.page}>
      <VideoFeed
        videoFeedConfiguration={{ enableAutoplay: true }}
        style={styles.feed}
        source={'playlist'}
        channel={CHANNEL_ID}
        playlist={PLAYLIST_ID}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
      />
      <Button
        title="Go to Detail Page"
        onPress={() => navigation.push('VideoFeedDetail')}
        containerStyle={styles.detailButton}
      />
    </View>
  );
}

function VideoFeedDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<VideoFeedStackParamList>>();
  return (
    <View style={styles.detailPage}>
      <Text style={styles.detailTitle}>Video Feed Detail Page</Text>
      <Text style={styles.detailDescription}>
        Tap the button below to go back. The VideoFeed will refresh on return.
        {'\n\n'}
        Check: does the StoryBlock on the other tab unexpectedly start
        auto-playing?
      </Text>
      <Button
        title="Go Back & Refresh VideoFeed"
        onPress={() => navigation.goBack()}
        containerStyle={styles.detailButton}
      />
    </View>
  );
}

function VideoFeedTab() {
  return (
    <VideoFeedStack.Navigator screenOptions={{ headerShown: false }}>
      <VideoFeedStack.Screen name="VideoFeedHome" component={VideoFeedHome} />
      <VideoFeedStack.Screen
        name="VideoFeedDetail"
        component={VideoFeedDetailScreen}
        options={{ title: 'Detail' }}
      />
    </VideoFeedStack.Navigator>
  );
}

function StoryBlockTab() {
  const storyBlockRef = useRef<IStoryBlockMethods>(null);
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );

  // Resume/pause StoryBlock playback based on tab focus state.
  //
  // Why this is needed:
  // When the user taps a video in VideoFeed tab, a fullscreen PlayerActivity (Android)
  // or PlayerViewController (iOS) is launched. This causes the host Activity/ViewController
  // to enter a paused lifecycle state, which internally pauses the StoryBlock. However, when
  // the fullscreen player is dismissed and the user switches back to the StoryBlock tab,
  // there is no automatic mechanism to resume playback — the StoryBlock remains paused and
  // requires a manual tap to restart.
  //
  // useFocusEffect fires whenever this screen gains or loses navigation focus:
  //   - Focus gained  → play()  (e.g. switching to this tab, or returning from fullscreen)
  //   - Focus lost    → pause() (e.g. switching away, or entering fullscreen player)
  //
  // Safety of redundant play()/pause() calls:
  //   Both play() and pause() are safe to call in any state on both platforms:
  //
  //   Android: play() dispatches OnStartPlayer and pause() dispatches OnPausePlayer via
  //   a SharedFlow (event stream). The downstream player fragment simply applies the latest
  //   state. Calling play() when already playing, or pause() when already paused, emits a
  //   no-op event — no crash, no side effect, no state corruption.
  //
  //   iOS: play() and pause() are forwarded to StoryBlockViewController which delegates to
  //   the underlying player. The player ignores redundant play/pause calls gracefully.
  //
  //   RN Bridge: sendCommand() guards with isMountedRef and null-checks the native node
  //   handle, so calls on an unmounted or not-yet-ready component are silently dropped.
  useFocusEffect(
    useCallback(() => {
      storyBlockRef.current?.onViewportEntered();
      console.log('[useFocusEffect] StoryBlockTab onViewportEntered');
      return () => {
        storyBlockRef.current?.onViewportLeft();
        console.log('[useFocusEffect] StoryBlockTab onViewportLeft');
      };
    }, [])
  );

  return (
    <View style={styles.page}>
      <StoryBlock
        ref={storyBlockRef}
        style={styles.storyBlock}
        source={'playlist'}
        channel={CHANNEL_ID}
        playlist={PLAYLIST_ID}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
        storyBlockConfiguration={{
          handleAppearanceManually: true,
        }}
        onStoryBlockLoadFinished={(error) => {
          if (!error) {
            storyBlockRef.current?.onViewportEntered();
          }
        }}
      />
    </View>
  );
}

function VideoFeedAndStoryBlock() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <BottomTab.Screen name="VideoFeed" component={VideoFeedTab} />
      <BottomTab.Screen name="StoryBlock" component={StoryBlockTab} />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 100,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  feed: {
    height: 200,
    width: '100%',
    marginTop: 10,
  },
  detailButton: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  detailPage: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  storyBlock: {
    width: '100%',
    height: '40%',
  },
});

export default VideoFeedAndStoryBlock;
