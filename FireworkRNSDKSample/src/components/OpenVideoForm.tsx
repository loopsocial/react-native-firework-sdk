import CommonStyles from './CommonStyles';
import FireworkSDK, {
  type VideoPlayerConfiguration,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import PlayerConfigurationModal from './PlayerConfigurationModal';
import { useState } from 'react';
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
  const defaultPlayerConfiguration: VideoPlayerConfiguration = {
    playerStyle: 'full',
    videoCompleteAction: 'advanceToNext',
    showShareButton: true,
    showMuteButton: true,
    showPlaybackButton: true,
    ctaButtonStyle: {
      fontSize: 14,
      iOSFontInfo: { systemFontWeight: 'bold' },
    },
    ctaDelay: {
      type: 'constant',
      value: 3,
    },
    ctaHighlightDelay: {
      type: 'constant',
      value: 2,
    },
    ctaWidth: 'fullWidth',
    showVideoDetailTitle: true,
    videoPlayerLogoConfiguration: {
      option: 'disabled',
      isClickable: true,
    },
  };
  const [playerConfiguration, setPlayerConfiguration] = useState<
    VideoPlayerConfiguration | undefined
  >(defaultPlayerConfiguration);
  const [showPlayerConfiguration, setShowPlayerConfiguration] =
    useState<boolean>(false);
  console.log('OpenVideoForm errors', errors);

  const onOpenVideoPlayer = (data: OpenVideoFormData) => {
    console.log('OpenVideoForm data', data);
    FireworkSDK.getInstance().openVideoPlayer(data.videoURL, {
      ...playerConfiguration,
      enablePictureInPicture: false,
    });
  };

  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>Video URL</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
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
                    ? 'Please enter Video URL'
                    : 'Please enter correct Video URL'
                  : undefined
              }
              autoComplete={undefined}
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
          title="Open"
        />
      </View>
      <PlayerConfigurationModal
        visible={showPlayerConfiguration}
        playerConfiguration={playerConfiguration}
        defaultPlayerConfiguration={defaultPlayerConfiguration}
        onRequestClose={() => {
          setShowPlayerConfiguration(false);
        }}
        onSubmit={(newPlayerConfiguration) => {
          setPlayerConfiguration(newPlayerConfiguration);
          setTimeout(() => {
            setShowPlayerConfiguration(false);
          }, 0);
        }}
      />
    </View>
  );
}
