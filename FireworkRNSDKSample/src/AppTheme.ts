import type { FullTheme } from 'react-native-elements';

const AppTheme: Partial<FullTheme> = {
  CheckBox: {
    containerStyle: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  ButtonGroup: {
    containerStyle: {
      marginHorizontal: 0,
      marginVertical: 0,
    },
  },
  Input: {
    containerStyle: {
      paddingHorizontal: 0,
    },
    labelStyle: {
      fontSize: 14,
    },
  },
};

export default AppTheme;
