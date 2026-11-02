import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { PublicationsProvider } from './src/context/PublicationsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { MessagesProvider } from './src/context/MessagesContext';
import AppNavigator from './src/navigation/AppNavigator';

function MainApp() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PublicationsProvider>
            <FavoritesProvider>
              <MessagesProvider>
                <MainApp />
              </MessagesProvider>
            </FavoritesProvider>
          </PublicationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
