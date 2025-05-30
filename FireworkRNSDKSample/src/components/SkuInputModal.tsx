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

export interface ISkuInputModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  onSubmit?: (channelId: string, productIds: string[]) => void;
}

type SkuInputFormData = {
  channelId: string;
  productIds: string;
};

const SkuInputModal = ({
  visible,
  onRequestClose,
  onSubmit,
}: ISkuInputModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SkuInputFormData>();

  const onUse = (data: SkuInputFormData) => {
    if (onSubmit) {
      const productIdsString: string = (data.productIds ?? '').replace(
        /\s/g,
        ''
      );
      const productIds = productIdsString.split(',');
      onSubmit(data.channelId, productIds);
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

  let productIdsErrorMessage: string | undefined;
  if (errors.productIds) {
    productIdsErrorMessage = 'Please enter product ids';
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
              <Text style={CommonStyles.formItemTitle}>Product ids</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="e.g. product_id_1,product_id_2"
                    onBlur={onBlur}
                    onChangeText={(newValue) => onChange(newValue)}
                    value={value}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setValue('productIds', '');
                        }}
                      >
                        <Ionicons name="close" size={24} />
                      </TouchableOpacity>
                    }
                    errorMessage={productIdsErrorMessage}
                    autoComplete={undefined}
                  />
                )}
                name="productIds"
                rules={{
                  required: true,
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

export default SkuInputModal;
