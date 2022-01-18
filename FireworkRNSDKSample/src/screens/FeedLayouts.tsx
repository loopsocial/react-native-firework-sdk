import ChannelInputModal from '../components/ChannelInputModal';
import React, { useState } from 'react';
import { ListItem } from 'react-native-elements';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabParamsList } from './paramList/TabParamsList';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './paramList/RootStackParamList';
import PlaylistInputModal from '../components/PlaylistInputModal';
import { defaultChannelIdArray, defaultPlaylistInfoArray } from '../config/Feed.json';


type FeedLayoutsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'FeedLayouts'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface FeedListItemData {
  title: string;
  pressCallback: (event: GestureResponderEvent) => void;
}

export default function FeedLayouts() {
  const navigation = useNavigation<FeedLayoutsScreenNavigationProp>();
  const { showActionSheetWithOptions } = useActionSheet();
  const [channelInputModalVisible, setChannelInputModalVisible] =
    useState(false);
  const [playlistInputModalVisible, setPlaylistInputModalVisible] =
    useState(false);

  const dataList: FeedListItemData[] = [
    {
      title: 'Discover Feed',
      pressCallback: (_) => {
        navigation.navigate('Feed', { source: 'discover' });
      },
    },
    {
      title: 'Channel Feed',
      pressCallback: (_) => {
        const options = [...defaultChannelIdArray, 'Custom', 'Cancel'];
        const cancelButtonIndex = defaultChannelIdArray.length + 1;
        const customButtonIndex = defaultChannelIdArray.length;

        showActionSheetWithOptions(
          {
            title: 'Select Channel',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex === 'number') {
              if (buttonIndex < customButtonIndex) {
                navigation.navigate('Feed', {
                  source: 'channel',
                  channel: options[buttonIndex],
                });
              } else if (buttonIndex === customButtonIndex) {
                setChannelInputModalVisible(true);
              }
            }
          }
        );
      },
    },
    {
      title: 'Playlist Feed',
      pressCallback: (_) => {
        const options = [
          ...defaultPlaylistInfoArray.map((item: any) => `ChannelId: ${item.channelId} PlaylistId: ${item.playlistId}`),
          'Custom',
          'Cancel',
        ];
        const cancelButtonIndex = defaultPlaylistInfoArray.length + 1;
        const customButtonIndex = defaultPlaylistInfoArray.length;
        showActionSheetWithOptions(
          {
            title: 'Select Playlist',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex === 'number') {
              if (buttonIndex < customButtonIndex) {
                const playlistInfo = defaultPlaylistInfoArray[buttonIndex];
                navigation.navigate('Feed', {
                  source: 'playlist',
                  channel: playlistInfo.channelId,
                  playlist: playlistInfo.playlistId,
                });
              } else if (buttonIndex === customButtonIndex) {
                setPlaylistInputModalVisible(true);
              }
            }
          }
        );
      },
    },
  ];
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dataList.map((data) => (
          <ListItem
            key={data.title}
            bottomDivider
            onPress={data.pressCallback}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <ListItem.Content>
              <ListItem.Title>{data.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <ChannelInputModal
        visible={channelInputModalVisible}
        onRequestClose={() => {
          setChannelInputModalVisible(false);
        }}
        onSubmit={(channelId) => {
          setChannelInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'channel',
            channel: channelId,
          });
        }}
      />
      <PlaylistInputModal
        visible={playlistInputModalVisible}
        onRequestClose={() => {
          setPlaylistInputModalVisible(false);
        }}
        onSubmit={(channelId, playlistId) => {
          setPlaylistInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'playlist',
            channel: channelId,
            playlist: playlistId,
          });
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
    paddingVertical: 0,
  },
});
