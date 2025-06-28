import { StyleSheet } from 'react-native';

export const TemplateScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 10,
  },
  templateList: {
    width: '100%',
    paddingBottom: 30,
  },
  templateItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
    elevation: 5,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00796b',
    textAlign: 'left',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  noTemplatesText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});
