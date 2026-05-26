import { createSlice } from '@reduxjs/toolkit';

// Check if user is already logged in from a previous session
const storedUser  = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:  storedUser  ? JSON.parse(storedUser) : null,
    token: storedToken ? storedToken : null,
  },
  reducers: {
    // Called after a successful login
    setCredentials: (state, action) => {
      state.user  = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    // Called when the user logs out
    logout: (state) => {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;