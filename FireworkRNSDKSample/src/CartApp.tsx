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
import Checkout from './screens/Checkout';
import EmbedCart from './screens/EmbedCart';
import type { CartStackParamList } from './screens/paramList/CartStackParamList';
import { store } from './store';

const StackNavigator = createNativeStackNavigator<CartStackParamList>();

const CartApp = () => {
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
                  name="EmbedCart"
                  component={EmbedCart}
                  options={{
                    title: 'Host App Cart',
                    headerLeft: ({ tintColor }) => {
                      return (
                        <BackButton
                          tintColor={tintColor}
                          size={30}
                          customBack={() => {
                            FireworkSDK.getInstance().shopping.exitCartPage();
                          }}
                        />
                      );
                    },
                    headerBackVisible: false,
                  }}
                />
                <StackNavigator.Screen name="Checkout" component={Checkout} />
              </StackNavigator.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default CartApp;
