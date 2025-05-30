import FireworkSDK from 'react-native-firework-sdk';
import { useCallback, useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Button, ButtonGroup, Input } from 'react-native-elements';
import type {
  AdBadgeConfiguration,
  AdBadgeTextType,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Patterns from '../constants/Patterns';
import CommonStyles from './CommonStyles';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';

type SetAdBadgeConfigurationFormData = {
  backgroundColor?: string;
  textColor?: string;
  badgeTextType?: number;
  androidFontName?: string;
};

const BadgeTextTypeList: AdBadgeTextType[] = ['ad', 'sponsored'];

const SetAdBadgeConfigurationForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SetAdBadgeConfigurationFormData>({});
  const navigation = useNavigation();

  const onSave = (data: SetAdBadgeConfigurationFormData) => {
    console.log('onSave SetADBadgeConfigurationFormData', data);
    let configuration: AdBadgeConfiguration = {};
    configuration.backgroundColor = data.backgroundColor;
    configuration.textColor = data.textColor;
    if (data.badgeTextType && data.badgeTextType < BadgeTextTypeList.length) {
    }
    configuration.badgeTextType =
      typeof data.badgeTextType === 'number'
        ? BadgeTextTypeList[data.badgeTextType!]
        : undefined;
    configuration.androidFontInfo = data.androidFontName
      ? { isCustom: false, typefaceName: data.androidFontName }
      : undefined;
    console.log('AdBadgeConfiguration configuration', configuration);
    FireworkSDK.getInstance().adBadgeConfiguration = configuration;
    navigation.goBack();
    Toast.show('Set Ad badge configuration successfully');
  };

  const syncFormValuesFromConfiguration = useCallback(
    (configuration?: AdBadgeConfiguration) => {
      if (configuration) {
        setValue('backgroundColor', configuration.backgroundColor);
        setValue('textColor', configuration.textColor);

        if (configuration.badgeTextType) {
          const badgeTextTypeIndex = BadgeTextTypeList.indexOf(
            configuration.badgeTextType
          );
          setValue(
            'badgeTextType',
            badgeTextTypeIndex >= 0 ? badgeTextTypeIndex : undefined
          );
        } else {
          setValue('badgeTextType', undefined);
        }
      } else {
        reset();
      }
    },
    [setValue, reset]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration(
      FireworkSDK.getInstance().adBadgeConfiguration
    );
  }, [syncFormValuesFromConfiguration]);

  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Background color"
              placeholder="e.g. #c0c0c0"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={
                errors.backgroundColor
                  ? 'Please enter correct color'
                  : undefined
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('backgroundColor', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="backgroundColor"
          rules={{
            pattern: Patterns.hexColor,
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Text color"
              placeholder="e.g. #000000"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={
                errors.textColor ? 'Please enter correct color' : undefined
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('textColor', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="textColor"
          rules={{
            pattern: Patterns.hexColor,
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Android typeface name"
              placeholder="e.g. MONOSPACE"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={
                errors.androidFontName
                  ? 'Please enter correct typeface name'
                  : undefined
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('androidFontName', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="androidFontName"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <ButtonGroup
              buttons={BadgeTextTypeList}
              selectedIndex={value}
              onPress={(newValue) => {
                onChange(newValue);
              }}
            />
          )}
          name="badgeTextType"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onSave)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default SetAdBadgeConfigurationForm;
