import CommonStyles from './CommonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
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

export interface IPlaylistInputModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  onSubmit?: (channelId: string, playlistId: string) => void;
}

type PlaylistInputFormData = {
  channelId: string;
  playlistId: string;
};

const PlaylistInputModal = ({
  visible,
  onRequestClose,
  onSubmit,
}: IPlaylistInputModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PlaylistInputFormData>();

  const onUse = (data: PlaylistInputFormData) => {
    if (onSubmit) {
      onSubmit(data.channelId, data.playlistId);
    }
    reset();
  };

  let channelIdErrorMessage: string | undefined = undefined;
  if (errors.channelId) {
    if (errors.channelId.type === 'pattern') {
      channelIdErrorMessage = 'Please enter correct channel id';
    } else {
      channelIdErrorMessage = 'Please enter channel id';
    }
  }

  let playlistIdErrorMessage: string | undefined = undefined;
  if (errors.playlistId) {
    if (errors.playlistId.type === 'pattern') {
      playlistIdErrorMessage = 'Please enter correct playlist id';
    } else {
      playlistIdErrorMessage = 'Please enter playlist id';
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
                    onChangeText={(value) => onChange(value)}
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
                    autoCompleteType={undefined}
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
              <Text style={CommonStyles.formItemTitle}>Playlist id</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Enter playlist id"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setValue('playlistId', '');
                        }}
                      >
                        <Ionicons name="close" size={24} />
                      </TouchableOpacity>
                    }
                    errorMessage={playlistIdErrorMessage}
                    autoCompleteType={undefined}
                  />
                )}
                name="playlistId"
                rules={{
                  required: true,
                  pattern: Patterns.playlistId,
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
});

export default PlaylistInputModal;
