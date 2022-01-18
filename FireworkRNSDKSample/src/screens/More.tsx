import React from 'react';
import { ListItem } from 'react-native-elements';
import {
  View,
  ScrollView,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabParamsList } from './paramList/TabParamsList';
import {
  useNavigation,
} from '@react-navigation/native';
import type {
  CompositeNavigationProp,
} from '@react-navigation/native';
import type { RootStackParamList } from './paramList/RootStackParamList';

type MoreScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'More'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MoreListItemData {
  title: string;
  pressCallback: (event: GestureResponderEvent) => void;
}

function More() {
  const navigation = useNavigation<MoreScreenNavigationProp>();

  const dataList: MoreListItemData[] = [
    {
      title: 'Open VideoURL',
      pressCallback: (_) => {
        navigation.push('OpenVideo');
      },
    },
    {
      title: 'Set ShareBaseURL',
      pressCallback: (_) => {
        navigation.push('SetShareBaseURL');
      },
    },
  ];
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dataList.map((data) => (
          <ListItem
            key={data.title}
            bottomDivider
            onPress={data.pressCallback}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <ListItem.Content>
              <ListItem.Title>{data.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingVertical: 0,
  },
});

export default More;
