import { StyleSheet, View } from 'react-native';
import EnableProductDetailsHydrationForm from '../components/EnableProductDetailsHydrationForm';

const EnableProductDetailsHydration = () => {
  return (
    <View style={styles.container}>
      <EnableProductDetailsHydrationForm />
    </View>
  );
};

export default EnableProductDetailsHydration;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
});
