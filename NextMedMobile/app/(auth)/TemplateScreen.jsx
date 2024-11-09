import React, { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCustomizedTemplates, getTemplatesBySpecialty } from '../(services)/api/api';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { TemplateScreenStyles } from '../../styles/TemplateScreenStyles';

export default function TemplatesScreen() {
  const user = useSelector((state) => state.auth.user);
  const specialty = 'Gynecology';
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('No user data available.');
    } else {
      console.log('User data from Redux:', user);
    }
  }, [user]);

  const {
    data: customizedTemplates,
    isLoading: loadingCustomized,
    error: customizedError,
  } = useQuery({
    queryKey: ['customizedTemplates', user?.id],
    queryFn: () => getCustomizedTemplates(user?.id),
    enabled: !!user?.id,
  });

  const {
    data: defaultTemplates,
    isLoading: loadingDefault,
    error: defaultError,
  } = useQuery({
    queryKey: ['defaultTemplates', specialty],
    queryFn: () => getTemplatesBySpecialty(specialty),
    enabled: !!specialty,
  });

  const handleTemplateClick = (templateId) => {
    if (templateId) {
      router.push(`/TemplateDetailScreen?templateId=${templateId}`);
    }
  };

  if (loadingCustomized || loadingDefault) {
    return (
      <SafeAreaView style={TemplateScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={TemplateScreenStyles.container}>
      <Text style={TemplateScreenStyles.header}>Customized Templates</Text>
      <FlatList
        data={customizedTemplates}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={TemplateScreenStyles.templateItem}
            onPress={() => handleTemplateClick(item._id)}
          >
            <Text style={TemplateScreenStyles.templateName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={TemplateScreenStyles.templateList}
      />

      <Text style={TemplateScreenStyles.header}>Default Templates</Text>
      <FlatList
        data={defaultTemplates}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={TemplateScreenStyles.templateItem}
            onPress={() => handleTemplateClick(item._id)}
          >
            <Text style={TemplateScreenStyles.templateName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={TemplateScreenStyles.templateList}
      />
    </SafeAreaView>
  );
}
