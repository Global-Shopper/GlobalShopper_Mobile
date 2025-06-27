import { createStackNavigator } from "@react-navigation/stack";
import ForgotPasswordScreen from "../screens/authen/ForgotPasswordScreen";
import LoginScreen from "../screens/authen/LoginScreen";
import OnBoardingScreen from "../screens/authen/OnBoardingScreen";
import OTPVerificationScreen from "../screens/authen/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/authen/ResetPasswordScreen";
import SignupScreen from "../screens/authen/SignupScreen";
import SplashScreen from "../screens/authen/SplashScreen";
import AccountSettingList from "../screens/profile/AccountSettingList";
import AddAddress from "../screens/profile/AddAddress";
import ChangeProfile from "../screens/profile/ChangeProfile";
import ChangePassword from "../screens/profile/ChangePassword";
import ChatSetting from "../screens/profile/ChatSetting";
import FAQScreen from "../screens/profile/FAQScreen";
import MyAddress from "../screens/profile/MyAddress";
import NotiSetting from "../screens/profile/NotiSetting";
import PaymentMethod from "../screens/profile/PaymentMethod";
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
			<Stack.Screen
				name="ResetPassword"
				component={ResetPasswordScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AccountSettingList"
				component={AccountSettingList}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ChangeProfile"
				component={ChangeProfile}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="MyAddress"
				component={MyAddress}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AddAddress"
				component={AddAddress}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PaymentMethod"
				component={PaymentMethod}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ChatSetting"
				component={ChatSetting}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NotiSetting"
				component={NotiSetting}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ChangePassword"
				component={ChangePassword}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="FAQScreen"
				component={FAQScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

export default AppNavigator;
