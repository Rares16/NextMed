// app/index.jsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to the authenticated section after login
    router.push('/auth');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f9f9' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00796b' }}>Login Screen</Text>
      <Button title="Login" onPress={handleLogin} color="#00796b" />
    </View>
  );
};

export default LoginScreen;
