import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartPage from '../components/CartPage';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './paramList/RootStackParamList';
import type { TabParamsList } from './paramList/TabParamsList';

type CartScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'Cart'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Cart = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <CartPage
        onCheckout={() => {
          navigation.navigate('Checkout');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default Cart;
