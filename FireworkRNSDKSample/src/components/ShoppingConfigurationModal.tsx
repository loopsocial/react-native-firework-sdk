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
import { Button, ButtonGroup, CheckBox, Input } from 'react-native-elements';
import type {
  ShoppingCTAButtonConfiguration,
  ShoppingCTAButtonText,
  ProductCardConfiguration,
  ProductCardCTAButtonText,
  ProductCardTheme,
  ProductCardPriceLabelAxis,
} from 'react-native-firework-sdk';
import FireworkSDK from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Patterns from '../constants/Patterns';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  changeCartIconVisibility,
  updateEnableCustomClickLinkButton,
  changeLinkButtonVisibility,
  setCTAButtonConfiguration,
  setProductCardConfiguration,
  updateEnableCustomTapProductCard,
} from '../slice/shoppingSlice';
import HostAppService from '../utils/HostAppService';
import CommonStyles from './CommonStyles';

export interface IShoppingConfigurationModalProps {
  visible: boolean;
  onRequestClose?: () => void;
}

const shoppingCTAButtonTextList: ShoppingCTAButtonText[] = [
  'addToCart',
  'shopNow',
];
const productCardCTAButtonTextList: ProductCardCTAButtonText[] = [
  'shopNow',
  'buyNow',
];
const productCardThemeList: ProductCardTheme[] = ['dark', 'light'];
const productCardPriceAxisList: ProductCardPriceLabelAxis[] = [
  'horizontal',
  'vertical',
];

type ShoppingConfigurationFormData = {
  shoppingCTAButtonTextIndex?: number;
  productCardCTAButtonTextIndex?: number;
  productCardThemeIndex?: number;
  productCardCornerRadius?: string;
  productCardCtaButtonHidden?: boolean;
  productCardCTAButtonTextColor?: string;
  productCardCTAButtonFontSize?: string;
  productCardPriceHidden?: boolean;
  productCardPriceAxisIndex: number;
  productCardPriceLabelTextColor?: string;
  productCardPriceLabelFontSize?: string;
  productCardPriceLabelNumberOfLines?: string;
  productCardOriginalPriceLabelTextColor?: string;
  productCardOriginalPriceLabelFontSize?: string;
  productCardOriginalPriceLabelNumberOfLines?: string;
  productCardIsPriceFirst?: boolean;
  productCardWidth?: string;
  productCardHeight?: string;
  productCardBackgroundColor?: string;
  productCardIconCornerRadius?: string;
  productCardNameLabelTextColor?: string;
  productCardNameLabelFontSize?: string;
  productCardNameLabelNumberOfLines?: string;
  ctaButtonBackgroundColor?: string;
  ctaButtonTextColor?: string;
  ctaButtonFontSize?: string;
  ctaButtonIOSFontName?: string;
  showCartIcon?: boolean;
  linkButtonHidden?: boolean;
  enableCustomClickLinkButton?: boolean;
  enableCustomTapProductCard?: boolean;
};

type ShoppingConfiguration = {
  cartIconVisible: boolean;
  ctaButtonConfiguration: ShoppingCTAButtonConfiguration;
  linkButtonHidden: boolean;
  enableCustomClickLinkButton: boolean;
  productCardConfiguration: ProductCardConfiguration;
  enableCustomTapProductCard: boolean;
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
  const productCardConfiguration = useAppSelector(
    (state) => state.shopping.productCardConfiguration
  );
  const defaultProductCardConfiguration = useAppSelector(
    (state) => state.shopping.defaultProductCardConfiguration
  );
  const enableCustomTapProductCard = useAppSelector(
    (state) => state.shopping.enableCustomTapProductCard
  );
  const defaultEnableCustomTapProductCard = useAppSelector(
    (state) => state.shopping.defaultEnableCustomTapProductCard
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

  let productCardWidthErrorMessage: string | undefined;
  if (errors.productCardWidth) {
    if (
      errors.productCardWidth.type === 'max' ||
      errors.productCardWidth.type === 'min'
    ) {
      productCardWidthErrorMessage = 'Please enter font size in [218, 300]';
    } else {
      productCardWidthErrorMessage = 'Please enter correct number';
    }
  }

  let productCardHeightErrorMessage: string | undefined;
  if (errors.productCardHeight) {
    if (
      errors.productCardHeight.type === 'max' ||
      errors.productCardHeight.type === 'min'
    ) {
      productCardHeightErrorMessage = 'Please enter font size in [88, 120]';
    } else {
      productCardHeightErrorMessage = 'Please enter correct number';
    }
  }

  const syncFormValuesFromConfiguration = useCallback(
    (configuration: ShoppingConfiguration) => {
      if (configuration && configuration.ctaButtonConfiguration.text) {
        const shoppingCTAButtonTextIndex = shoppingCTAButtonTextList.indexOf(
          configuration.ctaButtonConfiguration.text!
        );
        setValue(
          'shoppingCTAButtonTextIndex',
          shoppingCTAButtonTextIndex >= 0
            ? shoppingCTAButtonTextIndex
            : undefined
        );
      } else {
        setValue('shoppingCTAButtonTextIndex', 0);
      }
      if (
        configuration &&
        configuration.productCardConfiguration.ctaButtonText
      ) {
        const productCardCTAButtonTextIndex =
          productCardCTAButtonTextList.indexOf(
            configuration.productCardConfiguration.ctaButtonText!
          );
        setValue(
          'productCardCTAButtonTextIndex',
          productCardCTAButtonTextIndex >= 0
            ? productCardCTAButtonTextIndex
            : undefined
        );
      } else {
        setValue('productCardCTAButtonTextIndex', 0);
      }
      if (configuration && configuration.productCardConfiguration.theme) {
        const productCardThemeIndex = productCardThemeList.indexOf(
          configuration.productCardConfiguration.theme!
        );
        setValue(
          'productCardThemeIndex',
          productCardThemeIndex >= 0 ? productCardThemeIndex : undefined
        );
      } else {
        setValue('productCardThemeIndex', 0);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.cornerRadius
      ) {
        setValue(
          'productCardCornerRadius',
          configuration.productCardConfiguration.cornerRadius?.toString()
        );
      } else {
        setValue('productCardCornerRadius', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.isHidden
      ) {
        setValue(
          'productCardPriceHidden',
          configuration.productCardConfiguration.priceConfiguration?.isHidden
        );
      } else {
        setValue('productCardPriceHidden', false);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.axis
      ) {
        const productCardPriceAxisIndex = productCardPriceAxisList.indexOf(
          configuration.productCardConfiguration.priceConfiguration?.axis!
        );
        setValue(
          'productCardPriceAxisIndex',
          productCardPriceAxisIndex >= 0 ? productCardPriceAxisIndex : 0
        );
      } else {
        setValue('productCardPriceAxisIndex', 0);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.priceLabel
          ?.textColor
      ) {
        setValue(
          'productCardPriceLabelTextColor',
          configuration.productCardConfiguration.priceConfiguration?.priceLabel
            .textColor
        );
      } else {
        setValue('productCardPriceLabelTextColor', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.priceLabel
          ?.fontSize
      ) {
        setValue(
          'productCardPriceLabelFontSize',
          configuration.productCardConfiguration.priceConfiguration?.priceLabel?.fontSize?.toString()
        );
      } else {
        setValue('productCardPriceLabelFontSize', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.priceLabel
          ?.numberOfLines
      ) {
        setValue(
          'productCardPriceLabelNumberOfLines',
          configuration.productCardConfiguration.priceConfiguration?.priceLabel?.numberOfLines?.toString()
        );
      } else {
        setValue('productCardPriceLabelNumberOfLines', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration
          ?.originalPriceLabel?.textColor
      ) {
        setValue(
          'productCardOriginalPriceLabelTextColor',
          configuration.productCardConfiguration.priceConfiguration
            ?.originalPriceLabel?.textColor
        );
      } else {
        setValue('productCardOriginalPriceLabelTextColor', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration
          ?.originalPriceLabel?.fontSize
      ) {
        setValue(
          'productCardOriginalPriceLabelFontSize',
          configuration.productCardConfiguration.priceConfiguration?.originalPriceLabel?.fontSize?.toString()
        );
      } else {
        setValue('productCardOriginalPriceLabelFontSize', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration
          ?.originalPriceLabel?.numberOfLines
      ) {
        setValue(
          'productCardOriginalPriceLabelNumberOfLines',
          configuration.productCardConfiguration.priceConfiguration?.originalPriceLabel?.numberOfLines?.toString()
        );
      } else {
        setValue('productCardOriginalPriceLabelNumberOfLines', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.priceConfiguration?.isPriceFirst
      ) {
        setValue(
          'productCardIsPriceFirst',
          configuration.productCardConfiguration.priceConfiguration
            ?.isPriceFirst
        );
      } else {
        setValue('productCardIsPriceFirst', false);
      }

      if (configuration && configuration.productCardConfiguration.width) {
        setValue(
          'productCardWidth',
          configuration.productCardConfiguration.width?.toString()
        );
      } else {
        setValue('productCardWidth', undefined);
      }

      if (configuration && configuration.productCardConfiguration.height) {
        setValue(
          'productCardHeight',
          configuration.productCardConfiguration.height?.toString()
        );
      } else {
        setValue('productCardHeight', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.backgroundColor
      ) {
        setValue(
          'productCardBackgroundColor',
          configuration.productCardConfiguration.backgroundColor
        );
      } else {
        setValue('productCardBackgroundColor', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.iconConfiguration?.cornerRadius
      ) {
        setValue(
          'productCardIconCornerRadius',
          configuration.productCardConfiguration.iconConfiguration?.cornerRadius.toString()
        );
      } else {
        setValue('productCardIconCornerRadius', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.nameLabel?.textColor
      ) {
        setValue(
          'productCardNameLabelTextColor',
          configuration.productCardConfiguration.nameLabel?.textColor
        );
      } else {
        setValue('productCardNameLabelTextColor', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.nameLabel?.fontSize
      ) {
        setValue(
          'productCardNameLabelFontSize',
          configuration.productCardConfiguration.nameLabel?.fontSize?.toString()
        );
      } else {
        setValue('productCardNameLabelFontSize', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.nameLabel?.numberOfLines
      ) {
        setValue(
          'productCardNameLabelNumberOfLines',
          configuration.productCardConfiguration.nameLabel?.numberOfLines?.toString()
        );
      } else {
        setValue('productCardNameLabelNumberOfLines', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.isCtaButtonHidden
      ) {
        setValue(
          'productCardCtaButtonHidden',
          configuration.productCardConfiguration.isCtaButtonHidden
        );
      } else {
        setValue('productCardCtaButtonHidden', false);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.ctaButtonStyle?.textColor
      ) {
        setValue(
          'productCardCTAButtonTextColor',
          configuration.productCardConfiguration.ctaButtonStyle?.textColor
        );
      } else {
        setValue('productCardCTAButtonTextColor', undefined);
      }

      if (
        configuration &&
        configuration.productCardConfiguration.ctaButtonStyle?.fontSize
      ) {
        setValue(
          'productCardCTAButtonFontSize',
          configuration.productCardConfiguration.ctaButtonStyle?.fontSize?.toString()
        );
      } else {
        setValue('productCardCTAButtonFontSize', undefined);
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
      productCardConfiguration,
      enableCustomTapProductCard,
    });
  }, [
    cartIconVisible,
    ctaButtonConfiguration,
    linkButtonHidden,
    enableCustomClickLinkButton,
    productCardConfiguration,
    syncFormValuesFromConfiguration,
    enableCustomTapProductCard,
  ]);

  const onSave = (data: ShoppingConfigurationFormData) => {
    console.log('onSave CartConfigurationFormData', data);
    dispatch(changeCartIconVisibility(data.showCartIcon ?? true));
    let resultCTAButtonConfiguration: ShoppingCTAButtonConfiguration = {};
    resultCTAButtonConfiguration.text =
      typeof data.shoppingCTAButtonTextIndex === 'number'
        ? shoppingCTAButtonTextList[data.shoppingCTAButtonTextIndex!]
        : undefined;
    let resultProductCardConfiguration: ProductCardConfiguration = {};
    resultProductCardConfiguration.ctaButtonText =
      typeof data.productCardCTAButtonTextIndex === 'number'
        ? productCardCTAButtonTextList[data.productCardCTAButtonTextIndex!]
        : undefined;
    resultProductCardConfiguration.theme =
      typeof data.productCardThemeIndex === 'number'
        ? productCardThemeList[data.productCardThemeIndex!]
        : undefined;
    if (data.productCardCornerRadius) {
      resultProductCardConfiguration.cornerRadius = parseInt(
        data.productCardCornerRadius
      );
    }
    resultProductCardConfiguration.priceConfiguration = {};
    resultProductCardConfiguration.priceConfiguration.isHidden =
      data.productCardPriceHidden;
    resultProductCardConfiguration.isCtaButtonHidden =
      data.productCardCtaButtonHidden;
    resultProductCardConfiguration.priceConfiguration.axis =
      typeof data.productCardPriceAxisIndex === 'number'
        ? productCardPriceAxisList[data.productCardPriceAxisIndex!]
        : undefined;

    resultProductCardConfiguration.priceConfiguration.priceLabel = {};
    if (data.productCardPriceLabelTextColor) {
      resultProductCardConfiguration.priceConfiguration.priceLabel.textColor =
        data.productCardPriceLabelTextColor;
    } else {
      resultProductCardConfiguration.priceConfiguration.priceLabel.textColor =
        undefined;
    }

    if (data.productCardPriceLabelFontSize) {
      resultProductCardConfiguration.priceConfiguration.priceLabel.fontSize =
        parseInt(data.productCardPriceLabelFontSize);
    } else {
      resultProductCardConfiguration.priceConfiguration.priceLabel.fontSize =
        undefined;
    }

    if (data.productCardPriceLabelNumberOfLines) {
      resultProductCardConfiguration.priceConfiguration.priceLabel.numberOfLines =
        parseInt(data.productCardPriceLabelNumberOfLines);
    } else {
      resultProductCardConfiguration.priceConfiguration.priceLabel.numberOfLines =
        undefined;
    }

    resultProductCardConfiguration.priceConfiguration.originalPriceLabel = {};
    if (data.productCardOriginalPriceLabelTextColor) {
      resultProductCardConfiguration.priceConfiguration.originalPriceLabel.textColor =
        data.productCardOriginalPriceLabelTextColor;
    }
    if (data.productCardOriginalPriceLabelFontSize) {
      resultProductCardConfiguration.priceConfiguration.originalPriceLabel.fontSize =
        parseInt(data.productCardOriginalPriceLabelFontSize);
    }
    if (data.productCardOriginalPriceLabelNumberOfLines) {
      resultProductCardConfiguration.priceConfiguration.originalPriceLabel.numberOfLines =
        parseInt(data.productCardOriginalPriceLabelNumberOfLines);
    }

    resultProductCardConfiguration.priceConfiguration.isPriceFirst =
      data.productCardIsPriceFirst;

    if (data.productCardWidth) {
      resultProductCardConfiguration.width = parseInt(data.productCardWidth);
    } else {
      resultProductCardConfiguration.width = undefined;
    }

    if (data.productCardHeight) {
      resultProductCardConfiguration.height = parseInt(data.productCardHeight);
    } else {
      resultProductCardConfiguration.height = undefined;
    }

    if (data.productCardBackgroundColor) {
      resultProductCardConfiguration.backgroundColor =
        data.productCardBackgroundColor;
    } else {
      resultProductCardConfiguration.backgroundColor = undefined;
    }

    if (data.productCardIconCornerRadius) {
      resultProductCardConfiguration.iconConfiguration = {
        cornerRadius: parseInt(data.productCardIconCornerRadius),
      };
    } else {
      resultProductCardConfiguration.iconConfiguration = undefined;
    }

    resultProductCardConfiguration.nameLabel = {};
    if (data.productCardNameLabelTextColor) {
      resultProductCardConfiguration.nameLabel.textColor =
        data.productCardNameLabelTextColor;
    }

    if (data.productCardNameLabelFontSize) {
      resultProductCardConfiguration.nameLabel.fontSize = parseInt(
        data.productCardNameLabelFontSize
      );
    }

    if (data.productCardNameLabelNumberOfLines) {
      resultProductCardConfiguration.nameLabel.numberOfLines = parseInt(
        data.productCardNameLabelNumberOfLines
      );
    }

    resultProductCardConfiguration.ctaButtonStyle = {};
    if (data.productCardCTAButtonTextColor) {
      resultProductCardConfiguration.ctaButtonStyle.textColor =
        data.productCardCTAButtonTextColor;
    }
    if (data.productCardCTAButtonFontSize) {
      resultProductCardConfiguration.ctaButtonStyle.fontSize = parseInt(
        data.productCardCTAButtonFontSize
      );
    }

    if (data.ctaButtonBackgroundColor) {
      resultCTAButtonConfiguration.backgroundColor =
        data.ctaButtonBackgroundColor;
    } else {
      resultCTAButtonConfiguration.backgroundColor = undefined;
    }

    if (data.ctaButtonTextColor) {
      resultCTAButtonConfiguration.textColor = data.ctaButtonTextColor;
    } else {
      resultCTAButtonConfiguration.textColor = undefined;
    }

    if (data.ctaButtonFontSize) {
      resultCTAButtonConfiguration.fontSize = parseInt(data.ctaButtonFontSize);
    } else {
      resultCTAButtonConfiguration.fontSize = undefined;
    }

    if (data.ctaButtonIOSFontName) {
      resultCTAButtonConfiguration.iOSFontInfo = {
        fontName: data.ctaButtonIOSFontName,
      };
    } else {
      resultCTAButtonConfiguration.iOSFontInfo = undefined;
    }

    dispatch(setCTAButtonConfiguration(resultCTAButtonConfiguration));
    dispatch(setProductCardConfiguration(resultProductCardConfiguration));
    dispatch(changeLinkButtonVisibility(data.linkButtonHidden ?? false));
    dispatch(
      updateEnableCustomClickLinkButton(
        data.enableCustomClickLinkButton ?? false
      )
    );
    if (data.enableCustomClickLinkButton ?? false) {
      FireworkSDK.getInstance().shopping.onCustomClickLinkButton = async (
        event
      ) => {
        HostAppService.getInstance().closePlayerOrStartFloatingPlayer();
        HostAppService.getInstance().navigate('LinkContent', {
          url: event.url,
        });
      };
    } else {
      FireworkSDK.getInstance().shopping.onCustomClickLinkButton = undefined;
    }

    dispatch(
      updateEnableCustomTapProductCard(data.enableCustomTapProductCard ?? false)
    );
    if (data.enableCustomTapProductCard ?? false) {
      FireworkSDK.getInstance().shopping.onCustomTapProductCard =
        HostAppService.getInstance().onCustomTapProductCard;
    } else {
      FireworkSDK.getInstance().shopping.onCustomTapProductCard = undefined;
    }

    FireworkSDK.getInstance().shopping.productInfoViewConfiguration = {
      ctaButton: resultCTAButtonConfiguration,
      linkButton: { isHidden: data.linkButtonHidden ?? false },
      productCard: resultProductCardConfiguration,
    };
    if (resultCTAButtonConfiguration.text === 'shopNow') {
      FireworkSDK.getInstance().shopping.onShoppingCTA =
        HostAppService.getInstance().onShopNow;
    } else {
      FireworkSDK.getInstance().shopping.onShoppingCTA =
        HostAppService.getInstance().onAddToCart;
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
          <Text style={styles.formItemLabel}>Shopping CTA button text</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={shoppingCTAButtonTextList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="shoppingCTAButtonTextIndex"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Background color of shopping CTA button'}
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
                label={'Text color of shopping CTA button'}
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
                label={'Font size of shopping CTA button'}
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
                label={'IOS Font name of shopping CTA button'}
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
      <View style={{ ...styles.formItemRow, marginBottom: 20 }}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Enable Custom Tap Product Card"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="enableCustomTapProductCard"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>Product card CTA button text</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={productCardThemeList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="productCardThemeIndex"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Product card corner radius'}
                placeholder="e.g. 0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardCornerRadius
                    ? 'Please enter correct corner radius'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardCornerRadius', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardCornerRadius"
            rules={{
              pattern: Patterns.number,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>Product card CTA button text</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={productCardCTAButtonTextList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="productCardCTAButtonTextIndex"
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
                  title="Hide product card CTA button"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="productCardCtaButtonHidden"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Product card CTA button text color(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardCTAButtonTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardCTAButtonTextColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardCTAButtonTextColor"
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
                label={'Font size of product card CTA button(iOS)'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={ctaButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardCTAButtonFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardCTAButtonFontSize"
            rules={{
              pattern: Patterns.number,
              max: 30,
              min: 8,
            }}
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
                  title="Hide product card price(@deprecated)"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="productCardPriceHidden"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>Product card price axis(iOS)</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={productCardPriceAxisList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="productCardPriceAxisIndex"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Product card price label text color(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardPriceLabelTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardPriceLabelTextColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardPriceLabelTextColor"
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
                label={'Font size of product card price label(iOS)'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={ctaButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardPriceLabelFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardPriceLabelFontSize"
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
                label={'Number of lines for product card price label(iOS)'}
                placeholder="e.g. 1"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardPriceLabelNumberOfLines
                    ? 'Please enter correct number'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardPriceLabelNumberOfLines', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardPriceLabelNumberOfLines"
            rules={{
              pattern: Patterns.number,
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
                label={'Product card original price label text color(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardOriginalPriceLabelTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue(
                        'productCardOriginalPriceLabelTextColor',
                        undefined
                      );
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardOriginalPriceLabelTextColor"
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
                label={'Font size of product card original price label(iOS)'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={ctaButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue(
                        'productCardOriginalPriceLabelFontSize',
                        undefined
                      );
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardOriginalPriceLabelFontSize"
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
                label={
                  'Number of lines for product card original price label(iOS)'
                }
                placeholder="e.g. 1"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardOriginalPriceLabelNumberOfLines
                    ? 'Please enter correct number'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue(
                        'productCardOriginalPriceLabelNumberOfLines',
                        undefined
                      );
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardOriginalPriceLabelNumberOfLines"
            rules={{
              pattern: Patterns.number,
            }}
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
                  title="Product card is price first(iOS)"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="productCardIsPriceFirst"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Product card width(iOS)'}
                placeholder="e.g. 218"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={productCardWidthErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardWidth', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardWidth"
            rules={{
              pattern: Patterns.number,
              max: 300,
              min: 218,
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
                label={'Product card height(iOS)'}
                placeholder="e.g. 88"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={productCardHeightErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardHeight', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardHeight"
            rules={{
              pattern: Patterns.number,
              max: 120,
              min: 88,
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
                label={'Product card backgroundColor(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardBackgroundColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardBackgroundColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardBackgroundColor"
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
                label={'Product card icon corner radius(iOS)'}
                placeholder="e.g. 0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardIconCornerRadius
                    ? 'Please enter correct corner radius'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardIconCornerRadius', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardIconCornerRadius"
            rules={{
              pattern: Patterns.number,
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
                label={'Product card name label text color(iOS)'}
                placeholder="e.g. #c0c0c0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardNameLabelTextColor
                    ? 'Please enter correct color'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardNameLabelTextColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardNameLabelTextColor"
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
                label={'Font size of product card name label(iOS)'}
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={ctaButtonFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardNameLabelFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardNameLabelFontSize"
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
                label={'Number of lines for product card name label(iOS)'}
                placeholder="e.g. 1"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.productCardNameLabelNumberOfLines
                    ? 'Please enter correct number'
                    : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('productCardNameLabelNumberOfLines', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="productCardNameLabelNumberOfLines"
            rules={{
              pattern: Patterns.number,
            }}
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
          productCardConfiguration,
          enableCustomTapProductCard,
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
                      productCardConfiguration,
                      enableCustomTapProductCard,
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
                      productCardConfiguration: defaultProductCardConfiguration,
                      enableCustomTapProductCard:
                        defaultEnableCustomTapProductCard,
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
