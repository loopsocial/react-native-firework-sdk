import { useEffect, useRef, useState } from 'react';

import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import {
  type FWError,
  type PlayerDeckConfiguration,
  PlayerDeck,
  type VideoPlayerConfiguration,
  PipPlacement,
  type PlayerDeckSource,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import PlayerConfigurationModal from '../components/PlayerConfigurationModal';
import PlayerDeckConfigurationModal from '../components/PlayerDeckConfigurationModal';
import type { RootStackParamList } from './paramList/RootStackParamList';

type PlayerDeckDemoRouteProp = RouteProp<RootStackParamList, 'PlayerDeckDemo'>;
type PlayerDeckDemoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlayerDeckDemo'
>;

const defaultDeckConfiguration: PlayerDeckConfiguration = {
  cornerRadius: 8,
  autoplay: { isEnabled: true },
  playIcon: { hidden: false, iconWidth: 50 },
  muteButton: { hidden: false },
  shareButton: { hidden: false },
  fullScreen: { isEnabled: true },
  showAdBadge: true,
  onFirstDisplayMuteState: 'default',
  itemSpacing: 16,
  contentPadding: { top: 10, right: 10, bottom: 10, left: 10 },
  subtitleConfiguration: { swapMuteAndSubtitleButtons: false },
};

const defaultPlayerConfiguration: VideoPlayerConfiguration = {
  playerStyle: 'full',
  videoCompleteAction: 'advanceToNext',
  showShareButton: true,
  showMuteButton: true,
  showPlaybackButton: true,
  ctaDelay: { type: 'constant', value: 3 },
  ctaHighlightDelay: { type: 'constant', value: 2 },
  ctaWidth: 'fullWidth',
  showVideoDetailTitle: true,
  pipPlacement: PipPlacement.BottomRight,
};

const PlayerDeckDemo = () => {
  const route = useRoute<PlayerDeckDemoRouteProp>();
  const navigation = useNavigation<PlayerDeckDemoNavigationProp>();
  const playerDeckRef = useRef<PlayerDeck>(null);
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);

  const source = route.params?.source || 'discover';
  const channel = route.params?.channel;
  const playlist = route.params?.playlist;
  const playlistGroup = route.params?.playlistGroup;
  const dynamicContentParameters = route.params?.dynamicContentParameters;
  const hashtagFilterExpression = route.params?.hashtagFilterExpression;
  const productIds = route.params?.productIds;
  const contentId = route.params?.contentId;

  const [enablePip, setEnablePip] = useState(true);
  const [showDeckConfig, setShowDeckConfig] = useState(false);
  const [showPlayerConfig, setShowPlayerConfig] = useState(false);

  const [deckConfiguration, setDeckConfiguration] =
    useState<PlayerDeckConfiguration>(defaultDeckConfiguration);
  const [playerConfiguration, setPlayerConfiguration] =
    useState<VideoPlayerConfiguration>(defaultPlayerConfiguration);

  useEffect(() => {
    const titleSource = source.charAt(0).toUpperCase() + source.slice(1);
    navigation.setOptions({
      title: `Player Deck - ${titleSource}`,
      headerRight: ({ tintColor }) => (
        <View style={styles.headerRight}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={tintColor}
            style={styles.headerIcon}
            onPress={() => setShowDeckConfig(true)}
          />
          <Ionicons
            name="videocam-outline"
            size={24}
            color={tintColor}
            style={styles.headerIcon}
            onPress={() => setShowPlayerConfig(true)}
          />
          <Ionicons
            name="refresh-sharp"
            size={24}
            color={tintColor}
            style={styles.headerIcon}
            onPress={() => playerDeckRef.current?.refresh()}
          />
        </View>
      ),
    });
  }, [navigation, source]);

  const renderPlayerDeck = () => {
    if (feedError) {
      return (
        <View style={styles.errorView}>
          <Button
            title="Refresh"
            onPress={() => {
              setFeedError(undefined);
              playerDeckRef.current?.refresh();
            }}
          />
          <Text style={styles.errorText}>
            {feedError.reason ?? 'Failed to load player deck'}
          </Text>
        </View>
      );
    }

    return (
      <PlayerDeck
        ref={playerDeckRef}
        style={styles.playerDeck}
        source={source as PlayerDeckSource}
        channel={channel}
        playlist={playlist}
        playlistGroup={playlistGroup}
        dynamicContentParameters={dynamicContentParameters}
        hashtagFilterExpression={hashtagFilterExpression}
        productIds={productIds}
        contentId={contentId}
        enablePictureInPicture={enablePip}
        playerDeckConfiguration={deckConfiguration}
        videoPlayerConfiguration={playerConfiguration}
        onPlayerDeckLoadFinished={(error?: FWError) => {
          console.log('[example] onPlayerDeckLoadFinished error', error);
          setFeedError(error);
        }}
        onPlayerDeckEmpty={(error?: FWError) => {
          console.log('[example] onPlayerDeckEmpty error', error);
        }}
        onPlayerDeckDidStartPictureInPicture={(error?: FWError) => {
          console.log(
            '[example] onPlayerDeckDidStartPictureInPicture error',
            error
          );
        }}
        onPlayerDeckDidStopPictureInPicture={(error?: FWError) => {
          console.log(
            '[example] onPlayerDeckDidStopPictureInPicture error',
            error
          );
        }}
        onPlayerDeckGetFeedId={(feedId: string) => {
          console.log('[example] onPlayerDeckGetFeedId feedId', feedId);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} nestedScrollEnabled>
        <Text style={styles.sourceInfo}>
          {`Source: ${source}`}
          {channel ? ` | Channel: ${channel}` : ''}
          {playlist ? ` | Playlist: ${playlist}` : ''}
        </Text>
        <View style={styles.pipRow}>
          <Text>Enable Picture in Picture</Text>
          <Switch value={enablePip} onValueChange={setEnablePip} />
        </View>
        <View style={styles.playerDeckWrapper}>{renderPlayerDeck()}</View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>List item placeholder</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>List item placeholder</Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>List item placeholder</Text>
        </View>
      </ScrollView>
      <PlayerDeckConfigurationModal
        visible={showDeckConfig}
        playerDeckConfiguration={deckConfiguration}
        defaultPlayerDeckConfiguration={defaultDeckConfiguration}
        onRequestClose={() => setShowDeckConfig(false)}
        onSubmit={(config) => {
          setDeckConfiguration(config);
          setTimeout(() => setShowDeckConfig(false), 0);
        }}
      />
      <PlayerConfigurationModal
        visible={showPlayerConfig}
        playerConfiguration={playerConfiguration}
        defaultPlayerConfiguration={defaultPlayerConfiguration}
        onRequestClose={() => setShowPlayerConfig(false)}
        onSubmit={(config) => {
          setPlayerConfiguration(config);
          setTimeout(() => setShowPlayerConfig(false), 0);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 12,
  },
  scrollContent: {
    flex: 1,
  },
  sourceInfo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 12,
    color: '#888',
  },
  pipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  playerDeckWrapper: {
    height: 580,
  },
  playerDeck: {
    height: '100%',
    width: '100%',
  },
  placeholder: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 200,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  errorView: {
    flex: 1,
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

export default PlayerDeckDemo;
