import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import { useCallback, useEffect, useState } from 'react';
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
  KeyboardAvoidingView,
  Platform,
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
  enablePiP?: boolean;
  defaultEnablePiP?: boolean;
  onRequestClose?: () => void;
  onSubmit?: (
    configuration: VideoFeedConfiguration,
    adConfiguration: AdConfiguration,
    enablePiP: boolean
  ) => void;
}

type FeedConfigurationFormData = {
  backgroundColor?: string;
  cornerRadius?: string;
  hideTitle?: boolean;
  titleColor?: string;
  titleFontSize?: string;
  titleIOSFontName?: string;
  titleAndroidFontName?: string;
  titlePosition?: number;
  hidePlayIcon?: boolean;
  playIconWidth?: string;
  showAdBadge?: boolean;
  enableAutoplay?: boolean;
  requiresAds?: boolean;
  vastAttributes?: string;
  enablePictureInPicture?: boolean;
  gridColumns?: string;
  titleNumberOfLines?: string;
  showReplayBadge?: boolean;
  shadowOpacity?: string;
  shadowColor?: string;
  shadowWidth?: string;
  shadowHeight?: string;
};

const TitlePositionList: VideoFeedTitlePosition[] = ['stacked', 'nested'];

const FeedConfigurationModal = ({
  visible,
  feedConfiguration,
  defaultFeedConfiguration,
  feedAdConfiguration,
  defaultFeedAdConfiguration,
  enablePiP,
  defaultEnablePiP,
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

  let gridColumnsErrorMessage: string | undefined;
  if (errors.gridColumns) {
    if (
      errors.gridColumns.type === 'max' ||
      errors.gridColumns.type === 'min'
    ) {
      gridColumnsErrorMessage = 'Please enter grid columns in [2, 8]';
    } else {
      gridColumnsErrorMessage = 'Please enter correct grid columns';
    }
  }

  let titleNumberOfLinesErrorMessage: string | undefined;
  if (errors.titleNumberOfLines) {
    if (
      errors.titleNumberOfLines.type === 'max' ||
      errors.titleNumberOfLines.type === 'min'
    ) {
      titleNumberOfLinesErrorMessage = 'Please enter number of lines in [1, 5]';
    } else {
      titleNumberOfLinesErrorMessage = 'Please enter correct grid columns';
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

  let shadowOpacityErrorMessage: string | undefined;
  if (errors.shadowOpacity) {
    if (
      errors.shadowOpacity.type === 'max' ||
      errors.shadowOpacity.type === 'min'
    ) {
      shadowOpacityErrorMessage = 'Please enter opacity in [0, 1]';
    } else {
      shadowOpacityErrorMessage = 'Please enter correct opacity';
    }
  }

  const syncFormValuesFromConfiguration = useCallback(
    (
      configuration?: VideoFeedConfiguration,
      adConfiguration?: AdConfiguration,
      enablePictureInPicture?: boolean
    ) => {
      setValue('backgroundColor', configuration?.backgroundColor);
      setValue('cornerRadius', configuration?.cornerRadius?.toString());
      setValue('hideTitle', configuration?.title?.hidden);
      setValue('titleColor', configuration?.title?.textColor);
      setValue('titleFontSize', configuration?.title?.fontSize?.toString());
      setValue('titleIOSFontName', configuration?.title?.iOSFontInfo?.fontName);
      setValue(
        'titleAndroidFontName',
        configuration?.title?.androidFontInfo?.typefaceName
      );
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
      setValue('gridColumns', configuration?.gridColumns?.toString());
      setValue(
        'titleNumberOfLines',
        configuration?.title?.numberOfLines?.toString()
      );
      setValue('showAdBadge', configuration?.showAdBadge);
      setValue('enableAutoplay', configuration?.enableAutoplay);
      setValue('enablePictureInPicture', enablePictureInPicture);
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
      setValue(
        'showReplayBadge',
        configuration?.replayBadge?.isHidden === false
      );
      setValue('shadowOpacity', configuration?.shadow?.opacity?.toString());
      setValue('shadowColor', configuration?.shadow?.color);
      setValue('shadowWidth', configuration?.shadow?.width?.toString());
      setValue('shadowHeight', configuration?.shadow?.height?.toString());
    },
    [setValue]
  );

  useEffect(() => {
    syncFormValuesFromConfiguration(
      feedConfiguration,
      feedAdConfiguration,
      enablePiP
    );
  }, [
    feedConfiguration,
    feedAdConfiguration,
    enablePiP,
    syncFormValuesFromConfiguration,
  ]);

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
          typeof data.titleFontSize === 'string' && data.titleFontSize
            ? parseInt(data.titleFontSize!)
            : undefined,
        numberOfLines:
          typeof data.titleNumberOfLines === 'string' && data.titleNumberOfLines
            ? parseInt(data.titleNumberOfLines!)
            : undefined,
        iOSFontInfo: {
          fontName: data.titleIOSFontName,
        },
        androidFontInfo: {
          isCustom: false,
          typefaceName: data.titleAndroidFontName,
        },
      };
      configuration.titlePosition =
        typeof data.titlePosition === 'number'
          ? TitlePositionList[data.titlePosition!]
          : undefined;
      configuration.playIcon = {
        hidden: data.hidePlayIcon ? true : false,
        iconWidth:
          typeof data.playIconWidth === 'string' && data.playIconWidth
            ? parseInt(data.playIconWidth!)
            : undefined,
      };
      configuration.gridColumns =
        typeof data.gridColumns === 'string' && data.gridColumns
          ? parseInt(data.gridColumns!)
          : undefined;
      configuration.showAdBadge = data.showAdBadge;
      configuration.enableAutoplay = data.enableAutoplay;
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
      configuration.replayBadge = {
        isHidden: data.showReplayBadge === true ? false : true,
      };
      configuration.shadow = {
        opacity:
          typeof data.shadowOpacity === 'string' && data.shadowOpacity
            ? parseFloat(data.shadowOpacity)
            : undefined,
        color: data.shadowColor,
        width:
          typeof data.shadowWidth === 'string' && data.shadowWidth
            ? parseFloat(data.shadowWidth)
            : undefined,
        height:
          typeof data.shadowHeight === 'string' && data.shadowHeight
            ? parseFloat(data.shadowHeight)
            : undefined,
      };

      onSubmit(
        configuration,
        adConfiguration,
        data.enablePictureInPicture ?? false
      );
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
              autoComplete={undefined}
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
              autoComplete={undefined}
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
                autoComplete={undefined}
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
                autoComplete={undefined}
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
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Number of title lines"
                placeholder="e.g. 1"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={titleNumberOfLinesErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('titleNumberOfLines', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="titleNumberOfLines"
            rules={{
              pattern: Patterns.number,
              min: 1,
              max: 5,
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
                label="Title iOS font name"
                placeholder="e.g. Helvetica-Bold"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('titleIOSFontName', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="titleIOSFontName"
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem, marginRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title android typeface name"
                placeholder="e.g. MONOSPACE"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('titleAndroidFontName', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="titleAndroidFontName"
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
              autoComplete={undefined}
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

  const gridColumnsConfiguration = (
    <View style={styles.formItemRow}>
      <View style={{ ...styles.formItem }}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Grid columns"
              placeholder="e.g. 2"
              onBlur={onBlur}
              onChangeText={(newValue) => onChange(newValue)}
              value={value}
              errorMessage={gridColumnsErrorMessage}
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    setValue('gridColumns', undefined);
                  }}
                >
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              }
              autoComplete={undefined}
            />
          )}
          name="gridColumns"
          rules={{
            pattern: Patterns.number,
            min: 2,
            max: 8,
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
              autoComplete={undefined}
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

  const showReplayBadgeRow = (
    <View style={styles.formItemRow}>
      <View style={styles.formItem}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <CheckBox
                center
                title="Show Replay Badge"
                checked={value}
                onPress={() => onChange(!value)}
              />
            );
          }}
          name="showReplayBadge"
        />
      </View>
    </View>
  );

  const shadowConfiguration = (
    <>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shadow opacity"
                placeholder="e.g. 0.6"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={shadowOpacityErrorMessage}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('shadowOpacity', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="shadowOpacity"
            rules={{
              pattern: Patterns.float,
              max: 1,
              min: 0,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shadow color"
                placeholder="e.g. #000000"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.shadowColor ? 'Please enter correct color' : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('shadowColor', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="shadowColor"
            rules={{
              pattern: Patterns.hexColor,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shadow width"
                placeholder="e.g. 0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.shadowWidth ? 'Please enter width' : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('shadowWidth', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="shadowWidth"
            rules={{
              pattern: Patterns.number,
            }}
          />
        </View>
      </View>
      <View style={styles.formItemRow}>
        <View style={{ ...styles.formItem }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shadow height"
                placeholder="e.g. 0"
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                errorMessage={
                  errors.shadowHeight ? 'Please enter height' : undefined
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('shadowHeight', undefined);
                    }}
                  >
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                }
                autoComplete={undefined}
              />
            )}
            name="shadowHeight"
            rules={{
              pattern: Patterns.number,
            }}
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
        console.log('onRequestClose');
        syncFormValuesFromConfiguration(
          feedConfiguration,
          feedAdConfiguration,
          enablePiP
        );
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
                  {gridColumnsConfiguration}
                  {showReplayBadgeRow}
                  {shadowConfiguration}
                </View>
              )}
              {configurationIndex === 1 && (
                <View style={styles.configurationContent}>
                  {requiresAds}
                  {vastAttributes}
                  {showAdBadgeRow}
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
                      feedAdConfiguration,
                      enablePiP
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
                      defaultFeedAdConfiguration,
                      defaultEnablePiP
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
  configurationContent: {
    paddingTop: 10,
  },
});

export default FeedConfigurationModal;
