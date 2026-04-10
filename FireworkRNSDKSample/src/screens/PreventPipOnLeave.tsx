import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FireworkSDK from 'react-native-firework-sdk';
import CommonStyles from '../components/CommonStyles';
import type { RootStackParamList } from './paramList/RootStackParamList';
import StorageKey from '../constants/StorageKey';

type PreventPipOnLeaveFormData = {
  preventPipOnLeave?: boolean;
};

const PreventPipOnLeave = () => {
  const [loaded, setLoaded] = useState(false);
  const { control, handleSubmit, reset } = useForm<PreventPipOnLeaveFormData>({
    defaultValues: {
      preventPipOnLeave: false,
    },
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const value = await AsyncStorage.getItem(StorageKey.preventPipOnLeave);
        reset({ preventPipOnLeave: value === 'true' });
      } catch (_) {}
      setLoaded(true);
    };
    loadSetting();
  }, [reset]);

  const onSave = async (data: PreventPipOnLeaveFormData) => {
    const enabled = data.preventPipOnLeave ?? false;
    FireworkSDK.getInstance().preventPipOnLeave = enabled;
    await AsyncStorage.setItem(
      StorageKey.preventPipOnLeave,
      enabled ? 'true' : 'false'
    );
    Toast.show(
      enabled ? 'Prevent PiP on leave enabled' : 'Prevent PiP on leave disabled'
    );
    navigation.goBack();
  };

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <View style={CommonStyles.formContainer}>
        <View style={CommonStyles.formItem}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Prevent PiP on Leave"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="preventPipOnLeave"
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
    </View>
  );
};

export default PreventPipOnLeave;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
