import type {
  StoryBlockSource,
  VideoFeedSource,
} from 'react-native-firework-sdk';

export type RootStackParamList = {
  Tab: undefined;
  OpenVideo: undefined;
  SetShareBaseURL: undefined;
  Feed: {
    source?: VideoFeedSource | StoryBlockSource;
    channel?: string;
    playlist?: string;
    playlistGroup?: string;
    dynamicContentParameters?: { [key: string]: string[] };
    hashtagFilterExpression?: string;
    productIds?: string[];
    contentId?: string;
  };
  Cart: undefined;
  Checkout: undefined;
  SetAdBadgeConfiguration: undefined;
  EnableCustomCTAClickCallback: undefined;
  LinkContent: {
    url: string;
    isFromNativeNavigation?: boolean;
  };
  CircleThumbnails: undefined;
  EnablePushingRNContainer: undefined;
  EnableNativeNavigation: undefined;
  EnablePausePlayer: undefined;
};
