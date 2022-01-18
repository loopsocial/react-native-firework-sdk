export type RootStackParamList = {
  Tab: undefined;
  OpenVideo: undefined;
  Feed: {
    source?: 'discover' | 'channel' | 'playlist';
    channel?: string;
    playlist?: string;
  };
  SetShareBaseURL: undefined;
  Checkout: undefined;
};
