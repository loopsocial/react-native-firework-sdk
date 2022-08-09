import React from 'react';

import { ThemeProvider } from 'react-native-elements';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTheme from './AppTheme';
import BackButton from './components/BackButton';
import {
  useCartIconVisibilityEffect,
  useCartItemCountEffect,
} from './hooks/cartHooks';
import Checkout from './screens/Checkout';
import Feed from './screens/Feed';
import OpenVideo from './screens/OpenVideo';
import type { RootStackParamList } from './screens/paramList/RootStackParamList';
import SetShareBaseURL from './screens/SetShareBaseURL';
import Tab from './screens/Tab';
import { store } from './store';
import SetAdBadgeConfiguration from './screens/SetAdBadgeConfiguration';
import EnableCustomCTAClickCallback from './screens/EnableCustomCTAClickCallback';
import EnableCustomCTALinkContentPageRouteName from './screens/EnableCustomCTALinkContentPageRouteName';
import FireworkSDK from 'react-native-firework-sdk';
import CTALinkContent from './screens/CTALinkContent';
import Cart from './screens/Cart';
import CircleThumbnails from './screens/CircleThumbnails';
import EnableCustomClickCartIconCallback from './screens/EnableCustomClickCartIconCallback';

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

type AppRouteName = keyof RootStackParamList;
export interface IFWNavigationContainer {
  initialRouteName?: keyof RootStackParamList;
  initialParams?: any;
}
const FWNavigationContainer = ({
  initialRouteName, //If initialRouteName is not equal to undefined, it indicates this is a new native container.
  initialParams,
}: IFWNavigationContainer) => {
  console.log(
    'FWNavigationContainer initialRouteName',
    initialRouteName,
    'initialParams',
    initialParams
  );
  useCartIconVisibilityEffect();
  useCartItemCountEffect();

  const renderScreen = ({
    name,
    options,
    component,
  }: {
    name: AppRouteName;
    options?: any;
    component: React.ComponentType<any>;
  }) => {
    const isFirstScreenForNewNativeContainer = initialRouteName === name;
    return (
      <StackNavigator.Screen
        name={name}
        initialParams={
          isFirstScreenForNewNativeContainer ? initialParams : undefined
        }
        component={component}
        options={{
          ...options,
          headerLeft: isFirstScreenForNewNativeContainer
            ? ({ tintColor }) => {
                return (
                  <BackButton
                    tintColor={tintColor}
                    size={30}
                    customBack={() => {
                      FireworkSDK.getInstance().navigator.popNativeContainer();
                    }}
                  />
                );
              }
            : undefined,
          headerBackVisible: isFirstScreenForNewNativeContainer ? false : true,
        }}
      />
    );
  };

  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerLeft: ({ tintColor }) => {
            return <BackButton tintColor={tintColor} size={30} />;
          },
        }}
      >
        {renderScreen({
          name: 'Tab',
          component: Tab,
          options: { headerShown: false },
        })}
        {renderScreen({
          name: 'OpenVideo',
          component: OpenVideo,
          options: { title: 'Open Video URL' },
        })}
        {renderScreen({
          name: 'SetShareBaseURL',
          component: SetShareBaseURL,
          options: { title: 'Set Share Base URL' },
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
          name: 'EnableCustomCTALinkContentPageRouteName',
          component: EnableCustomCTALinkContentPageRouteName,
          options: { title: 'Enable CTA Link Content Page Route Name' },
        })}
        {renderScreen({
          name: 'Feed',
          component: Feed,
        })}
        {renderScreen({
          name: 'Cart',
          component: Cart,
          options: { title: 'Host App Cart' },
        })}
        {renderScreen({
          name: 'Checkout',
          component: Checkout,
        })}
        {renderScreen({
          name: 'CTALinkContent',
          component: CTALinkContent,
          options: { title: 'CTA Link Content(RN page)' },
        })}
        {renderScreen({
          name: 'CircleThumbnails',
          component: CircleThumbnails,
          options: { title: 'Circle Thumbnails(iOS)' },
        })}
        {renderScreen({
          name: 'EnableCustomClickCartIconCallback',
          component: EnableCustomClickCartIconCallback,
          options: { title: 'Enable Custom Click Cart Icon Callback' },
        })}
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export interface IAppProps {
  initialRouteName?: keyof RootStackParamList;
  initialParams?: any;
}
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
