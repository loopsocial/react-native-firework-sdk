import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { type IStoryBlockMethods, StoryBlock } from 'react-native-firework-sdk';
import { useAppSelector } from '../hooks/reduxHooks';
import { defaultShoppingPlaylist } from '../config/Feed.json';

const { channelId: CHANNEL_ID, playlistId: PLAYLIST_ID } =
  defaultShoppingPlaylist;

const StoryBlockTab = () => {
  const storyBlockRef = useRef<IStoryBlockMethods>(null);
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );

  useFocusEffect(
    useCallback(() => {
      storyBlockRef.current?.onViewportEntered();
      return () => {
        storyBlockRef.current?.onViewportLeft();
      };
    }, [])
  );

  return (
    <View style={styles.page}>
      <StoryBlock
        ref={storyBlockRef}
        style={styles.storyBlock}
        source={'playlist'}
        channel={CHANNEL_ID}
        playlist={PLAYLIST_ID}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
        storyBlockConfiguration={{
          handleAppearanceManually: true,
        }}
        onStoryBlockLoadFinished={(error) => {
          if (!error) {
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
    width: '100%',
    height: '100%',
  },
});

export default StoryBlockTab;
