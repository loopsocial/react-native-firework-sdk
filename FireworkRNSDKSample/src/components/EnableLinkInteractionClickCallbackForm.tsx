import { View } from 'react-native';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import HostAppService from '../utils/HostAppService';
import { LiveStream } from 'react-native-firework-sdk';

type EnableLinkInteractionClickCallbackFormData = {
  enableLinkInteractionClickCallback?: boolean;
};

const EnableLinkInteractionClickCallbackForm = () => {
  const liveStream = LiveStream.getInstance();
  const { control, handleSubmit } =
    useForm<EnableLinkInteractionClickCallbackFormData>({
      defaultValues: {
        enableLinkInteractionClickCallback:
          liveStream.onCustomLinkInteractionClick ? true : false,
      },
    });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnableLinkInteractionClickCallback = (
    data: EnableLinkInteractionClickCallbackFormData
  ) => {
    if (data.enableLinkInteractionClickCallback) {
      liveStream.onCustomLinkInteractionClick =
        HostAppService.getInstance().onCustomLinkInteractionClick;
      Toast.show('Enable link interaction click callback successfully');
    } else {
      liveStream.onCustomLinkInteractionClick = undefined;
      Toast.show('Disable link interaction click callback successfully');
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
                title="Enable Link Interaction Click Callback"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableLinkInteractionClickCallback"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableLinkInteractionClickCallback)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableLinkInteractionClickCallbackForm;
