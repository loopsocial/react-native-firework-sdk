import React, { useEffect } from 'react';

import { ThemeProvider } from 'react-native-elements';
import FireworkSDK from 'react-native-firework-sdk';
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
                    FireworkSDK.getInstance().navigator.bringRNContainerToBottom();
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
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export interface IAppProps {}
export default function App(props: IAppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
            <FWNavigationContainer {...props} />
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
}
