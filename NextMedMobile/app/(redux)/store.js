// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust the path to where your slice is located

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers if you have them
  },
});

export default store;
