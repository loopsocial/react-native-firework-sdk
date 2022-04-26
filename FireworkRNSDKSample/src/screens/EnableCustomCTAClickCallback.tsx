import { StyleSheet, View } from 'react-native';
import React from 'react';
import EnableCustomCTAClickCallbackForm from '../components/EnableCustomCTAClickCallbackForm';

const EnableCustomCTAClickCallback = () => {
  return (
    <View style={styles.container}>
      <EnableCustomCTAClickCallbackForm />
    </View>
  );
};

export default EnableCustomCTAClickCallback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
