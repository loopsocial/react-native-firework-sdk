import CommonStyles from './CommonStyles';
import FireworkSDK from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';

type SetShareBaseURLFormData = {
  shareBaseURL: string;
};

export default function SetShareBaseURLForm() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetShareBaseURLFormData>({
    defaultValues: {
      shareBaseURL: FireworkSDK.getInstance().shareBaseURL ?? '',
    },
  });
  const [currentLink, setCurrentLink] = useState<string>(FireworkSDK.getInstance().shareBaseURL ?? '')
  console.log('SetShareBaseURLForm error', errors);

  const onSetShareURLHandler = (data: SetShareBaseURLFormData) => {
    console.log('SetShareBaseURLForm data', data);
    FireworkSDK.getInstance().shareBaseURL = data.shareBaseURL;
    setCurrentLink(data.shareBaseURL);
    Toast.show('Set share base URL successfully');
  };

  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>ShareBaseURL</Text>
        <Text style={styles.currentText}>{`Current: ${currentLink}`}</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('shareBaseURL', '');
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              errorMessage={
                errors.shareBaseURL
                  ? 'Please enter correct ShareBaseURL'
                  : undefined
              }
              autoCompleteType={undefined}
            />
          )}
          name="shareBaseURL"
          rules={{
            pattern: Patterns.url,
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          containerStyle={CommonStyles.mainButtonContainer}
          titleStyle={CommonStyles.mainButtonText}
          onPress={handleSubmit(onSetShareURLHandler)}
          title="Set ShareBaseURL"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currentText: {
    fontSize: 16,
    marginBottom: 10,
  },
});