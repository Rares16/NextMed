// app/(auth)/_layout.jsx
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00796b',
        tabBarInactiveTintColor: '#b2dfdb',
        tabBarStyle: { backgroundColor: '#e0f2f1' },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
