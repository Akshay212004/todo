import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// Dark icons on the app's light background. (Newer React Native versions draw
// edge-to-edge on Android, so the status bar takes the colour of the screen behind it.)
const App = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" />
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
