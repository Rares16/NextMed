import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCustomizedTemplates, getTemplatesBySpecialty } from '../(services)/api/api';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function TemplatesScreen() {
  const user = useSelector((state) => state.auth.user); // Get current doctor from Redux
  const specialty = 'Gynecology'; // Set specialty for testing, you can make this dynamic later.
  const router = useRouter(); // Initialize router for navigation

  // Debugging user state
  useEffect(() => {
    if (!user) {
      console.log('No user data available from Redux state. Check if the user is logged in properly.');
    } else {
      console.log('User data from Redux:', user);
    }
  }, [user]);

  // Fetch customized templates for the doctor using React Query v5
  const {
    data: customizedTemplates,
    isLoading: loadingCustomized,
    error: customizedError,
  } = useQuery({
    queryKey: ['customizedTemplates', user?.id],
    queryFn: () => {
      console.log('Fetching customized templates for doctor:', user?.id);
      return getCustomizedTemplates(user?.id);
    },
    enabled: !!user?.id, // Ensure doctorId is available before fetching
    onSuccess: (data) => {
      console.log('Successfully fetched customized templates:', data);
    },
    onError: (error) => {
      console.error('Error while fetching customized templates:', error);
    },
  });

  // Fetch default templates by specialty using React Query v5
  const {
    data: defaultTemplates,
    isLoading: loadingDefault,
    error: defaultError,
  } = useQuery({
    queryKey: ['defaultTemplates', specialty],
    queryFn: () => {
      console.log('Fetching default templates for specialty:', specialty);
      return getTemplatesBySpecialty(specialty);
    },
    enabled: !!specialty, // Fetch only when specialty is available
    onSuccess: (data) => {
      console.log('Successfully fetched default templates:', data);
    },
    onError: (error) => {
      console.error('Error while fetching default templates:', error);
    },
  });

  if (loadingCustomized || loadingDefault) {
    console.log('Loading templates...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (customizedError || defaultError) {
    console.error('Customized Templates Error:', customizedError);
    console.error('Default Templates Error:', defaultError);
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading templates. Please try again later.</Text>
        {customizedError && (
          <Text style={styles.errorMessage}>Error Details: {customizedError.message}</Text>
        )}
        {defaultError && (
          <Text style={styles.errorMessage}>Error Details: {defaultError.message}</Text>
        )}
      </View>
    );
  }

  const handleTemplateClick = (templateId) => {
    console.log('Navigating to TemplateDetailScreen with template ID:', templateId);
    if (templateId) {
        router.push(`/TemplateDetailScreen?templateId=${templateId}`);
    } else {
      console.error('Invalid template ID. Cannot navigate to TemplateDetailScreen.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customized Templates</Text>
      {customizedTemplates?.length ? (
        <FlatList
          data={customizedTemplates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.templateItem}
              onPress={() => handleTemplateClick(item._id)}
            >
              <Text style={styles.templateName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.templateList}
        />
      ) : (
        <Text>No customized templates available.</Text>
      )}

      <Text style={styles.header}>Default Templates</Text>
      {defaultTemplates?.length ? (
        <FlatList
          data={defaultTemplates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.templateItem}
              onPress={() => handleTemplateClick(item._id)}
            >
              <Text style={styles.templateName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.templateList}
        />
      ) : (
        <Text>No default templates available for the selected specialty.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f9f9',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    marginTop: 20,
    marginBottom: 10,
  },
  templateList: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  templateItem: {
    backgroundColor: '#e6f2ef',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
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
