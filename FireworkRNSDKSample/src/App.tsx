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
import EnableCustomCTALinkContentRender from './screens/EnableCustomCTALinkContentRender';

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

const FWNavigationContainer = () => {
  useCartIconVisibilityEffect();
  useCartItemCountEffect();

  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerLeft: ({ tintColor }) => {
            return <BackButton tintColor={tintColor} size={30} />;
          },
        }}
      >
        <StackNavigator.Screen
          name="Tab"
          component={Tab}
          options={{ headerShown: false }}
        />
        <StackNavigator.Screen
          name="OpenVideo"
          component={OpenVideo}
          options={{ title: 'Open Video URL' }}
        />
        <StackNavigator.Screen
          name="SetShareBaseURL"
          component={SetShareBaseURL}
          options={{ title: 'Set Share Base URL' }}
        />
        <StackNavigator.Screen
          name="SetAdBadgeConfiguration"
          component={SetAdBadgeConfiguration}
          options={{ title: 'Set Ad Badge Configuration' }}
        />
        <StackNavigator.Screen
          name="EnableCustomCTAClickCallback"
          component={EnableCustomCTAClickCallback}
          options={{ title: 'Enable Custom CTA Click Callback' }}
        />
        <StackNavigator.Screen
          name="EnableCustomCTALinkContentRender"
          component={EnableCustomCTALinkContentRender}
          options={{ title: 'Enable Custom CTA Link Content Render' }}
        />
        <StackNavigator.Screen name="Feed" component={Feed} />
        <StackNavigator.Screen name="Checkout" component={Checkout} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
            <FWNavigationContainer />
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
}
