// app/index.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to the authenticated section after login
    router.push('/(auth)/dashboard');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f9ff', padding: 20 }}>
  {/* Logo and Login UI */}
  <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#095d7e', marginBottom: 20 }}>NextMed Login</Text>
  <TextInput
    placeholder="doctor@hospital.com"
    placeholderTextColor="#095d7e"
    style={{
      width: '100%',
      backgroundColor: '#ccecee',
      color: '#095d7e',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 16,
    }}
  />
  <TextInput
    placeholder="Password"
    placeholderTextColor="#095d7e"
    secureTextEntry
    style={{
      width: '100%',
      backgroundColor: '#ccecee',
      color: '#095d7e',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 24,
    }}
  />
  <TouchableOpacity
    onPress={handleLogin} // Call handleLogin to simulate login
    style={{
      backgroundColor: '#14967f',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Login</Text>
  </TouchableOpacity>

  <TouchableOpacity
    //onPress={handleLogin} // Call handleLogin to simulate login
    style={{
      paddingVertical: 10,
      paddingHorizontal: 25,
      //borderRadius: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' }}>Request password</Text>
  </TouchableOpacity>
</View>
  );
};

export default LoginScreen;
