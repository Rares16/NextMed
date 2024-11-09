import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null); // To show status updates
  
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
    if (!audioFile) return;

    setUploading(true);
    setTranscriptionStatus(null); // Reset transcription status message
    const formData = new FormData();
    formData.append('audio', {
      uri: audioFile,
      name: 'recording.3gp',
      type: 'audio/3gpp',
    });

    try {
      console.log('Uploading audio...');
      const response = await axios.post('http://192.168.0.160:3000/api/transcription/upload-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', response.data);
      setTranscriptionStatus('File Uploaded Successfully. Transcription is in progress.');
      // You can store the job name to check the status later
    } catch (error) {
      console.error('Error uploading audio:', error);
      setTranscriptionStatus('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };

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
});
