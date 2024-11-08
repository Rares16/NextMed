import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDoctorInfo } from '../(services)/api/api';
import { Stack, useRouter, useLocalSearchParams, useGlobalSearchParams } from 'expo-router'
const { height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { doctorId } = useLocalSearchParams(); // Extract doctorId from query parameters
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      const fetchDoctorInfo = async () => {
        try {
          const doctorData = await getDoctorInfo(doctorId);
          setDoctor(doctorData);
        } catch (error) {
          console.error('Error fetching doctor data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDoctorInfo();
    } else {
      console.error('No doctor ID provided');
      setLoading(false);
    }
  }, [doctorId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to load doctor information. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: doctor.profileImage || 'https://ih1.redbubble.net/image.2382029195.6138/flat,750x,075,f-pad,750x1000,f8f8f8.webp' }}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.profileName}>Dr. {doctor.name}</Text>

      {/* Display the list of patients */}
      <FlatList
        data={doctor.patients || []}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.patientItem} onPress={() => console.log('Navigate to Patient:', item._id)}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientAge}>Age: {item.age}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.patientList}
      />
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
  patientList: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  patientItem: {
    backgroundColor: '#e6f2ef',
    paddingVertical: 15,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
  },
  patientAge: {
    fontSize: 16,
    color: '#00796b',
    marginTop: 2,
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
});
