import { OpenVideoWithSourceForm } from '../components/OpenVideoWithSourceForm';
import { ScrollView, StyleSheet, View } from 'react-native';

const OpenVideoWithSource = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <OpenVideoWithSourceForm />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default OpenVideoWithSource;
