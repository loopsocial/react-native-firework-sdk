import { StyleSheet, View } from 'react-native';
import React from 'react';
import EnableCustomCTALinkContentPageRouteNameForm from '../components/EnableCustomCTALinkContentPageRouteNameForm';

const EnableCustomCTALinkContentPageRouteName = () => {
  return (
    <View style={styles.container}>
      <EnableCustomCTALinkContentPageRouteNameForm />
    </View>
  );
};

export default EnableCustomCTALinkContentPageRouteName;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
