import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { Button, Input } from 'react-native-elements';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { VideoFeedSource } from 'react-native-firework-sdk';

const sourceTypes: VideoFeedSource[] = [
  'discover',
  'channel',
  'playlist',
  'playlistGroup',
  'dynamicContent',
  'hashtagPlaylist',
  'sku',
  'singleContent',
];

const sourceDisplayNames: Record<VideoFeedSource, string> = {
  discover: 'Discover',
  channel: 'Channel',
  playlist: 'Playlist',
  playlistGroup: 'Playlist Group',
  dynamicContent: 'Dynamic Content',
  hashtagPlaylist: 'Hashtag Playlist',
  sku: 'SKU',
  singleContent: 'Single Content',
};

const defaults = {
  channel: 'bJDywZ',
  playlistId: 'g206q5',
  playlistGroupId: '9glb5G',
  dynamicChannelId: '23LBMWN',
  dynamicKey: 'category',
  dynamicValues: 'dessert',
  hashtagChannelId: 'BKQlqD',
  hashtagExpression: 'powder',
};

export interface CircleStorySourceConfig {
  source: VideoFeedSource;
  channel?: string;
  playlist?: string;
  playlistGroup?: string;
  dynamicContentParameters?: { [key: string]: string[] };
  hashtagFilterExpression?: string;
  productIds?: string[];
  contentId?: string;
}

export interface ICircleStorySourceModalProps {
  visible: boolean;
  currentConfig: CircleStorySourceConfig;
  onRequestClose: () => void;
  onSubmit: (config: CircleStorySourceConfig) => void;
}

const CircleStorySourceModal = ({
  visible,
  currentConfig,
  onRequestClose,
  onSubmit,
}: ICircleStorySourceModalProps) => {
  const [selectedSource, setSelectedSource] = useState<VideoFeedSource>(
    currentConfig.source
  );
  const [channelId, setChannelId] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [playlistGroupId, setPlaylistGroupId] = useState('');
  const [dynamicKey, setDynamicKey] = useState('');
  const [dynamicValues, setDynamicValues] = useState('');
  const [hashtagExpression, setHashtagExpression] = useState('');
  const [productIds, setProductIds] = useState('');
  const [contentId, setContentId] = useState('');

  const applyDefaultsForSource = useCallback((source: VideoFeedSource) => {
    switch (source) {
      case 'channel':
        setChannelId(defaults.channel);
        break;
      case 'playlist':
        setChannelId(defaults.channel);
        setPlaylistId(defaults.playlistId);
        break;
      case 'playlistGroup':
        setPlaylistGroupId(defaults.playlistGroupId);
        break;
      case 'dynamicContent':
        setChannelId(defaults.dynamicChannelId);
        setDynamicKey(defaults.dynamicKey);
        setDynamicValues(defaults.dynamicValues);
        break;
      case 'hashtagPlaylist':
        setChannelId(defaults.hashtagChannelId);
        setHashtagExpression(defaults.hashtagExpression);
        break;
      case 'sku':
        setChannelId('');
        setProductIds('');
        break;
      case 'singleContent':
        setContentId('');
        break;
      default:
        break;
    }
  }, []);

  const syncFromConfig = useCallback((config: CircleStorySourceConfig) => {
    setSelectedSource(config.source);
    switch (config.source) {
      case 'channel':
        setChannelId(config.channel || defaults.channel);
        break;
      case 'playlist':
        setChannelId(config.channel || defaults.channel);
        setPlaylistId(config.playlist || defaults.playlistId);
        break;
      case 'playlistGroup':
        setPlaylistGroupId(config.playlistGroup || defaults.playlistGroupId);
        break;
      case 'dynamicContent':
        if (config.dynamicContentParameters) {
          const entries = Object.entries(config.dynamicContentParameters);
          if (entries.length > 0) {
            setChannelId(config.channel || defaults.dynamicChannelId);
            setDynamicKey(entries[0]![0]);
            setDynamicValues(entries[0]![1].join(', '));
          }
        } else {
          setChannelId(defaults.dynamicChannelId);
          setDynamicKey(defaults.dynamicKey);
          setDynamicValues(defaults.dynamicValues);
        }
        break;
      case 'hashtagPlaylist':
        setChannelId(config.channel || defaults.hashtagChannelId);
        setHashtagExpression(
          config.hashtagFilterExpression || defaults.hashtagExpression
        );
        break;
      case 'sku':
        setChannelId(config.channel || '');
        setProductIds(config.productIds?.join(', ') || '');
        break;
      case 'singleContent':
        setContentId(config.contentId || '');
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (visible) {
      syncFromConfig(currentConfig);
    }
  }, [visible, currentConfig, syncFromConfig]);

  const buildResult = (): CircleStorySourceConfig => {
    const result: CircleStorySourceConfig = { source: selectedSource };

    switch (selectedSource) {
      case 'channel':
        result.channel = channelId;
        break;
      case 'playlist':
        result.channel = channelId;
        result.playlist = playlistId;
        break;
      case 'playlistGroup':
        result.playlistGroup = playlistGroupId;
        break;
      case 'dynamicContent':
        result.channel = channelId;
        result.dynamicContentParameters = {
          [dynamicKey]: dynamicValues
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        };
        break;
      case 'hashtagPlaylist':
        result.channel = channelId;
        result.hashtagFilterExpression = hashtagExpression;
        break;
      case 'sku':
        result.channel = channelId;
        result.productIds = productIds
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        break;
      case 'singleContent':
        result.contentId = contentId;
        break;
      default:
        break;
    }

    return result;
  };

  const renderSourceSelector = () => (
    <View style={styles.sourceSelectorContainer}>
      <Text style={styles.fieldLabel}>Source Type</Text>
      <View style={styles.sourceGrid}>
        {sourceTypes.map((source) => (
          <TouchableOpacity
            key={source}
            style={[
              styles.sourceChip,
              selectedSource === source && styles.sourceChipSelected,
            ]}
            onPress={() => {
              setSelectedSource(source);
              applyDefaultsForSource(source);
            }}
          >
            <Text
              style={[
                styles.sourceChipText,
                selectedSource === source && styles.sourceChipTextSelected,
              ]}
            >
              {sourceDisplayNames[source]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFieldsForSource = () => {
    switch (selectedSource) {
      case 'discover':
        return null;
      case 'channel':
        return (
          <Input
            label="Channel ID"
            placeholder="Enter channel ID"
            value={channelId}
            onChangeText={setChannelId}
            rightIcon={
              <TouchableOpacity onPress={() => setChannelId('')}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        );
      case 'playlist':
        return (
          <>
            <Input
              label="Channel ID"
              placeholder="Enter channel ID"
              value={channelId}
              onChangeText={setChannelId}
              rightIcon={
                <TouchableOpacity onPress={() => setChannelId('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
            <Input
              label="Playlist ID"
              placeholder="Enter playlist ID"
              value={playlistId}
              onChangeText={setPlaylistId}
              rightIcon={
                <TouchableOpacity onPress={() => setPlaylistId('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          </>
        );
      case 'playlistGroup':
        return (
          <Input
            label="Playlist Group ID"
            placeholder="Enter playlist group ID"
            value={playlistGroupId}
            onChangeText={setPlaylistGroupId}
            rightIcon={
              <TouchableOpacity onPress={() => setPlaylistGroupId('')}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        );
      case 'dynamicContent':
        return (
          <>
            <Input
              label="Channel ID"
              placeholder="Enter channel ID"
              value={channelId}
              onChangeText={setChannelId}
              rightIcon={
                <TouchableOpacity onPress={() => setChannelId('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
            <Input
              label="Parameter Key"
              placeholder="e.g. category"
              value={dynamicKey}
              onChangeText={setDynamicKey}
              rightIcon={
                <TouchableOpacity onPress={() => setDynamicKey('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
            <Input
              label="Parameter Values (comma separated)"
              placeholder="e.g. sports,news"
              value={dynamicValues}
              onChangeText={setDynamicValues}
              rightIcon={
                <TouchableOpacity onPress={() => setDynamicValues('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          </>
        );
      case 'hashtagPlaylist':
        return (
          <>
            <Input
              label="Channel ID"
              placeholder="Enter channel ID"
              value={channelId}
              onChangeText={setChannelId}
              rightIcon={
                <TouchableOpacity onPress={() => setChannelId('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
            <Input
              label="Hashtag Filter Expression"
              placeholder="e.g. powder"
              value={hashtagExpression}
              onChangeText={setHashtagExpression}
              rightIcon={
                <TouchableOpacity onPress={() => setHashtagExpression('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          </>
        );
      case 'sku':
        return (
          <>
            <Input
              label="Channel ID"
              placeholder="Enter channel ID"
              value={channelId}
              onChangeText={setChannelId}
              rightIcon={
                <TouchableOpacity onPress={() => setChannelId('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
            <Input
              label="Product IDs (comma separated)"
              placeholder="e.g. sku1,sku2,sku3"
              value={productIds}
              onChangeText={setProductIds}
              rightIcon={
                <TouchableOpacity onPress={() => setProductIds('')}>
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          </>
        );
      case 'singleContent':
        return (
          <Input
            label="Content ID"
            placeholder="Enter content ID"
            value={contentId}
            onChangeText={setContentId}
            rightIcon={
              <TouchableOpacity onPress={() => setContentId('')}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View
            style={{
              ...CommonStyles.formContainer,
              ...styles.formContainerExtra,
            }}
          >
            <ScrollView>
              <Text style={styles.sectionTitle}>Circle Story Source</Text>
              <Text style={styles.sectionSubtitle}>
                Select a source type and fill in the required parameters.
              </Text>
              {renderSourceSelector()}
              <View style={styles.fieldsContainer}>
                {renderFieldsForSource()}
              </View>
              <View style={{ ...CommonStyles.formItem, ...styles.buttonList }}>
                <Button
                  type="outline"
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                    marginRight: 20,
                  }}
                  onPress={onRequestClose}
                  title="Cancel"
                />
                <Button
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                  }}
                  onPress={() => onSubmit(buildResult())}
                  title="Use"
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  formContainerExtra: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#86939e',
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#86939e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sourceSelectorContainer: {
    marginBottom: 20,
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  sourceChipSelected: {
    backgroundColor: '#2089dc',
    borderColor: '#2089dc',
  },
  sourceChipText: {
    fontSize: 13,
    color: '#333',
  },
  sourceChipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    marginBottom: 10,
  },
  buttonList: {
    flexDirection: 'row',
  },
});

export default CircleStorySourceModal;
