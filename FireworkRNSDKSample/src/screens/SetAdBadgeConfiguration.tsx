import { View, StyleSheet } from 'react-native'
import React from 'react'
import SetAdBadgeConfigurationForm from '../components/SetAdBadgeConfigurationForm';

const SetAdBadgeConfiguration = () => {
  return (
    <View style={styles.container}>
      <SetAdBadgeConfigurationForm />
    </View>
  )
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

export default SetAdBadgeConfiguration