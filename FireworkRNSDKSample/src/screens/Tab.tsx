import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedLayouts from './FeedLayouts';
import More from './More';
import type { TabParamsList } from './paramList/TabParamsList';
import Shopping from './Shopping';
import Cart from './Cart';
import { useAppSelector } from '../hooks/reduxHooks';

const TabNavigator = createBottomTabNavigator<TabParamsList>();

const Tab = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  return (
    <TabNavigator.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'Shopping':
              iconName = focused ? 'apps-outline' : 'apps';
              break;
            case 'Cart':
              iconName = focused ? 'cart-outline' : 'cart';
              break;
            case 'FeedLayouts':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'More':
              iconName = focused
                ? 'ellipsis-horizontal'
                : 'ellipsis-horizontal-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#067be9',
        tabBarInactiveTintColor: '#52606b',
        headerTitleAlign: 'center',
      })}
    >
      <TabNavigator.Screen name="Shopping" component={Shopping} />
      <TabNavigator.Screen
        name="Cart"
        component={Cart}
        options={{
          title: 'Host App Cart',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
        }}
      />
      <TabNavigator.Screen
        name="FeedLayouts"
        component={FeedLayouts}
      />
      <TabNavigator.Screen name="More" component={More} />
    </TabNavigator.Navigator>
  );
};

export default Tab;
