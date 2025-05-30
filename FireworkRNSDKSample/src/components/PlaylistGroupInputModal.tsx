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

export interface IPlaylistGroupInputModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  onSubmit?: (playlistGroupId: string) => void;
}

type PlaylistGroupInputFormData = {
  playlistGroupId: string;
};

const PlaylistGroupInputModal = ({
  visible,
  onRequestClose,
  onSubmit,
}: IPlaylistGroupInputModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PlaylistGroupInputFormData>();

  const onUse = (data: PlaylistGroupInputFormData) => {
    if (onSubmit) {
      onSubmit(data.playlistGroupId);
    }
    reset();
  };

  let playlistGroupIdErrorMessage: string | undefined;
  if (errors.playlistGroupId) {
    if (errors.playlistGroupId.type === 'pattern') {
      playlistGroupIdErrorMessage = 'Please enter correct playlist group id';
    } else {
      playlistGroupIdErrorMessage = 'Please enter playlist group id';
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
              <Text style={CommonStyles.formItemTitle}>Playlist Group id</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Enter playlist id"
                    onBlur={onBlur}
                    onChangeText={(newValue) => onChange(newValue)}
                    value={value}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setValue('playlistGroupId', '');
                        }}
                      >
                        <Ionicons name="close" size={24} />
                      </TouchableOpacity>
                    }
                    errorMessage={playlistGroupIdErrorMessage}
                    autoComplete={undefined}
                  />
                )}
                name="playlistGroupId"
                rules={{
                  required: true,
                  pattern: Patterns.playlistGroupId,
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

export default PlaylistGroupInputModal;
