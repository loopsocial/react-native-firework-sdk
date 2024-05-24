import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import FWExampleLoggerUtil from '../utils/FWExampleLoggerUtil';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './paramList/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const Log = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setMessages(FWExampleLoggerUtil.getMessages());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              FWExampleLoggerUtil.clearMessages();
              setMessages(FWExampleLoggerUtil.getMessages());
              Alert.alert('Removed logs!');
            }}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="trash-outline" size={24} color={tintColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(messages.join('\n\n')); // Copy all logs to clipboard
              Alert.alert('Copied to Clipboard!');
            }}
          >
            <Ionicons name="clipboard-outline" size={24} color={tintColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [messages, navigation]);

  const handleLongPress = (item: string) => {
    Alert.alert(
      'Copy Text',
      'Do you want to copy this text?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Copy', onPress: () => Clipboard.setString(item) },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)}>
      <Text style={{ padding: 10 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Log;
