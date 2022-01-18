import { StyleSheet } from "react-native";

const CommonStyles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formItem: {
    marginBottom: 20,
  },
  formItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: 'red',
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainButtonContainer: {
    height: 40,
  },
});

export default CommonStyles;
