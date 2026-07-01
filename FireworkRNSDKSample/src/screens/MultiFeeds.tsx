import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import {
  type IStoryBlockMethods,
  StoryBlock,
  VideoFeed,
} from 'react-native-firework-sdk';
import type { RootStackParamList } from './paramList/RootStackParamList';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  defaultHomeVideoFeedPlaylistInfoArray,
  defaultHomeStoryBlockPlaylistInfoArray,
} from '../config/Feed.json';
import { useAppSelector } from '../hooks/reduxHooks';

type MultiFeedsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type FeedPlaylistInfo = {
  channelId: string;
  playlistId: string;
  type: 'storyBlock' | 'feed' | 'placeholder';
  key: string;
};

function StoryBlockWrapper({
  item,
  isViewable,
  height,
}: {
  item: FeedPlaylistInfo;
  isViewable: boolean;
  height: number;
}) {
  const ref = useRef<IStoryBlockMethods>(null);
  const isScreenFocused = useIsFocused();
  useFocusEffect(
    useCallback(() => {
      console.log(
        'MultiFeeds StoryBlockWrapper useFocusEffect ref.current',
        ref.current
      );
    }, [])
  );
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );
  const isVisible = isViewable && isScreenFocused;
  console.log(
    'MultiFeeds StoryBlockWrapper isViewable',
    isViewable,
    'isScreenFocused',
    isScreenFocused,
    'isVisible',
    isVisible,
    'item channelId',
    item.channelId,
    'item playlistId',
    item.playlistId
  );
  useEffect(() => {
    if (isVisible) {
      ref.current?.onViewportEntered();
    } else {
      ref.current?.onViewportLeft();
    }
  }, [isVisible]);
  return (
    <View style={[styles.storyBlockWrapper, { height }]}>
      <StoryBlock
        ref={ref}
        style={styles.storyBlock}
        source={'playlist'}
        channel={item.channelId}
        playlist={item.playlistId}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
        storyBlockConfiguration={{ handleAppearanceManually: true }}
      />
    </View>
  );
}

function MultiFeeds() {
  const { height: windowHeight } = useWindowDimensions();
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );
  const navigation = useNavigation<MultiFeedsScreenNavigationProp>();
  const buttons = ['FlatList', 'ScrollView'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewableKeys, setViewableKeys] = useState<string[]>([]);
  const storyBlockHeight = Math.max(
    320,
    Math.min(420, Math.round(windowHeight * 0.52))
  );
  const listItemHeight = Math.max(
    120,
    Math.min(160, Math.round(windowHeight * 0.18))
  );

  let data: FeedPlaylistInfo[] = [];
  defaultHomeStoryBlockPlaylistInfoArray.forEach((item) => {
    data.push({
      ...item,
      type: 'storyBlock',
      key: item.channelId + item.playlistId,
    });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 1,
    });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 2,
    });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 3,
    });
  });

  defaultHomeVideoFeedPlaylistInfoArray.forEach((item) => {
    data.push({ ...item, type: 'feed', key: item.channelId + item.playlistId });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 1,
    });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 2,
    });
    data.push({
      channelId: '',
      playlistId: '',
      type: 'placeholder',
      key: item.channelId + item.playlistId + 3,
    });
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <View />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: FeedPlaylistInfo }) => {
    if (item.type === 'storyBlock') {
      return (
        <StoryBlockWrapper
          item={item}
          isViewable={viewableKeys.includes(item.key)}
          height={storyBlockHeight}
        />
      );
    } else if (item.type === 'feed') {
      return (
        <View style={[styles.feedWrapper, { height: listItemHeight }]}>
          <VideoFeed
            style={styles.feed}
            source={'playlist'}
            channel={item.channelId}
            playlist={item.playlistId}
            enablePictureInPicture={enablePictureInPicture}
            enableSystemPictureInPicture={enableSystemPictureInPicture}
          />
        </View>
      );
    } else {
      return (
        <View style={[styles.placeholderWrapper, { height: listItemHeight }]}>
          <Text style={styles.placeholder}>List item placeholder</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ButtonGroupWrapper}>
        <ButtonGroup
          buttons={buttons}
          selectedIndex={selectedIndex}
          onPress={(index) => {
            setSelectedIndex(index);
            if (index === 1) {
              setViewableKeys([]);
            }
          }}
        />
      </View>
      {selectedIndex === 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          nestedScrollEnabled
          removeClippedSubviews={true}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          onViewableItemsChanged={(info) => {
            const { viewableItems } = info;
            setViewableKeys(viewableItems.map((item) => item.key));
            console.log('FlatList onViewableItemsChanged', info);
          }}
        />
      ) : (
        <ScrollView nestedScrollEnabled removeClippedSubviews={true}>
          {data.map((item) => (
            <View key={item.key}>{renderItem({ item })}</View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  ButtonGroupWrapper: {
    margin: 10,
  },
  storyBlockWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
  },
  storyBlock: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  feedWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
  },
  feed: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  placeholderWrapper: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'lightgray',
  },
  placeholder: {
    textAlign: 'center',
  },
});

export default MultiFeeds;
