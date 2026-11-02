import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../styles/theme';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = '@uniapuntes_theme_dark';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar preferencia guardada
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) {
          setIsDarkMode(stored === 'true');
        }
      } catch (err) {
        console.warn('Error al cargar preferencia de tema:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  // Alternar entre modo claro y oscuro
  const toggleTheme = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, String(nextMode));
    } catch (err) {
      console.warn('Error al guardar preferencia de tema:', err);
    }
  };

  const setDarkMode = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, String(value));
    } catch (err) {
      console.warn('Error al establecer tema:', err);
    }
  };

  const currentColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: currentColors,
        toggleTheme,
        setDarkMode,
        isLoaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
}

export default ThemeContext;
