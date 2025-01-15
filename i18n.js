import i18n from 'i18next'; // Correct import
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './src/lang/en/en.json';
import hi from './src/lang/hi/hi.json';
import ger from './src/lang/ger/ger.json';

const LANGUAGE_KEY = 'language';

i18n
  .use(initReactI18next) // Correct method
  .init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ger: { translation: ger },
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: false, // For SSR compatibility
    },
  });

// Load language from AsyncStorage
(async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
  }
})();

export default i18n;
