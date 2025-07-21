import { NavigationContainer } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import React from "react";
import { LogBox, Text } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "../navigation/AppNavigator";
import { persistor, store } from "../redux/store";
import setUpInterceptor from "../services/baseRequest";
import AppThemeProvider from "./ThemeProvider";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
	"VirtualizedLists should never be nested",
]);

setUpInterceptor(store);

const linking = {
  prefixes: [Linking.createURL('')],
  config: {
    screens: {
      Tabs: {
        screens: {
          Wallet: 'wallet',
        },
      },
    },
  },
};

export default function App() {
	console.log(Linking.createURL('/'))
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppThemeProvider>
					<NavigationContainer
						linking={linking}
						fallback={<Text>Loading...</Text>}
						>
						<AppNavigator />
					</NavigationContainer>
				</AppThemeProvider>
			</PersistGate>
		</Provider>
	);
}
