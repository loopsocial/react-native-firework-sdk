import { View } from 'react-native';
import CommonStyles from './CommonStyles';
import { Controller, useForm } from 'react-hook-form';
import FireworkSDK from 'react-native-firework-sdk';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import HostAppService from '../utils/HostAppService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';

type EnableProductDetailsHydrationFormData = {
  enableProductDetailsHydration?: boolean;
};

const EnableProductDetailsHydrationForm = () => {
  const { control, handleSubmit } =
    useForm<EnableProductDetailsHydrationFormData>({
      defaultValues: {
        enableProductDetailsHydration: FireworkSDK.getInstance().shopping
          .onUpdateProductDetails
          ? true
          : false,
      },
    });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnableProductDetailsHydration = async (
    data: EnableProductDetailsHydrationFormData
  ) => {
    if (data.enableProductDetailsHydration) {
      FireworkSDK.getInstance().shopping.onUpdateProductDetails =
        HostAppService.getInstance().onUpdateProductDetails;
      await AsyncStorage.setItem(
        StorageKey.enableProductDetailsHydration,
        'true'
      );
      Toast.show('Enable product details hydration successfully');
    } else {
      FireworkSDK.getInstance().shopping.onUpdateProductDetails = undefined;
      await AsyncStorage.setItem(
        StorageKey.enableProductDetailsHydration,
        'false'
      );
      Toast.show('Disable product details hydration successfully');
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
                title="Enable Product Details Hydration"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableProductDetailsHydration"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onEnableProductDetailsHydration)}
          title="Save"
        />
      </View>
    </View>
  );
};

export default EnableProductDetailsHydrationForm;
