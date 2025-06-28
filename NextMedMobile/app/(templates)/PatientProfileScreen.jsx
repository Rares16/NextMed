import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPatientInfo } from '../(services)/api/api';
import { PatientProfileStyles } from '../../styles/PatientProfileStyles';

export default function PatientProfileScreen() {
  const { patientId, doctorId } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      const fetchPatientInfo = async () => {
        try {
          const patientData = await getPatientInfo(patientId);
          console.log('Fetched Patient Data:', patientData); // Debugging line to ensure data is fetched
          setPatient(patientData);
        } catch (error) {
          console.error('Error fetching patient data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPatientInfo();
    }
  }, [patientId]);

  if (loading) {
    return (
      <SafeAreaView style={PatientProfileStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </SafeAreaView>
    );
  }

  if (!patient) {
    return (
      <SafeAreaView style={PatientProfileStyles.errorContainer}>
        <Text style={PatientProfileStyles.errorText}>Unable to load patient information. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={PatientProfileStyles.container}>
        <Text style={PatientProfileStyles.header}>Patient Profile</Text>
        <Text style={PatientProfileStyles.patientName}>Name: {patient.name || 'N/A'}</Text>
        <Text style={PatientProfileStyles.patientAge}>Age: {patient.fields?.['Patient Age'] || 'N/A'}</Text>
        <Text style={PatientProfileStyles.patientGender}>Gender: {patient.patientGender || 'N/A'}</Text>

        <Text style={PatientProfileStyles.sectionTitle}>Symptoms</Text>
        <Text style={PatientProfileStyles.sectionContent}>
          {patient.fields?.['Symptoms'] || 'No symptoms available.'}
        </Text>

        <Text style={PatientProfileStyles.sectionTitle}>Previous Pregnancy Complications</Text>
        <Text style={PatientProfileStyles.sectionContent}>
          {patient.fields?.['Previous Pregnancy Complications'] || 'N/A'}
        </Text>

        <TouchableOpacity
          style={PatientProfileStyles.backButton}
          onPress={() => router.push(`/profile?doctorId=${doctorId}`)}
        >
          <Text style={PatientProfileStyles.backButtonText}>Back to Patients</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
