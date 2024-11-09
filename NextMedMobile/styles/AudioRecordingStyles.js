import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f7f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: width * 0.8,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  recordButton: {
    backgroundColor: '#00796b',
  },
  stopButton: {
    backgroundColor: '#d32f2f',
  },
  uploadButton: {
    backgroundColor: '#14967f',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    width: width * 0.8,
    backgroundColor: '#e6f2ef',
    borderRadius: 8,
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    width: width * 0.8,
    backgroundColor: '#e6f2ef',
    borderRadius: 8,
    borderWidth: 0,
    marginVertical: 20,
  },
  transcriptionStatus: {
    marginTop: 20,
    fontSize: 16,
    color: '#00796b',
    textAlign: 'center',
  },
});

export default styles;
