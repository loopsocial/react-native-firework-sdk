import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import FireworkSDK, {
  PlayerDeck,
  VideoFeed,
  type VideoPlaybackDetails,
  type VideoPlaybackEvent,
} from 'react-native-firework-sdk';

/**
 * A test screen for the videos-loaded callbacks and the `hashtags` field of
 * `VideoPlaybackDetails` (iOS).
 *
 * It renders a VideoFeed or PlayerDeck from a playlist and records every
 * `onVideoFeedVideosLoaded` / `onPlayerDeckVideosLoaded` batch on screen, so
 * the tester can confirm that the callback fires once for the initial page and
 * again for each load-more page, delivering only that page's videos. Every
 * video row also shows its hashtags.
 *
 * While the screen is mounted it additionally hooks `onVideoPlayback` and
 * shows the latest playback event together with the video's hashtags, to
 * verify that the field arrives on the playback event paths as well. The
 * previous handler is restored when leaving the screen.
 */

const COMPONENT_TYPES = ['VideoFeed', 'PlayerDeck'] as const;

type ComponentType = (typeof COMPONENT_TYPES)[number];

interface SourceIds {
  channelId: string;
  playlistId: string;
}

const DEFAULT_SOURCE_IDS: SourceIds = {
  channelId: 'V3Wyyr4',
  playlistId: 'o8Nayj',
};

interface LoadedBatch {
  /** 1-based order in which the batch was received for the current widget. */
  index: number;
  receivedAt: string;
  videos: VideoPlaybackDetails[];
}

interface PlaybackSummary {
  eventName: string;
  videoId: string;
  hashtags: string[];
  receivedAt: string;
}

function formatHashtags(hashtags?: string[] | null): string {
  if (!hashtags || hashtags.length === 0) {
    return '(none)';
  }
  return hashtags.map((hashtag) => `#${hashtag}`).join(' ');
}

function currentTime(): string {
  return new Date().toLocaleTimeString();
}

const VideosLoadedTest = () => {
  const [componentIndex, setComponentIndex] = useState(0);

  // `draftIds` follows the text inputs; `appliedIds` is what the widget uses.
  // They are only synced when the tester taps Apply, so typing does not
  // recreate the native view on every keystroke.
  const [draftIds, setDraftIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [appliedIds, setAppliedIds] = useState<SourceIds>(DEFAULT_SOURCE_IDS);
  const [applyCount, setApplyCount] = useState(0);

  const [batches, setBatches] = useState<LoadedBatch[]>([]);
  const [lastPlayback, setLastPlayback] = useState<PlaybackSummary>();

  const componentType: ComponentType = COMPONENT_TYPES[componentIndex]!;

  // Recreate the native view whenever the selection changes so the callback
  // sequence starts over from the initial page. `applyCount` is part of the
  // key so tapping Apply reloads even when the ids are unchanged.
  const componentKey = `${componentType}_${appliedIds.channelId}_${appliedIds.playlistId}_${applyCount}`;

  // A new widget means a new callback sequence, so drop the previous log.
  useEffect(() => {
    setBatches([]);
  }, [componentKey]);

  // Mirror the latest playback event so the tester can check `hashtags` on
  // the playback paths too (impression / start / pause / ...).
  useEffect(() => {
    const sdk = FireworkSDK.getInstance();
    const previousHandler = sdk.onVideoPlayback;
    sdk.onVideoPlayback = (event: VideoPlaybackEvent) => {
      console.log(
        `[example] onVideoPlayback ${event.eventName} videoId: ${event.info.videoId} hashtags:`,
        event.info.hashtags
      );
      setLastPlayback({
        eventName: event.eventName,
        videoId: event.info.videoId,
        hashtags: event.info.hashtags ?? [],
        receivedAt: currentTime(),
      });
      previousHandler?.(event);
    };
    return () => {
      sdk.onVideoPlayback = previousHandler;
    };
  }, []);

  const handleVideosLoaded = useCallback(
    (source: ComponentType, videos: VideoPlaybackDetails[]) => {
      console.log(
        `[example] ${source} videos loaded: ${videos.length} videos`,
        videos.map((video) => ({
          videoId: video.videoId,
          hashtags: video.hashtags,
        }))
      );
      setBatches((previous) => [
        ...previous,
        { index: previous.length + 1, receivedAt: currentTime(), videos },
      ]);
    },
    []
  );

  const updateDraftId = (key: keyof SourceIds) => (value: string) => {
    setDraftIds((previous) => ({ ...previous, [key]: value }));
  };

  const applyIds = () => {
    setAppliedIds(draftIds);
    setApplyCount((previous) => previous + 1);
  };

  const feedComponent = useMemo(() => {
    switch (componentType) {
      case 'VideoFeed':
        return (
          <VideoFeed
            key={componentKey}
            style={styles.videoFeed}
            source="playlist"
            channel={appliedIds.channelId}
            playlist={appliedIds.playlistId}
            videoFeedConfiguration={{ enableAutoplay: true }}
            onVideoFeedVideosLoaded={(videos) =>
              handleVideosLoaded('VideoFeed', videos)
            }
          />
        );
      case 'PlayerDeck':
        return (
          <PlayerDeck
            key={componentKey}
            style={styles.playerDeck}
            source="playlist"
            channel={appliedIds.channelId}
            playlist={appliedIds.playlistId}
            playerDeckConfiguration={{ autoplay: { isEnabled: true } }}
            onPlayerDeckVideosLoaded={(videos) =>
              handleVideosLoaded('PlayerDeck', videos)
            }
          />
        );
    }
  }, [componentKey, componentType, appliedIds, handleVideosLoaded]);

  const totalVideos = batches.reduce(
    (sum, batch) => sum + batch.videos.length,
    0
  );

  const renderVideo = (
    batch: LoadedBatch,
    video: VideoPlaybackDetails,
    videoIndex: number
  ) => {
    let title = video.videoId;
    if (video.videoType) {
      title += ` · ${video.videoType}`;
    }
    if (video.caption) {
      title += ` · ${video.caption}`;
    }
    return (
      <View
        key={`${batch.index}_${videoIndex}_${video.videoId}`}
        style={styles.videoRow}
      >
        <Text style={styles.videoTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.videoHashtags} numberOfLines={2}>
          {`hashtags: ${formatHashtags(video.hashtags)}`}
        </Text>
      </View>
    );
  };

  const renderBatch = (batch: LoadedBatch) => (
    <View key={`batch_${batch.index}`} style={styles.batch}>
      <Text style={styles.batchTitle}>
        {`#${batch.index} · ${batch.videos.length} videos · ${batch.receivedAt}`}
      </Text>
      {batch.videos.map((video, videoIndex) =>
        renderVideo(batch, video, videoIndex)
      )}
    </View>
  );

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
        <View style={styles.idInputRow}>
          <TextInput
            style={[styles.idInput, styles.idInputFlex]}
            value={draftIds.channelId}
            onChangeText={updateDraftId('channelId')}
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
          <TouchableOpacity style={styles.applyButton} onPress={applyIds}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {feedComponent}
      <View style={styles.playbackPanel}>
        <Text style={styles.panelTitle}>Latest playback event</Text>
        <Text style={styles.panelText} numberOfLines={2}>
          {lastPlayback
            ? `${lastPlayback.eventName} · ${lastPlayback.videoId} · ${lastPlayback.receivedAt}\nhashtags: ${formatHashtags(lastPlayback.hashtags)}`
            : 'No playback event yet. Play a video to receive one.'}
        </Text>
      </View>
      <View style={styles.logHeader}>
        <Text style={styles.panelTitle}>
          {`Videos loaded: ${batches.length} batches · ${totalVideos} videos`}
        </Text>
        <TouchableOpacity onPress={() => setBatches([])}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.log} contentContainerStyle={styles.logContent}>
        {batches.length === 0 ? (
          <Text style={styles.emptyText}>
            No callback received yet. The initial page arrives once the widget
            loads; scroll the widget to the end to load more pages, each of
            which should arrive as a separate batch.
          </Text>
        ) : (
          batches.map(renderBatch)
        )}
      </ScrollView>
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
    paddingBottom: 4,
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
  applyButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  videoFeed: {
    height: 220,
  },
  playerDeck: {
    height: 400,
  },
  playbackPanel: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#cccccc',
    backgroundColor: '#f7f7f7',
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222222',
  },
  panelText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#555555',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#cccccc',
  },
  clearButtonText: {
    fontSize: 13,
    color: '#2089dc',
    fontWeight: '600',
  },
  log: {
    flex: 1,
  },
  logContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#888888',
  },
  batch: {
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  batchTitle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2089dc',
  },
  videoRow: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  videoTitle: {
    fontSize: 12,
    color: '#222222',
  },
  videoHashtags: {
    marginTop: 2,
    fontSize: 11,
    color: '#666666',
  },
});

export default VideosLoadedTest;
