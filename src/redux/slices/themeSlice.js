import {createSlice} from '@reduxjs/toolkit';

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
      otpBox: "#F2F7FC",
      grey: '#889CA3',
      darkBorderColor: '#6B737A',
      midBorderColor : 'rgba(107, 115, 122, 0.2)'
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

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const {toggleTheme, setTheme} = themeSlice.actions;
export default themeSlice.reducer;
