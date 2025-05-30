import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Input } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Patterns from '../constants/Patterns';

export interface IDynamicContentInputModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  onSubmit?: (
    channelId: string,
    dynamicContentParameters: { [key: string]: string[] }
  ) => void;
}

type DynamicContentInputFormData = {
  channelId: string;
  dynamicContentParametersString: string;
};

const DynamicContentInputModal = ({
  visible,
  onRequestClose,
  onSubmit,
}: IDynamicContentInputModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DynamicContentInputFormData>();

  const onUse = (data: DynamicContentInputFormData) => {
    if (onSubmit) {
      onSubmit(data.channelId, JSON.parse(data.dynamicContentParametersString));
    }
    reset();
  };

  let channelIdErrorMessage: string | undefined;
  if (errors.channelId) {
    if (errors.channelId.type === 'pattern') {
      channelIdErrorMessage = 'Please enter correct channel id';
    } else {
      channelIdErrorMessage = 'Please enter channel id';
    }
  }

  let dynamicContentParametersStringErrorMessage: string | undefined;
  if (errors.dynamicContentParametersString) {
    if (errors.dynamicContentParametersString.type === 'required') {
      dynamicContentParametersStringErrorMessage =
        'Please enter dynamic content parameters';
    } else {
      dynamicContentParametersStringErrorMessage =
        'Please enter correct dynamic content parameters';
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        if (onRequestClose) {
          onRequestClose();
        }
        reset();
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
            <View style={CommonStyles.formItem}>
              <Text style={CommonStyles.formItemTitle}>Channel id</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Enter channel id"
                    onBlur={onBlur}
                    onChangeText={(newValue) => onChange(newValue)}
                    value={value}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setValue('channelId', '');
                        }}
                      >
                        <Ionicons name="close" size={24} />
                      </TouchableOpacity>
                    }
                    errorMessage={channelIdErrorMessage}
                    autoComplete={undefined}
                  />
                )}
                name="channelId"
                rules={{
                  required: true,
                  pattern: Patterns.channelId,
                }}
                defaultValue=""
              />
            </View>
            <View style={CommonStyles.formItem}>
              <Text style={CommonStyles.formItemTitle}>
                Dynamic content parameters
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    multiline
                    numberOfLines={5}
                    style={{ height: 150 }}
                    placeholder={'e.g. {"key": ["value1", "value2"]}'}
                    onBlur={onBlur}
                    onChangeText={(newValue) => onChange(newValue)}
                    value={value}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setValue('dynamicContentParametersString', '');
                        }}
                      >
                        <Ionicons name="close" size={24} />
                      </TouchableOpacity>
                    }
                    errorMessage={dynamicContentParametersStringErrorMessage}
                    autoComplete={undefined}
                  />
                )}
                name="dynamicContentParametersString"
                rules={{
                  required: true,
                  validate: (value) => {
                    const errorMessage =
                      'Please enter correct dynamic content parameters';
                    try {
                      const jsonParsedResult = JSON.parse(value);
                      if (typeof jsonParsedResult === 'object') {
                        const keyList = Object.keys(jsonParsedResult);
                        if (keyList.length === 0) {
                          return errorMessage;
                        }
                        for (const key of keyList) {
                          const jsonValue = jsonParsedResult[key];
                          if (Array.isArray(jsonValue)) {
                            for (const valueItem of jsonValue) {
                              if (typeof valueItem !== 'string') {
                                return errorMessage;
                              }
                            }
                          } else {
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
            <View style={{ ...CommonStyles.formItem, ...styles.buttonList }}>
              <Button
                titleStyle={CommonStyles.mainButtonText}
                containerStyle={{
                  ...CommonStyles.mainButtonContainer,
                  flex: 1,
                  marginRight: 20,
                }}
                type="outline"
                onPress={() => {
                  if (onRequestClose) {
                    onRequestClose();
                  }
                  reset();
                }}
                title="Cancel"
              />
              <Button
                titleStyle={CommonStyles.mainButtonText}
                containerStyle={{
                  ...CommonStyles.mainButtonContainer,
                  flex: 1,
                }}
                onPress={handleSubmit(onUse)}
                title="Use"
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
    paddingHorizontal: 15,
  },
  formContainerExtra: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
  },
  buttonList: {
    flexDirection: 'row',
  },
});

export default DynamicContentInputModal;
