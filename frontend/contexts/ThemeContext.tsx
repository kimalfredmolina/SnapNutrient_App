import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    bgray: string,
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Color palette
  const lightColors = {
    primary: '#9ACD32',     // Light green
    secondary: '#40E0D0',   // Teal/cyan
    accent: '#FF6B6B',      // Red/coral
    background: '#FFFFFF',  // White
    surface: '#F8F9FA',
    text: '#000000',
    border: 'black',
    bgray: '#F3F4F6',
  };

  const darkColors = {
    primary: '#228B22',     // Dark green
    secondary: '#008B8B',   // Dark teal
    accent: '#DC143C',      // Dark red
    background: '#000000',  // Black
    surface: '#1A1A1A',
    text: '#FFFFFF',
    border: '#374151',
    bgray: '#F3F4F6',
  };

  const colors = isDark ? darkColors : lightColors;

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};