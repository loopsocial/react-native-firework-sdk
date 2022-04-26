import React from 'react';

import { ThemeProvider } from 'react-native-elements';
import FireworkSDK from 'react-native-firework-sdk';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTheme from './AppTheme';
import BackButton from './components/BackButton';
import CTALinkContent from './screens/CTALinkContent';
import type { NativeContainerParamList } from './screens/paramList/NativeContainerParamList';
import { store } from './store';

const StackNavigator = createNativeStackNavigator<NativeContainerParamList>();

export interface INativeContainerAppProps {
  ctaLink: string;
}

const NativeContainerApp = ({ ctaLink }: INativeContainerAppProps) => {
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
                  name="CTALinkContent"
                  initialParams={{ url: ctaLink }}
                  component={CTALinkContent}
                  options={{
                    title: 'CTA Link Content(RN page)',
                    headerLeft: ({ tintColor }) => {
                      return (
                        <BackButton
                          tintColor={tintColor}
                          size={30}
                          customBack={() => {
                            FireworkSDK.getInstance().navigator.popNativeContainer();
                          }}
                        />
                      );
                    },
                    headerBackVisible: false,
                  }}
                />
              </StackNavigator.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default NativeContainerApp;
