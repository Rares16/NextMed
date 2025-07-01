import { StyleSheet } from 'react-native';
import { colors } from './colors';

const componentWidth = '80%';

const formStyle = StyleSheet.create({
  form: {
    width: componentWidth,
  },
  input: {
    height: 50,
    borderColor: colors.primaryText,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    color: colors.primaryText,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default formStyle;
