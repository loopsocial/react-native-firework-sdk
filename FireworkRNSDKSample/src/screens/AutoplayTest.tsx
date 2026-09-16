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
import { PlayerDeck, StoryBlock, VideoFeed } from 'react-native-firework-sdk';
import type { RootStackParamList } from './paramList/RootStackParamList';

/**
 * A test screen for widget autoplay behavior.
 *
 * Lets the tester switch between component types (VideoFeed / PlayerDeck /
 * StoryBlock), content sources (playlist / singleContent), and host scroll
 * containers (none / ScrollView / FlatList) to verify that autoplay starts
 * and stops correctly as the widget scrolls in and out of the viewport.
 *
 * It also offers an entry to a second-level page, so the tester can check that
 * autoplay stops while the screen is covered and resumes after going back.
 */

const COMPONENT_TYPES = ['VideoFeed', 'PlayerDeck', 'StoryBlock'] as const;
const SOURCE_TYPES = ['playlist', 'singleContent'] as const;
const CONTAINER_TYPES = ['None', 'ScrollView', 'FlatList'] as const;

type ComponentType = (typeof COMPONENT_TYPES)[number];
type SourceType = (typeof SOURCE_TYPES)[number];
type ContainerType = (typeof CONTAINER_TYPES)[number];

const SOURCE_LABELS: Record<SourceType, string> = {
  playlist: 'Playlist',
  singleContent: 'Single Content',
};

interface SourceIds {
  playlistChannelId: string;
  playlistId: string;
  contentId: string;
}

const DEFAULT_SOURCE_IDS: SourceIds = {
  playlistChannelId: 'V3Wyyr4',
  playlistId: 'o8Nayj',
  contentId: 'gwkaR1',
};

const FILLER_COLORS = ['#cfd8dc', '#ffe0b2', '#c8e6c9', '#e1bee7', '#b2dfdb'];

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

const AutoplayTest = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [componentIndex, setComponentIndex] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [containerIndex, setContainerIndex] = useState(1);

  // `draftIds` follows the text inputs; `appliedIds` is what the widget uses.
  // They are only synced when the tester taps Apply, so typing does not
  // recreate the native view on every keystroke.
  const [draftIds, setDraftIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [appliedIds, setAppliedIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [applyCount, setApplyCount] = useState(0);

  const componentType: ComponentType = COMPONENT_TYPES[componentIndex]!;
  const sourceType: SourceType = SOURCE_TYPES[sourceIndex]!;
  const containerType: ContainerType = CONTAINER_TYPES[containerIndex]!;

  const channel =
    sourceType === 'playlist' ? appliedIds.playlistChannelId : undefined;
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
  const componentKey = `${componentType}_${sourceType}_${containerType}_${channel ?? ''}_${playlist ?? ''}_${contentId ?? ''}_${applyCount}`;

  const feedComponent = useMemo(() => {
    switch (componentType) {
      case 'VideoFeed':
        return (
          <VideoFeed
            key={componentKey}
            style={styles.videoFeed}
            source={sourceType}
            channel={channel}
            playlist={playlist}
            contentId={contentId}
            videoFeedConfiguration={{ enableAutoplay: true }}
          />
        );
      case 'PlayerDeck':
        return (
          <PlayerDeck
            key={componentKey}
            style={styles.playerDeck}
            source={sourceType}
            channel={channel}
            playlist={playlist}
            contentId={contentId}
          />
        );
      case 'StoryBlock':
        return (
          <StoryBlock
            key={componentKey}
            style={styles.storyBlock}
            source={sourceType}
            channel={channel}
            playlist={playlist}
            contentId={contentId}
          />
        );
    }
  }, [componentKey, componentType, sourceType, channel, playlist, contentId]);

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
          value={draftIds.playlistChannelId}
          onChangeText={updateDraftId('playlistChannelId')}
          placeholder="Channel ID"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[styles.idInput, styles.idInputFlex]}
          value={draftIds.playlistId}
          onChangeText={updateDraftId('playlistId')}
          placeholder="Playlist ID"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {renderApplyButton()}
      </View>
    );
  };

  const renderDetailEntry = () => {
    return (
      <TouchableOpacity
        style={styles.detailEntryButton}
        onPress={() => navigation.push('AutoplayTestDetail')}
      >
        <Text style={styles.detailEntryButtonText}>Open second-level page</Text>
      </TouchableOpacity>
    );
  };

  const renderApplyButton = () => {
    return (
      <TouchableOpacity style={styles.applyButton} onPress={applyIds}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    );
  };

  const scrollChildren = [
    <FillerBlock key="filler0" index={0} />,
    <FillerBlock key="filler1" index={1} />,
    <FillerBlock key="filler2" index={2} />,
    <View key="feed">{feedComponent}</View>,
    <FillerBlock key="filler3" index={3} />,
    <FillerBlock key="filler4" index={4} />,
  ];

  const renderBody = () => {
    switch (containerType) {
      case 'None':
        return (
          <View style={styles.body}>
            <FillerBlock index={0} />
            {feedComponent}
            <FillerBlock index={1} />
          </View>
        );
      case 'ScrollView':
        return <ScrollView style={styles.body}>{scrollChildren}</ScrollView>;
      case 'FlatList':
        return (
          <FlatList
            style={styles.body}
            data={scrollChildren}
            keyExtractor={(_, index) => `item_${index}`}
            renderItem={({ item }) => item}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <ButtonGroup
          buttons={[...COMPONENT_TYPES]}
          selectedIndex={componentIndex}
          onPress={setComponentIndex}
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonGroupText}
        />
        <ButtonGroup
          buttons={SOURCE_TYPES.map((type) => SOURCE_LABELS[type])}
          selectedIndex={sourceIndex}
          onPress={setSourceIndex}
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonGroupText}
        />
        <ButtonGroup
          buttons={[...CONTAINER_TYPES]}
          selectedIndex={containerIndex}
          onPress={setContainerIndex}
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonGroupText}
        />
        {renderSourceInputs()}
        {renderDetailEntry()}
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
  buttonGroupText: {
    fontSize: 12,
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
  detailEntryButton: {
    height: 36,
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
  applyButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  videoFeed: {
    height: 220,
  },
  playerDeck: {
    height: 420,
  },
  storyBlock: {
    height: 420,
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

export default AutoplayTest;
