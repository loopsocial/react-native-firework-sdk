import { useCallback, useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, CheckBox, Slider } from 'react-native-elements';
import type { PlayerDeckConfiguration } from 'react-native-firework-sdk';
import type { PlayerDeckMuteState } from 'react-native-firework-sdk';

import CommonStyles from './CommonStyles';

export interface IPlayerDeckConfigurationModalProps {
  visible: boolean;
  playerDeckConfiguration?: PlayerDeckConfiguration;
  defaultPlayerDeckConfiguration?: PlayerDeckConfiguration;
  onRequestClose?: () => void;
  onSubmit?: (configuration: PlayerDeckConfiguration) => void;
}

const MuteStateLabels: PlayerDeckMuteState[] = ['default', 'unmuted'];

const PlayerDeckConfigurationModal = ({
  visible,
  playerDeckConfiguration,
  defaultPlayerDeckConfiguration,
  onRequestClose,
  onSubmit,
}: IPlayerDeckConfigurationModalProps) => {
  const [cornerRadius, setCornerRadius] = useState(8);
  const [enableAutoplay, setEnableAutoplay] = useState(true);
  const [hidePlayIcon, setHidePlayIcon] = useState(false);
  const [playIconWidth, setPlayIconWidth] = useState(50);
  const [showMuteButton, setShowMuteButton] = useState(true);
  const [showShareButton, setShowShareButton] = useState(true);
  const [enableFullScreen, setEnableFullScreen] = useState(true);
  const [showAdBadge, setShowAdBadge] = useState(true);
  const [muteState, setMuteState] = useState<PlayerDeckMuteState>('default');
  const [itemSpacing, setItemSpacing] = useState(16);
  const [contentPadding, setContentPadding] = useState(10);
  const [swapSubtitleButtons, setSwapSubtitleButtons] = useState(false);

  const syncFromConfig = useCallback((config?: PlayerDeckConfiguration) => {
    setCornerRadius(config?.cornerRadius ?? 8);
    setEnableAutoplay(config?.autoplay?.isEnabled ?? true);
    setHidePlayIcon(config?.playIcon?.hidden ?? false);
    setPlayIconWidth(config?.playIcon?.iconWidth ?? 50);
    setShowMuteButton(!(config?.muteButton?.hidden ?? false));
    setShowShareButton(!(config?.shareButton?.hidden ?? false));
    setEnableFullScreen(config?.fullScreen?.isEnabled ?? true);
    setShowAdBadge(config?.showAdBadge ?? true);
    setMuteState(config?.onFirstDisplayMuteState ?? 'default');
    setItemSpacing(config?.itemSpacing ?? 16);
    setContentPadding(config?.contentPadding?.left ?? 10);
    setSwapSubtitleButtons(
      config?.subtitleConfiguration?.swapMuteAndSubtitleButtons ?? false
    );
  }, []);

  useEffect(() => {
    if (visible) {
      syncFromConfig(playerDeckConfiguration);
    }
  }, [visible, playerDeckConfiguration, syncFromConfig]);

  const handleSave = () => {
    const config: PlayerDeckConfiguration = {
      cornerRadius,
      autoplay: { isEnabled: enableAutoplay },
      playIcon: { hidden: hidePlayIcon, iconWidth: playIconWidth },
      muteButton: { hidden: !showMuteButton },
      shareButton: { hidden: !showShareButton },
      fullScreen: { isEnabled: enableFullScreen },
      showAdBadge,
      onFirstDisplayMuteState: muteState,
      itemSpacing,
      contentPadding: {
        top: contentPadding,
        right: contentPadding,
        bottom: contentPadding,
        left: contentPadding,
      },
      subtitleConfiguration: {
        swapMuteAndSubtitleButtons: swapSubtitleButtons,
      },
    };
    onSubmit?.(config);
  };

  const handleReset = () => {
    syncFromConfig(defaultPlayerDeckConfiguration);
  };

  const handleCancel = () => {
    syncFromConfig(playerDeckConfiguration);
    onRequestClose?.();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
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
              <Text style={styles.sectionTitle}>Player Deck Configuration</Text>

              <Text style={styles.groupHeader}>Playback</Text>
              <CheckBox
                title="Enable Autoplay"
                checked={enableAutoplay}
                onPress={() => setEnableAutoplay((v) => !v)}
              />
              <View style={styles.muteStateRow}>
                <Text style={styles.muteStateLabel}>
                  First Display Mute State (iOS):
                </Text>
                {MuteStateLabels.map((state) => (
                  <CheckBox
                    key={state}
                    title={state}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={muteState === state}
                    onPress={() => setMuteState(state)}
                    containerStyle={styles.radioItem}
                  />
                ))}
              </View>

              <Text style={styles.groupHeader}>Item Controls</Text>
              <CheckBox
                title="Show Play Icon"
                checked={!hidePlayIcon}
                onPress={() => setHidePlayIcon((v) => !v)}
              />
              {!hidePlayIcon && (
                <View style={styles.sliderRow}>
                  <Text style={styles.sliderLabel}>
                    Play Icon Width: {playIconWidth}
                  </Text>
                  <Slider
                    minimumValue={20}
                    maximumValue={100}
                    value={playIconWidth}
                    onValueChange={(v) => setPlayIconWidth(Math.round(v))}
                  />
                </View>
              )}
              <CheckBox
                title="Show Mute Button (iOS)"
                checked={showMuteButton}
                onPress={() => setShowMuteButton((v) => !v)}
              />
              <CheckBox
                title="Show Share Button"
                checked={showShareButton}
                onPress={() => setShowShareButton((v) => !v)}
              />
              <CheckBox
                title="Enable Full Screen"
                checked={enableFullScreen}
                onPress={() => setEnableFullScreen((v) => !v)}
              />

              <Text style={styles.groupHeader}>Appearance</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>
                  Corner Radius: {cornerRadius}
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={30}
                  value={cornerRadius}
                  onValueChange={(v) => setCornerRadius(Math.round(v))}
                />
              </View>

              <Text style={styles.groupHeader}>Badges</Text>
              <CheckBox
                title="Show Ad Badge"
                checked={showAdBadge}
                onPress={() => setShowAdBadge((v) => !v)}
              />
              <Text style={styles.groupHeader}>Subtitle</Text>
              <CheckBox
                title="Swap Mute & Subtitle Buttons (iOS)"
                checked={swapSubtitleButtons}
                onPress={() => setSwapSubtitleButtons((v) => !v)}
              />

              <Text style={styles.groupHeader}>Layout</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>
                  Item Spacing: {itemSpacing}
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={50}
                  value={itemSpacing}
                  onValueChange={(v) => setItemSpacing(Math.round(v))}
                />
              </View>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>
                  Content Padding: {contentPadding}
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={50}
                  value={contentPadding}
                  onValueChange={(v) => setContentPadding(Math.round(v))}
                />
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
                  onPress={handleCancel}
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
                  onPress={handleReset}
                  title="Reset"
                />
                <Button
                  titleStyle={CommonStyles.mainButtonText}
                  containerStyle={{
                    ...CommonStyles.mainButtonContainer,
                    flex: 1,
                  }}
                  onPress={handleSave}
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
  groupHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
    marginLeft: 10,
  },
  sliderRow: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#86939e',
    marginBottom: 4,
  },
  muteStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  muteStateLabel: {
    fontSize: 14,
    color: '#86939e',
  },
  radioItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 6,
  },
  buttonList: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default PlayerDeckConfigurationModal;
