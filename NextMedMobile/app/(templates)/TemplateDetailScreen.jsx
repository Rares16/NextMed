import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router'; // Add useNavigation if using Expo Router
import { getTemplateById, updateTemplateById } from '../(services)/api/api';

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams();
  const navigation = useNavigation(); // Access navigation for back button
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

  const handleAddField = async () => {
    try {
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
      const updatedTemplate = await updateTemplateById(templateId, updates);
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
        fields: [
          {
            action: 'remove',
            fieldName,
          },
        ],
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Template Details</Text>
      <View style={styles.templateInfoContainer}>
        <Text style={styles.templateInfo}>Name: <Text style={styles.boldText}>{template.name}</Text></Text>
        <Text style={styles.templateInfo}>Specialty: <Text style={styles.boldText}>{template.specialty}</Text></Text>
      </View>

      <Text style={styles.sectionTitle}>Fields:</Text>
      {template.fields?.length > 0 ? (
        template.fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldName}>Name: {field.fieldName}</Text>
            <Text style={styles.fieldDetail}>Type: {field.fieldType}</Text>
            <Text style={styles.fieldDetail}>Required: {field.required ? 'Yes' : 'No'}</Text>
            {field.fieldType === 'dropdown' && field.options?.length > 0 && (
              <Text style={styles.fieldDetail}>Options: {field.options.join(', ')}</Text>
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
          <Text style={styles.addButtonText}>Add Field</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#093a59",
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#14967f',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  templateInfoContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  templateInfo: {
    fontSize: 18,
    color: "#093a59",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#093a59",
    marginBottom: 20,
  },
  fieldContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  fieldName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796b",
  },
  fieldDetail: {
    fontSize: 18,
    color: "#00796b",
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noFieldsText: {
    marginTop: 20,
    fontSize: 18,
    color: "#00796b",
    textAlign: "center",
  },
  addFieldContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#444",
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#14967f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
