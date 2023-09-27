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
import { updateEnablePausePlayer } from '../slice/navigationSlice';

type EnablePausePlayerFormData = {
  enablePausePlayer?: boolean;
};

const EnablePausePlayer = () => {
  const enablePausePlayer = useAppSelector(
    (state) => state.navigation.enablePausePlayer
  );
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<EnablePausePlayerFormData>({
    defaultValues: {
      enablePausePlayer: enablePausePlayer,
    },
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnablePausePlayer = (data: EnablePausePlayerFormData) => {
    dispatch(updateEnablePausePlayer(data.enablePausePlayer ?? false));
    if (data.enablePausePlayer) {
      Toast.show('Enable pause player successfully');
    } else {
      Toast.show('Disable pause player successfully');
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
                  title="Enable Pause Player"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="enablePausePlayer"
          />
        </View>
        <View style={CommonStyles.formItem}>
          <Button
            containerStyle={CommonStyles.mainButtonContainer}
            titleStyle={CommonStyles.mainButtonText}
            onPress={handleSubmit(onEnablePausePlayer)}
            title="Save"
          />
        </View>
      </View>
    </View>
  );
};

export default EnablePausePlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
