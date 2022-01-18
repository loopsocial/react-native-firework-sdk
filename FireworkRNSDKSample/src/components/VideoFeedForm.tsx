import CommonStyles from './CommonStyles';
import React from 'react';
import { Button, ButtonGroup } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import type { VideoFeedMode } from 'react-native-firework-sdk';

export interface VideoFeedFormProps {
  mode: VideoFeedMode;
  onChangeMode?: (mode: VideoFeedMode) => void;
  onGoToFeedConfiguration?: () => void;
  onGoToPlayerConfiguration?: () => void;
}

const VideoFeedForm = ({
  mode,
  onChangeMode,
  onGoToFeedConfiguration,
  onGoToPlayerConfiguration,
}: VideoFeedFormProps) => {
  const modeList = ['row', 'column', 'grid'];
  const modelIndex = modeList.indexOf(mode);
  return (
    <View style={CommonStyles.formContainer}>
      <View style={CommonStyles.formItem}>
        <Text style={CommonStyles.formItemTitle}>Mode</Text>
        <ButtonGroup
          buttons={modeList}
          selectedIndex={modelIndex}
          onPress={(value) => {
            if (onChangeMode) {
              onChangeMode(modeList[value] as VideoFeedMode);
            }
          }}
        />
      </View>
      <View style={CommonStyles.formItem}>
        <View style={styles.buttonList}>
          <Button
            titleStyle={CommonStyles.mainButtonText}
            containerStyle={{
              ...CommonStyles.mainButtonContainer,
              flex: 1,
              marginRight: 20,
            }}
            onPress={() => {
              if (onGoToFeedConfiguration) {
                onGoToFeedConfiguration();
              }
            }}
            title="Feed Configuration"
          />
          <Button
            titleStyle={CommonStyles.mainButtonText}
            containerStyle={{
              ...CommonStyles.mainButtonContainer,
              flex: 1,
            }}
            onPress={() => {
              if (onGoToPlayerConfiguration) {
                onGoToPlayerConfiguration();
              }
            }}
            title="Player Configuration"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoFeedForm;
