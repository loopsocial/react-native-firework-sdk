import React, { useEffect, useRef, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { FWError, VideoFeed } from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlaylistInputModal from '../components/PlaylistInputModal';
import { shopifyDomain } from '../config/Shopify.json';
import type { RootStackParamList } from './paramList/RootStackParamList';
import type { TabParamsList } from './paramList/TabParamsList';
import { defaultShoppingPlaylist } from '../config/Feed.json';

type ShoppingScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'Shopping'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function Shopping() {
  const navigation = useNavigation<ShoppingScreenNavigationProp>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <TouchableOpacity
          onPress={() => {
            setPlaylistInputModalVisible(true);
          }}
        >
          <View style={styles.settingWrapper}>
            <Ionicons name="settings-outline" size={24} color={tintColor} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);
  const [playlistInputModalVisible, setPlaylistInputModalVisible] =
    useState(false);
  const [channelId, setChannelId] = useState<string>(
    defaultShoppingPlaylist.channelId
  );
  const [playlistId, setPlaylistId] = useState<string>(
    defaultShoppingPlaylist.playlistId
  );
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);

  const feedRef = useRef<VideoFeed>(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoFeedWrapper}>
          <VideoFeed
            style={styles.videoFeed}
            source="playlist"
            channel={channelId}
            playlist={playlistId}
            videoFeedConfiguration={{
              title: { hidden: false },
              titlePosition: 'nested',
            }}
            videoPlayerConfiguration={{
              playerStyle: 'full',
              videoCompleteAction: 'advanceToNext',
              showShareButton: true,
            }}
            onVideoFeedLoadFinished={(error) => {
              console.log('onVideoFeedLoadFinished error', error);
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
            </View>
          )}
        </View>
        <ListItem
          containerStyle={styles.listItemContainer}
          topDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <ListItem.Title style={styles.title}>Channel Id:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {channelId}
          </ListItem.Subtitle>
        </ListItem>
        <ListItem
          containerStyle={styles.listItemContainer}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <ListItem.Title style={styles.title}>Playlist Id:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {playlistId}
          </ListItem.Subtitle>
        </ListItem>
        <ListItem
          containerStyle={{ ...styles.listItemContainer, marginTop: 20 }}
          topDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <Text style={styles.title}>Store Details:</Text>
        </ListItem>
        <ListItem
          containerStyle={styles.listItemContainer}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <ListItem.Title style={styles.title}>Integration:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>Shopify</ListItem.Subtitle>
        </ListItem>
        <ListItem
          containerStyle={styles.listItemContainer}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <ListItem.Title style={styles.title}>Storefront:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {shopifyDomain}
          </ListItem.Subtitle>
        </ListItem>
      </ScrollView>
      <PlaylistInputModal
        visible={playlistInputModalVisible}
        onRequestClose={() => {
          setPlaylistInputModalVisible(false);
        }}
        onSubmit={(channelId, playlistId) => {
          setPlaylistInputModalVisible(false);
          setChannelId(channelId);
          setPlaylistId(playlistId);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingVertical: 30,
  },
  videoFeedWrapper: {
    height: 220,
    marginBottom: 30,
  },
  videoFeed: {
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 18,
  },
  listItemContainer: {
    paddingVertical: 10,
  },
  settingWrapper: {
    marginRight: 20,
  },
  errorView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Shopping;
