import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider} from 'react-redux';
import store from './src/redux/store';

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
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AppNavigator />
        </I18nextProvider>
      </Provider>
    </QueryClientProvider>
  );
}
