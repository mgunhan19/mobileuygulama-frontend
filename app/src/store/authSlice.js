import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isLoggedIn: false },
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutAction: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    }
  }
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;