import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Patterns from '../constants/Patterns';
import { useCallback, useEffect } from 'react';
import { Button, CheckBox, Input } from 'react-native-elements';
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
import type { CircleStoryConfiguration } from 'react-native-firework-sdk';

export interface ICircleStoryConfigurationModalProps {
  visible: boolean;
  configuration?: CircleStoryConfiguration;
  defaultConfiguration?: CircleStoryConfiguration;
  onRequestClose: () => void;
  onSubmit: (configuration: CircleStoryConfiguration) => void;
}

type CircleStoryConfigurationFormData = {
  backgroundColor?: string;
  enableAutoplay?: boolean;
  showAdBadge?: boolean;
  hidePlayIcon?: boolean;
  playIconWidth?: string;
  itemSpacing?: string;
  contentPaddingTop?: string;
  contentPaddingRight?: string;
  contentPaddingBottom?: string;
  contentPaddingLeft?: string;
};

const CircleStoryConfigurationModal = ({
  visible,
  configuration,
  defaultConfiguration,
  onRequestClose,
  onSubmit,
}: ICircleStoryConfigurationModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CircleStoryConfigurationFormData>();

  const syncFormValues = useCallback(
    (config?: CircleStoryConfiguration) => {
      setValue('backgroundColor', config?.backgroundColor);
      setValue('enableAutoplay', config?.enableAutoplay ?? false);
      setValue('showAdBadge', config?.showAdBadge ?? true);
      setValue('hidePlayIcon', config?.playIcon?.hidden ?? false);
      setValue('playIconWidth', config?.playIcon?.iconWidth?.toString());
      setValue('itemSpacing', config?.itemSpacing?.toString());
      setValue('contentPaddingTop', config?.contentPadding?.top?.toString());
      setValue(
        'contentPaddingRight',
        config?.contentPadding?.right?.toString()
      );
      setValue(
        'contentPaddingBottom',
        config?.contentPadding?.bottom?.toString()
      );
      setValue('contentPaddingLeft', config?.contentPadding?.left?.toString());
    },
    [setValue]
  );

  useEffect(() => {
    syncFormValues(configuration);
  }, [configuration, syncFormValues]);

  const onSave = (data: CircleStoryConfigurationFormData) => {
    const result: CircleStoryConfiguration = {};
    result.backgroundColor = data.backgroundColor || undefined;
    result.enableAutoplay = data.enableAutoplay;
    result.showAdBadge = data.showAdBadge;
    result.playIcon = {
      hidden: data.hidePlayIcon ?? false,
      iconWidth:
        data.playIconWidth && data.playIconWidth.length > 0
          ? parseFloat(data.playIconWidth)
          : undefined,
    };

    const pTop =
      data.contentPaddingTop && data.contentPaddingTop.length > 0
        ? parseInt(data.contentPaddingTop, 10)
        : undefined;
    const pRight =
      data.contentPaddingRight && data.contentPaddingRight.length > 0
        ? parseInt(data.contentPaddingRight, 10)
        : undefined;
    const pBottom =
      data.contentPaddingBottom && data.contentPaddingBottom.length > 0
        ? parseInt(data.contentPaddingBottom, 10)
        : undefined;
    const pLeft =
      data.contentPaddingLeft && data.contentPaddingLeft.length > 0
        ? parseInt(data.contentPaddingLeft, 10)
        : undefined;
    if (
      pTop !== undefined ||
      pRight !== undefined ||
      pBottom !== undefined ||
      pLeft !== undefined
    ) {
      result.contentPadding = {
        top: pTop,
        right: pRight,
        bottom: pBottom,
        left: pLeft,
      };
    }

    result.itemSpacing =
      data.itemSpacing && data.itemSpacing.length > 0
        ? parseFloat(data.itemSpacing)
        : undefined;

    onSubmit(result);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        syncFormValues(configuration);
        onRequestClose();
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
                Circle Story Configuration
              </Text>

              <View style={styles.formItemRow}>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Background Color"
                        placeholder="e.g. #F5F5F5"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={
                          errors.backgroundColor
                            ? 'Invalid hex color (e.g. #F5F5F5)'
                            : undefined
                        }
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              setValue('backgroundColor', undefined)
                            }
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="backgroundColor"
                    rules={{ pattern: Patterns.hexColor }}
                  />
                </View>
              </View>

              <View style={styles.formItemRow}>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckBox
                        center
                        title="Enable Autoplay"
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    )}
                    name="enableAutoplay"
                  />
                </View>
              </View>

              <View style={styles.formItemRow}>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckBox
                        center
                        title="Show Ad Badge"
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    )}
                    name="showAdBadge"
                  />
                </View>
              </View>

              <View style={styles.formItemRow}>
                <View style={{ ...styles.formItem, marginRight: 10 }}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckBox
                        center
                        title="Hide Play Icon"
                        checked={value}
                        onPress={() => onChange(!value)}
                      />
                    )}
                    name="hidePlayIcon"
                  />
                </View>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Play Icon Width"
                        placeholder="e.g. 48"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={
                          errors.playIconWidth ? 'Enter valid width' : undefined
                        }
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => setValue('playIconWidth', undefined)}
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="playIconWidth"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
                  />
                </View>
              </View>

              <View style={styles.formItemRow}>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Item Spacing"
                        placeholder="e.g. 10"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={
                          errors.itemSpacing
                            ? 'Enter valid spacing (0-100)'
                            : undefined
                        }
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => setValue('itemSpacing', undefined)}
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="itemSpacing"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Content Padding</Text>
              <View style={styles.formItemRow}>
                <View style={{ ...styles.formItem, marginRight: 10 }}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Top"
                        placeholder="e.g. 10"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              setValue('contentPaddingTop', undefined)
                            }
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="contentPaddingTop"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
                  />
                </View>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Right"
                        placeholder="e.g. 10"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              setValue('contentPaddingRight', undefined)
                            }
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="contentPaddingRight"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
                  />
                </View>
              </View>
              <View style={styles.formItemRow}>
                <View style={{ ...styles.formItem, marginRight: 10 }}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Bottom"
                        placeholder="e.g. 10"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              setValue('contentPaddingBottom', undefined)
                            }
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="contentPaddingBottom"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
                  />
                </View>
                <View style={styles.formItem}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Left"
                        placeholder="e.g. 10"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              setValue('contentPaddingLeft', undefined)
                            }
                          >
                            <Ionicons name="close" size={24} />
                          </TouchableOpacity>
                        }
                        autoComplete={undefined}
                      />
                    )}
                    name="contentPaddingLeft"
                    rules={{ pattern: Patterns.number, min: 0, max: 100 }}
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
                    syncFormValues(configuration);
                    onRequestClose();
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
                  onPress={() => syncFormValues(defaultConfiguration)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#86939e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formItemRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formItem: {
    flex: 1,
  },
  buttonList: {
    flexDirection: 'row',
  },
});

export default CircleStoryConfigurationModal;
