// app/(auth)/_layout.jsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import PrivateRoute from '../components/PrivateRoute';

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
          name="TemplateScreen"
          options={{
            tabBarLabel: 'Templates',
            tabBarIcon: ({ color }) => <MaterialIcons name="description" size={24} color={color} />,
            headerShown : false
          }}
        />
        <Tabs.Screen
          name="AudioRecordingScreen"
          options={{
            tabBarLabel: 'Record',
            tabBarIcon: ({ color }) => <MaterialIcons name="mic" size={24} color={color} />,
            headerShown : false
          }}
        />
        <Tabs.Screen
          name="profile"
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
