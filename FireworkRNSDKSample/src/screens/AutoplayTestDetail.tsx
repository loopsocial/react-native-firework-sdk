import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from './paramList/RootStackParamList';

/**
 * A plain second-level page pushed from the autoplay test screen.
 *
 * It contains no Firework widget on purpose: pushing it verifies that the
 * widget on the previous screen stops autoplaying while it is covered, and
 * resumes once this page is popped.
 */
const AutoplayTestDetail = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Second-level page</Text>
      <Text style={styles.description}>
        The autoplay test screen is now covered by this page. The widget there
        should have paused, and should resume playing after you go back.
      </Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>No widget on this page</Text>
      </View>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  placeholder: {
    height: 240,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: '#cfd8dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#555555',
  },
});

export default AutoplayTestDetail;
