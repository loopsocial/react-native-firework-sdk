import React from 'react';

import { ThemeProvider } from 'react-native-elements';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTheme from './AppTheme';
import BackButton from './components/BackButton';
import Checkout from './screens/Checkout';
import Feed from './screens/Feed';
import OpenVideo from './screens/OpenVideo';
import type {
  RootStackParamList,
} from './screens/paramList/RootStackParamList';
import SetShareBaseURL from './screens/SetShareBaseURL';
import Tab from './screens/Tab';
import { store } from './store';

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
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
                  options={{ title: 'Open VideoURL' }}
                />
                <StackNavigator.Screen
                  name="SetShareBaseURL"
                  component={SetShareBaseURL}
                  options={{ title: 'Set ShareBaseURL' }}
                />
                <StackNavigator.Screen name="Feed" component={Feed} />
                <StackNavigator.Screen name="Checkout" component={Checkout} />
              </StackNavigator.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
}
