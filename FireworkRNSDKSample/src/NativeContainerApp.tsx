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

type NativeContainerAppRouteName = 'CTALinkContent';

export interface INativeContainerAppProps {
  initialRouteName?: NativeContainerAppRouteName;
  initialParams?: any;
}

const NativeContainerApp = ({
  initialRouteName,
  initialParams,
}: INativeContainerAppProps) => {
  const renderScreen = ({
    name,
    title,
    component,
  }: {
    name: NativeContainerAppRouteName;
    title: string;
    component: React.ComponentType<any>;
  }) => {
    return (
      <StackNavigator.Screen
        name={name}
        initialParams={initialRouteName === name ? initialParams : undefined}
        component={component}
        options={{
          title: title,
          headerLeft:
            initialRouteName === name
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
          headerBackVisible: initialRouteName === name ? false : true,
        }}
      />
    );
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
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
                  name: 'CTALinkContent',
                  title: 'CTA Link Content(RN page)',
                  component: CTALinkContent,
                })}
              </StackNavigator.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default NativeContainerApp;
