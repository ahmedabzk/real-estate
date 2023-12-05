import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "user",
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
    signInFailure: (state, action) => {
      (state.loading = false),
        (state.error = action.payload),
        (state.currentUser = null);
    },
    startUpdateUser: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      (state.loading = false),
        (state.currentUser = action.payload),
        (state.error = null);
    },
    updateUserFailure: (state, action) => {
      (state.loading = false),
        (state.error = action.payload),
        (state.currentUser = null);
    },
    signOutAndDeleteStart: (state) => {
      state.loading = true;
    },
    signOutAndDeleteSuccess: (state) => {
        state.currentUser = null,
        state.loading = false,
        state.error = null
    },
    signOutAndDeleteFailure: (state, action) => {
      state.error = action.payload,
        state.loading = false
    }
  },
});

export const { signInStart, signInSuccess, signInFailure, startUpdateUser, updateUserSuccess,
  updateUserFailure, signOutAndDeleteFailure, signOutAndDeleteSuccess, signOutAndDeleteStart } = authSlice.actions;
export default authSlice.reducer;
