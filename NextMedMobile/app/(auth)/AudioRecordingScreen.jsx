import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getCustomizedTemplates, getTemplatesBySpecialty } from '../(services)/api/api';
import { useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../styles/AudioRecordingStyles';

const AudioRecordingScreen = () => {
  const [recording, setRecording] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [open, setOpen] = useState(false); // Controls dropdown visibility

  const user = useSelector((state) => state.auth.user);
  const specialty = 'Gynecology';

  // Fetch customized templates for the user using React Query
  const {
    data: customizedTemplates,
    isLoading: loadingCustomized,
    error: customizedError,
  } = useQuery({
    queryKey: ['customizedTemplates', user?.id],
    queryFn: () => getCustomizedTemplates(user?.id),
    enabled: !!user?.id,
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
  });

  // Combining template data for dropdown options
  const templates = [
    ...(customizedTemplates || []),
    ...(defaultTemplates || []),
  ].map((template) => ({
    label: template.name,
    value: template._id,
  }));

  // Function to start recording audio
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        console.log('Permission to record audio not granted');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Function to stop recording audio
  const stopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioFile(uri);
  };

  // Function to upload audio file to backend
  const uploadAudio = async () => {
    if (!audioFile || !selectedTemplate) {
      setTranscriptionStatus('Please select a template before uploading audio.');
      return;
    }

    setUploading(true);
    setTranscriptionStatus(null);
    const formData = new FormData();
    formData.append('audio', {
      uri: audioFile,
      name: 'recording.3gp',
      type: 'audio/3gpp',
    });
    formData.append('templateId', selectedTemplate);
    formData.append('doctorId', user.id);

    try {
      const response = await axios.post('http://192.168.0.160:3000/api/transcription/upload-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscriptionStatus('File Uploaded Successfully. Transcription in progress...');
      setTranscriptionStatus(response.data?.patient ? 'Patient profile created successfully.' : 'Transcription completed, but no patient profile was created.');
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
        <Text style={styles.errorMessage}>Error loading templates. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.header}>Audio Recording Screen</Text>
      {recording ? (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.recordButton]} onPress={startRecording}>
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>
      )}

      <DropDownPicker
        open={open}
        value={selectedTemplate}
        items={templates}
        setOpen={setOpen}
        setValue={setSelectedTemplate}
        placeholder="Select a Template"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {audioFile && (
        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={uploadAudio}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Upload Audio'}
          </Text>
        </TouchableOpacity>
      )}

      {transcriptionStatus && (
        <Text style={styles.transcriptionStatus}>{transcriptionStatus}</Text>
      )}
    </View>
  );
};

export default AudioRecordingScreen;
