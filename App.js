import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider, useDispatch} from 'react-redux';
import store from './src/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadThemeFromStorage} from './src/redux/slices/themeSlice';
import {loadLanguageStrings} from './src/redux/slices/languageSlice'; // adjust path
import {Provider as Paper} from 'react-native-paper';
// Component to load theme on startup
const Setup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        dispatch(loadThemeFromStorage(savedTheme));
      }
    };
    getTheme();
  }, [dispatch]);
  useEffect(() => {
    dispatch(loadLanguageStrings()); // Load language + strings from AsyncStorage
  }, []);
  return <AppNavigator />;
};

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Paper>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Setup />
          </I18nextProvider>
        </Provider>
      </Paper>
    </QueryClientProvider>
  );
}
