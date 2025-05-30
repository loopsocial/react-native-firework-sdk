import { WebView } from 'react-native-webview';

import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import type { RootStackParamList } from './paramList/RootStackParamList';

type LinkContentScreenRouteProp = RouteProp<RootStackParamList, 'LinkContent'>;

const LinkContent = () => {
  const route = useRoute<LinkContentScreenRouteProp>();
  const url = route.params?.url ?? '';
  console.log('LinkContent url', url);

  return <WebView mediaPlaybackRequiresUserAction source={{ uri: url }} />;
};

export default LinkContent;
