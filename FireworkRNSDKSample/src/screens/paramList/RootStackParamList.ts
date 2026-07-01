import type {
  PlayerDeckSource,
  PlayerHandler,
  StoryBlockSource,
  VideoFeedSource,
} from 'react-native-firework-sdk';

export type RootStackParamList = {
  Tab: undefined;
  OpenVideo: undefined;
  OpenVideoWithSource: undefined;
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
    playerHandler?: PlayerHandler;
  };
  CircleStoryDemo: undefined;
  CircleThumbnails: undefined;
  EnablePausePlayer: undefined;
  EnableLinkInteractionClickCallback: undefined;
  EnableProductDetailsHydration: undefined;
  PreventPipOnLeave: undefined;
  VideoFeedAndStoryBlock: undefined;
  Log: undefined;
  ListViewFeeds: undefined;
  PlayerDeckDemo: {
    source?: PlayerDeckSource;
    channel?: string;
    playlist?: string;
    playlistGroup?: string;
    dynamicContentParameters?: { [key: string]: string[] };
    hashtagFilterExpression?: string;
    productIds?: string[];
    contentId?: string;
  };
  More: undefined;
};
