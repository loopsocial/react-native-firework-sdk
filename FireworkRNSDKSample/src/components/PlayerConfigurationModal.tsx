import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useEffect } from 'react';
import { Button, ButtonGroup, CheckBox, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import type {
  VideoPlayerConfiguration,
  VideoPlayerStyle,
  VideoPlayerCompleteAction,
} from 'react-native-firework-sdk';

export interface IPlayerConfigurationModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  playerConfiguration?: VideoPlayerConfiguration;
  onSubmit?: (configuration: VideoPlayerConfiguration) => void;
}

type PlayerConfigurationFormData = {
  playerStyle?: number;
  videoCompleteAction?: number;
  showShareButton?: boolean;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  ctaFontSize?: string;
};

const PlayStyleList: VideoPlayerStyle[] = ['full', 'fit'];
const VideoCompleteActionList: VideoPlayerCompleteAction[] = [
  'loop',
  'advanceToNext',
];

const PlayerConfigurationModal = ({
  visible,
  playerConfiguration,
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

  useEffect(() => {
    if (playerConfiguration) {
      if (playerConfiguration.playerStyle) {
        const playerStyleIndex = PlayStyleList.indexOf(
          playerConfiguration.playerStyle
        );
        if (playerStyleIndex >= 0) {
          setValue('playerStyle', playerStyleIndex);
        } else {
          setValue('playerStyle', undefined);
        }
      } else {
        setValue('playerStyle', undefined);
      }

      if (playerConfiguration.videoCompleteAction) {
        const videoCompleteActionIndex = VideoCompleteActionList.indexOf(
          playerConfiguration.videoCompleteAction
        );
        if (videoCompleteActionIndex >= 0) {
          setValue('videoCompleteAction', videoCompleteActionIndex);
        } else {
          setValue('videoCompleteAction', undefined);
        }
      } else {
        setValue('videoCompleteAction', undefined);
      }
      setValue('showShareButton', playerConfiguration.showShareButton);
      setValue(
        'ctaBackgroundColor',
        playerConfiguration.ctaButtonStyle?.backgroundColor
      );
      setValue('ctaTextColor', playerConfiguration.ctaButtonStyle?.textColor);
      setValue(
        'ctaFontSize',
        playerConfiguration.ctaButtonStyle?.fontSize?.toString()
      );
    } else {
      reset();
    }
  }, [playerConfiguration]);

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
        if (onRequestClose) {
          onRequestClose();
        }
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
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
            <Text style={styles.sectionTitle}>VideoPlayerConfiguration</Text>
            <View style={styles.formItemRow}>
              <View style={{ ...styles.formItem }}>
                <Text style={styles.formItemLabel}>PlayerStyle</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      buttons={PlayStyleList}
                      selectedIndex={value}
                      onPress={(value) => {
                        onChange(value);
                      }}
                    />
                  )}
                  name="playerStyle"
                />
              </View>
            </View>
            <View style={styles.formItemRow}>
              <View style={styles.formItem}>
                <Text style={styles.formItemLabel}>VideoCompleteAction</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      buttons={VideoCompleteActionList}
                      selectedIndex={value}
                      onPress={(value) => {
                        onChange(value);
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
                        title="Show Share Button"
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
                      label="CTA BackgroundColor"
                      placeholder="e.g. #c0c0c0"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
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
                      label="CTA TextColor"
                      placeholder="e.g. #000000"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
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
                      label="CTA FontSize"
                      placeholder="e.g. 14"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      errorMessage={
                        errors.ctaFontSize
                          ? 'Please enter correct font size'
                          : undefined
                      }
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
                  }}
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
                  reset();
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
          </View>
        </View>
      </TouchableWithoutFeedback>
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
