import React, { useCallback, useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, CheckBox, Input, ButtonGroup } from 'react-native-elements';
import type {
  ShoppingCTAButtonConfiguration,
  ShoppingCTAButtonText,
} from 'react-native-firework-sdk';
import FireworkSDK from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Patterns from '../constants/Patterns';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import {
  changeCartIconVisibility,
  changeCustomClickLinkButtonAbility,
  changeLinkButtonVisibility,
  setCTAButtonConfiguration,
} from '../slice/shoppingSlice';
import HostAppShoppingService from '../utils/HostAppShoppingService';
import CommonStyles from './CommonStyles';

export interface IShoppingConfigurationModalProps {
  visible: boolean;
  onRequestClose?: () => void;
}

const ctaButtonTextList: ShoppingCTAButtonText[] = ['addToCart', 'shopNow'];

type ShoppingConfigurationFormData = {
  ctaButtonTextIndex?: number;
  ctaButtonBackgroundColor?: string;
  ctaButtonTextColor?: string;
  ctaButtonFontSize?: string;
  ctaButtonIOSFontName?: string;
  showCartIcon?: boolean;
  linkButtonHidden?: boolean;
  enableCustomClickLinkButton?: boolean;
};

type ShoppingConfiguration = {
  cartIconVisible: boolean;
  ctaButtonConfiguration: ShoppingCTAButtonConfiguration;
  linkButtonHidden: boolean;
  enableCustomClickLinkButton: boolean;
};

const ShoppingConfigurationModal = ({
  visible,
  onRequestClose,
}: IShoppingConfigurationModalProps) => {
  const cartIconVisible = useAppSelector(
    (state) => state.shopping.cartIconVisible
  );
  const defaultCartIconVisible = useAppSelector(
    (state) => state.shopping.defaultCartIconVisible
  );
  const ctaButtonConfiguration = useAppSelector(
    (state) => state.shopping.ctaButtonConfiguration
  );
  const defaultCtaButtonConfiguration = useAppSelector(
    (state) => state.shopping.defaultCtaButtonConfiguration
  );
  const linkButtonHidden = useAppSelector(
    (state) => state.shopping.linkButtonHidden
  );
  const defaultLinkButtonHidden = useAppSelector(
    (state) => state.shopping.defaultLinkButtonHidden
  );
  const enableCustomClickLinkButton = useAppSelector(
    (state) => state.shopping.enableCustomClickLinkButton
  );
  const defaultEnableCustomClickLinkButton = useAppSelector(
    (state) => state.shopping.defaultEnableCustomClickLinkButton
  );
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShoppingConfigurationFormData>();

  let ctaButtonFontSizeErrorMessage: string | undefined;
  if (errors.ctaButtonFontSize) {
    if (
      errors.ctaButtonFontSize.type === 'max' ||
      errors.ctaButtonFontSize.type === 'min'
    ) {
      ctaButtonFontSizeErrorMessage = 'Please enter font size in [8, 30]';
    } else {
      ctaButtonFontSizeErrorMessage = 'Please enter correct font size';
    }
  }

  const syncFormValuesFromConfiguration = useCallback(
    (configuration: ShoppingConfiguration) => {
      if (configuration && configuration.ctaButtonConfiguration.text) {
        const ctaButtonTextIndex = ctaButtonTextList.indexOf(
          configuration.ctaButtonConfiguration.text!
        );
        setValue(
          'ctaButtonTextIndex',
          ctaButtonTextIndex >= 0 ? ctaButtonTextIndex : undefined
        );
      } else {
        setValue('ctaButtonTextIndex', 0);
      }
      setValue(
        'ctaButtonBackgroundColor',
        configuration.ctaButtonConfiguration.backgroundColor
      );
      setValue(
        'ctaButtonTextColor',
        configuration.ctaButtonConfiguration.textColor
      );
      setValue(
        'ctaButtonFontSize',
        configuration.ctaButtonConfiguration.fontSize?.toString()
      );
      setValue(
        'ctaButtonIOSFontName',
        configuration.ctaButtonConfiguration.iOSFontInfo?.fontName
      );
      setValue('showCartIcon', configuration.cartIconVisible);
      setValue('linkButtonHidden', configuration.linkButtonHidden);
    },
    [setValue]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration({
      cartIconVisible,
      ctaButtonConfiguration,
      linkButtonHidden,
      enableCustomClickLinkButton,
    });
  }, [
    cartIconVisible,
    ctaButtonConfiguration,
    linkButtonHidden,
    enableCustomClickLinkButton,
    syncFormValuesFromConfiguration,
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onSave = (data: ShoppingConfigurationFormData) => {
    console.log('onSave CartConfigurationFormData', data);
    dispatch(changeCartIconVisibility(data.showCartIcon ?? true));
    let resultCTAButtonConfiguration: ShoppingCTAButtonConfiguration = {};
    resultCTAButtonConfiguration.text =
      typeof data.ctaButtonTextIndex === 'number'
        ? ctaButtonTextList[data.ctaButtonTextIndex!]
        : undefined;
    if (data.ctaButtonBackgroundColor) {
      resultCTAButtonConfiguration.backgroundColor =
        data.ctaButtonBackgroundColor;
    }

    if (data.ctaButtonTextColor) {
      resultCTAButtonConfiguration.textColor = data.ctaButtonTextColor;
    }

    if (data.ctaButtonFontSize) {
      resultCTAButtonConfiguration.fontSize = parseInt(data.ctaButtonFontSize);
    }

    if (data.ctaButtonIOSFontName) {
      resultCTAButtonConfiguration.iOSFontInfo = {
        fontName: data.ctaButtonIOSFontName,
      };
    }

    dispatch(setCTAButtonConfiguration(resultCTAButtonConfiguration));

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
      ctaButton: resultCTAButtonConfiguration,
      linkButton: { isHidden: data.linkButtonHidden ?? false },
    };
    if (Platform.OS === 'ios') {
      if (resultCTAButtonConfiguration.text === 'shopNow') {
        FireworkSDK.getInstance().shopping.onShoppingCTA =
          HostAppShoppingService.getInstance().onShopNow;
      } else {
        FireworkSDK.getInstance().shopping.onShoppingCTA =
          HostAppShoppingService.getInstance().onAddToCart;
      }
    } else {
      FireworkSDK.getInstance().shopping.onShoppingCTA =
        HostAppShoppingService.getInstance().onAddToCart;
    }

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
          <Text style={styles.formItemLabel}>
            Shopping CTA button text(iOS)
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={ctaButtonTextList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="ctaButtonTextIndex"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Background color of shopping CTA button(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.ctaButtonBackgroundColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('ctaButtonBackgroundColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="ctaButtonBackgroundColor"
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
                label={'Text color of shopping CTA button(iOS)'}
                placeholder="e.g. #ffffff"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.ctaButtonTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('ctaButtonTextColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="ctaButtonTextColor"
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
                label={'Font size of shopping CTA button(iOS)'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={ctaButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('ctaButtonFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="ctaButtonFontSize"
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
                label={'IOS Font name of shopping CTA button(iOS)'}
                placeholder="e.g. Helvetica-Bold"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('ctaButtonIOSFontName', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="ctaButtonIOSFontName"
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
                  title="Enable Custom Click Link Button"
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
          ctaButtonConfiguration,
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
              <Text style={styles.sectionTitle}>Shopping Configuration</Text>
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
                      ctaButtonConfiguration,
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
                      ctaButtonConfiguration: defaultCtaButtonConfiguration,
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

export default ShoppingConfigurationModal;
