import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import { lightTheme,darkTheme } from './Theme';



const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkTheme(savedTheme === 'dark');
      } else {
        setIsDarkTheme(Appearance.getColorScheme() === 'dark');
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
