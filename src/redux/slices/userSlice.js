import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email: '',
  fullName: '',
  phoneNumber: '',
  country: '',
  password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return {...state, ...action.payload};
    },
    resetUserData: () => {
      return initialState;
    },
  },
});

export const {setUserData, resetUserData} = userSlice.actions;

export default userSlice.reducer;
