import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import appReducer from "../features/app";
import userReducer from "../features/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  // blacklist: [ 'isLoading']
};

const combinedReducer = combineReducers({
  app: appReducer,
  user: persistReducer(userPersistConfig, userReducer),
});

const rootReducer = (state, action) => {
	return combinedReducer(state, action);
};
export default rootReducer;
