import { View } from 'react-native';
import React from 'react';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import FireworkSDK from 'react-native-firework-sdk';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';

type EnableCustomCTALinkContentPageRouteNameFormData = {
  enableCustomCTALinkContentPageRouteName?: boolean;
};

const EnableCustomCTALinkContentPageRouteNameForm = () => {
  const { control, handleSubmit } =
    useForm<EnableCustomCTALinkContentPageRouteNameFormData>({
      defaultValues: {
        enableCustomCTALinkContentPageRouteName: FireworkSDK.getInstance()
          .customCTALinkContentPageRouteName
          ? true
          : false,
      },
    });
  const navigation = useNavigation();

  const onEnableCustomCTALinkContentPageRouteName = (
    data: EnableCustomCTALinkContentPageRouteNameFormData
  ) => {
    if (data.enableCustomCTALinkContentPageRouteName) {
      FireworkSDK.getInstance().customCTALinkContentPageRouteName =
        'CTALinkContent';
      Toast.show('Enable custom CTA link content page route name successfully');
    } else {
      FireworkSDK.getInstance().customCTALinkContentPageRouteName = undefined;
      Toast.show(
        'Disable custom CTA link content page route name successfully'
      );
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
                title="Enable Custom CTA Link Content Page Route Name"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableCustomCTALinkContentPageRouteName"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableCustomCTALinkContentPageRouteName)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableCustomCTALinkContentPageRouteNameForm;
