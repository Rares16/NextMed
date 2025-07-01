import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTemplateById, updateTemplateById, deleteTemplateById } from '../(services)/api/api';
import styles from '../../styles/TemplateDetailStyles';
export default function TemplateDetailScreen() {
  const [doctorId, setDoctorId] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      setDoctorId(user.id);
      console.log('Doctor ID set from Redux:', user.id);
    } else {
      console.log('No user data available.');
    }
  }, [user]);

  //console.log('Doctor ID:', doctorId);
  const { templateId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newField, setNewField] = useState({
    fieldName: '',
    fieldType: '',
    required: false,
    options: '',
  });
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);

    useEffect(() => {
      if (template?.doctorId) {
        setIsCustomTemplate(true);
      }
    }, [template]);


  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        if (!templateId) throw new Error('Template ID is missing.');
        const fetchedTemplate = await getTemplateById(templateId);
        setTemplate(fetchedTemplate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  const handleDelete = async (templateId) => {
    try {
      if (!templateId) throw new Error('Template ID is missing when trying to delete this template.');
      const result = await deleteTemplateById(templateId);
      console.log('Deleted:', result);
    } catch (error) {
      console.error('Delete failed:', error.message);
    }
  };
  
  const handleAddField = async () => {
    try {
      const updates = {
        fields: [
          {
            action: 'add',
            fieldName: newField.fieldName,
            fieldType: newField.fieldType,
            required: newField.required,
            options:
              newField.fieldType === 'dropdown'
                ? newField.options.split(',').map((opt) => opt.trim())
                : [],
          },
        ],
      };
      const updatedTemplate = await updateTemplateById(templateId, updates,doctorId);
      setTemplate(updatedTemplate);
      setNewField({ fieldName: '', fieldType: '', required: false, options: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteField = async (fieldName) => {
    try {
      if (!templateId) throw new Error('Template ID is missing when trying to delete a field.');
      const updates = {
        fields: [{ action: 'remove', fieldName }],
      };
      const updatedTemplate = await updateTemplateById(templateId, updates);
      setTemplate(updatedTemplate);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14967f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {}
          <View style={styles.topActionBar}>
            <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.actionButtonText}>Back</Text>
            </TouchableOpacity>

            {isCustomTemplate && (
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} 
              onPress={() =>{
                handleDelete(templateId),
                navigation.goBack()
                }
              }
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.header}>Template Details</Text>

          <View style={styles.templateInfoContainer}>
            <Text style={styles.templateInfo}>
              Name: <Text style={styles.boldText}>{template.name}</Text>
            </Text>
            <Text style={styles.templateInfo}>
              Specialty: <Text style={styles.boldText}>{template.specialty}</Text>
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Fields:</Text>
          {template.fields?.length > 0 ? (
            template.fields.map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                <Text style={styles.fieldName}>Name: {field.fieldName}</Text>
                <Text style={styles.fieldDetail}>Type: {field.fieldType}</Text>
                <Text style={styles.fieldDetail}>
                  Required: {field.required ? 'Yes' : 'No'}
                </Text>
                {field.fieldType === 'dropdown' && field.options?.length > 0 && (
                  <Text style={styles.fieldDetail}>Options: {field.options.join(', ')}</Text>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteField(field.fieldName)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete Field</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noFieldsText}>No fields available.</Text>
          )}

          <View style={styles.addFieldContainer}>
            <Text style={styles.sectionTitle}>Add New Field</Text>
            <TextInput
              style={styles.input}
              placeholder="Field Name"
              value={newField.fieldName}
              onChangeText={(text) => setNewField({ ...newField, fieldName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Field Type (text, number, date, dropdown)"
              value={newField.fieldType}
              onChangeText={(text) => setNewField({ ...newField, fieldType: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Required? (true/false)"
              value={newField.required.toString()}
              onChangeText={(text) =>
                setNewField({ ...newField, required: text.toLowerCase() === 'true' })
              }
            />
            {newField.fieldType === 'dropdown' && (
              <TextInput
                style={styles.input}
                placeholder="Options (comma-separated)"
                value={newField.options}
                onChangeText={(text) => setNewField({ ...newField, options: text })}
              />
            )}
            <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
              <Text style={styles.addButtonText}>Add Field</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
