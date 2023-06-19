import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  CheckBox,
  Input,
  Slider,
} from 'react-native-elements';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type {
  VideoPlayerConfiguration,
  VideoPlayerStyle,
  VideoPlayerCompleteAction,
  VideoLaunchBehavior,
  VideoPlayerCTADelayType,
  VideoPlayerCTAWidth,
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
  ctaIOSFontName?: string;
  showPlaybackButton?: boolean;
  showMuteButton?: boolean;
  launchBehavior?: number;
  ctaDelayType?: number;
  ctaDelayValue?: number;
  ctaHighlightDelayType?: number;
  ctaHighlightDelayValue?: number;
  ctaWidth?: number;
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

const CTADelayTypeList: VideoPlayerCTADelayType[] = ['constant', 'percentage'];
const CTAWidthList: VideoPlayerCTAWidth[] = [
  'fullWidth',
  'compact',
  'sizeToFit',
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
  const [configurationIndex, setConfigurationIndex] = useState<number>(0);
  const configurationTitles = ['Config 1', 'Config 2'];

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

  const ctaDelayType = useWatch({
    control,
    name: 'ctaDelayType',
  });
  const ctaDelayValue = useWatch({
    control,
    name: 'ctaDelayValue',
  });

  const ctaHighlightDelayType = useWatch({
    control,
    name: 'ctaHighlightDelayType',
  });
  const ctaHighlightDelayValue = useWatch({
    control,
    name: 'ctaHighlightDelayValue',
  });

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
        setValue(
          'ctaIOSFontName',
          configuration.ctaButtonStyle?.iOSFontInfo?.fontName
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

        if (configuration.ctaDelay) {
          const typeIndex = CTADelayTypeList.indexOf(
            configuration.ctaDelay?.type ?? ''
          );
          setValue('ctaDelayType', typeIndex < 0 ? 0 : typeIndex);
          setValue('ctaDelayValue', configuration.ctaDelay.value);
        } else {
          setValue('ctaDelayType', undefined);
          setValue('ctaDelayValue', undefined);
        }

        if (configuration.ctaHighlightDelay) {
          const typeIndex = CTADelayTypeList.indexOf(
            configuration.ctaHighlightDelay?.type ?? ''
          );
          setValue('ctaHighlightDelayType', typeIndex < 0 ? 0 : typeIndex);
          setValue(
            'ctaHighlightDelayValue',
            configuration.ctaHighlightDelay.value
          );
        } else {
          setValue('ctaHighlightDelayType', undefined);
          setValue('ctaHighlightDelayValue', undefined);
        }

        if (configuration.ctaWidth) {
          const ctaWidthIndex = CTAWidthList.indexOf(configuration.ctaWidth);
          if (ctaWidthIndex >= 0) {
            setValue('ctaWidth', ctaWidthIndex);
          } else {
            setValue('ctaWidth', undefined);
          }
        } else {
          setValue('ctaWidth', undefined);
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
        iOSFontInfo: {
          fontName: data.ctaIOSFontName,
          systemFontWeight: 'bold',
        },
      };
      configuration.showPlaybackButton = data.showPlaybackButton;
      configuration.showMuteButton = data.showMuteButton;
      configuration.launchBehavior =
        typeof data.launchBehavior === 'number'
          ? VideoLaunchBehaviorList[data.launchBehavior]
          : undefined;
      if (
        typeof data.ctaDelayType === 'number' &&
        typeof data.ctaDelayValue === 'number'
      ) {
        configuration.ctaDelay = {
          type: CTADelayTypeList[data.ctaDelayType],
          value: data.ctaDelayValue,
        };
      }

      if (
        typeof data.ctaHighlightDelayType === 'number' &&
        typeof data.ctaHighlightDelayValue === 'number'
      ) {
        configuration.ctaHighlightDelay = {
          type: CTADelayTypeList[data.ctaHighlightDelayType],
          value: data.ctaHighlightDelayValue,
        };
      }
      configuration.ctaWidth =
        typeof data.ctaWidth === 'number'
          ? CTAWidthList[data.ctaWidth]
          : undefined;
      console.log('configuration', configuration);
      onSubmit(configuration);
    }
  };

  const config1 = (
    <>
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
    </>
  );

  const config2 = (
    <>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Text style={styles.formItemLabel}>CTA width</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={CTAWidthList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="ctaWidth"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Text style={styles.formItemLabel}>CTA Delay Type</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={CTADelayTypeList}
                selectedIndex={value}
                onPress={(newValue) => {
                  if (newValue === 0) {
                    setValue('ctaDelayValue', 3);
                  } else {
                    setValue('ctaDelayValue', 0.3);
                  }
                  onChange(newValue);
                }}
              />
            )}
            name="ctaDelayType"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>{`CTA Delay Value: ${
            ctaDelayValue?.toFixed(2) ?? 0
          }`}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Slider
                key={ctaDelayType?.toString() ?? 'default'}
                minimumValue={0}
                step={ctaDelayType === 0 ? 0.1 : 0.01}
                maximumValue={ctaDelayType === 0 ? 10 : 0.99}
                value={value}
                onValueChange={(newValue) => {
                  onChange(newValue);
                }}
                thumbStyle={{ width: 20, height: 20 }}
              />
            )}
            name="ctaDelayValue"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Text style={styles.formItemLabel}>CTA Highlight Delay Type</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={CTADelayTypeList}
                selectedIndex={value}
                onPress={(newValue) => {
                  if (newValue === 0) {
                    setValue('ctaHighlightDelayValue', 2);
                  } else {
                    setValue('ctaHighlightDelayValue', 0.3);
                  }
                  onChange(newValue);
                }}
              />
            )}
            name="ctaHighlightDelayType"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>{`CTA Highlight Delay Value: ${
            ctaHighlightDelayValue?.toFixed(2) ?? 0
          }`}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Slider
                key={ctaHighlightDelayType?.toString() ?? 'default'}
                minimumValue={0}
                step={ctaHighlightDelayType === 0 ? 0.1 : 0.01}
                maximumValue={ctaHighlightDelayType === 0 ? 10 : 0.99}
                value={value}
                onValueChange={(newValue) => {
                  onChange(newValue);
                }}
                thumbStyle={{ width: 20, height: 20 }}
              />
            )}
            name="ctaHighlightDelayValue"
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
                  errors.ctaTextColor ? 'Please enter correct color' : undefined
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
        <View style={{ ...styles.formItem, flex: 0.5, marginRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CTA iOS font name"
                placeholder="e.g. Helvetica"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('ctaIOSFontName', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="ctaIOSFontName"
          />
        </View>
      </View>
    </>
  );

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
      <TouchableWithoutFeedback onPress={() => {}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View
            style={{
              ...CommonStyles.formContainer,
              ...styles.formContainerExtra,
            }}
          >
            <ScrollView>
              <Text style={styles.sectionTitle}>
                Video Player Configuration
              </Text>
              <ButtonGroup
                containerStyle={styles.configurationButtonGroup}
                selectedIndex={configurationIndex}
                onPress={setConfigurationIndex}
                buttons={configurationTitles}
              />
              {configurationIndex === 0 && config1}
              {configurationIndex === 1 && config2}
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
        </KeyboardAvoidingView>
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
    paddingHorizontal: 15,
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
  configurationButtonGroup: {
    marginBottom: 20,
  },
});

export default PlayerConfigurationModal;
