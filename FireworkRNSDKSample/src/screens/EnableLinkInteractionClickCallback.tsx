import { StyleSheet, View } from 'react-native';
import EnableLinkInteractionClickCallbackForm from '../components/EnableLinkInteractionClickCallbackForm';

const EnableLinkInteractionClickCallback = () => {
  return (
    <View style={styles.container}>
      <EnableLinkInteractionClickCallbackForm />
    </View>
  );
};

export default EnableLinkInteractionClickCallback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
