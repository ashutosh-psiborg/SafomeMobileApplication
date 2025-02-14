import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';

const initialState = {
  currentTheme: 'light', // Default theme
  themes: {
    light: {
      background: '#ffffff',
      text: '#000000',
      primary: '#0279E1',
      secondary: '#323A51',
      lightText: 'rgba(0, 0, 0, 0.4)',
      textInputColor: 'rgba(107, 115, 122, 1)',
      buttonBorder: '#F0F1F2',
      placeHolderText: '#5E6368',
      borderColor: '#6B737A1A',
      blackText: '#000000',
      otpBox: '#F2F7FC',
      grey: '#889CA3',
      darkGrey: '#8B8B8B',
      darkBorderColor: '#6B737A',
      midBorderColor: 'rgba(107, 115, 122, 0.2)',
    },
    dark: {
      background: '#000000',
      text: '#FFFFFF',
      placeHolderText: '#555555',
      grey: '#333333',
      primary: '#1E90FF',
    },
  },
};

// Load theme from AsyncStorage
const loadTheme = async () => {
  const savedTheme = await AsyncStorage.getItem('theme');
  return savedTheme ? savedTheme : 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', state.currentTheme); // Save to AsyncStorage
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      AsyncStorage.setItem('theme', action.payload); // Save to AsyncStorage
    },
    loadThemeFromStorage: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const {toggleTheme, setTheme, loadThemeFromStorage} = themeSlice.actions;
export default themeSlice.reducer;
