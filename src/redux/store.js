import {configureStore} from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    language: languageReducer,

  },
});

export default store;
