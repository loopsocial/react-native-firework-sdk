import React from 'react';

import { StyleSheet } from 'react-native';
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

  return <WebView source={{ uri: url }}></WebView>;
};

export default CTALinkContent;

const styles = StyleSheet.create({});
