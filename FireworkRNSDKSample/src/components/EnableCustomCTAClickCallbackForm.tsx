import { View } from 'react-native';
import React from 'react';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import FireworkSDK from 'react-native-firework-sdk';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import HostAppService from '../utils/HostAppService';

type EnableCustomCTAClickCallbackFormData = {
  enableCustomCTAClickCallback?: boolean;
};

const EnableCustomCTAClickCallbackForm = () => {
  const { control, handleSubmit } =
    useForm<EnableCustomCTAClickCallbackFormData>({
      defaultValues: {
        enableCustomCTAClickCallback: FireworkSDK.getInstance().onCustomCTAClick
          ? true
          : false,
      },
    });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnableCustomCTAClickCallback = (
    data: EnableCustomCTAClickCallbackFormData
  ) => {
    if (data.enableCustomCTAClickCallback) {
      FireworkSDK.getInstance().onCustomCTAClick = (event) => {
        if (event.url) {
          HostAppService.getInstance().closePlayerOrStartFloatingPlayer();
          navigation.navigate('LinkContent', { url: event.url });
        }
      };
      Toast.show('Enable custom CTA click callback successfully');
    } else {
      FireworkSDK.getInstance().onCustomCTAClick = undefined;
      Toast.show('Disable custom CTA click callback successfully');
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
                title="Enable Custom CTA Click Callback"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableCustomCTAClickCallback"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableCustomCTAClickCallback)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableCustomCTAClickCallbackForm;
