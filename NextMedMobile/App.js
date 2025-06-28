import { ExpoRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

// Default export
export default function App() {
  return (
    <View style={styles.container}>
      <ExpoRouter />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9f9',  // Background color for the app, light and welcoming
  },
});
