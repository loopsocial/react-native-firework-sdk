import { View } from 'react-native';
import React from 'react';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import FireworkSDK from 'react-native-firework-sdk';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import NativeContainerApp from '../NativeContainerApp';

type EnableCustomCTALinkContentRenderFormData = {
  enableCustomCTALinkContentRender?: boolean;
};

const EnableCustomCTALinkContentRenderForm = () => {
  const { control, handleSubmit } =
    useForm<EnableCustomCTALinkContentRenderFormData>({
      defaultValues: {
        enableCustomCTALinkContentRender: FireworkSDK.getInstance()
          .customCTALinkContentRender
          ? true
          : false,
      },
    });
  const navigation = useNavigation();

  const onEnableCustomCTALinkContentRender = (
    data: EnableCustomCTALinkContentRenderFormData
  ) => {
    if (data.enableCustomCTALinkContentRender) {
      FireworkSDK.getInstance().customCTALinkContentRender = (event) => {
        return (
          <NativeContainerApp
            initialRouteName="CTALinkContent"
            initialParams={{ url: event.url }}
          />
        );
      };
      Toast.show('Enable custom CTA link content render successfully');
    } else {
      FireworkSDK.getInstance().customCTALinkContentRender = undefined;
      Toast.show('Disable custom CTA link content render successfully');
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
                title="Enable Custom CTA Link Content Render"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableCustomCTALinkContentRender"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableCustomCTALinkContentRender)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableCustomCTALinkContentRenderForm;
