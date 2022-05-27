import React from 'react';

import { WebView } from 'react-native-webview';

import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import type { NativeContainerParamList } from './paramList/NativeContainerParamList';

type CTALinkContentScreenRouteProp = RouteProp<
  NativeContainerParamList,
  'CTALinkContent'
>;

const CTALinkContent = () => {
  const route = useRoute<CTALinkContentScreenRouteProp>();
  const url = route.params?.url ?? '';

  return <WebView mediaPlaybackRequiresUserAction source={{ uri: url }} />;
};

export default CTALinkContent;
