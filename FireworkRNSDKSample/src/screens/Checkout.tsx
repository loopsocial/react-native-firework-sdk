import { useForm, Controller } from 'react-hook-form';
import { Text, Divider, Input, Button } from 'react-native-elements';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CommonStyles from '../components/CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useAppDispatch } from '../hooks/reduxHooks';
import { removeAllCartItems } from '../slice/shoppingSlice';
import FireworkSDK from 'react-native-firework-sdk';

interface CheckoutFormData {
  cardNumber?: string;
  cardMonth?: string;
  cardYear?: string;
  cardCVC?: string;
  nameOnCard?: string;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const Checkout = () => {
  const { control, handleSubmit, setValue } = useForm<CheckoutFormData>();
  const dispatch = useAppDispatch();
  const onBuy = (data: CheckoutFormData) => {
    console.log('[example] onBuy', data);
    FireworkSDK.getInstance().trackPurchase({
      orderId: uuid.v4() as string,
      value: Math.floor(Math.random() * 100 + 1),
      currencyCode: 'USD',
      countryCode: 'US',
      additionalInfo: {
        additionalKey1: 'additionalValue1',
        additionalKey2: 'additionalValue2',
        additionalKey3: 'additionalValue3',
      },
    });
    dispatch(removeAllCartItems());
  };

  const creditCardInfoSection = (
    <View style={CommonStyles.formItem}>
      <Text style={CommonStyles.formItemTitle}>Credit Card Info</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Card Number"
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(newValue)}
            value={value}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  setValue('cardNumber', undefined);
                }}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        )}
        name="cardNumber"
      />
      <View style={styles.formItemRow}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              containerStyle={{ flex: 1, marginRight: 15 }}
              placeholder="MM"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorStyle={{ height: 0 }}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('cardMonth', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="cardMonth"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              containerStyle={{ flex: 1, marginRight: 15 }}
              placeholder="YY"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorStyle={{ height: 0 }}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('cardYear', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="cardYear"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              containerStyle={{ flex: 2, marginRight: 30 }}
              placeholder="CVC"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorStyle={{ height: 0 }}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('cardCVC', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="cardCVC"
        />
        <Ionicons name="card" size={32} />
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Name On Card"
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(newValue)}
            value={value}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  setValue('nameOnCard', undefined);
                }}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        )}
        name="nameOnCard"
      />
    </View>
  );

  const shippingInfoSection = (
    <View style={CommonStyles.formItem}>
      <Text style={CommonStyles.formItemTitle}>Shipping Info</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Name"
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(newValue)}
            value={value}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  setValue('name', undefined);
                }}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        )}
        name="name"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Street"
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(newValue)}
            value={value}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  setValue('street', undefined);
                }}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        )}
        name="street"
      />
      <View style={styles.formItemRow}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              containerStyle={{ flex: 1, marginRight: 15 }}
              placeholder="City"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorStyle={{ height: 0 }}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('city', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="city"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              containerStyle={{ flex: 1, marginRight: 15 }}
              placeholder="State"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorStyle={{ height: 0 }}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('state', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="state"
        />
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Zip code"
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(newValue)}
            value={value}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  setValue('zipCode', undefined);
                }}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            }
            autoComplete={undefined}
          />
        )}
        name="zipCode"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.topSection}>
          <Text h2 style={{ marginBottom: 20 }}>
            Total
          </Text>
          <Text h1>$ 423.42</Text>
        </View>
        <Divider style={{ marginBottom: 30 }} />
        <View style={{ ...CommonStyles.formContainer, padding: 20 }}>
          {creditCardInfoSection}
          {shippingInfoSection}
        </View>
      </ScrollView>
      <SafeAreaView style={styles.buyButtonWrapper}>
        <Button
          titleStyle={CommonStyles.mainButtonText}
          containerStyle={CommonStyles.mainButtonContainer}
          onPress={handleSubmit(onBuy)}
          title="BUY NOW"
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyButtonWrapper: {
    paddingHorizontal: 20,
  },
});

export default Checkout;
