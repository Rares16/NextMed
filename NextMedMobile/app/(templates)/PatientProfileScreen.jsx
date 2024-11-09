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
        <Text style={PatientProfileStyles.patientName}>{patient.name}</Text>
        <Text style={PatientProfileStyles.patientAge}>Age: {patient.age}</Text>
        <Text style={PatientProfileStyles.patientGender}>Gender: {patient.gender}</Text>

        <Text style={PatientProfileStyles.sectionTitle}>Medical History</Text>
        <Text style={PatientProfileStyles.sectionContent}>{patient.medicalHistory || 'No history available.'}</Text>

        <Text style={PatientProfileStyles.sectionTitle}>Allergies</Text>
        <Text style={PatientProfileStyles.sectionContent}>{patient.allergies || 'No allergies reported.'}</Text>

        <Text style={PatientProfileStyles.sectionTitle}>Prescriptions</Text>
        {patient.prescriptions?.length > 0 ? (
          patient.prescriptions.map((prescription, index) => (
            <Text key={index} style={PatientProfileStyles.sectionContent}>{prescription}</Text>
          ))
        ) : (
          <Text style={PatientProfileStyles.sectionContent}>No prescriptions available.</Text>
        )}

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
