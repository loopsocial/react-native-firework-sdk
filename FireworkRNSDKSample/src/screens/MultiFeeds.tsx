import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { StoryBlock, VideoFeed } from 'react-native-firework-sdk';
import type { RootStackParamList } from './paramList/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import {
  defaultHomeVideoFeedPlaylistInfoArray,
  defaultHomeStoryBlockPlaylistInfoArray,
} from '../config/Feed.json';

type MultiFeedsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type FeedPlaylistInfo = {
  channelId: string;
  playlistId: string;
  type: 'storyBlock' | 'feed' | 'placeholder';
  key: string;
};

function MultiFeeds() {
  const navigation = useNavigation<MultiFeedsScreenNavigationProp>();
  const buttons = ['FlatList', 'ScrollView'];
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const renderItem = ({ item }: { item: FeedPlaylistInfo }) =>
    item.type === 'storyBlock' ? (
      <View style={styles.storyBlockWrapper} key={item.key}>
        <StoryBlock
          style={styles.storyBlock}
          source={'playlist'}
          channel={item.channelId}
          playlist={item.playlistId}
        />
      </View>
    ) : item.type === 'feed' ? (
      <View style={styles.feedWrapper} key={item.key}>
        <VideoFeed
          style={styles.feed}
          source={'playlist'}
          channel={item.channelId}
          playlist={item.playlistId}
        />
      </View>
    ) : (
      <View style={styles.placeholderWrapper} key={item.key}>
        <Text style={styles.placeholder}>List item placeholder</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.ButtonGroupWrapper}>
        <ButtonGroup
          buttons={buttons}
          selectedIndex={selectedIndex}
          onPress={(index) => setSelectedIndex(index)}
        />
      </View>
      {selectedIndex === 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          removeClippedSubviews={true}
        />
      ) : (
        <ScrollView removeClippedSubviews={true}>
          {data.map((item) => renderItem({ item }))}
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
    height: 600,
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
    height: 200,
    margin: 10,
  },
  feed: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  placeholderWrapper: {
    height: 200,
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
