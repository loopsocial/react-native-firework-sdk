import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartPage from '../components/CartPage';
import type { CartStackParamList } from './paramList/CartStackParamList';

type FeedScreenNavigationProp = NativeStackNavigationProp<
  CartStackParamList,
  'EmbedCart'
>;

const EmbedCart = () => {
  const navigation = useNavigation<FeedScreenNavigationProp>();

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

export default EmbedCart;
