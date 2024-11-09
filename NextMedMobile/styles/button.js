// styles/button.js
import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Import shared colors file

const buttonStyle = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default buttonStyle;
