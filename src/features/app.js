import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onLineStatus: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnLineStatus: (state, action) => {
      state.onLineStatus = action.payload;
    },
  },
});

export const {
  setOnLineStatus
} = appSlice.actions;
export default appSlice.reducer;
