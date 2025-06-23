import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LogBox } from "react-native";
import { store, persistor } from "../redux/store";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "../navigation/AppNavigator";
import setUpInterceptor from "../services/baseRequest";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
	"VirtualizedLists should never be nested",
]);

setUpInterceptor(store);

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
					<AppNavigator />
			</PersistGate>
		</Provider>
	);
}
