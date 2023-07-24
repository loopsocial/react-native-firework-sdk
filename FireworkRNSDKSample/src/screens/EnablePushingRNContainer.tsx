import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Toast from 'react-native-root-toast';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CommonStyles from '../components/CommonStyles';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { RootStackParamList } from '../screens/paramList/RootStackParamList';
import { updateEnablePushingRNContainer } from '../slice/navigationSlice';

type EnablePushingRNContainerFormData = {
  enablePushingRNContainer?: boolean;
};

const EnablePushingRNContainer = () => {
  const enablePushingRNContainer = useAppSelector(
    (state) => state.navigation.enablePushingRNContainer
  );
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<EnablePushingRNContainerFormData>({
    defaultValues: {
      enablePushingRNContainer: enablePushingRNContainer,
    },
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEnablePushingRNContainer = (
    data: EnablePushingRNContainerFormData
  ) => {
    dispatch(
      updateEnablePushingRNContainer(data.enablePushingRNContainer ?? false)
    );
    if (data.enablePushingRNContainer) {
      Toast.show('Enable pusing RN container successfully');
    } else {
      Toast.show('Disable pusing RN container successfully');
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
                  title="Enable Pushing RN Container"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="enablePushingRNContainer"
          />
        </View>
        <View style={CommonStyles.formItem}>
          <Button
            containerStyle={CommonStyles.mainButtonContainer}
            titleStyle={CommonStyles.mainButtonText}
            onPress={handleSubmit(onEnablePushingRNContainer)}
            title="Save"
          />
        </View>
      </View>
    </View>
  );
};

export default EnablePushingRNContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
