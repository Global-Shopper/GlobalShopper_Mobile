import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import rootReducer from "../redux/rootReducer";
import gshopApi from "../services/gshopApi";
import devtoolsEnhancer from "redux-devtools-expo-dev-plugin";

const store = configureStore({
	reducer: {
		rootReducer,
		[gshopApi.reducerPath]: gshopApi.reducer,
	},
	enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(devtoolsEnhancer()),
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(gshopApi.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
