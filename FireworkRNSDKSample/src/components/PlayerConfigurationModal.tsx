import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useCallback, useEffect } from 'react';
import { Button, ButtonGroup, CheckBox, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import type {
  VideoPlayerConfiguration,
  VideoPlayerStyle,
  VideoPlayerCompleteAction,
  VideoLaunchBehavior,
} from 'react-native-firework-sdk';

export interface IPlayerConfigurationModalProps {
  visible: boolean;
  playerConfiguration?: VideoPlayerConfiguration;
  defaultPlayerConfiguration?: VideoPlayerConfiguration;
  onRequestClose?: () => void;
  onSubmit?: (configuration: VideoPlayerConfiguration) => void;
}

type PlayerConfigurationFormData = {
  playerStyle?: number;
  videoCompleteAction?: number;
  showShareButton?: boolean;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  ctaFontSize?: string;
  showPlaybackButton?: boolean;
  showMuteButton?: boolean;
  launchBehavior?: number;
};

const PlayStyleList: VideoPlayerStyle[] = ['full', 'fit'];
const VideoCompleteActionList: VideoPlayerCompleteAction[] = [
  'loop',
  'advanceToNext',
];

const VideoLaunchBehaviorList: VideoLaunchBehavior[] = [
  'default',
  'muteOnFirstLaunch',
];

const PlayerConfigurationModal = ({
  visible,
  playerConfiguration,
  defaultPlayerConfiguration,
  onRequestClose,
  onSubmit,
}: IPlayerConfigurationModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PlayerConfigurationFormData>();

  let ctaFontSizeErrorMessage: string | undefined;
  if (errors.ctaFontSize) {
    if (
      errors.ctaFontSize.type === 'max' ||
      errors.ctaFontSize.type === 'min'
    ) {
      ctaFontSizeErrorMessage = 'Please enter font size in [8, 30]';
    } else {
      ctaFontSizeErrorMessage = 'Please enter correct font size';
    }
  }
  const syncFormValuesFromConfiguration = useCallback(
    (configuration?: VideoPlayerConfiguration) => {
      if (configuration) {
        if (configuration.playerStyle) {
          const playerStyleIndex = PlayStyleList.indexOf(
            configuration.playerStyle
          );
          if (playerStyleIndex >= 0) {
            setValue('playerStyle', playerStyleIndex);
          } else {
            setValue('playerStyle', undefined);
          }
        } else {
          setValue('playerStyle', undefined);
        }

        if (configuration.videoCompleteAction) {
          const videoCompleteActionIndex = VideoCompleteActionList.indexOf(
            configuration.videoCompleteAction
          );
          if (videoCompleteActionIndex >= 0) {
            setValue('videoCompleteAction', videoCompleteActionIndex);
          } else {
            setValue('videoCompleteAction', undefined);
          }
        } else {
          setValue('videoCompleteAction', undefined);
        }

        setValue('showShareButton', configuration.showShareButton);
        setValue(
          'ctaBackgroundColor',
          configuration.ctaButtonStyle?.backgroundColor
        );
        setValue('ctaTextColor', configuration.ctaButtonStyle?.textColor);
        setValue(
          'ctaFontSize',
          configuration.ctaButtonStyle?.fontSize?.toString()
        );
        setValue('showPlaybackButton', configuration.showPlaybackButton);
        setValue('showMuteButton', configuration.showMuteButton);
        if (configuration.launchBehavior) {
          const launchBehaviorIndex = VideoLaunchBehaviorList.indexOf(
            configuration.launchBehavior
          );
          if (launchBehaviorIndex >= 0) {
            setValue('launchBehavior', launchBehaviorIndex);
          } else {
            setValue('launchBehavior', undefined);
          }
        } else {
          setValue('launchBehavior', undefined);
        }
      } else {
        reset();
      }
    },
    [setValue, reset]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration(playerConfiguration);
  }, [playerConfiguration, syncFormValuesFromConfiguration]);

  const onSave = (data: PlayerConfigurationFormData) => {
    if (onSubmit) {
      console.log('onSave PlayerConfigurationFormData', data);
      var configuration: VideoPlayerConfiguration = {};
      configuration.playerStyle =
        typeof data.playerStyle === 'number'
          ? PlayStyleList[data.playerStyle]
          : undefined;
      configuration.videoCompleteAction =
        typeof data.videoCompleteAction === 'number'
          ? VideoCompleteActionList[data.videoCompleteAction]
          : undefined;
      configuration.showShareButton = data.showShareButton;
      configuration.ctaButtonStyle = {
        backgroundColor: data.ctaBackgroundColor,
        textColor: data.ctaTextColor,
        fontSize:
          typeof data.ctaFontSize === 'string'
            ? parseInt(data.ctaFontSize)
            : undefined,
      };
      configuration.showPlaybackButton = data.showPlaybackButton;
      configuration.showMuteButton = data.showMuteButton;
      configuration.launchBehavior =
        typeof data.launchBehavior === 'number'
          ? VideoLaunchBehaviorList[data.launchBehavior]
          : undefined;
      console.log('configuration', configuration);
      onSubmit(configuration);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        syncFormValuesFromConfiguration(playerConfiguration);
        if (onRequestClose) {
          onRequestClose();
        }
      }}
    >
      <View style={styles.content}>
        <View
          style={{
            ...CommonStyles.formContainer,
            ...styles.formContainerExtra,
          }}
        >
          <ScrollView>
            <Text style={styles.sectionTitle}>Video Player Configuration</Text>
            <View style={styles.formItemRow}>
              <View style={{ ...styles.formItem }}>
                <Text style={styles.formItemLabel}>Player style</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      buttons={PlayStyleList}
                      selectedIndex={value}
                      onPress={(newValue) => {
                        onChange(newValue);
                      }}
                    />
                  )}
                  name="playerStyle"
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={styles.formItem}>
                <Text style={styles.formItemLabel}>Video complete action</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      buttons={VideoCompleteActionList}
                      selectedIndex={value}
                      onPress={(newValue) => {
                        onChange(newValue);
                      }}
                    />
                  )}
                  name="videoCompleteAction"
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={styles.formItem}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CheckBox
                        center
                        title="Show share button"
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    );
                  }}
                  name="showShareButton"
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={{ ...styles.formItem, marginRight: 10 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="CTA background color"
                      placeholder="e.g. #c0c0c0"
                      onBlur={onBlur}
                      onChangeText={(newValue) => onChange(newValue)}
                      value={value}
                      errorMessage={
                        errors.ctaBackgroundColor
                          ? 'Please enter correct color'
                          : undefined
                      }
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => {
                            setValue('ctaBackgroundColor', undefined);
                          }}
                        >
                          <Ionicons name="close" size={24} />
                        </TouchableOpacity>
                      }
                      autoCompleteType={undefined}
                    />
                  )}
                  name="ctaBackgroundColor"
                  rules={{
                    pattern: Patterns.hexColor,
                  }}
                />
              </View>
              <View style={styles.formItem}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="CTA text color"
                      placeholder="e.g. #000000"
                      onBlur={onBlur}
                      onChangeText={(newValue) => onChange(newValue)}
                      value={value}
                      errorMessage={
                        errors.ctaTextColor
                          ? 'Please enter correct color'
                          : undefined
                      }
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => {
                            setValue('ctaTextColor', undefined);
                          }}
                        >
                          <Ionicons name="close" size={24} />
                        </TouchableOpacity>
                      }
                      autoCompleteType={undefined}
                    />
                  )}
                  name="ctaTextColor"
                  rules={{
                    pattern: Patterns.hexColor,
                  }}
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={{ ...styles.formItem, flex: 0.5, marginRight: 10 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="CTA font size"
                      placeholder="e.g. 14"
                      onBlur={onBlur}
                      onChangeText={(newValue) => onChange(newValue)}
                      value={value}
                      errorMessage={ctaFontSizeErrorMessage}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => {
                            setValue('ctaFontSize', undefined);
                          }}
                        >
                          <Ionicons name="close" size={24} />
                        </TouchableOpacity>
                      }
                      autoCompleteType={undefined}
                    />
                  )}
                  name="ctaFontSize"
                  rules={{
                    pattern: Patterns.number,
                    max: 30,
                    min: 8,
                  }}
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={{ ...styles.formItem, marginRight: 10 }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CheckBox
                        center
                        title={`Show playback${'\n'}button`}
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    );
                  }}
                  name="showPlaybackButton"
                />
              </View>
              <View style={styles.formItem}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CheckBox
                        center
                        title={`Show mute${'\n'}button`}
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    );
                  }}
                  name="showMuteButton"
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={styles.formItem}>
                <Text style={styles.formItemLabel}>Video launch behavior</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      buttons={VideoLaunchBehaviorList}
                      selectedIndex={value}
                      onPress={(newValue) => {
                        onChange(newValue);
                      }}
                    />
                  )}
                  name="launchBehavior"
                />
              </View>
            </View>
            <View style={{ ...CommonStyles.formItem, ...styles.buttonList }}>
              <Button
                type="outline"
                titleStyle={CommonStyles.mainButtonText}
                containerStyle={{
                  ...CommonStyles.mainButtonContainer,
                  flex: 1,
                  marginRight: 20,
                }}
                onPress={() => {
                  syncFormValuesFromConfiguration(playerConfiguration);
                  if (onRequestClose) {
                    onRequestClose();
                  }
                }}
                title="Cancel"
              />
              <Button
                buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
                titleStyle={CommonStyles.mainButtonText}
                containerStyle={{
                  ...CommonStyles.mainButtonContainer,
                  flex: 1,
                  marginRight: 20,
                }}
                onPress={() => {
                  syncFormValuesFromConfiguration(defaultPlayerConfiguration);
                }}
                title="Reset"
              />
              <Button
                titleStyle={CommonStyles.mainButtonText}
                containerStyle={{
                  ...CommonStyles.mainButtonContainer,
                  flex: 1,
                }}
                onPress={handleSubmit(onSave)}
                title="Save"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formContainerExtra: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
  },
  buttonList: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formItemRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formItem: {
    flex: 1,
  },
  formItemLabel: {
    color: '#86939e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PlayerConfigurationModal;
