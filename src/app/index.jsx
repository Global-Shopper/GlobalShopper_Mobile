import { initializeApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import React from "react";
import { LogBox, Text } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "../navigation/AppNavigator";
import { persistor, store } from "../redux/store";
import setUpInterceptor from "../services/baseRequest";
import { useNotification } from "../utils/fcm";
import AppThemeProvider from "./ThemeProvider";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
	"VirtualizedLists should never be nested",
]);

setUpInterceptor(store);

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Tabs: {
        screens: {
          Wallet: 'wallet',
					Order: 'order',
        },
      },
			SuccessPaymentScreen: 'success-payment-screen',
    },
  },
};


const firebaseConfig = {
    apiKey: "AIzaSyCdWCgf0nl6pGpXsvXNOvtNeuG9ZycIYJE",
    authDomain: "globalshopper-54484.firebaseapp.com",
    projectId: "globalshopper-54484",
    storageBucket: "globalshopper-54484.firebasestorage.app",
    messagingSenderId: "180078038826",
    appId: "1:180078038826:web:d07314c8a28628fe099853",
    measurementId: "G-DJPWLHETHB"
  };
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
export default function App() {
	console.log("Init app")
	useNotification()
	onMessage(messaging, (payload) => {
		console.log('Message received. ', payload);
	});
	
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
