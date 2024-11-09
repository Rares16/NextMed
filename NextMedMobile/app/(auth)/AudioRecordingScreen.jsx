import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getCustomizedTemplates, getTemplatesBySpecialty } from '../(services)/api/api';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker'; // Import from the new picker package

export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null); // To show status updates
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Track selected template

  const user = useSelector((state) => state.auth.user); // Get current user from Redux
  const specialty = 'Gynecology'; // You can modify this to get dynamically

  // Fetch customized templates for the user using React Query
  const {
    data: customizedTemplates,
    isLoading: loadingCustomized,
    error: customizedError,
  } = useQuery({
    queryKey: ['customizedTemplates', user?.id],
    queryFn: () => getCustomizedTemplates(user?.id),
    enabled: !!user?.id,
    onSuccess: (data) => {
      console.log('Successfully fetched customized templates:', data);
    },
    onError: (error) => {
      console.error('Error fetching customized templates:', error);
    },
  });

  // Fetch default templates by specialty using React Query
  const {
    data: defaultTemplates,
    isLoading: loadingDefault,
    error: defaultError,
  } = useQuery({
    queryKey: ['defaultTemplates', specialty],
    queryFn: () => getTemplatesBySpecialty(specialty),
    enabled: !!specialty,
    onSuccess: (data) => {
      console.log('Successfully fetched default templates:', data);
    },
    onError: (error) => {
      console.error('Error fetching default templates:', error);
    },
  });

  // Function to start recording audio
  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        console.log('Starting recording..');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log('Recording started');
      } else {
        console.log('Permission to record audio not granted');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Function to stop recording audio
  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioFile(uri);
    console.log('Recording stopped and stored at', uri);
  };

  // Function to upload audio file to backend
  const uploadAudio = async () => {
    if (!audioFile || !selectedTemplate) {
      setTranscriptionStatus('Please select a template before uploading audio.');
      return;
    }
  
    setUploading(true);
    setTranscriptionStatus(null); // Reset transcription status message
    const formData = new FormData();
    formData.append('audio', {
      uri: audioFile,
      name: 'recording.3gp',
      type: 'audio/3gpp',
    });
  
    formData.append('templateId', selectedTemplate); // Add the selected template ID
    formData.append('doctorId', user.id); // Add the doctor ID from the logged-in user
  
    try {
      console.log('Uploading audio...');
      const response = await axios.post('http://192.168.0.160:3000/api/transcription/upload-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload success:', response.data);
      setTranscriptionStatus('File Uploaded Successfully. Transcription in progress...');
  
      // If a patient profile is created successfully, show success message
      if (response.data && response.data.patient) {
        console.log('Patient profile created:', response.data.patient);
        setTranscriptionStatus('Patient profile created successfully.');
      } else {
        setTranscriptionStatus('Transcription completed, but no patient profile was created.');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setTranscriptionStatus('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };
  

  if (loadingCustomized || loadingDefault) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (customizedError || defaultError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading templates. Please try again later.</Text>
        {customizedError && <Text style={styles.errorMessage}>Error: {customizedError.message}</Text>}
        {defaultError && <Text style={styles.errorMessage}>Error: {defaultError.message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audio Recording Screen</Text>
      {recording ? (
        <TouchableOpacity style={styles.button} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startRecording}>
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>
      )}

      {(customizedTemplates?.length > 0 || defaultTemplates?.length > 0) && (
        <Picker
        selectedValue={selectedTemplate}
        onValueChange={(itemValue) => setSelectedTemplate(itemValue)}
        style={{ width: 200, marginTop: 20 }}
      >
        <Picker.Item label="Select a Template" value={null} />
        {customizedTemplates?.map((template) => (
          <Picker.Item key={template._id} label={template.name} value={template._id} /> // Send template ID
        ))}
        {defaultTemplates?.map((template) => (
          <Picker.Item key={template._id} label={template.name} value={template._id} /> // Send template ID
        ))}
      </Picker>
      )}

      {audioFile && (
        <View style={styles.uploadContainer}>
          <Button title="Upload Audio" onPress={uploadAudio} disabled={uploading} />
          {uploading && <ActivityIndicator size="small" color="#00796b" />}
        </View>
      )}

      {transcriptionStatus && (
        <Text style={styles.transcriptionStatus}>
          {transcriptionStatus}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00796b',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  uploadContainer: {
    marginTop: 20,
  },
  transcriptionStatus: {
    marginTop: 20,
    fontSize: 16,
    color: '#00796b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});
