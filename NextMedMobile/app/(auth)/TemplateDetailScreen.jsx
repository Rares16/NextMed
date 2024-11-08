import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getTemplateById, updateTemplateById } from '../(services)/api/api';

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams(); // Extract templateId from route parameters
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newField, setNewField] = useState({ fieldName: '', fieldType: '', required: false, options: [] });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        if (!templateId) {
          throw new Error('Template ID is missing.');
        }

        console.log(`Fetching template details with ID: ${templateId}`);
        const fetchedTemplate = await getTemplateById(templateId);
        console.log('Fetched template details:', fetchedTemplate);
        setTemplate(fetchedTemplate);
      } catch (err) {
        console.error('Error fetching template details:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleAddField = async () => {
    try {
      // Prepare updates for adding a new field
      const updates = {
        fields: [
          {
            action: 'add',
            fieldName: newField.fieldName,
            fieldType: newField.fieldType,
            required: newField.required,
            options: newField.fieldType === 'dropdown' ? newField.options.split(',').map(opt => opt.trim()) : [],
          },
        ],
      };
  
      // Log the data to see if it's correctly formatted
      console.log('Sending update request with:', JSON.stringify({ ...updates, templateId }, null, 2));
  
      // Send the update request
      const updatedTemplate = await updateTemplateById(templateId, updates);
      setTemplate(updatedTemplate);
      setNewField({ fieldName: '', fieldType: '', required: false, options: '' }); // Reset the form
    } catch (err) {
      console.error('Error updating template:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }
  };
  
  

  const handleDeleteField = async (fieldName) => {
    try {
      if (!templateId) {
        throw new Error('Template ID is missing when trying to delete a field.');
      }

      // Prepare the update payload for field removal
      const updates = {
        fields: [
          {
            action: 'remove',
            fieldName: fieldName,
          },
        ],
      };

      console.log('Sending update request with:', JSON.stringify({ ...updates, templateId }, null, 2));

      // Send the update request
      const updatedTemplate = await updateTemplateById(templateId, updates);
      console.log('Updated template after deletion:', updatedTemplate);
      setTemplate(updatedTemplate);
    } catch (err) {
      console.error('Error deleting field:', err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Template Details</Text>
      <Text style={styles.templateName}>Name: {template.name}</Text>
      <Text style={styles.specialty}>Specialty: {template.specialty}</Text>

      <Text style={styles.fieldsHeader}>Fields:</Text>
      {template.fields?.length > 0 ? (
        template.fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Field Name: {field.fieldName}</Text>
            <Text style={styles.fieldType}>Field Type: {field.fieldType}</Text>
            <Text style={styles.fieldRequired}>Required: {field.required ? 'Yes' : 'No'}</Text>
            {field.fieldType === 'dropdown' && field.options?.length > 0 && (
              <Text style={styles.fieldOptions}>Options: {field.options.join(', ')}</Text>
            )}
            <TouchableOpacity onPress={() => handleDeleteField(field.fieldName)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Field</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noFieldsText}>No fields available.</Text>
      )}

      <View style={styles.addFieldContainer}>
        <Text style={styles.fieldsHeader}>Add New Field</Text>
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
          onChangeText={(text) => setNewField({ ...newField, required: text.toLowerCase() === 'true' })}
        />
        {newField.fieldType === 'dropdown' && (
          <TextInput
            style={styles.input}
            placeholder="Options (comma-separated)"
            value={newField.options}
            onChangeText={(text) => setNewField({ ...newField, options: text })}
          />
        )}
        <Button title="Add Field" onPress={handleAddField} />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f7f9f9',
    padding: 20,
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
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
  },
  specialty: {
    fontSize: 16,
    color: '#00796b',
    marginBottom: 20,
  },
  fieldsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
  },
  fieldContainer: {
    backgroundColor: '#e6f2ef',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  fieldName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  fieldType: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 2,
  },
  fieldRequired: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 2,
  },
  fieldOptions: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 2,
  },
  noFieldsText: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
