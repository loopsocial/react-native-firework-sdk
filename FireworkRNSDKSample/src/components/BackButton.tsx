import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export interface IBackButtonProps {
  tintColor?: string;
  size?: number;
  customBack?: () => void;
}

const BackButton = ({
  tintColor = '#000000',
  customBack,
  size = 30,
}: IBackButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (customBack) {
          customBack();
        } else {
          navigation.goBack();
        }
      }}
    >
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
