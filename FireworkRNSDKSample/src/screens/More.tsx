import React, { useEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import {
  View,
  ScrollView,
  StyleSheet,
  GestureResponderEvent,
  I18nManager,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabParamsList } from './paramList/TabParamsList';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './paramList/RootStackParamList';
import { useActionSheet } from '@expo/react-native-action-sheet';
import RNRestart from 'react-native-restart';
import FireworkSDK from 'react-native-firework-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';

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
  const [currentDisplayLanguage, setCurrentDisplayLanguage] = useState<
    string | null
  >(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const getDisplayLanguage = (language: string) => {
    if (language === 'ar') {
      return 'Arabic';
    }

    if (language === 'en') {
      return 'English';
    }

    if (language === 'ja-JP') {
      return 'Japanese';
    }

    if (language === 'pt-BR') {
      return 'Portuguese (Brazil)';
    }

    return 'System';
  };
  const handleChangeAppLanguage = async (language: string) => {
    try {
      if (language === 'system') {
        await AsyncStorage.removeItem(StorageKey.appLanguage);
      } else {
        await AsyncStorage.setItem(StorageKey.appLanguage, language);
      }

      setCurrentDisplayLanguage(getDisplayLanguage(language));
      if (language === 'system') {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(false);
      } else if (language.startsWith('ar')) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      } else {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      }

      await FireworkSDK.getInstance().changeAppLanguage(
        language === 'system' ? null : language
      );
      RNRestart.Restart();
    } catch (e) {
      console.log('handleChangeAppLanguage e', e);
    }
  };
  const dataList: MoreListItemData[] = [
    {
      title: 'Open Video URL',
      pressCallback: (_) => {
        navigation.push('OpenVideo');
      },
    },
    {
      title: 'Set Share Base URL',
      pressCallback: (_) => {
        navigation.push('SetShareBaseURL');
      },
    },
    {
      title: 'Set Ad Badge Configuration',
      pressCallback: (_) => {
        navigation.push('SetAdBadgeConfiguration');
      },
    },
    {
      title: 'Enable Custom CTA Click Callback',
      pressCallback: (_) => {
        navigation.push('EnableCustomCTAClickCallback');
      },
    },
    {
      title: 'Enable Custom CTA Link Content Page Route Name',
      pressCallback: (_) => {
        navigation.push('EnableCustomCTALinkContentPageRouteName');
      },
    },
    {
      title: 'Circle Thumbnails(iOS)',
      pressCallback: (_) => {
        navigation.push('CircleThumbnails');
      },
    },
    {
      title: 'Enable Custom Click Cart Icon Callback',
      pressCallback: (_) => {
        navigation.push('EnableCustomClickCartIconCallback');
      },
    },
    {
      title: currentDisplayLanguage
        ? `App Language(${currentDisplayLanguage})`
        : 'App Language',
      pressCallback: (_) => {
        const options = [
          'English',
          'Arabic',
          'Japanese',
          'Portuguese (Brazil)',
          'System',
          'Cancel',
        ];
        const languageCodeList = ['en', 'ar', 'ja', 'pt-BR', 'system'];

        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
          {
            title: 'Change App language',
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            if (
              typeof buttonIndex === 'number' &&
              buttonIndex < languageCodeList.length &&
              buttonIndex < options.length
            ) {
              handleChangeAppLanguage(languageCodeList[buttonIndex]);
            }
          }
        );
      },
    },
    {
      title: 'Stop Floating Player',
      pressCallback: (_) => {
        FireworkSDK.getInstance().navigator.stopFloatingPlayer();
      },
    },
  ];

  useEffect(() => {
    const sycnCurrentDisplayLanguageFromStorage = async () => {
      try {
        const language = await AsyncStorage.getItem(StorageKey.appLanguage);
        setCurrentDisplayLanguage(getDisplayLanguage(language ?? ''));
      } catch (_) {}
    };

    sycnCurrentDisplayLanguageFromStorage();
  }, []);
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
