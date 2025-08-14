import { createStackNavigator } from "@react-navigation/stack";
import ForgotPasswordScreen from "../screens/authen/ForgotPasswordScreen";
import LoginScreen from "../screens/authen/LoginScreen";
import OnBoardingScreen from "../screens/authen/OnBoardingScreen";
import OTPVerificationScreen from "../screens/authen/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/authen/ResetPasswordScreen";
import SignupScreen from "../screens/authen/SignupScreen";
import SplashScreen from "../screens/authen/SplashScreen";
import BlogDetail from "../screens/blog/BlogDetail";
import BlogListScreen from "../screens/blog/BlogListScreen";
import FeedbackDetails from "../screens/feedback/FeedbackDetails";
import FeedbackOrder from "../screens/feedback/FeedbackOrder";
import NotificationScreen from "../screens/notification/NotificationScreen";
import CancelOrder from "../screens/order/CancelOrder";
import OrderDetails from "../screens/order/OrderDetails";
import OrderHistoryScreen from "../screens/order/OrderHistoryScreen";
import SuccessPaymentScreen from "../screens/payment/SuccessPaymentScreen";
import VNPayGateWay from "../screens/payment/VNPayGateWay";
import AccountSettingList from "../screens/profile/AccountSettingList";
import AddAddress from "../screens/profile/AddAddress";
import AddWithdraw from "../screens/profile/AddWithdraw";
import ChangePassword from "../screens/profile/ChangePassword";
import ChangeProfile from "../screens/profile/ChangeProfile";
import ChatSetting from "../screens/profile/ChatSetting";
import EditAddress from "../screens/profile/EditAddress";
import FAQScreen from "../screens/profile/FAQScreen";
import MyAddress from "../screens/profile/MyAddress";
import NotiSetting from "../screens/profile/NotiSetting";
import PolicyScreen from "../screens/profile/PolicyScreen";
import TermsScreen from "../screens/profile/TermsScreen";
import WithdrawList from "../screens/profile/WithdrawList";
import RequestRefund from "../screens/refund/RequestRefund";
import AddStore from "../screens/request/AddStore";
import ConfirmQuotation from "../screens/request/ConfirmQuotation";
import ConfirmRequest from "../screens/request/ConfirmRequest";
import ProductDetails from "../screens/request/ProductDetails";
import RequestDetails from "../screens/request/RequestDetails";
import RequestHistory from "../screens/request/RequestHistory";
import SuccessConfirmationScreen from "../screens/request/SuccessConfirmationScreen";
import WithLink from "../screens/request/WithLink";
import StatisticScreen from "../screens/statistic/StatisticScreen";
import SuccessWithdrawScreen from "../screens/wallet/SuccessWithdrawScreen";
import TopUpScreen from "../screens/wallet/TopUpScreen";
import TransactionHistoryScreen from "../screens/wallet/TransactionHistoryScreen";
import WithdrawScreen from "../screens/wallet/WithdrawScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

//Lưu ý các navigator phải được import vào đây và được sử dụng trong hàm AppNavigator
const AppNavigator = () => {
	// Wrapper component để pass navigation prop
	const TabsScreen = ({ navigation }) => (
		<BottomTabNavigator navigation={navigation} />
	);

	return (
		<Stack.Navigator initialRouteName="Splash">
			<Stack.Screen
				name="Tabs"
				component={TabsScreen}
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
				name="EditAddress"
				component={EditAddress}
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
			<Stack.Screen
				name="TermsScreen"
				component={TermsScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PolicyScreen"
				component={PolicyScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="WithdrawList"
				component={WithdrawList}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AddWithdraw"
				component={AddWithdraw}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NotificationScreen"
				component={NotificationScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="TransactionHistory"
				component={TransactionHistoryScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="TopUp"
				component={TopUpScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Withdraw"
				component={WithdrawScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="SuccessWithdrawScreen"
				component={SuccessWithdrawScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="VNPayGateWay"
				component={VNPayGateWay}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="WithLink"
				component={WithLink}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AddStore"
				component={AddStore}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ProductDetails"
				component={ProductDetails}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ConfirmRequest"
				component={ConfirmRequest}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ConfirmQuotation"
				component={ConfirmQuotation}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="SuccessPaymentScreen"
				component={SuccessPaymentScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="RequestDetails"
				component={RequestDetails}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="RequestHistory"
				component={RequestHistory}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="SuccessConfirmationScreen"
				component={SuccessConfirmationScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OrderDetails"
				component={OrderDetails}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="RequestRefund"
				component={RequestRefund}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="CancelOrder"
				component={CancelOrder}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OrderHistory"
				component={OrderHistoryScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="FeedbackDetails"
				component={FeedbackDetails}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="FeedbackOrder"
				component={FeedbackOrder}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="BlogListScreen"
				component={BlogListScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="BlogDetail"
				component={BlogDetail}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="StatisticScreen"
				component={StatisticScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

export default AppNavigator;
