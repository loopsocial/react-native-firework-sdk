import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import FireworkSDK from 'react-native-firework-sdk';
import Toast from 'react-native-root-toast';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import CommonStyles from './CommonStyles';
import HostAppShoppingService from '../utils/HostAppShoppingService';

type EnableCustomClickCartIconCallbackFormData = {
  enableCustomClickCartIconCallback?: boolean;
};

const EnableCustomClickCartIconCallbackForm = () => {
  const { control, handleSubmit } =
    useForm<EnableCustomClickCartIconCallbackFormData>({
      defaultValues: {
        enableCustomClickCartIconCallback: FireworkSDK.getInstance().shopping
          .onCustomClickCartIcon
          ? true
          : false,
      },
    });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnableCustomClickCartIconCallback = (
    data: EnableCustomClickCartIconCallbackFormData
  ) => {
    if (data.enableCustomClickCartIconCallback) {
      FireworkSDK.getInstance().shopping.onCustomClickCartIcon = async () => {
        HostAppShoppingService.getInstance().closePlayerOrStartFloatingPlayer();
        if (HostAppShoppingService.getInstance().shouldShowCart()) {
          navigation.navigate('Cart');
        }
      };
      Toast.show('Enable custom click cart icon callback successfully');
    } else {
      FireworkSDK.getInstance().shopping.onCustomClickCartIcon = undefined;
      Toast.show('Disable custom click cart icon callback successfully');
    }
    navigation.goBack();
  };
  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Enable Custom Click Cart Icon Callback"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableCustomClickCartIconCallback"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableCustomClickCartIconCallback)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableCustomClickCartIconCallbackForm;
