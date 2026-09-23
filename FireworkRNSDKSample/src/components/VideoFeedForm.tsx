import CommonStyles from './CommonStyles';
import { Button, ButtonGroup } from 'react-native-elements';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';
import type { VideoFeedMode } from 'react-native-firework-sdk';

/** Host scroll container used by the autosizing example. */
export type AutosizingContainer = 'ScrollView' | 'FlatList';

/**
 * `maxVideos` presets. `50` is above the 20-video cap the SDK applies to an
 * autosized grid/column feed, so it doubles as a check of that clamp.
 */
const MAX_VIDEOS_OPTIONS: (number | undefined)[] = [undefined, 6, 50];
const MAX_VIDEOS_LABELS = ['No cap', '6', '50'];
const AUTOSIZING_CONTAINERS: AutosizingContainer[] = ['ScrollView', 'FlatList'];

export interface VideoFeedFormProps {
  mode: VideoFeedMode;
  autosizing: boolean;
  autosizingContainer: AutosizingContainer;
  maxVideos?: number;
  onChangeMode?: (mode: VideoFeedMode) => void;
  onChangeAutosizing?: (autosizing: boolean) => void;
  onChangeAutosizingContainer?: (container: AutosizingContainer) => void;
  onChangeMaxVideos?: (maxVideos?: number) => void;
  onGoToFeedConfiguration?: () => void;
  onGoToPlayerConfiguration?: () => void;
}

const VideoFeedForm = ({
  mode,
  autosizing,
  autosizingContainer,
  maxVideos,
  onChangeMode,
  onChangeAutosizing,
  onChangeAutosizingContainer,
  onChangeMaxVideos,
  onGoToFeedConfiguration,
  onGoToPlayerConfiguration,
}: VideoFeedFormProps) => {
  const modeList = ['row', 'column', 'grid'];
  const modelIndex = modeList.indexOf(mode);
  const maxVideosIndex = MAX_VIDEOS_OPTIONS.indexOf(maxVideos);
  const autosizingContainerIndex =
    AUTOSIZING_CONTAINERS.indexOf(autosizingContainer);
  // Android autosizes a grid feed only; iOS also handles row and column.
  const autosizingSupported = Platform.OS !== 'android' || mode === 'grid';
  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>Mode</Text>
        <ButtonGroup
          buttons={modeList}
          selectedIndex={modelIndex}
          onPress={(value) => {
            if (onChangeMode) {
              onChangeMode(modeList[value] as VideoFeedMode);
            }
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <View style={styles.switchRow}>
          <Text style={CommonStyles.formItemTitle}>
            Autosizing{Platform.OS === 'android' ? ' (grid only)' : ''}
          </Text>
          <Switch
            value={autosizing && autosizingSupported}
            disabled={!autosizingSupported}
            onValueChange={(value) => {
              if (onChangeAutosizing) {
                onChangeAutosizing(value);
              }
            }}
          />
        </View>
        {autosizing && autosizingSupported && (
          <ButtonGroup
            buttons={AUTOSIZING_CONTAINERS}
            selectedIndex={autosizingContainerIndex}
            onPress={(value) => {
              if (onChangeAutosizingContainer) {
                onChangeAutosizingContainer(AUTOSIZING_CONTAINERS[value]!);
              }
            }}
          />
        )}
      </View>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>
          Max videos{Platform.OS === 'android' ? ' (autosized grid only)' : ''}
        </Text>
        <ButtonGroup
          buttons={MAX_VIDEOS_LABELS}
          selectedIndex={maxVideosIndex}
          onPress={(value) => {
            if (onChangeMaxVideos) {
              onChangeMaxVideos(MAX_VIDEOS_OPTIONS[value]);
            }
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <View style={styles.buttonList}>
          <Button
            titleStyle={CommonStyles.mainButtonText}
            containerStyle={{
              ...CommonStyles.mainButtonContainer,
              flex: 1,
              marginRight: 20,
            }}
            onPress={() => {
              if (onGoToFeedConfiguration) {
                onGoToFeedConfiguration();
              }
            }}
            title="Feed Configuration"
          />
          <Button
            titleStyle={CommonStyles.mainButtonText}
            containerStyle={{
              ...CommonStyles.mainButtonContainer,
              flex: 1,
            }}
            onPress={() => {
              if (onGoToPlayerConfiguration) {
                onGoToPlayerConfiguration();
              }
            }}
            title="Player Configuration"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default VideoFeedForm;
