import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Image, Button } from 'react-native-elements';
import { useAppSelector } from '../hooks/reduxHooks';
import CommonStyles from './CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ICartPageProps {
  onCheckout?: () => void;
}

const CartPage = ({ onCheckout }: ICartPageProps) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {cartItems.map((cartItem) => (
          <ListItem
            key={`${cartItem.productId}_${cartItem.unitId}`}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            bottomDivider
            onPress={() => {}}
          >
            <Image
              source={{ uri: cartItem.imageURL }}
              containerStyle={styles.itemImage}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.itemTitle}>
                {cartItem.name}
              </ListItem.Title>
              <ListItem.Subtitle>{cartItem.description}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <SafeAreaView style={styles.checkoutButtonWrapper}>
      <Button
        titleStyle={CommonStyles.mainButtonText}
        containerStyle={CommonStyles.mainButtonContainer}
        disabled={cartItems.length === 0}
        title="CHECKOUT"
        onPress={() => {
          if (onCheckout) {
            onCheckout();
          }
        }}
      />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    paddingVertical: 0,
    flex: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemTitle: {
    marginBottom: 10,
  },
  checkoutButtonWrapper: {
    paddingHorizontal: 20,
  },
});

export default CartPage;
