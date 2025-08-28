import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	fcmToken: "",
	isOnline: true, // Add online status tracking
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setFcmToken: (state, action) => {
			state.fcmToken = action.payload;
		},
		setOnLineStatus: (state, action) => {
			state.isOnline = action.payload;
		},
	},
});

export const { setFcmToken, setOnLineStatus } = appSlice.actions;
export default appSlice.reducer;
