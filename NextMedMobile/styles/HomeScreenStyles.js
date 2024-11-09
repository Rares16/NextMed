import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#00796b',
  },
  userSpecialty: {
    fontSize: 16,
    color: '#555555',
  },
  profileButton: {
    padding: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00796b',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#00796b',
    padding: 6,
    borderRadius: 3,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HomeScreenStyles;
