import CommonStyles from './CommonStyles';
import FireworkSDK, {
  type OpenVideoPlayerSource,
  type VideoPlayerConfiguration,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlayerConfigurationModal from './PlayerConfigurationModal';
import { useEffect, useState } from 'react';
import { Button, CheckBox, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

type SourceType = OpenVideoPlayerSource['type'];

const SOURCE_OPTIONS: { label: string; value: SourceType }[] = [
  { label: 'Channel', value: 'channel' },
  { label: 'Playlist', value: 'playlist' },
  { label: 'Dynamic Content', value: 'dynamicContent' },
  { label: 'Hashtag Playlist', value: 'hashtagPlaylist' },
  { label: 'SKU', value: 'sku' },
  { label: 'Single Content', value: 'singleContent' },
];

const SOURCE_DEFAULTS: Partial<Record<SourceType, Partial<FormData>>> = {
  channel: { channelId: 'OK1BXMy' },
  playlist: { channelId: 'OK1BXMy', playlistId: '5maAAm' },
  dynamicContent: {
    channelId: '23LBMWN',
    dynamicContentKey: 'category',
    dynamicContentValues: 'dessert',
  },
  hashtagPlaylist: { channelId: 'BKQlqD', filterExpression: 'powder' },
  sku: { channelId: 'OK1BXMy', productIds: 'yw9q6NG' },
  singleContent: { contentId: 'gwkaR1' },
};

type FormData = {
  channelId: string;
  playlistId: string;
  dynamicContentKey: string;
  dynamicContentValues: string;
  filterExpression: string;
  productIds: string;
  contentId: string;
};

const EMPTY_FORM: FormData = {
  channelId: '',
  playlistId: '',
  dynamicContentKey: '',
  dynamicContentValues: '',
  filterExpression: '',
  productIds: '',
  contentId: '',
};

export function OpenVideoWithSourceForm() {
  const { showActionSheetWithOptions } = useActionSheet();
  const [selectedSource, setSelectedSource] = useState<SourceType>('channel');

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    const defaults = SOURCE_DEFAULTS[selectedSource] ?? {};
    reset({ ...EMPTY_FORM, ...defaults });
  }, [selectedSource, reset]);

  const defaultPlayerConfiguration: VideoPlayerConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
    showMuteButton: true,
    showPlaybackButton: true,
    ctaButtonStyle: {
      fontSize: 14,
      iOSFontInfo: { systemFontWeight: 'bold' },
    },
    ctaDelay: { type: 'constant', value: 3 },
    ctaHighlightDelay: { type: 'constant', value: 2 },
    ctaWidth: 'fullWidth',
    showVideoDetailTitle: true,
    videoPlayerLogoConfiguration: { option: 'disabled', isClickable: true },
  };

  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
  const [showPlayerConfiguration, setShowPlayerConfiguration] = useState(false);
  const [enablePictureInPicture, setEnablePictureInPicture] = useState(true);

  const getSourceLabel = (source: SourceType) =>
    SOURCE_OPTIONS.find((o) => o.value === source)?.label ?? source;

  const onSelectSource = () => {
    const options = [...SOURCE_OPTIONS.map((o) => o.label), 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      { title: 'Select Content Source', options, cancelButtonIndex },
      (buttonIndex) => {
        if (
          typeof buttonIndex === 'number' &&
          buttonIndex < SOURCE_OPTIONS.length
        ) {
          const newSource = SOURCE_OPTIONS[buttonIndex]!.value;
          setSelectedSource(newSource);
        }
      }
    );
  };

  const buildSource = (data: FormData): OpenVideoPlayerSource => {
    switch (selectedSource) {
      case 'channel':
        return { type: 'channel', channelId: data.channelId.trim() };
      case 'playlist':
        return {
          type: 'playlist',
          channelId: data.channelId.trim(),
          playlistId: data.playlistId.trim(),
        };
      case 'dynamicContent':
        return {
          type: 'dynamicContent',
          channelId: data.channelId.trim(),
          parameters: {
            [data.dynamicContentKey.trim()]: data.dynamicContentValues
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          },
        };
      case 'hashtagPlaylist':
        return {
          type: 'hashtagPlaylist',
          channelId: data.channelId.trim(),
          filterExpression: data.filterExpression.trim(),
        };
      case 'sku':
        return {
          type: 'sku',
          channelId: data.channelId.trim(),
          productIds: data.productIds
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        };
      case 'singleContent':
        return { type: 'singleContent', contentId: data.contentId.trim() };
    }
  };

  const onOpen = (data: FormData) => {
    FireworkSDK.getInstance().openVideoPlayerWithSource(buildSource(data), {
      ...playerConfiguration,
      enablePictureInPicture,
    });
  };

  const renderTextField = (
    name: keyof FormData,
    label: string,
    options?: {
      placeholder?: string;
      required?: boolean;
    }
  ) => (
    <View style={CommonStyles.formItem}>
      <Text style={CommonStyles.formItemTitle}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={
          options?.required ? { required: `${label} is required` } : undefined
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={options?.placeholder ?? `Enter ${label}`}
            rightIcon={
              <TouchableOpacity onPress={() => setValue(name, '')}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            errorMessage={errors[name]?.message}
            autoComplete={undefined}
          />
        )}
      />
    </View>
  );

  const renderDynamicFields = () => {
    switch (selectedSource) {
      case 'channel':
        return renderTextField('channelId', 'Channel ID', { required: true });
      case 'playlist':
        return (
          <>
            {renderTextField('channelId', 'Channel ID', { required: true })}
            {renderTextField('playlistId', 'Playlist ID', { required: true })}
          </>
        );
      case 'dynamicContent':
        return (
          <>
            {renderTextField('channelId', 'Channel ID', { required: true })}
            {renderTextField('dynamicContentKey', 'Parameter Key', {
              placeholder: 'e.g. category',
              required: true,
            })}
            {renderTextField('dynamicContentValues', 'Parameter Values', {
              placeholder: 'Comma-separated, e.g. sport,food',
              required: true,
            })}
          </>
        );
      case 'hashtagPlaylist':
        return (
          <>
            {renderTextField('channelId', 'Channel ID', { required: true })}
            {renderTextField('filterExpression', 'Hashtag Filter Expression', {
              placeholder: 'e.g. (and sport food)',
              required: true,
            })}
          </>
        );
      case 'sku':
        return (
          <>
            {renderTextField('channelId', 'Channel ID', { required: true })}
            {renderTextField('productIds', 'Product IDs', {
              placeholder: 'Comma-separated, e.g. sku1,sku2',
              required: true,
            })}
          </>
        );
      case 'singleContent':
        return renderTextField('contentId', 'Content ID', {
          required: true,
        });
      default:
        return null;
    }
  };

  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>Content Source</Text>
        <TouchableOpacity
          style={styles.sourceSelector}
          onPress={onSelectSource}
        >
          <Text style={styles.sourceSelectorText}>
            {getSourceLabel(selectedSource)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {renderDynamicFields()}

      <View style={CommonStyles.formItem}>
        <CheckBox
          title="Enable Picture In Picture"
          checked={enablePictureInPicture}
          onPress={() => setEnablePictureInPicture(!enablePictureInPicture)}
        />
      </View>

      <View style={CommonStyles.formItem}>
        <Button
          type="outline"
          titleStyle={CommonStyles.mainButtonText}
          containerStyle={{ marginBottom: 0 }}
          onPress={() => setShowPlayerConfiguration(true)}
          title="Player Configuration"
        />
      </View>

      <View style={CommonStyles.formItem}>
        <Button
          titleStyle={CommonStyles.mainButtonText}
          containerStyle={{ marginBottom: 0 }}
          onPress={handleSubmit(onOpen)}
          title="Open"
        />
      </View>

      <PlayerConfigurationModal
        visible={showPlayerConfiguration}
        playerConfiguration={playerConfiguration}
        defaultPlayerConfiguration={defaultPlayerConfiguration}
        onRequestClose={() => setShowPlayerConfiguration(false)}
        onSubmit={(newConfig) => {
          setPlayerConfiguration(newConfig);
          setTimeout(() => setShowPlayerConfiguration(false), 0);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sourceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  sourceSelectorText: {
    fontSize: 16,
    color: '#333',
  },
});
