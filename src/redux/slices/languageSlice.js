import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enJson from '../../constants/STRINGS/en.json';
import {processJson} from '../../utils/translate';

const SOURCE_VERSION = '1.7'; // Increment this manually whenever en.json is updated

export const loadLanguageStrings = createAsyncThunk(
  'language/loadLanguageStrings',
  async (_, {rejectWithValue}) => {
    try {
      let langKey = await AsyncStorage.getItem('languageKey');
      if (!langKey) {
        langKey = 'en';
        await AsyncStorage.setItem('languageKey', langKey);
      }

      // Check stored version
      const storedVersion = await AsyncStorage.getItem(
        `lang_version_${langKey}`,
      );
      const isStale = storedVersion !== SOURCE_VERSION;

      // If already translated and version is up-to-date
      const cachedStrings = await AsyncStorage.getItem(langKey);
      if (cachedStrings && !isStale) {
        return {language: langKey, strings: JSON.parse(cachedStrings)};
      }

      // (Re-)translate and cache it
      const translated =
        langKey === 'en' ? enJson : await processJson(enJson, langKey);
      await AsyncStorage.setItem(langKey, JSON.stringify(translated));
      await AsyncStorage.setItem(`lang_version_${langKey}`, SOURCE_VERSION);

      return {language: langKey, strings: translated};
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to load language strings',
      );
    }
  },
);

export const changeLanguage = createAsyncThunk(
  'language/changeLanguage',
  async (newLangKey, {dispatch, rejectWithValue}) => {
    try {
      await AsyncStorage.setItem('languageKey', newLangKey);
      return await dispatch(loadLanguageStrings()).unwrap();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change language');
    }
  },
);

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    appStrings: {},
    selectedLanguage: 'en',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadLanguageStrings.pending, state => {
        state.loading = true;
      })
      .addCase(loadLanguageStrings.fulfilled, (state, action) => {
        state.appStrings = action.payload.strings;
        state.selectedLanguage = action.payload.language;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadLanguageStrings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeLanguage.fulfilled, (state, action) => {
        state.appStrings = action.payload.strings;
        state.selectedLanguage = action.payload.language;
        state.loading = false;
        state.error = null;
      });
  },
});

export default languageSlice.reducer;
