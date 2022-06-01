import React from 'react';

import { WebView } from 'react-native-webview';

import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import type { RootStackParamList } from './paramList/RootStackParamList';

type CTALinkContentScreenRouteProp = RouteProp<
  RootStackParamList,
  'CTALinkContent'
>;

const CTALinkContent = () => {
  const route = useRoute<CTALinkContentScreenRouteProp>();
  const url = route.params?.url ?? '';
  console.log('CTALinkContent url', url);

  return <WebView mediaPlaybackRequiresUserAction source={{ uri: url }} />;
};

export default CTALinkContent;
