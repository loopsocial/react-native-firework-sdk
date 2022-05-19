import { StyleSheet, View } from 'react-native';
import React from 'react';
import EnableCustomCTALinkContentRenderForm from '../components/EnableCustomCTALinkContentRenderForm';

const EnableCustomCTALinkContentRender = () => {
  return (
    <View style={styles.container}>
      <EnableCustomCTALinkContentRenderForm />
    </View>
  );
};

export default EnableCustomCTALinkContentRender;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
