import React, { useEffect } from 'react';

import FireworkSDK, {
  type DataTrackingLevel,
  LivestreamPlayerDesignVersion,
} from 'react-native-firework-sdk';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';
import AppTheme from './AppTheme';
import BackButton from './components/BackButton';
import {
  useCartIconVisibilityEffect,
  useCartItemCountEffect,
} from './hooks/cartHooks';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import CircleThumbnails from './screens/CircleThumbnails';
import LinkContent from './screens/LinkContent';
import EnableCustomCTAClickCallback from './screens/EnableCustomCTAClickCallback';
import Feed from './screens/Feed';
import OpenVideo from './screens/OpenVideo';
import type { RootStackParamList } from './screens/paramList/RootStackParamList';
import SetAdBadgeConfiguration from './screens/SetAdBadgeConfiguration';
import Tab from './screens/Tab';
import { store } from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from './constants/StorageKey';
import SetShareBaseURL from './screens/SetShareBaseURL';
import EnablePushingRNContainer from './screens/EnablePushingRNContainer';
import EnableNativeNavigation from './screens/EnableNativeNavigation';
import EnablePausePlayer from './screens/EnablePausePlayer';
import EnableLinkInteractionClickCallback from './screens/EnableLinkInteractionClickCallback';
import Log from './screens/Log';
import CustomThemeProvider from './components/CustomThemeProvider';

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

type AppRouteName = keyof RootStackParamList;

const FWNavigationContainer = () => {
  useCartIconVisibilityEffect();
  useCartItemCountEffect();
  useEffect(() => {
    const sycnCurrentLanguageFromStorage = async () => {
      try {
        const language = await AsyncStorage.getItem(StorageKey.appLanguage);
        FireworkSDK.getInstance().changeAppLanguage(language);
      } catch (_) {}
    };
    sycnCurrentLanguageFromStorage();

    const sycnCurrentDataTrackingLevel = async () => {
      try {
        const level = await AsyncStorage.getItem(StorageKey.dataTrackingLevel);
        if (level) {
          FireworkSDK.getInstance().dataTrackingLevel =
            level as DataTrackingLevel;
        }
      } catch (_) {}
    };

    sycnCurrentDataTrackingLevel();

    const sycnCurrentLivestreamPlayerDesignVersion = async () => {
      const version = await AsyncStorage.getItem(
        StorageKey.livestreamPlayerDesignVersion
      );
      if (version) {
        FireworkSDK.getInstance().livestreamPlayerDesignVersion =
          version as LivestreamPlayerDesignVersion;
      }
    };

    sycnCurrentLivestreamPlayerDesignVersion();
  }, []);

  const renderScreen = ({
    name,
    options,
    component,
  }: {
    name: AppRouteName;
    options?: any;
    component: React.ComponentType<any>;
  }) => {
    return (
      <StackNavigator.Screen
        name={name}
        component={component}
        options={options}
      />
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator.Navigator
        initialRouteName={'Tab'}
        screenOptions={({ route, navigation }) => ({
          animation: (route.params as any)?.isFromNativeNavigation
            ? 'none'
            : 'slide_from_right',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerBackVisible: false,
          headerLeft: ({ tintColor, canGoBack }) => {
            return (
              <BackButton
                onBack={async () => {
                  console.log('FWTopNavigationContainer canGoBack', canGoBack);
                  if (canGoBack) {
                    navigation.goBack();
                  }
                  if ((route.params as any)?.isFromNativeNavigation) {
                    await FireworkSDK.getInstance().navigator.bringRNContainerToBottom();
                    (route.params as any)?.playerHandler?.resume();
                  }
                }}
                tintColor={tintColor}
                size={30}
              />
            );
          },
        })}
      >
        {renderScreen({
          name: 'Tab',
          component: Tab,
          options: { headerShown: false },
        })}
        {renderScreen({
          name: 'SetShareBaseURL',
          component: SetShareBaseURL,
          options: { title: 'Set Global Share Base URL' },
        })}
        {renderScreen({
          name: 'OpenVideo',
          component: OpenVideo,
          options: { title: 'Open Video URL' },
        })}
        {renderScreen({
          name: 'SetAdBadgeConfiguration',
          component: SetAdBadgeConfiguration,
          options: { title: 'Set Ad Badge Configuration' },
        })}
        {renderScreen({
          name: 'EnableCustomCTAClickCallback',
          component: EnableCustomCTAClickCallback,
          options: { title: 'Enable Custom CTA Click Callback' },
        })}
        {renderScreen({
          name: 'Feed',
          component: Feed,
        })}
        {renderScreen({
          name: 'Cart',
          component: Cart,
          options: {
            title: 'Host App Cart',
          },
        })}
        {renderScreen({
          name: 'Checkout',
          component: Checkout,
          options: { title: 'Checkout(RN page)' },
        })}
        {renderScreen({
          name: 'LinkContent',
          component: LinkContent,
          options: { title: 'Link Content(RN page)' },
        })}
        {renderScreen({
          name: 'CircleThumbnails',
          component: CircleThumbnails,
          options: { title: 'Circle Thumbnails(iOS)' },
        })}
        {renderScreen({
          name: 'EnablePushingRNContainer',
          component: EnablePushingRNContainer,
          options: { title: 'Enable Pushing RN Container' },
        })}
        {renderScreen({
          name: 'EnableNativeNavigation',
          component: EnableNativeNavigation,
          options: { title: 'Enable Native Navigation' },
        })}
        {renderScreen({
          name: 'EnablePausePlayer',
          component: EnablePausePlayer,
          options: { title: 'Enable Pause Player' },
        })}
        {renderScreen({
          name: 'EnableLinkInteractionClickCallback',
          component: EnableLinkInteractionClickCallback,
          options: { title: 'Enable Link Interaction Click Callback' },
        })}
        {renderScreen({
          name: 'Log',
          component: Log,
          options: { title: 'Log' },
        })}
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export interface IAppProps {}
export default function App(props: IAppProps) {
  return (
    <Provider store={store}>
      <CustomThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
            <FWNavigationContainer {...props} />
          </RootSiblingParent>
        </ActionSheetProvider>
      </CustomThemeProvider>
    </Provider>
  );
}
