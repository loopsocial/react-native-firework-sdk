import { useState } from 'react';

import {
  type GestureResponderEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ListItem } from 'react-native-elements';

import { useActionSheet } from '@expo/react-native-action-sheet';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import ChannelInputModal from '../components/ChannelInputModal';
import DynamicContentInputModal from '../components/DynamicContentInputModal';
import HashtagPlaylistInputModal from '../components/HashtagPlaylistInputModal';
import PlaylistGroupInputModal from '../components/PlaylistGroupInputModal';
import PlaylistInputModal from '../components/PlaylistInputModal';
import SkuInputModal from '../components/SkuInputModal';
import {
  defaultChannelIdArray,
  defaultDynamicContentInfoArray,
  defaultPlaylistGroupInfoArray,
  defaultPlaylistInfoArray,
} from '../config/Feed.json';
import type { RootStackParamList } from './paramList/RootStackParamList';
import type { TabParamsList } from './paramList/TabParamsList';
import SingleContentInputModal from '../components/SingleContentInputModal';

type FeedLayoutsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'FeedLayouts'>,
  StackNavigationProp<RootStackParamList>
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
  const [playlistGroupInputModalVisible, setPlaylistGroupInputModalVisible] =
    useState(false);
  const [dynamicContentInputModalVisible, setDynamicContentInputModalVisible] =
    useState(false);
  const [
    hashtagPlaylistInputModalVisible,
    setHashtagPlaylistInputModalVisible,
  ] = useState(false);
  const [skuInputModalVisible, setSkuInputModalVisible] = useState(false);
  const [singleContentInputModalVisible, setSingleContentInputModalVisible] =
    useState(false);
  const [playerDeckHashtagModalVisible, setPlayerDeckHashtagModalVisible] =
    useState(false);
  const [playerDeckSkuModalVisible, setPlayerDeckSkuModalVisible] =
    useState(false);
  const [
    playerDeckSingleContentModalVisible,
    setPlayerDeckSingleContentModalVisible,
  ] = useState(false);
  const [
    playerDeckChannelInputModalVisible,
    setPlayerDeckChannelInputModalVisible,
  ] = useState(false);
  const [
    playerDeckPlaylistInputModalVisible,
    setPlayerDeckPlaylistInputModalVisible,
  ] = useState(false);

  const showPlayerDeckChannelPicker = () => {
    const options = [...defaultChannelIdArray, 'Custom', 'Cancel'];
    const cancelButtonIndex = defaultChannelIdArray.length + 1;
    const customButtonIndex = defaultChannelIdArray.length;
    showActionSheetWithOptions(
      { title: 'Select Channel Id', options, cancelButtonIndex },
      (buttonIndex) => {
        if (typeof buttonIndex === 'number') {
          if (buttonIndex < customButtonIndex) {
            navigation.navigate('PlayerDeckDemo', {
              source: 'channel',
              channel: options[buttonIndex],
            });
          } else if (buttonIndex === customButtonIndex) {
            setPlayerDeckChannelInputModalVisible(true);
          }
        }
      }
    );
  };

  const showPlayerDeckPlaylistPicker = () => {
    const options = [
      ...defaultPlaylistInfoArray.map(
        (item) => `ChannelId: ${item.channelId} PlaylistId: ${item.playlistId}`
      ),
      'Custom',
      'Cancel',
    ];
    const cancelButtonIndex = defaultPlaylistInfoArray.length + 1;
    const customButtonIndex = defaultPlaylistInfoArray.length;
    showActionSheetWithOptions(
      { title: 'Select Playlist Info', options, cancelButtonIndex },
      (buttonIndex) => {
        if (typeof buttonIndex === 'number') {
          if (buttonIndex < customButtonIndex) {
            const playlistInfo = defaultPlaylistInfoArray[buttonIndex];
            navigation.navigate('PlayerDeckDemo', {
              source: 'playlist',
              channel: playlistInfo?.channelId ?? '',
              playlist: playlistInfo?.playlistId ?? '',
            });
          } else if (buttonIndex === customButtonIndex) {
            setPlayerDeckPlaylistInputModalVisible(true);
          }
        }
      }
    );
  };

  const showPlayerDeckPlaylistGroupPicker = () => {
    const options = [
      ...defaultPlaylistGroupInfoArray.map((item) => item.playlistGroupId),
      'Cancel',
    ];
    const cancelButtonIndex = defaultPlaylistGroupInfoArray.length;
    showActionSheetWithOptions(
      { title: 'Select Playlist Group Id', options, cancelButtonIndex },
      (buttonIndex) => {
        if (
          typeof buttonIndex === 'number' &&
          buttonIndex < cancelButtonIndex
        ) {
          const groupInfo = defaultPlaylistGroupInfoArray[buttonIndex];
          navigation.navigate('PlayerDeckDemo', {
            source: 'playlistGroup',
            playlistGroup: groupInfo?.playlistGroupId ?? '',
          });
        }
      }
    );
  };

  const showPlayerDeckDynamicContentPicker = () => {
    const options = [
      ...defaultDynamicContentInfoArray.map((item) => item.name),
      'Cancel',
    ];
    const cancelButtonIndex = defaultDynamicContentInfoArray.length;
    showActionSheetWithOptions(
      { title: 'Select Dynamic Content Info', options, cancelButtonIndex },
      (buttonIndex) => {
        if (
          typeof buttonIndex === 'number' &&
          buttonIndex < cancelButtonIndex
        ) {
          const info = defaultDynamicContentInfoArray[buttonIndex];
          navigation.navigate('PlayerDeckDemo', {
            source: 'dynamicContent',
            channel: info?.channelId ?? '',
            dynamicContentParameters: info?.parameters,
          });
        }
      }
    );
  };

  let dataList: FeedListItemData[] = [
    {
      title: 'Discover Feed',
      pressCallback: () => {
        navigation.navigate('Feed', { source: 'discover' });
      },
    },
    {
      title: 'Channel Feed',
      pressCallback: () => {
        const options = [...defaultChannelIdArray, 'Custom', 'Cancel'];
        const cancelButtonIndex = defaultChannelIdArray.length + 1;
        const customButtonIndex = defaultChannelIdArray.length;

        showActionSheetWithOptions(
          {
            title: 'Select Channel Id',
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
      pressCallback: () => {
        const options = [
          ...defaultPlaylistInfoArray.map(
            (item) =>
              `ChannelId: ${item.channelId} PlaylistId: ${item.playlistId}`
          ),
          'Custom',
          'Cancel',
        ];
        const cancelButtonIndex = defaultPlaylistInfoArray.length + 1;
        const customButtonIndex = defaultPlaylistInfoArray.length;
        showActionSheetWithOptions(
          {
            title: 'Select Playlist Info',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex === 'number') {
              if (buttonIndex < customButtonIndex) {
                const playlistInfo = defaultPlaylistInfoArray[buttonIndex];
                navigation.navigate('Feed', {
                  source: 'playlist',
                  channel: playlistInfo?.channelId ?? '',
                  playlist: playlistInfo?.playlistId ?? '',
                });
              } else if (buttonIndex === customButtonIndex) {
                setPlaylistInputModalVisible(true);
              }
            }
          }
        );
      },
    },
    {
      title: 'Playlist Group Feed',
      pressCallback: () => {
        const options = [
          ...defaultPlaylistGroupInfoArray.map((item) => item.playlistGroupId),
          'Custom',
          'Cancel',
        ];
        const cancelButtonIndex = defaultPlaylistGroupInfoArray.length + 1;
        const customButtonIndex = defaultPlaylistGroupInfoArray.length;
        showActionSheetWithOptions(
          {
            title: 'Select Playlist Group Id',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex === 'number') {
              if (buttonIndex < customButtonIndex) {
                const playlistGroupInfo =
                  defaultPlaylistGroupInfoArray[buttonIndex];
                navigation.navigate('Feed', {
                  source: 'playlistGroup',
                  playlistGroup: playlistGroupInfo?.playlistGroupId ?? '',
                });
              } else if (buttonIndex === customButtonIndex) {
                setPlaylistGroupInputModalVisible(true);
              }
            }
          }
        );
      },
    },
    {
      title: 'Dynamic Content Feed',
      pressCallback: () => {
        const options = [
          ...defaultDynamicContentInfoArray.map((item) => item.name),
          'Custom',
          'Cancel',
        ];
        const cancelButtonIndex = defaultDynamicContentInfoArray.length + 1;
        const customButtonIndex = defaultDynamicContentInfoArray.length;
        showActionSheetWithOptions(
          {
            title: 'Select Dynamic Content Info',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex === 'number') {
              if (buttonIndex < customButtonIndex) {
                const dynamicContentInfo =
                  defaultDynamicContentInfoArray[buttonIndex];
                navigation.navigate('Feed', {
                  source: 'dynamicContent',
                  channel: dynamicContentInfo?.channelId ?? '',
                  dynamicContentParameters: dynamicContentInfo?.parameters,
                });
              } else if (buttonIndex === customButtonIndex) {
                setDynamicContentInputModalVisible(true);
              }
            }
          }
        );
      },
    },
    {
      title: 'Hashtag Playlist Feed',
      pressCallback: () => {
        setHashtagPlaylistInputModalVisible(true);
      },
    },
    {
      title: 'SKU Feed',
      pressCallback: () => {
        setSkuInputModalVisible(true);
      },
    },
    {
      title: 'Single Content Feed',
      pressCallback: () => {
        setSingleContentInputModalVisible(true);
      },
    },
    {
      title: 'Circle Story',
      pressCallback: () => {
        navigation.navigate('CircleStoryDemo');
      },
    },
    {
      title: 'Player Deck',
      pressCallback: () => {
        const sourceOptions = [
          'Discover',
          'Channel',
          'Playlist',
          'Playlist Group',
          'Dynamic Content',
          'Hashtag Playlist',
          'SKU',
          'Single Content',
          'Cancel',
        ];
        const cancelButtonIndex = sourceOptions.length - 1;
        showActionSheetWithOptions(
          {
            title: 'Select Player Deck Source',
            options: sourceOptions,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (typeof buttonIndex !== 'number') return;
            switch (buttonIndex) {
              case 0:
                navigation.navigate('PlayerDeckDemo', { source: 'discover' });
                break;
              case 1:
                showPlayerDeckChannelPicker();
                break;
              case 2:
                showPlayerDeckPlaylistPicker();
                break;
              case 3:
                showPlayerDeckPlaylistGroupPicker();
                break;
              case 4:
                showPlayerDeckDynamicContentPicker();
                break;
              case 5:
                setPlayerDeckHashtagModalVisible(true);
                break;
              case 6:
                setPlayerDeckSkuModalVisible(true);
                break;
              case 7:
                setPlayerDeckSingleContentModalVisible(true);
                break;
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
          <ListItem key={data.title} bottomDivider onPress={data.pressCallback}>
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
      <PlaylistGroupInputModal
        visible={playlistGroupInputModalVisible}
        onRequestClose={() => {
          setPlaylistGroupInputModalVisible(false);
        }}
        onSubmit={(playlistGroupId) => {
          console.log('playlistGroupId', playlistGroupId);
          setPlaylistGroupInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'playlistGroup',
            playlistGroup: playlistGroupId,
          });
        }}
      />
      <DynamicContentInputModal
        visible={dynamicContentInputModalVisible}
        onRequestClose={() => {
          setDynamicContentInputModalVisible(false);
        }}
        onSubmit={(channelId, dynamicContentParameters) => {
          console.log('channelId', channelId);
          console.log('dynamicContentParameters', dynamicContentParameters);

          setDynamicContentInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'dynamicContent',
            channel: channelId,
            dynamicContentParameters: dynamicContentParameters,
          });
        }}
      />
      <HashtagPlaylistInputModal
        visible={hashtagPlaylistInputModalVisible}
        onRequestClose={() => {
          setHashtagPlaylistInputModalVisible(false);
        }}
        onSubmit={(channelId, hashtagFilterExpression) => {
          setHashtagPlaylistInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'hashtagPlaylist',
            channel: channelId,
            hashtagFilterExpression: hashtagFilterExpression,
          });
        }}
      />
      <SkuInputModal
        visible={skuInputModalVisible}
        onRequestClose={() => {
          setSkuInputModalVisible(false);
        }}
        onSubmit={(channelId, productIds) => {
          setSkuInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'sku',
            channel: channelId,
            productIds: productIds,
          });
        }}
      />
      <SingleContentInputModal
        visible={singleContentInputModalVisible}
        onRequestClose={() => {
          setSingleContentInputModalVisible(false);
        }}
        onSubmit={(contentId) => {
          setSingleContentInputModalVisible(false);
          navigation.navigate('Feed', {
            source: 'singleContent',
            contentId: contentId,
          });
        }}
      />
      <HashtagPlaylistInputModal
        visible={playerDeckHashtagModalVisible}
        onRequestClose={() => {
          setPlayerDeckHashtagModalVisible(false);
        }}
        onSubmit={(channelId, hashtagFilterExpression) => {
          setPlayerDeckHashtagModalVisible(false);
          navigation.navigate('PlayerDeckDemo', {
            source: 'hashtagPlaylist',
            channel: channelId,
            hashtagFilterExpression: hashtagFilterExpression,
          });
        }}
      />
      <SkuInputModal
        visible={playerDeckSkuModalVisible}
        onRequestClose={() => {
          setPlayerDeckSkuModalVisible(false);
        }}
        onSubmit={(channelId, productIds) => {
          setPlayerDeckSkuModalVisible(false);
          navigation.navigate('PlayerDeckDemo', {
            source: 'sku',
            channel: channelId,
            productIds: productIds,
          });
        }}
      />
      <SingleContentInputModal
        visible={playerDeckSingleContentModalVisible}
        onRequestClose={() => {
          setPlayerDeckSingleContentModalVisible(false);
        }}
        onSubmit={(contentId) => {
          setPlayerDeckSingleContentModalVisible(false);
          navigation.navigate('PlayerDeckDemo', {
            source: 'singleContent',
            contentId: contentId,
          });
        }}
      />
      <ChannelInputModal
        visible={playerDeckChannelInputModalVisible}
        onRequestClose={() => {
          setPlayerDeckChannelInputModalVisible(false);
        }}
        onSubmit={(channelId) => {
          setPlayerDeckChannelInputModalVisible(false);
          navigation.navigate('PlayerDeckDemo', {
            source: 'channel',
            channel: channelId,
          });
        }}
      />
      <PlaylistInputModal
        visible={playerDeckPlaylistInputModalVisible}
        onRequestClose={() => {
          setPlayerDeckPlaylistInputModalVisible(false);
        }}
        onSubmit={(channelId, playlistId) => {
          setPlayerDeckPlaylistInputModalVisible(false);
          navigation.navigate('PlayerDeckDemo', {
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
