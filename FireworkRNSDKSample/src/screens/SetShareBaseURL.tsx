import React from 'react';
import { StyleSheet, View } from 'react-native';
import SetShareBaseURLForm from '../components/SetShareBaseURLForm';

export default function SetShareBaseURL() {
  return (
    <View style={styles.container}>
      <SetShareBaseURLForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
