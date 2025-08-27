import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fcmToken: "",
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const {
  setFcmToken
} = appSlice.actions;
export default appSlice.reducer;
