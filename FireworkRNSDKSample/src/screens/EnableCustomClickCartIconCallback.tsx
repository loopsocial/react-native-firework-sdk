import { StyleSheet, View } from 'react-native';
import React from 'react';
import EnableCustomClickCartIconCallbackForm from '../components/EnableCustomClickCartIconCallbackForm';

const EnableCustomClickCartIconCallback = () => {
  return (
    <View style={styles.container}>
      <EnableCustomClickCartIconCallbackForm />
    </View>
  );
};

export default EnableCustomClickCartIconCallback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
