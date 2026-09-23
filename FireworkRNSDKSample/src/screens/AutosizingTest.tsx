import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { VideoFeed } from 'react-native-firework-sdk';
import type { RootStackParamList } from './paramList/RootStackParamList';

/**
 * A test screen for the VideoFeed autosizing feature on iOS and Android.
 *
 * The feed is embedded in a scroll container (ScrollView / FlatList) with
 * filler blocks above and below. The grid feed should expand to its full
 * content height and the items actually on screen should autoplay as the page
 * scrolls.
 *
 * Source (channel / playlist / single content with editable ids), maxVideos,
 * and the host container are all switchable. Autosizing is always on, the mode
 * is fixed to `grid`, and autoplay is enabled by default.
 *
 * It also offers an entry to a second-level page, so the tester can check that
 * autoplay stops while the screen is covered and resumes after going back.
 */

const SOURCE_TYPES = ['channel', 'playlist', 'singleContent'] as const;
const CONTAINER_TYPES = ['ScrollView', 'FlatList'] as const;
// `24` is above the 20-video cap of an autosized grid/column feed, so it
// doubles as a check of that clamp.
const MAX_VIDEOS_OPTIONS: (number | undefined)[] = [undefined, 4, 8, 16, 24];
const MAX_VIDEOS_LABELS = ['No cap', '4', '8', '16', '24'];

type SourceType = (typeof SOURCE_TYPES)[number];
type ContainerType = (typeof CONTAINER_TYPES)[number];

const SOURCE_LABELS: Record<SourceType, string> = {
  channel: 'Channel',
  playlist: 'Playlist',
  singleContent: 'Single Content',
};

interface SourceIds {
  channelId: string;
  playlistId: string;
  contentId: string;
}

const DEFAULT_SOURCE_IDS: SourceIds = {
  channelId: 'm08mZk9',
  playlistId: 'oPNeKr',
  contentId: '5nexlb',
};

const FILLER_COLORS = [
  '#cfd8dc',
  '#ffe0b2',
  '#c8e6c9',
  '#e1bee7',
  '#b2dfdb',
  '#f0f4c3',
];

function FillerBlock({ index }: { index: number }) {
  return (
    <View
      style={[
        styles.fillerBlock,
        { backgroundColor: FILLER_COLORS[index % FILLER_COLORS.length] },
      ]}
    >
      <Text style={styles.fillerText}>{`Filler block ${index + 1}`}</Text>
    </View>
  );
}

const AutosizingTest = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [sourceIndex, setSourceIndex] = useState(1); // playlist
  const [containerIndex, setContainerIndex] = useState(0);
  const [maxVideosIndex, setMaxVideosIndex] = useState(0);

  // `draftIds` follows the text inputs; `appliedIds` is what the widget uses.
  // They are only synced when the tester taps Apply, so typing does not
  // recreate the native view on every keystroke.
  const [draftIds, setDraftIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [appliedIds, setAppliedIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [applyCount, setApplyCount] = useState(0);

  const sourceType: SourceType = SOURCE_TYPES[sourceIndex]!;
  const containerType: ContainerType = CONTAINER_TYPES[containerIndex]!;
  const maxVideos = MAX_VIDEOS_OPTIONS[maxVideosIndex];

  const channel =
    sourceType !== 'singleContent' ? appliedIds.channelId : undefined;
  const playlist =
    sourceType === 'playlist' ? appliedIds.playlistId : undefined;
  const contentId =
    sourceType === 'singleContent' ? appliedIds.contentId : undefined;

  const updateDraftId = (key: keyof SourceIds) => (value: string) => {
    setDraftIds((previous) => ({ ...previous, [key]: value }));
  };

  const applyIds = () => {
    setAppliedIds(draftIds);
    setApplyCount((previous) => previous + 1);
  };

  // Recreate the native view whenever any selection changes so the new
  // source/config takes effect from a clean state. `applyCount` is part of the
  // key so tapping Apply reloads even when the ids are unchanged.
  const componentKey = `${sourceType}_${containerType}_${maxVideos}_${channel ?? ''}_${playlist ?? ''}_${contentId ?? ''}_${applyCount}`;

  const feedComponent = useMemo(() => {
    return (
      <VideoFeed
        key={componentKey}
        // No height: the feed reports its own height while autosizing.
        style={styles.autosizedVideoFeed}
        source={sourceType}
        channel={channel}
        playlist={playlist}
        contentId={contentId}
        mode="grid"
        autosizing
        maxVideos={maxVideos}
        videoFeedConfiguration={{ enableAutoplay: true }}
      />
    );
  }, [componentKey, sourceType, channel, playlist, contentId, maxVideos]);

  const renderApplyButton = () => {
    return (
      <TouchableOpacity style={styles.applyButton} onPress={applyIds}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    );
  };

  const renderSourceInputs = () => {
    if (sourceType === 'singleContent') {
      return (
        <View style={styles.idInputRow}>
          <TextInput
            style={[styles.idInput, styles.idInputFlex]}
            value={draftIds.contentId}
            onChangeText={updateDraftId('contentId')}
            placeholder="Content ID"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {renderApplyButton()}
        </View>
      );
    }
    return (
      <View style={styles.idInputRow}>
        <TextInput
          style={[styles.idInput, styles.idInputFlex]}
          value={draftIds.channelId}
          onChangeText={updateDraftId('channelId')}
          placeholder="Channel ID"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {sourceType === 'playlist' && (
          <TextInput
            style={[styles.idInput, styles.idInputFlex]}
            value={draftIds.playlistId}
            onChangeText={updateDraftId('playlistId')}
            placeholder="Playlist ID"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {renderApplyButton()}
      </View>
    );
  };

  const scrollChildren = [
    <FillerBlock key="filler0" index={0} />,
    <FillerBlock key="filler1" index={1} />,
    <FillerBlock key="filler2" index={2} />,
    <View key="feed">{feedComponent}</View>,
    <FillerBlock key="filler3" index={3} />,
    <FillerBlock key="filler4" index={4} />,
    <FillerBlock key="filler5" index={5} />,
  ];

  const renderBody = () => {
    if (containerType === 'FlatList') {
      return (
        <FlatList
          style={styles.body}
          data={scrollChildren}
          keyExtractor={(_, index) => `item_${index}`}
          renderItem={({ item }) => item}
        />
      );
    }
    return <ScrollView style={styles.body}>{scrollChildren}</ScrollView>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <ButtonGroup
          buttons={SOURCE_TYPES.map((type) => SOURCE_LABELS[type])}
          selectedIndex={sourceIndex}
          onPress={setSourceIndex}
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonGroupText}
        />
        {renderSourceInputs()}
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Max videos</Text>
          <ButtonGroup
            buttons={MAX_VIDEOS_LABELS}
            selectedIndex={maxVideosIndex}
            onPress={setMaxVideosIndex}
            containerStyle={styles.inlineButtonGroup}
            textStyle={styles.buttonGroupText}
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Container</Text>
          <ButtonGroup
            buttons={[...CONTAINER_TYPES]}
            selectedIndex={containerIndex}
            onPress={setContainerIndex}
            containerStyle={styles.inlineButtonGroup}
            textStyle={styles.buttonGroupText}
          />
        </View>
        <TouchableOpacity
          style={styles.detailEntryButton}
          onPress={() => navigation.push('AutoplayTestDetail')}
        >
          <Text style={styles.detailEntryButtonText}>
            Open second-level page
          </Text>
        </TouchableOpacity>
      </View>
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  controls: {
    paddingHorizontal: 8,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cccccc',
  },
  buttonGroup: {
    height: 32,
    marginVertical: 4,
  },
  inlineButtonGroup: {
    flex: 1,
    height: 28,
    marginVertical: 2,
    marginLeft: 8,
  },
  buttonGroupText: {
    fontSize: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  optionLabel: {
    fontSize: 13,
    width: 110,
  },
  idInput: {
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999999',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginVertical: 4,
    fontSize: 13,
  },
  idInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idInputFlex: {
    flex: 1,
  },
  applyButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2089dc',
  },
  applyButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  detailEntryButton: {
    height: 32,
    borderRadius: 6,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#2089dc',
  },
  detailEntryButtonText: {
    fontSize: 13,
    color: '#2089dc',
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  autosizedVideoFeed: {
    width: '100%',
  },
  fillerBlock: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillerText: {
    fontSize: 16,
    color: '#555555',
  },
});

export default AutosizingTest;
