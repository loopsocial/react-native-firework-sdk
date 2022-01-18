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
  VideoFeedConfiguration,
  VideoFeedTitlePosition,
} from 'react-native-firework-sdk';

export interface IFeedConfigurationModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  feedConfiguration?: VideoFeedConfiguration;
  onSubmit?: (configuration: VideoFeedConfiguration) => void;
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
};

const TitlePositionList: VideoFeedTitlePosition[] = ['stacked', 'nested'];

const FeedConfigurationModal = ({
  visible,
  feedConfiguration,
  onRequestClose,
  onSubmit,
}: IFeedConfigurationModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FeedConfigurationFormData>();

  useEffect(() => {
    if (feedConfiguration) {
      setValue('backgroundColor', feedConfiguration.backgroundColor);
      setValue('cornerRadius', feedConfiguration.cornerRadius?.toString());
      setValue('hideTitle', feedConfiguration.title?.hidden);
      setValue('titleColor', feedConfiguration.title?.textColor);
      setValue('titleFontSize', feedConfiguration.title?.fontSize?.toString());
      if (feedConfiguration.titlePosition) {
        const titlePositionIndex = TitlePositionList.indexOf(
          feedConfiguration.titlePosition
        );
        setValue(
          'titlePosition',
          titlePositionIndex >= 0 ? titlePositionIndex : undefined
        );
      } else {
        setValue('titlePosition', undefined);
      }
      setValue('hidePlayIcon', feedConfiguration.playIcon?.hidden);
      setValue(
        'playIconWidth',
        feedConfiguration.playIcon?.iconWidth?.toString()
      );
    } else {
      reset();
    }
  }, [feedConfiguration]);

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
      console.log('configuration', configuration);
      onSubmit(configuration);
    }
  };

  const backgroundColorAndCornerRadius = (
    <View style={styles.formItemRow}>
      <View style={{ ...styles.formItem, marginRight: 10 }}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="BackgroundColor"
              placeholder="e.g. #c0c0c0"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
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
              label="CornerRadius"
              placeholder="e.g. 30"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              errorMessage={
                errors.cornerRadius
                  ? 'Please enter correct CornerRadius'
                  : undefined
              }
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
                  title="Hide Title"
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
                label="TitleColor"
                placeholder="e.g. #000000"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
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
                label="TitleFontSize"
                placeholder="e.g. 14"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                errorMessage={
                  errors.titleFontSize
                    ? 'Please enter correct font size'
                    : undefined
                }
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
            }}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formItemLabel}>Title Position</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ButtonGroup
                buttons={TitlePositionList}
                selectedIndex={value}
                onPress={(value) => {
                  onChange(value);
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
                title="Hide PlayIcon"
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
              label="PlayIconWidth"
              placeholder="e.g. 36"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorMessage={
                errors.playIconWidth ? 'Please enter correct width' : undefined
              }
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
          }}
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
            <Text style={styles.sectionTitle}>VideoFeedConfiguration</Text>
            {backgroundColorAndCornerRadius}
            {titleConfiguration}
            {playIconConfiguration}
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

export default FeedConfigurationModal;
