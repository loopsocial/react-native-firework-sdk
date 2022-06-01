import type { VideoFeedSource } from 'react-native-firework-sdk';

export type RootStackParamList = {
  Tab: undefined;
  OpenVideo: undefined;
  Feed: {
    source?: VideoFeedSource;
    channel?: string;
    playlist?: string;
    playlistGroup?: string;
    dynamicContentParameters?: { [key: string]: string[] };
  };
  SetShareBaseURL: undefined;
  Cart: undefined;
  Checkout: undefined;
  SetAdBadgeConfiguration: undefined;
  EnableCustomCTAClickCallback: undefined;
  EnableCustomCTALinkContentPageRouteName: undefined;
  CTALinkContent: {
    url: string;
  };
};
