import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null, isLoggedIn: false},
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutAction: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    
    updateUserScore: (state, action) => {
      if (state.user) {
        state.user.score = action.payload; 
      }
    },
  }
});

export const {loginAction, logoutAction, updateUserScore} = authSlice.actions;
export default authSlice.reducer;