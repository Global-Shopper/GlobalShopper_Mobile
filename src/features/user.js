import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	accessToken: "",
  refreshToken: "",
	accessTokenExpired: false,
	username: "",
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setAccessTokenExpired(state, action) {
      state.accessTokenExpired = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
		signout() {
			return initialState
		},
	},
});

export const {
	setIsLoggedIn,
	setAccessToken,
  setRefreshToken,
	setAccessTokenExpired,
	setUsername,
	signout,
} = userSlice.actions;

export default userSlice.reducer;
