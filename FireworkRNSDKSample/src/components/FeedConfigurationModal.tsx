import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, ButtonGroup, CheckBox, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import type {
  VastAttribute,
  AdConfiguration,
  VideoFeedConfiguration,
  VideoFeedTitlePosition,
} from 'react-native-firework-sdk';

export interface IFeedConfigurationModalProps {
  visible: boolean;
  feedConfiguration?: VideoFeedConfiguration;
  defaultFeedConfiguration?: VideoFeedConfiguration;
  feedAdConfiguration?: AdConfiguration;
  defaultFeedAdConfiguration?: AdConfiguration;
  onRequestClose?: () => void;
  onSubmit?: (
    configuration: VideoFeedConfiguration,
    adConfiguration: AdConfiguration
  ) => void;
}

type FeedConfigurationFormData = {
  backgroundColor?: string;
  cornerRadius?: string;
  hideTitle?: boolean;
  titleColor?: string;
  titleFontSize?: string;
  titlePosition?: number;
  hidePlayIcon?: boolean;
  playIconWidth?: string;
  showAdBadge?: boolean;
  enableCustomLayoutName?: boolean;
  enableAutoplay?: boolean;
  requiresAds?: boolean;
  vastAttributes?: string;
  enablePictureInPicture?: boolean;
};

const TitlePositionList: VideoFeedTitlePosition[] = ['stacked', 'nested'];

const FeedConfigurationModal = ({
  visible,
  feedConfiguration,
  defaultFeedConfiguration,
  feedAdConfiguration,
  defaultFeedAdConfiguration,
  onRequestClose,
  onSubmit,
}: IFeedConfigurationModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedConfigurationFormData>();

  const [configurationIndex, setConfigurationIndex] = useState<number>(0);
  const configurationTitles = ['Config 1', 'Config 2'];

  let titleFontSizeErrorMessage: string | undefined;
  if (errors.titleFontSize) {
    if (
      errors.titleFontSize.type === 'max' ||
      errors.titleFontSize.type === 'min'
    ) {
      titleFontSizeErrorMessage = 'Please enter font size in [8, 30]';
    } else {
      titleFontSizeErrorMessage = 'Please enter correct font size';
    }
  }

  let playIconWidthErrorMessage: string | undefined;
  if (errors.playIconWidth) {
    if (
      errors.playIconWidth.type === 'max' ||
      errors.playIconWidth.type === 'min'
    ) {
      playIconWidthErrorMessage = 'Please enter play icon width in [0, 100]';
    } else {
      playIconWidthErrorMessage = 'Please enter correct play icon width';
    }
  }

  let cornerRadiusErrorMessage: string | undefined;
  if (errors.cornerRadius) {
    if (
      errors.cornerRadius.type === 'max' ||
      errors.cornerRadius.type === 'min'
    ) {
      cornerRadiusErrorMessage = 'Please enter corner radius in [0, 50]';
    } else {
      cornerRadiusErrorMessage = 'Please enter correct corner radius';
    }
  }

  let vastAttributesErrorMessage: string | undefined;
  if (errors.vastAttributes) {
    vastAttributesErrorMessage = 'Please enter correct vast attributes';
  }

  const syncFormValuesFromConfiguration = useCallback(
    (
      configuration?: VideoFeedConfiguration,
      adConfiguration?: AdConfiguration
    ) => {
      setValue('backgroundColor', configuration?.backgroundColor);
      setValue('cornerRadius', configuration?.cornerRadius?.toString());
      setValue('hideTitle', configuration?.title?.hidden);
      setValue('titleColor', configuration?.title?.textColor);
      setValue('titleFontSize', configuration?.title?.fontSize?.toString());
      if (configuration && configuration.titlePosition) {
        const titlePositionIndex = TitlePositionList.indexOf(
          configuration.titlePosition!
        );
        setValue(
          'titlePosition',
          titlePositionIndex >= 0 ? titlePositionIndex : undefined
        );
      } else {
        setValue('titlePosition', undefined);
      }
      setValue('hidePlayIcon', configuration?.playIcon?.hidden);
      setValue('playIconWidth', configuration?.playIcon?.iconWidth?.toString());
      setValue('showAdBadge', configuration?.showAdBadge);
      if (configuration && configuration.customLayoutName) {
        setValue('enableCustomLayoutName', true);
      } else {
        setValue('enableCustomLayoutName', false);
      }
      setValue('enableAutoplay', configuration?.enableAutoplay);
      setValue('enablePictureInPicture', configuration?.enablePictureInPicture);
      setValue('requiresAds', adConfiguration?.requiresAds);
      if (adConfiguration && adConfiguration.vastAttributes) {
        var vastAttributesJson: { [key: string]: string } = {};
        adConfiguration.vastAttributes!.forEach((attribute) => {
          if (attribute.name && attribute.value) {
            vastAttributesJson[attribute.name!] = attribute.value;
          }
        });
        setValue('vastAttributes', JSON.stringify(vastAttributesJson));
      } else {
        setValue('vastAttributes', '');
      }
    },
    [setValue]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration(feedConfiguration, feedAdConfiguration);
  }, [feedConfiguration, feedAdConfiguration, syncFormValuesFromConfiguration]);

  const onSave = (data: FeedConfigurationFormData) => {
    if (onSubmit) {
      console.log('onSave FeedConfigurationFormData', data);
      var configuration: VideoFeedConfiguration = {};
      configuration.backgroundColor = data.backgroundColor;
      configuration.cornerRadius = data.cornerRadius
        ? parseInt(data.cornerRadius)
        : undefined;
      configuration.title = {
        hidden: data.hideTitle ? true : false,
        textColor: data.titleColor,
        fontSize:
          typeof data.titleFontSize === 'string'
            ? parseInt(data.titleFontSize!)
            : undefined,
      };
      configuration.titlePosition =
        typeof data.titlePosition === 'number'
          ? TitlePositionList[data.titlePosition!]
          : undefined;
      configuration.playIcon = {
        hidden: data.hidePlayIcon ? true : false,
        iconWidth:
          typeof data.playIconWidth === 'string'
            ? parseInt(data.playIconWidth)
            : undefined,
      };
      configuration.showAdBadge = data.showAdBadge;
      if (data.enableCustomLayoutName) {
        configuration.customLayoutName = 'fw_feed_custom_layout';
      }
      configuration.enableAutoplay = data.enableAutoplay;
      configuration.enablePictureInPicture = data.enablePictureInPicture;
      console.log('configuration', configuration);
      var adConfiguration: AdConfiguration = {};
      adConfiguration.requiresAds = data.requiresAds;
      adConfiguration.adsFetchTimeout = 20;
      if (data.vastAttributes) {
        let vastAttributesJson = JSON.parse(data.vastAttributes);
        let vastAttributesJsonKeys = Object.keys(vastAttributesJson);
        var vastAttributes: VastAttribute[] = [];
        for (let jsonKey of vastAttributesJsonKeys) {
          vastAttributes.push({
            name: jsonKey,
            value: vastAttributesJson[jsonKey],
          });
        }
        adConfiguration.vastAttributes = vastAttributes;
      }
      console.log('adConfiguration', adConfiguration);
      onSubmit(configuration, adConfiguration);
    }
  };

  const backgroundColorAndCornerRadius = (
    <View style={styles.formItemRow}>
      <View style={{ ...styles.formItem, marginRight: 10 }}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Background color"
              placeholder="e.g. #c0c0c0"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={
                errors.backgroundColor
                  ? 'Please enter correct color'
                  : undefined
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('backgroundColor', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoCompleteType={undefined}
            />
          )}
          name="backgroundColor"
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
              label="Corner radius"
              placeholder="e.g. 30"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              errorMessage={cornerRadiusErrorMessage}
              value={value}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('cornerRadius', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoCompleteType={undefined}
            />
          )}
          name="cornerRadius"
          rules={{
            pattern: Patterns.number,
            min: 0,
            max: 50,
          }}
        />
      </View>
    </View>
  );

  const titleConfiguration = (
    <>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem, marginRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <CheckBox
                  center
                  title="Hide title"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="hideTitle"
          />
        </View>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title color"
                placeholder="e.g. #000000"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.titleColor ? 'Please enter correct color' : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('titleColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="titleColor"
            rules={{
              pattern: Patterns.hexColor,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem, marginRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title font size"
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={titleFontSizeErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('titleFontSize', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoCompleteType={undefined}
              />
            )}
            name="titleFontSize"
            rules={{
              pattern: Patterns.number,
              max: 30,
              min: 8,
            }}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>Title position</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={TitlePositionList}
                selectedIndex={value}
                onPress={(newValue) => {
                  onChange(newValue);
                }}
              />
            )}
            name="titlePosition"
          />
        </View>
      </View>
    </>
  );

  const playIconConfiguration = (
    <View style={styles.formItemRow}>
      <View style={{ ...styles.formItem, marginRight: 10 }}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Hide play icon"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="hidePlayIcon"
        />
      </View>
      <View style={{ ...styles.formItem }}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Play icon width"
              placeholder="e.g. 36"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={playIconWidthErrorMessage}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('playIconWidth', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoCompleteType={undefined}
            />
          )}
          name="playIconWidth"
          rules={{
            pattern: Patterns.number,
            min: 0,
            max: 100,
          }}
        />
      </View>
    </View>
  );

  const requiresAds = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Requires Ads"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="requiresAds"
        />
      </View>
    </View>
  );

  const vastAttributes = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Vast attributes"
              multiline
              numberOfLines={5}
              style={{ height: 100 }}
              placeholder={'e.g. {"name1": "value1", "name2": "value2"}'}
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('vastAttributes', '');
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              errorMessage={vastAttributesErrorMessage}
              autoCompleteType={undefined}
            />
          )}
          name="vastAttributes"
          rules={{
            validate: (value) => {
              if (!value) {
                return true;
              }
              const errorMessage = 'Please enter correct vast attributes';
              try {
                const jsonParsedResult = JSON.parse(value ?? '');
                if (typeof jsonParsedResult === 'object') {
                  const keyList = Object.keys(jsonParsedResult);
                  if (keyList.length === 0) {
                    return errorMessage;
                  }
                  for (const key of keyList) {
                    const jsonValue = jsonParsedResult[key];
                    if (typeof jsonValue !== 'string') {
                      return errorMessage;
                    }
                  }
                } else {
                  return errorMessage;
                }
                console.log('jsonParsedResult', jsonParsedResult);
              } catch (e) {
                console.log('jsonParsedError', e);
                return errorMessage;
              }
              return true;
            },
          }}
          defaultValue=""
        />
      </View>
    </View>
  );

  const showAdBadgeRow = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Show Ad Badge"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="showAdBadge"
        />
      </View>
    </View>
  );

  const enableCustomLayoutName = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Enable Custom Layout Name(Android)"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableCustomLayoutName"
        />
      </View>
    </View>
  );

  const enableAutoplay = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Enable Autoplay"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enableAutoplay"
        />
      </View>
    </View>
  );

  const enablePictureInPicture = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Enable Picture In Picture"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="enablePictureInPicture"
        />
      </View>
    </View>
  );
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('onRequestClose');
        syncFormValuesFromConfiguration(feedConfiguration, feedAdConfiguration);
        if (onRequestClose) {
          onRequestClose();
        }
      }}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.content}>
          <View
            style={{
              ...CommonStyles.formContainer,
              ...styles.formContainerExtra,
            }}
          >
            <ScrollView>
              <Text style={styles.sectionTitle}>Video Feed Configuration</Text>
              <ButtonGroup
                selectedIndex={configurationIndex}
                onPress={setConfigurationIndex}
                buttons={configurationTitles}
              />

              {configurationIndex === 0 && (
                <View style={styles.configurationContent}>
                  {backgroundColorAndCornerRadius}
                  {titleConfiguration}
                  {playIconConfiguration}
                </View>
              )}
              {configurationIndex === 1 && (
                <View style={styles.configurationContent}>
                  {requiresAds}
                  {vastAttributes}
                  {showAdBadgeRow}
                  {enableCustomLayoutName}
                  {enableAutoplay}
                  {enablePictureInPicture}
                </View>
              )}
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
                    syncFormValuesFromConfiguration(
                      feedConfiguration,
                      feedAdConfiguration
                    );
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
                    syncFormValuesFromConfiguration(
                      defaultFeedConfiguration,
                      defaultFeedAdConfiguration
                    );
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
  configurationContent: {
    paddingTop: 10,
  },
});

export default FeedConfigurationModal;
