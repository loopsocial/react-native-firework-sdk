import { View } from 'react-native';
import React from 'react';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import FireworkSDK from 'react-native-firework-sdk';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import NativeContainerApp from '../NativeContainerApp';

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
  const navigation = useNavigation();

  const onEnableCustomCTAClickCallback = (
    data: EnableCustomCTAClickCallbackFormData
  ) => {
    if (data.enableCustomCTAClickCallback) {
      FireworkSDK.getInstance().onCustomCTAClick = (event) => {
        if (event.url) {
          FireworkSDK.getInstance().navigator.pushNativeContainer(
            <NativeContainerApp ctaLink={event.url} />
          );
        }
      };
    } else {
      FireworkSDK.getInstance().onCustomCTAClick = undefined;
    }
    navigation.goBack();
    Toast.show('Enable custom CTA click callback successfully');
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
                title="Enable Custom CTA ClickCallback"
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
