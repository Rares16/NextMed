// app/(auth)/_layout.jsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import PrivateRoute from '../components/PrivateRoute'; // Ensure the correct path

export default function AuthLayout() {
  return (
    <PrivateRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#00796b',
          tabBarInactiveTintColor: '#b2dfdb',
          tabBarStyle: { backgroundColor: '#e0f2f1' },
        }}
      >
        <Tabs.Screen
          name="dashboard" // Must match file name (HomeScreen.jsx)
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
            headerShown : false
          }}
        />
        <Tabs.Screen
          name="TemplateScreen" // Ensure this matches file name (TemplatesScreen.jsx)
          options={{
            tabBarLabel: 'Templates',
            tabBarIcon: ({ color }) => <MaterialIcons name="description" size={24} color={color} />,
            headerShown : false
          }}
        />
        <Tabs.Screen
          name="AudioRecordingScreen" // Ensure this matches file name (TemplatesScreen.jsx)
          options={{
            tabBarLabel: 'Record',
            tabBarIcon: ({ color }) => <MaterialIcons name="mic" size={24} color={color} />,
            headerShown : false
          }}
        />
        <Tabs.Screen
          name="profile" // Must match file name (ProfileScreen.jsx)
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            headerShown : false
          }}
        />
      </Tabs>
    </PrivateRoute>
  );
}
