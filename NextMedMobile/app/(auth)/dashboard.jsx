import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../../styles/HomeScreenStyles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.userName}>Welcome, Dr. {user?.name}</Text>
        <Text style={styles.userSpecialty}>{user?.specialty || 'Specialty'}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user-circle" size={30} color="#00796b" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.circleButton}>
          <FontAwesome name="microphone" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Audio</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>Recording #123 - Transcription Completed</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
