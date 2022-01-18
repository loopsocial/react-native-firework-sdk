import React from 'react';
import { OpenVideoForm } from '../components/OpenVideoForm';
import { StyleSheet, View } from 'react-native';

const OpenVideo = () => {
  return (
    <View style={styles.container}>
      <OpenVideoForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});

export default OpenVideo;
