import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { getDoctorInfo } from '../(services)/api/api';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter for navigation
import { ProfileScreenStyles } from '../../styles/ProfileScreenStyles'; // Import refactored styles

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { doctorId } = useLocalSearchParams(); // Extract doctorId from query parameters
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Hook to handle navigation

  useEffect(() => {
    if (doctorId) {
      const fetchDoctorInfo = async () => {
        try {
          const doctorData = await getDoctorInfo(doctorId);
          console.log("Fetched Doctor Data:", doctorData); // Add a console log to see the data
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
      <View style={ProfileScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={ProfileScreenStyles.errorContainer}>
        <Text style={ProfileScreenStyles.errorText}>Unable to load doctor information. Please try again later.</Text>
      </View>
    );
  }

  // Handle navigation to the patient profile
  const handlePatientPress = (patientId) => {
    router.push(`/PatientProfileScreen?patientId=${patientId}&doctorId=${doctorId}`);
  };

  return (
    <View style={ProfileScreenStyles.container}>
      <View style={ProfileScreenStyles.profileImageContainer}>
        <Image
          source={{ uri: doctor.profileImage || 'https://ih1.redbubble.net/image.2382029195.6138/flat,750x,075,f-pad,750x1000,f8f8f8.webp' }}
          style={ProfileScreenStyles.profileImage}
        />
      </View>
      <Text style={ProfileScreenStyles.profileName}>Dr. {doctor.name}</Text>
      <Text style={ProfileScreenStyles.profileHospital}>Hospital: {doctor.hospital}</Text>

      {/* Display the list of patients */}
      <Text style={ProfileScreenStyles.sectionTitle}>Patients</Text>
      {doctor.patients && doctor.patients.length > 0 ? (
        <FlatList
          data={doctor.patients}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={ProfileScreenStyles.patientItem}
              onPress={() => handlePatientPress(item._id)} // Navigate to patient profile
            >
              <Text style={ProfileScreenStyles.patientName}>{item.name}</Text>
              <Text style={ProfileScreenStyles.patientAge}>
                Age: {item.fields && item.fields['Patient Age'] ? item.fields['Patient Age'] : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={ProfileScreenStyles.patientList}
        />
      ) : (
        <Text style={ProfileScreenStyles.noPatientsText}>No patients assigned yet.</Text>
      )}
    </View>
  );
};

export default ProfileScreen;
