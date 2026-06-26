import { StyleSheet, View } from 'react-native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CartPage from '../components/CartPage';
import type { RootStackParamList } from './paramList/RootStackParamList';
import type { TabParamsList } from './paramList/TabParamsList';

type CartScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamsList, 'Cart'>,
  StackNavigationProp<RootStackParamList>
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
