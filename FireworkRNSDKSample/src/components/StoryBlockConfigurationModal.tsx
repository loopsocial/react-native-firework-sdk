import React, { useCallback, useEffect, useState } from 'react';

import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  ButtonGroup,
  CheckBox,
  Input,
  Slider,
} from 'react-native-elements';
import type {
  StoryBlockConfiguration,
  VideoPlayerCompleteAction,
  VideoPlayerCTADelayType,
  VideoPlayerCTAWidth,
} from 'react-native-firework-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Patterns from '../constants/Patterns';
import CommonStyles from './CommonStyles';

export interface IStoryBlockConfigurationModalProps {
  visible: boolean;
  storyBlockConfiguration?: StoryBlockConfiguration;
  defaultStoryBlockConfiguration?: StoryBlockConfiguration;
  onRequestClose?: () => void;
  onSubmit?: (configuration: StoryBlockConfiguration) => void;
}

type StoryBlockConfigurationFormData = {
  videoCompleteAction?: number;
  showShareButton?: boolean;
  showPlaybackButton?: boolean;
  ctaDelayType?: number;
  ctaDelayValue?: number;
  ctaHighlightDelayType?: number;
  ctaHighlightDelayValue?: number;
  shareBaseURL?: string;
  ctaWidth?: number;
  showVideoDetailTitle?: boolean;
};

const VideoCompleteActionList: VideoPlayerCompleteAction[] = [
  'loop',
  'advanceToNext',
];

const CTADelayTypeList: VideoPlayerCTADelayType[] = ['constant', 'percentage'];
const CTAWidthList: VideoPlayerCTAWidth[] = [
  'fullWidth',
  'compact',
  'sizeToFit',
];

const StoryBlockConfigurationModal = ({
  visible,
  storyBlockConfiguration: playerConfiguration,
  defaultStoryBlockConfiguration: defaultPlayerConfiguration,
  onRequestClose,
  onSubmit,
}: IStoryBlockConfigurationModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StoryBlockConfigurationFormData>();
  const [configurationIndex, setConfigurationIndex] = useState<number>(0);
  const configurationTitles = ['Config 1', 'Config 2'];

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
    (configuration?: StoryBlockConfiguration) => {
      if (configuration) {
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
        setValue('showPlaybackButton', configuration.showPlaybackButton);

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

        setValue('shareBaseURL', configuration.shareBaseURL);
        setValue('showVideoDetailTitle', configuration.showVideoDetailTitle);

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

  const onSave = (data: StoryBlockConfigurationFormData) => {
    if (onSubmit) {
      console.log('onSave PlayerConfigurationFormData', data);
      var configuration: StoryBlockConfiguration = {};
      configuration.videoCompleteAction =
        typeof data.videoCompleteAction === 'number'
          ? VideoCompleteActionList[data.videoCompleteAction]
          : undefined;
      configuration.showShareButton = data.showShareButton;
      configuration.showPlaybackButton = data.showPlaybackButton;

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
      configuration.shareBaseURL = data.shareBaseURL;
      configuration.ctaWidth =
        typeof data.ctaWidth === 'number'
          ? CTAWidthList[data.ctaWidth]
          : undefined;
      configuration.showVideoDetailTitle = data.showVideoDetailTitle;
      console.log('configuration', configuration);
      onSubmit(configuration);
    }
  };

  const config1 = (
    <>
      <View style={styles.formItemRow}>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>
            {Platform.OS === 'android'
              ? 'Video complete action'
              : 'Video Player CompleteAction(only apply to full-screen story block on iOS)'}
          </Text>
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
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem, marginRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title={`Show video${'\n'}detail title`}
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="showVideoDetailTitle"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Share base URL"
                placeholder="e.g. https://example.com"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.shareBaseURL ? 'Please enter correct url' : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('shareBaseURL', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
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
              <Text style={styles.sectionTitle}>Story Block Configuration</Text>
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

export default StoryBlockConfigurationModal;
