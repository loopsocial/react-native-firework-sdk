import { useEffect, useRef, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Slider } from 'react-native-elements';
import {
  CircleStory,
  type CircleStoryConfiguration,
  type FWError,
  type VideoPlayerConfiguration,
  type AdConfiguration,
  PipPlacement,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from './paramList/RootStackParamList';

import CircleStoryConfigurationModal from '../components/CircleStoryConfigurationModal';
import CircleStorySourceModal, {
  type CircleStorySourceConfig,
} from '../components/CircleStorySourceModal';
import PlayerConfigurationModal from '../components/PlayerConfigurationModal';
import { useAppSelector } from '../hooks/reduxHooks';

type CircleStoryDemoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CircleStoryDemo'
>;

const sourceDisplayNames: Record<string, string> = {
  discover: 'Discover',
  channel: 'Channel',
  playlist: 'Playlist',
  playlistGroup: 'Playlist Group',
  dynamicContent: 'Dynamic Content',
  hashtagPlaylist: 'Hashtag Playlist',
  sku: 'SKU',
  singleContent: 'Single Content',
};

const defaultCircleStoryConfiguration: CircleStoryConfiguration = {
  backgroundColor: '#F5F5F5',
  showAdBadge: true,
  enableAutoplay: true,
  itemSpacing: 10,
  contentPadding: { top: 10, right: 10, bottom: 10, left: 10 },
};

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
  ctaDelay: { type: 'constant', value: 3 },
  ctaHighlightDelay: { type: 'constant', value: 2 },
  ctaWidth: 'fullWidth',
  showVideoDetailTitle: true,
  videoPlayerLogoConfiguration: { option: 'disabled', isClickable: true },
  countdownTimerConfiguration: { isHidden: false, appearance: 'dark' },
  shouldExtendMediaOutsideSafeArea: false,
  statusBarHidden: false,
  statusBarStyle: 'light',
  pipPlacement: PipPlacement.BottomRight,
  scrollDirection: 'horizontal',
  isArrowButtonVisible: true,
  showMoreButton: true,
};

const defaultSourceConfig: CircleStorySourceConfig = {
  source: 'playlist',
  channel: 'bJDywZ',
  playlist: 'g206q5',
};

const defaultAdConfiguration: AdConfiguration = {
  requiresAds: false,
  adsFetchTimeout: 20,
};

const CircleStoryDemo = () => {
  const navigation = useNavigation<CircleStoryDemoNavigationProp>();
  const circleStoryRef = useRef<CircleStory>(null);

  const [height, setHeight] = useState(120);
  const [enablePictureInPicture, setEnablePictureInPicture] = useState(true);
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );
  const [feedError, setFeedError] = useState<FWError | undefined>(undefined);

  const [sourceConfig, setSourceConfig] =
    useState<CircleStorySourceConfig>(defaultSourceConfig);
  const [circleStoryConfiguration, setCircleStoryConfiguration] =
    useState<CircleStoryConfiguration>(defaultCircleStoryConfiguration);
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
  const [adConfiguration] = useState<AdConfiguration>(defaultAdConfiguration);

  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Circle Story',
      headerRight: ({ tintColor }) => (
        <TouchableOpacity onPress={() => circleStoryRef.current?.refresh()}>
          <Ionicons name="refresh-sharp" size={24} color={tintColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderSourceInfo = () => {
    const rows: { label: string; value: string }[] = [
      {
        label: 'Source',
        value: sourceDisplayNames[sourceConfig.source] || sourceConfig.source,
      },
    ];
    if (sourceConfig.channel) {
      rows.push({ label: 'Channel', value: sourceConfig.channel });
    }
    if (sourceConfig.playlist) {
      rows.push({ label: 'Playlist', value: sourceConfig.playlist });
    }
    if (sourceConfig.playlistGroup) {
      rows.push({
        label: 'Playlist Group',
        value: sourceConfig.playlistGroup,
      });
    }
    if (sourceConfig.dynamicContentParameters) {
      rows.push({
        label: 'Dynamic Params',
        value: JSON.stringify(sourceConfig.dynamicContentParameters),
      });
    }
    if (sourceConfig.hashtagFilterExpression) {
      rows.push({
        label: 'Hashtag Filter',
        value: sourceConfig.hashtagFilterExpression,
      });
    }
    if (sourceConfig.productIds && sourceConfig.productIds.length > 0) {
      rows.push({
        label: 'Product IDs',
        value: sourceConfig.productIds.join(', '),
      });
    }
    if (sourceConfig.contentId) {
      rows.push({ label: 'Content ID', value: sourceConfig.contentId });
    }

    return (
      <View style={styles.sourceInfoContainer}>
        {rows.map(({ label, value }) => (
          <View key={label} style={styles.sourceInfoRow}>
            <Text style={styles.sourceInfoLabel}>{label}:</Text>
            <Text
              style={[
                styles.sourceInfoValue,
                label === 'Source' && styles.sourceInfoHighlight,
              ]}
              numberOfLines={1}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.controlsContainer}>
          <Text style={styles.fieldLabel}>Height: {Math.round(height)}</Text>
          <Slider
            value={height}
            minimumValue={80}
            maximumValue={200}
            step={5}
            onValueChange={setHeight}
            thumbStyle={styles.sliderThumb}
            thumbTintColor="#2089dc"
            minimumTrackTintColor="#2089dc"
            maximumTrackTintColor="#b3b3b3"
          />

          <View style={styles.sectionSpacing} />

          <Text style={styles.sectionTitle}>Source Configuration</Text>
          {renderSourceInfo()}
          <Button
            icon={<Ionicons name="create-outline" size={18} color="white" />}
            title="  Edit Source"
            onPress={() => setShowSourceModal(true)}
            containerStyle={styles.fullWidthButton}
          />

          <View style={styles.sectionSpacing} />

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setEnablePictureInPicture(!enablePictureInPicture)}
            >
              <Ionicons
                name={
                  enablePictureInPicture ? 'checkbox-outline' : 'square-outline'
                }
                size={24}
                color="#2089dc"
              />
              <Text style={styles.checkboxLabel}>
                Enable Picture In Picture
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Circle Story Configuration</Text>
          <Button
            icon={
              <Ionicons name="color-palette-outline" size={18} color="white" />
            }
            title="  Configure Circle Story"
            onPress={() => setShowConfigModal(true)}
            containerStyle={styles.fullWidthButton}
          />

          <View style={styles.sectionSpacing} />
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Video Player Configuration</Text>
          <Button
            icon={<Ionicons name="settings-outline" size={18} color="white" />}
            title="  Configure Video Player"
            onPress={() => setShowPlayerModal(true)}
            containerStyle={styles.fullWidthButton}
          />
        </View>

        <View style={styles.thickDivider} />

        {feedError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error: {feedError.reason ?? 'Unknown error'}
            </Text>
          </View>
        )}

        <View
          style={[styles.circleStoryContainer, { height: Math.round(height) }]}
        >
          <CircleStory
            ref={circleStoryRef}
            style={styles.circleStory}
            source={sourceConfig.source}
            channel={sourceConfig.channel}
            playlist={sourceConfig.playlist}
            playlistGroup={sourceConfig.playlistGroup}
            dynamicContentParameters={sourceConfig.dynamicContentParameters}
            hashtagFilterExpression={sourceConfig.hashtagFilterExpression}
            productIds={sourceConfig.productIds}
            contentId={sourceConfig.contentId}
            enablePictureInPicture={enablePictureInPicture}
            enableSystemPictureInPicture={enableSystemPictureInPicture}
            circleStoryConfiguration={circleStoryConfiguration}
            videoPlayerConfiguration={playerConfiguration}
            adConfiguration={adConfiguration}
            onCircleStoryLoadFinished={(error?: FWError) => {
              console.log('[example] onCircleStoryLoadFinished error', error);
              setFeedError(error);
            }}
            onCircleStoryEmpty={(error?: FWError) => {
              console.log('[example] onCircleStoryEmpty error', error);
            }}
            onCircleStoryDidStartPictureInPicture={(error?: FWError) => {
              console.log(
                '[example] onCircleStoryDidStartPictureInPicture error',
                error
              );
            }}
            onCircleStoryDidStopPictureInPicture={(error?: FWError) => {
              console.log(
                '[example] onCircleStoryDidStopPictureInPicture error',
                error
              );
            }}
            onCircleStoryGetFeedId={(feedId: string) => {
              console.log('[example] onCircleStoryGetFeedId feedId', feedId);
            }}
          />
        </View>
      </ScrollView>

      <CircleStorySourceModal
        visible={showSourceModal}
        currentConfig={sourceConfig}
        onRequestClose={() => setShowSourceModal(false)}
        onSubmit={(config) => {
          setSourceConfig(config);
          setShowSourceModal(false);
        }}
      />
      <CircleStoryConfigurationModal
        visible={showConfigModal}
        configuration={circleStoryConfiguration}
        defaultConfiguration={defaultCircleStoryConfiguration}
        onRequestClose={() => setShowConfigModal(false)}
        onSubmit={(config) => {
          setCircleStoryConfiguration(config);
          setTimeout(() => setShowConfigModal(false), 0);
        }}
      />
      <PlayerConfigurationModal
        visible={showPlayerModal}
        playerConfiguration={playerConfiguration}
        defaultPlayerConfiguration={defaultPlayerConfiguration}
        onRequestClose={() => setShowPlayerModal(false)}
        onSubmit={(config) => {
          setPlayerConfiguration(config);
          setTimeout(() => setShowPlayerModal(false), 0);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  controlsContainer: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#2089dc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSpacing: {
    height: 15,
  },
  sourceInfoContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  sourceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sourceInfoLabel: {
    fontWeight: '500',
    color: '#333',
  },
  sourceInfoValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  sourceInfoHighlight: {
    color: '#2089dc',
    fontWeight: '600',
  },
  fullWidthButton: {
    marginTop: 5,
  },
  checkboxRow: {
    marginVertical: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  thickDivider: {
    height: 2,
    backgroundColor: '#ccc',
  },
  errorContainer: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  circleStoryContainer: {
    backgroundColor: '#e8e8e8',
  },
  circleStory: {
    width: '100%',
    height: '100%',
  },
});

export default CircleStoryDemo;
