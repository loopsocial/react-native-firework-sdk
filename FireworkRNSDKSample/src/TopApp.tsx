import React, { useEffect, useMemo } from 'react';

import { BackHandler, Platform } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import FireworkSDK from 'react-native-firework-sdk';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTheme from './AppTheme';
import BackButton from './components/BackButton';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import LinkContent from './screens/LinkContent';
import type { TopParamList } from './screens/paramList/TopParamList';
import { store } from './store';

const StackNavigator = createNativeStackNavigator<TopParamList>();

type AppRouteName = keyof TopParamList;
export interface IFWNavigationContainer {
  initialRouteName?: keyof TopParamList;
  initialParams?: any;
}
const FWTopNavigationContainer = ({
  initialRouteName,
  initialParams,
}: IFWNavigationContainer) => {
  console.log(
    'FWNavigationContainer initialRouteName',
    initialRouteName,
    'initialParams',
    initialParams
  );

  const navigationRef = useMemo(() => createNavigationContainerRef(), []);

  const renderScreen = ({
    name,
    options,
    component,
  }: {
    name: AppRouteName;
    options?: any;
    component: React.ComponentType<any>;
  }) => {
    const isInitialScreen = initialRouteName === name;
    return (
      <StackNavigator.Screen
        name={name}
        // We should pass initialParams to the initial screen
        initialParams={isInitialScreen ? initialParams : undefined}
        component={component}
        options={options}
      />
    );
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        console.log(
          'onBackPress current route is',
          navigationRef.getCurrentRoute()
        );
        if (navigationRef.getCurrentRoute()?.name === initialRouteName) {
          // It's the first screen.
          // We should call popRNContainer method to close
          // the RN Container overlaying the full-screen player.
          FireworkSDK.getInstance().navigator.popRNContainer();
          return true;
        }

        return false;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => {
        subscription.remove();
      };
    }

    return;
  }, [initialRouteName, navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator.Navigator
        initialRouteName={initialRouteName}
        screenOptions={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerBackVisible: false,
          headerLeft: ({ tintColor, canGoBack }) => {
            return (
              <BackButton
                tintColor={tintColor}
                size={30}
                onBack={() => {
                  console.log('FWTopNavigationContainer canGoBack', canGoBack);
                  if (canGoBack) {
                    navigation.goBack();
                  } else {
                    // It's the first screen when canGoBack is false.
                    // We should call popRNContainer method to close
                    // the RN Container overlaying the full-screen player.
                    FireworkSDK.getInstance().navigator.popRNContainer();
                  }
                }}
              />
            );
          },
        })}
      >
        {renderScreen({
          name: 'Cart',
          component: Cart,
          options: { title: 'Host App RN Cart page' },
        })}
        {renderScreen({
          name: 'Checkout',
          component: Checkout,
          options: { title: 'Host App RN Checkout page' },
        })}
        {renderScreen({
          name: 'LinkContent',
          component: LinkContent,
          options: { title: 'Host App RN In-app browser' },
        })}
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export interface ITopAppProps {
  initialRouteName?: AppRouteName;
  initialParams?: any;
}
export default function TopApp(props: ITopAppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={AppTheme}>
        <ActionSheetProvider>
          <RootSiblingParent>
            <FWTopNavigationContainer {...props} />
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
}
