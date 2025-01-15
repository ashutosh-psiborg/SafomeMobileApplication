import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../i18n';

const LANGUAGE_KEY = 'language';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        i18n.changeLanguage(storedLanguage);
        setLanguage(storedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
