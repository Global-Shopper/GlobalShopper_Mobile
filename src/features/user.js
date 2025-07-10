import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	accessToken: "",
  	refreshToken: "",
	accessTokenExpired: false,
	name: "",
	phone: "",
	role: "",
	avatar: "",
	email: "",
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
		setName(state, action) {
			state.name = action.payload;
		},
		setPhone(state, action) {
			state.phone = action.payload;
		},
		setRole(state, action) {
			state.role = action.payload;
		},
		setAvatar(state, action) {
			state.avatar = action.payload;
		},
		setEmail(state, action) {
			state.email = action.payload;
		},
		setUserInfo(state, action) {
			const { name, phone, role, avatar, email, accessToken } = action.payload;
			state.name = name || state.name;
			state.phone = phone || state.phone;
			state.role = role || state.role;
			state.avatar = avatar || state.avatar;
			state.email = email || state.email;
			state.accessToken = accessToken || state.accessToken;
			state.isLoggedIn = true;
		},
		setCustomerBaseInfo(state, action) {
			const { name, phone, avatar, email } = action.payload;
			state.name = name || state.name;
			state.phone = phone || state.phone;
			state.avatar = avatar || state.avatar;
			state.email = email || state.email;
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
	setName,
	setPhone,
	setRole,
	setAvatar,
	setEmail,
	signout,
	setUserInfo,
	updateProfile,
	setCustomerBaseInfo,
} = userSlice.actions;

export default userSlice.reducer;
