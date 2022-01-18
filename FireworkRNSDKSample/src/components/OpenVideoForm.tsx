import CommonStyles from './CommonStyles';
import FireworkSDK, {
  VideoPlayerConfiguration,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import PlayerConfigurationModal from './PlayerConfigurationModal';
import React, { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

type OpenVideoFormData = {
  videoURL: string;
};

export function OpenVideoForm() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpenVideoFormData>();
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >({
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
  });
  const [showPlayerConfiguration, setShowPlayerConfiguration] =
    useState<boolean>(false);
  console.log('OpenVideoForm errors', errors);

  const onOpenVideoPlayer = (data: OpenVideoFormData) => {
    console.log('OpenVideoForm data', data);
    FireworkSDK.getInstance().openVideoPlayer(
      data.videoURL,
      playerConfiguration
    );
  };

  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>VideoURL</Text>
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
                    setValue('videoURL', '');
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              errorMessage={
                errors.videoURL
                  ? errors.videoURL!.type === 'required'
                    ? 'Please enter VideoURL'
                    : 'Please enter correct VideoURL'
                  : undefined
              }
              autoCompleteType={undefined}
            />
          )}
          name="videoURL"
          rules={{
            required: true,
            pattern: Patterns.url,
          }}
          defaultValue=""
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          type="outline"
          titleStyle={CommonStyles.mainButtonText}
          containerStyle={CommonStyles.mainButtonContainer}
          onPress={() => {
            setShowPlayerConfiguration(true);
          }}
          title="Player Configuration"
        />
      </View>
      <View style={CommonStyles.formItem}>
        <Button
          titleStyle={CommonStyles.mainButtonText}
          containerStyle={CommonStyles.mainButtonContainer}
          onPress={handleSubmit(onOpenVideoPlayer)}
          title="Open VideoURL"
        />
      </View>
      <PlayerConfigurationModal
        playerConfiguration={playerConfiguration}
        visible={showPlayerConfiguration}
        onRequestClose={() => {
          setShowPlayerConfiguration(false);
        }}
        onSubmit={(playerConfiguration) => {
          setPlayerConfiguration(playerConfiguration);
          setTimeout(() => {
            setShowPlayerConfiguration(false);
          }, 0);
        }}
      />
    </View>
  );
}
