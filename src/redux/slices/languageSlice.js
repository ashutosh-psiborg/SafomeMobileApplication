import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  language: 'en', // Default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
});

// Action to change language
export const changeLanguage = (language) => async (dispatch) => {
  // Save the language to AsyncStorage
  await AsyncStorage.setItem('language', language);

  // Dispatch to update the Redux state
  dispatch(setLanguage(language));
};

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
