// app/auth/ProfileScreen.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const patients = [
    { id: '1', name: 'Alice Johnson', age: 45 },
    { id: '2', name: 'Bob Smith', age: 34 },
    { id: '3', name: 'Cathy Brown', age: 29 },
    { id: '4', name: 'David Lee', age: 52 },
    { id: '5', name: 'Emma Davis', age: 41 },
    // Add more patients to demonstrate scrolling
  ];

  const handlePatientPress = (patientId) => {
    console.log(`Navigate to PatientProfileScreen for patient ID: ${patientId}`);
  };

  const handleAddPatient = () => {
    console.log("Add Patient button pressed");
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture and Doctor's Name */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.profileName}>Dr. John Doe</Text>

      {/* Add Patient Button */}
      <TouchableOpacity style={styles.addPatientButton} onPress={handleAddPatient}>
        <Text style={styles.addPatientButtonText}>Add Patient</Text>
      </TouchableOpacity>

      {/* Gradient overlay for top fade effect */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
        style={styles.topFade}
        pointerEvents="none"
      />

      {/* Patient List */}
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.patientItem} onPress={() => handlePatientPress(item.id)}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientAge}>Age: {item.age}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.patientList}
      />

      {/* Gradient overlay for bottom fade effect */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout pressed')}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f9f9',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#00796b',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 10,
    marginBottom: 20,
  },
  addPatientButton: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  addPatientButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  patientList: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  patientItem: {
    backgroundColor: '#e6f2ef',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  patientAge: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 2,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topFade: {
    position: 'absolute',
    top: 200,
    width: '100%',
    height: 40,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    height: 40,
  },
});
