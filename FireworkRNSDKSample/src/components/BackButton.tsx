import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface IBackButtonProps {
  tintColor?: string;
  size?: number;
  onBack?: () => void;
}

const BackButton = ({
  tintColor = '#000000',
  onBack,
  size = 30,
}: IBackButtonProps) => {
  return (
    <TouchableOpacity onPress={onBack}>
      <View style={styles.container}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          size={size}
          color={tintColor}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      marginLeft: -15,
    },
    android: {
      marginRight: 5,
    },
    default: {
      marginLeft: 0,
    },
  }),
});

export default BackButton;
