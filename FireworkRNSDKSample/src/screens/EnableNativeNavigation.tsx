import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CommonStyles from '../components/CommonStyles';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { RootStackParamList } from './paramList/RootStackParamList';
import { updateEnableNativeNavigation } from '../slice/navigationSlice';

type EnableNativeNavigationFormData = {
  enableNativeNavigation?: boolean;
};

const EnableNativeNavigation = () => {
  const enableNativeNavigation = useAppSelector(
    (state) => state.navigation.enableNativeNavigation
  );
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<EnableNativeNavigationFormData>({
    defaultValues: {
      enableNativeNavigation: enableNativeNavigation,
    },
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnableNativeNavigation = (data: EnableNativeNavigationFormData) => {
    dispatch(
      updateEnableNativeNavigation(data.enableNativeNavigation ?? false)
    );
    if (data.enableNativeNavigation) {
      Toast.show('Enable native navigation successfully');
    } else {
      Toast.show('Disable native navigation successfully');
    }
    navigation.goBack();
  };
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
                  title="Enable Native Navigation"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="enableNativeNavigation"
          />
        </View>
        <View style={CommonStyles.formItem}>
          <Button
            containerStyle={CommonStyles.mainButtonContainer}
            titleStyle={CommonStyles.mainButtonText}
            onPress={handleSubmit(onEnableNativeNavigation)}
            title="Save"
          />
        </View>
      </View>
    </View>
  );
};

export default EnableNativeNavigation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
