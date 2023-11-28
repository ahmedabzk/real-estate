import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      (state.loading = false),
        (state.currentUser = action.payload),
        (state.error = null);
    },
    signInError: (state, action) => {
        (state.loading = false),
        (state.error = action.payload),
        (state.currentUser = null);
    },
  },
});

export const { signInStart, signInSuccess, signInError } = authSlice.actions;
export default authSlice;
