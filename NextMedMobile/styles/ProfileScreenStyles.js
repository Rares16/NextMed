import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f9f9',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#00796b',
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 10,
    marginBottom: 5,
  },
  profileHospital: {
    fontSize: width * 0.05,
    color: '#00796b',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 40,
    marginBottom: 15,
  },
  patientList: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  patientItem: {
    backgroundColor: '#e6f2ef',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: width * 0.85,
    maxHeight: height * 0.15,
    elevation: 3,
    alignSelf: 'center',
  },
  patientName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#00796b',
  },
  patientAge: {
    fontSize: width * 0.045,
    color: '#00796b',
    marginTop: 5,
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
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  noPatientsText: {
    marginTop: 20,
    fontSize: 18,
    color: '#00796b',
  },
});
