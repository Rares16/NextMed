import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCustomizedTemplates, getTemplatesBySpecialty } from '../(services)/api/api';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { TemplateScreenStyles } from '../../styles/TemplateScreenStyles'; // Import refactored styles

const { height, width } = Dimensions.get('window');

export default function TemplatesScreen() {
  const user = useSelector((state) => state.auth.user);
  const specialty = 'Gynecology'; // Set specialty for testing
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('No user data available.');
    } else {
      console.log('User data from Redux:', user);
    }
  }, [user]);

  // Fetch customized templates
  const {
    data: customizedTemplates,
    isLoading: loadingCustomized,
    error: customizedError,
  } = useQuery({
    queryKey: ['customizedTemplates', user?.id],
    queryFn: () => getCustomizedTemplates(user?.id),
    enabled: !!user?.id,
  });

  // Fetch default templates by specialty
  const {
    data: defaultTemplates,
    isLoading: loadingDefault,
    error: defaultError,
  } = useQuery({
    queryKey: ['defaultTemplates', specialty],
    queryFn: () => getTemplatesBySpecialty(specialty),
    enabled: !!specialty,
  });

  if (loadingCustomized || loadingDefault) {
    return (
      <View style={TemplateScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (customizedError || defaultError) {
    return (
      <View style={TemplateScreenStyles.errorContainer}>
        <Text style={TemplateScreenStyles.errorText}>Error loading templates. Please try again later.</Text>
        {customizedError && <Text style={TemplateScreenStyles.errorMessage}>{customizedError.message}</Text>}
        {defaultError && <Text style={TemplateScreenStyles.errorMessage}>{defaultError.message}</Text>}
      </View>
    );
  }

  const handleTemplateClick = (templateId) => {
    if (templateId) {
      router.push(`/TemplateDetailScreen?templateId=${templateId}`);
    } else {
      console.error('Invalid template ID.');
    }
  };

  return (
    <View style={TemplateScreenStyles.container}>
      <Text style={TemplateScreenStyles.header}>Customized Templates</Text>
      {customizedTemplates?.length ? (
        <FlatList
          data={customizedTemplates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={TemplateScreenStyles.templateItem}
              onPress={() => handleTemplateClick(item._id)}
            >
              <Text style={TemplateScreenStyles.templateName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={TemplateScreenStyles.templateList}
        />
      ) : (
        <Text style={TemplateScreenStyles.noTemplatesText}>No customized templates available.</Text>
      )}

      <Text style={TemplateScreenStyles.header}>Default Templates</Text>
      {defaultTemplates?.length ? (
        <FlatList
          data={defaultTemplates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={TemplateScreenStyles.templateItem}
              onPress={() => handleTemplateClick(item._id)}
            >
              <Text style={TemplateScreenStyles.templateName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={TemplateScreenStyles.templateList}
        />
      ) : (
        <Text style={TemplateScreenStyles.noTemplatesText}>No default templates available for the selected specialty.</Text>
      )}
    </View>
  );
}
