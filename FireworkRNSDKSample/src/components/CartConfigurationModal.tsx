import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useCallback, useEffect } from 'react';
import { Button, CheckBox, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { AddToCartButtonConfiguration } from 'react-native-firework-sdk';
import {
  changeCartIconVisibility,
  setAddToCartButtonStyle,
  changeLinkButtonVisibility,
  changeCustomClickLinkButtonAbility,
} from '../slice/cartSlice';
import FireworkSDK from 'react-native-firework-sdk';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import HostAppShoppingService from '../utils/HostAppShoppingService';

export interface ICartConfigurationModalProps {
  visible: boolean;
  onRequestClose?: () => void;
}

type CartConfigurationFormData = {
  addToCartButtonBackgroundColor?: string;
  addToCartButtonTextColor?: string;
  addToCartButtonFontSize?: string;
  addToCartButtonIOSFontName?: string;
  showCartIcon?: boolean;
  linkButtonHidden?: boolean;
  enableCustomClickLinkButton?: boolean;
};

type CartConfiguration = {
  cartIconVisible: boolean;
  addToCartButtonStyle: AddToCartButtonConfiguration;
  linkButtonHidden: boolean;
  enableCustomClickLinkButton: boolean;
};

const CartConfigurationModal = ({
  visible,
  onRequestClose,
}: ICartConfigurationModalProps) => {
  const cartIconVisible = useAppSelector((state) => state.cart.cartIconVisible);
  const defaultCartIconVisible = useAppSelector(
    (state) => state.cart.defaultCartIconVisible
  );
  const addToCartButtonStyle = useAppSelector(
    (state) => state.cart.addToCartButtonStyle
  );
  const defaultAddToCartButtonStyle = useAppSelector(
    (state) => state.cart.defaultAddToCartButtonStyle
  );
  const linkButtonHidden = useAppSelector(
    (state) => state.cart.linkButtonHidden
  );
  const defaultLinkButtonHidden = useAppSelector(
    (state) => state.cart.defaultLinkButtonHidden
  );
  const enableCustomClickLinkButton = useAppSelector(
    (state) => state.cart.enableCustomClickLinkButton
  );
  const defaultEnableCustomClickLinkButton = useAppSelector(
    (state) => state.cart.defaultEnableCustomClickLinkButton
  );
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CartConfigurationFormData>();

  let addToCartButtonFontSizeErrorMessage: string | undefined;
  if (errors.addToCartButtonFontSize) {
    if (
      errors.addToCartButtonFontSize.type === 'max' ||
      errors.addToCartButtonFontSize.type === 'min'
    ) {
      addToCartButtonFontSizeErrorMessage = 'Please enter font size in [8, 30]';
    } else {
      addToCartButtonFontSizeErrorMessage = 'Please enter correct font size';
    }
  }

  const syncFormValuesFromConfiguration = useCallback(
    (configuration: CartConfiguration) => {
      setValue(
        'addToCartButtonBackgroundColor',
        configuration.addToCartButtonStyle.backgroundColor
      );
      setValue(
        'addToCartButtonTextColor',
        configuration.addToCartButtonStyle.textColor
      );
      setValue(
        'addToCartButtonFontSize',
        configuration.addToCartButtonStyle.fontSize?.toString()
      );
      setValue(
        'addToCartButtonIOSFontName',
        configuration.addToCartButtonStyle.iOSFontInfo?.fontName
      );
      setValue('showCartIcon', configuration.cartIconVisible);
      setValue('linkButtonHidden', configuration.linkButtonHidden);
    },
    [setValue]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration({
      cartIconVisible,
      addToCartButtonStyle,
      linkButtonHidden,
      enableCustomClickLinkButton,
    });
  }, [
    cartIconVisible,
    addToCartButtonStyle,
    linkButtonHidden,
    enableCustomClickLinkButton,
    syncFormValuesFromConfiguration,
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onSave = (data: CartConfigurationFormData) => {
    console.log('onSave CartConfigurationFormData', data);
    dispatch(changeCartIconVisibility(data.showCartIcon ?? true));
    let cartButtonStyle: AddToCartButtonConfiguration = {};
    if (data.addToCartButtonBackgroundColor) {
      cartButtonStyle.backgroundColor = data.addToCartButtonBackgroundColor;
    }

    if (data.addToCartButtonTextColor) {
      cartButtonStyle.textColor = data.addToCartButtonTextColor;
    }

    if (data.addToCartButtonFontSize) {
      cartButtonStyle.fontSize = parseInt(data.addToCartButtonFontSize);
    }

    if (data.addToCartButtonIOSFontName) {
      cartButtonStyle.iOSFontInfo = {
        fontName: data.addToCartButtonIOSFontName,
      };
    }

    dispatch(setAddToCartButtonStyle(cartButtonStyle));

    dispatch(changeLinkButtonVisibility(data.linkButtonHidden ?? false));
    dispatch(
      changeCustomClickLinkButtonAbility(
        data.enableCustomClickLinkButton ?? false
      )
    );
    if (data.enableCustomClickLinkButton ?? false) {
      FireworkSDK.getInstance().shopping.onCustomClickLinkButton = async (
        event
      ) => {
        HostAppShoppingService.getInstance().closePlayerOrStartFloatingPlayer();
        navigation.navigate('LinkContent', { url: event.url });
      };
    } else {
      FireworkSDK.getInstance().shopping.onCustomClickLinkButton = undefined;
    }

    FireworkSDK.getInstance().shopping.productInfoViewConfiguration = {
      addToCartButton: cartButtonStyle,
      linkButton: { isHidden: data.linkButtonHidden ?? false },
    };

    setTimeout(() => {
      if (onRequestClose) {
        onRequestClose();
      }
    }, 0);
  };

  const formContent = (
    <>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Background color of "Add to cart" button'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.addToCartButtonBackgroundColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('addToCartButtonBackgroundColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="addToCartButtonBackgroundColor"
            rules={{
              pattern: Patterns.hexColor,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Text color of "Add to cart" button'}
                placeholder="e.g. #ffffff"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.addToCartButtonTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('addToCartButtonTextColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="addToCartButtonTextColor"
            rules={{
              pattern: Patterns.hexColor,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Font size of "Add to cart" button'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={addToCartButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('addToCartButtonFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="addToCartButtonFontSize"
            rules={{
              pattern: Patterns.number,
              max: 30,
              min: 8,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'IOS Font name of "Add to cart" button'}
                placeholder="e.g. Helvetica-Bold"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('addToCartButtonIOSFontName', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="addToCartButtonIOSFontName"
          />
        </View>
      </View>
      <View style={{ ...styles.formItemRow, marginBottom: 20 }}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Show cart icon"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="showCartIcon"
          />
        </View>
      </View>
      <View style={{ ...styles.formItemRow, marginBottom: 20 }}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Hide link button"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="linkButtonHidden"
          />
        </View>
      </View>
      <View style={{ ...styles.formItemRow, marginBottom: 20 }}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Enable Custom Click Link Button(Android)"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="enableCustomClickLinkButton"
          />
        </View>
      </View>
    </>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        syncFormValuesFromConfiguration({
          cartIconVisible,
          addToCartButtonStyle,
          linkButtonHidden,
          enableCustomClickLinkButton,
        });
        if (onRequestClose) {
          onRequestClose();
        }
      }}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View
            style={{
              ...CommonStyles.formContainer,
              ...styles.formContainerExtra,
            }}
          >
            <ScrollView>
              <Text style={styles.sectionTitle}>Cart Configuration</Text>
              {formContent}
              <View style={{ ...CommonStyles.formItem, ...styles.buttonList }}>
                <Button
                  type="outline"
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                    marginRight: 20,
                  }}
                  onPress={() => {
                    syncFormValuesFromConfiguration({
                      cartIconVisible,
                      addToCartButtonStyle,
                      linkButtonHidden,
                      enableCustomClickLinkButton,
                    });
                    if (onRequestClose) {
                      onRequestClose();
                    }
                  }}
                  title="Cancel"
                />
                <Button
                  buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                    marginRight: 20,
                  }}
                  onPress={() => {
                    syncFormValuesFromConfiguration({
                      cartIconVisible: defaultCartIconVisible,
                      addToCartButtonStyle: defaultAddToCartButtonStyle,
                      linkButtonHidden: defaultLinkButtonHidden,
                      enableCustomClickLinkButton:
                        defaultEnableCustomClickLinkButton,
                    });
                  }}
                  title="Reset"
                />
                <Button
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                  }}
                  onPress={handleSubmit(onSave)}
                  title="Save"
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
  },
  formContainerExtra: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
  },
  buttonList: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formItemRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formItem: {
    flex: 1,
  },
  formItemLabel: {
    color: '#86939e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CartConfigurationModal;
