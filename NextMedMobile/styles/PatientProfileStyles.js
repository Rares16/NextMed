import { StyleSheet } from 'react-native';

export const PatientProfileStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 20,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  patientAge: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  patientGender: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#00796b',
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#00796b',
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
