import { createStackNavigator } from "@react-navigation/stack";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import SignupScreen from "../screens/SignupScreen";
import SplashScreen from "../screens/SplashScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();
//Lưu ý các navigator phải được import vào đây và được sử dụng trong hàm AppNavigator
const AppNavigator = () => {
	return (
		<Stack.Navigator initialRouteName="Splash">
			<Stack.Screen
				name="Tabs"
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Splash"
				component={SplashScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OnBoarding"
				component={OnBoardingScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Signup"
				component={SignupScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ForgotPassword"
				component={ForgotPasswordScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OTPVerification"
				component={OTPVerificationScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

export default AppNavigator;
