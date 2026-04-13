import { useEffect, useRef, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { type FWError, VideoFeed } from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlaylistInputModal from '../components/PlaylistInputModal';
import { defaultShoppingPlaylist } from '../config/Feed.json';
import type { RootStackParamList } from './paramList/RootStackParamList';
import ShoppingConfigurationModal from '../components/ShoppingConfigurationModal';
import { useAppSelector } from '../hooks/reduxHooks';

type ShoppingScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

function Shopping() {
  const navigation = useNavigation<ShoppingScreenNavigationProp>();
  const [playlistInputModalVisible, setPlaylistInputModalVisible] =
    useState<boolean>(false);
  const [
    shoppingConfigurationModalVisible,
    setShoppingConfigurationModalVisible,
  ] = useState<boolean>(false);
  const [channelId, setChannelId] = useState<string>(
    defaultShoppingPlaylist.channelId
  );
  const [playlistId, setPlaylistId] = useState<string>(
    defaultShoppingPlaylist.playlistId
  );
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);
  const feedRef = useRef<VideoFeed>(null);
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              feedRef.current?.refresh();
            }}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="refresh-sharp" size={24} color={tintColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPlaylistInputModalVisible(true);
            }}
          >
            <View style={styles.settingWrapper}>
              <Ionicons name="settings-outline" size={24} color={tintColor} />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoFeedWrapper}>
          <VideoFeed
            style={styles.videoFeed}
            source="playlist"
            channel={channelId}
            playlist={playlistId}
            enablePictureInPicture={enablePictureInPicture}
            videoFeedConfiguration={{
              title: { hidden: false },
              titlePosition: 'nested',
              showAdBadge: true,
              itemSpacing: 10,
            }}
            videoPlayerConfiguration={{
              playerStyle: 'full',
              videoCompleteAction: 'advanceToNext',
              showShareButton: true,
              showMuteButton: true,
              showPlaybackButton: true,
            }}
            onVideoFeedLoadFinished={(error?: FWError) => {
              console.log('onVideoFeedLoadFinished error', error);
              setFeedError(error);
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
        <ListItem containerStyle={styles.listItemContainer} topDivider>
          <ListItem.Title style={styles.title}>Channel Id:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {channelId}
          </ListItem.Subtitle>
        </ListItem>
        <ListItem containerStyle={styles.listItemContainer}>
          <ListItem.Title style={styles.title}>Playlist Id:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>
            {playlistId}
          </ListItem.Subtitle>
        </ListItem>
        <ListItem
          containerStyle={{ ...styles.listItemContainer, marginTop: 15 }}
          topDivider
        >
          <Text style={styles.title}>Store Details:</Text>
        </ListItem>
        <ListItem containerStyle={styles.listItemContainer}>
          <ListItem.Title style={styles.title}>Integration:</ListItem.Title>
          <ListItem.Subtitle style={styles.subTitle}>Shopify</ListItem.Subtitle>
        </ListItem>
        <ListItem
          containerStyle={{
            ...styles.listItemContainer,
            marginTop: 15,
          }}
          topDivider
        >
          <View style={styles.cartConfigButtonWrapper}>
            <Button
              title="Shopping Configuration"
              onPress={() => {
                setShoppingConfigurationModalVisible(true);
              }}
            />
          </View>
        </ListItem>
      </ScrollView>
      <PlaylistInputModal
        visible={playlistInputModalVisible}
        onRequestClose={() => {
          setPlaylistInputModalVisible(false);
        }}
        onSubmit={(newChannelId, newPlaylistId) => {
          setPlaylistInputModalVisible(false);
          setChannelId(newChannelId);
          setPlaylistId(newPlaylistId);
        }}
      />
      <ShoppingConfigurationModal
        visible={shoppingConfigurationModalVisible}
        onRequestClose={() => {
          setShoppingConfigurationModalVisible(false);
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingVertical: 0,
  },
  videoFeedWrapper: {
    height: 220,
    marginBottom: 20,
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
    backgroundColor: '#ffffff',
  },
  errorText: {
    padding: 20,
    marginTop: 10,
    fontSize: 14,
    color: 'red',
  },
  cartConfigButtonWrapper: {
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
});

export default Shopping;
