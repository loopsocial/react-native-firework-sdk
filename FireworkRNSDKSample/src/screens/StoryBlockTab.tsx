import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { type IStoryBlockMethods, StoryBlock } from 'react-native-firework-sdk';
import { useAppSelector } from '../hooks/reduxHooks';
import { defaultShoppingPlaylist } from '../config/Feed.json';

const { channelId: CHANNEL_ID, playlistId: PLAYLIST_ID } =
  defaultShoppingPlaylist;

const StoryBlockTab = () => {
  const storyBlockRef = useRef<IStoryBlockMethods>(null);
  const [handleAppearanceManually, setHandleAppearanceManually] =
    useState<boolean>(true);
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );

  useFocusEffect(
    useCallback(() => {
      if (!handleAppearanceManually) {
        return;
      }
      storyBlockRef.current?.onViewportEntered();
      return () => {
        storyBlockRef.current?.onViewportLeft();
      };
    }, [handleAppearanceManually])
  );

  return (
    <View style={styles.page}>
      <CheckBox
        center
        title="Handle Appearance Manually"
        checked={handleAppearanceManually}
        onPress={() => setHandleAppearanceManually((v) => !v)}
        containerStyle={styles.handleAppearanceCheckBox}
      />
      <StoryBlock
        ref={storyBlockRef}
        style={styles.storyBlock}
        source={'playlist'}
        channel={CHANNEL_ID}
        playlist={PLAYLIST_ID}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
        storyBlockConfiguration={{
          handleAppearanceManually,
        }}
        onStoryBlockLoadFinished={(error) => {
          if (!error && handleAppearanceManually) {
            storyBlockRef.current?.onViewportEntered();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  storyBlock: {
    flex: 1,
    width: '100%',
  },
  handleAppearanceCheckBox: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    paddingVertical: 6,
  },
});

export default StoryBlockTab;
