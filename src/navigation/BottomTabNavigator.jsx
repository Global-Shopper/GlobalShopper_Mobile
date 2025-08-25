import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Text } from "../components/ui/text";

// Import screens
import AccountScreen from "../screens/main/AccountScreen";
import GuestAccountScreen from "../screens/main/GuestAccountScreen";
import GuestHomeScreen from "../screens/main/GuestHomeScreen";
import GuestScreen from "../screens/main/GuestScreen";
import HomeScreen from "../screens/main/HomeScreen";
import OrderScreen from "../screens/main/OrderScreen";
import RequestScreen from "../screens/main/RequestScreen";
import WalletScreen from "../screens/main/WalletScreen";

// Create navigators
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main app screens
const BottomTabNavigator = ({ navigation }) => {
	// Check if user is logged in
	const user = useSelector((state) => state?.rootReducer?.user);
	const isGuest = !user || !user.accessToken;

	// Guest screen component with tab info
	const createGuestScreen = (tabName, tabIcon) => {
		const GuestScreenComponent = (props) => (
			<GuestScreen
				{...props}
				route={{
					...props.route,
					params: { tabName, tabIcon },
				}}
			/>
		);
		GuestScreenComponent.displayName = `GuestScreen_${tabName}`;
		return GuestScreenComponent;
	};
	// Custom tab button component
	const CustomTabButton = ({
		focused,
		children,
		onPress,
		accessibilityState,
	}) => {
		return (
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.7}
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: 8,
					paddingHorizontal: 16,
				}}
			>
				{children}
			</TouchableOpacity>
		);
	};

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Home") {
						iconName = focused ? "home" : "home-outline";
					} else if (route.name === "Wallet") {
						iconName = focused ? "wallet" : "wallet-outline";
					} else if (route.name === "Request") {
						iconName = focused
							? "document-text"
							: "document-text-outline";
					} else if (route.name === "Order") {
						iconName = focused
							? "bag-handle"
							: "bag-handle-outline";
					} else if (route.name === "Account") {
						iconName = focused ? "person" : "person-outline";
					}

					return (
						<Ionicons
							name={iconName}
							size={focused ? size + 2 : size}
							color={focused ? "#1976D2" : "#9CA3AF"}
						/>
					);
				},
				tabBarLabel: ({ focused, color }) => {
					let label;

					if (route.name === "Home") {
						label = "Trang chủ";
					} else if (route.name === "Wallet") {
						label = "Ví tiền";
					} else if (route.name === "Request") {
						label = "Yêu cầu";
					} else if (route.name === "Order") {
						label = "Đơn hàng";
					} else if (route.name === "Account") {
						label = "Tài khoản";
					}

					return (
						<Text
							style={{
								color: focused ? "#1976D2" : "#9CA3AF",
								fontSize: 10,
								fontWeight: focused ? "700" : "500",
								marginTop: 2,
								textAlign: "center",
								width: "100%",
							}}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{label}
						</Text>
					);
				},
				tabBarActiveTintColor: "#1976D2",
				tabBarInactiveTintColor: "#9CA3AF",
				tabBarStyle: {
					backgroundColor: "#FFFFFF",
					paddingTop: 6,
					paddingBottom: Platform.OS === "ios" ? 28 : 8,
					paddingHorizontal: 8,
					height: Platform.OS === "ios" ? 90 : 70,
					shadowColor: "#000000",
					shadowOffset: {
						width: 0,
						height: -8,
					},
					shadowOpacity: 0.1,
					shadowRadius: 20,
					elevation: 20,
					borderTopLeftRadius: 28,
					borderTopRightRadius: 28,
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					borderTopWidth: 0,
				},
				tabBarItemStyle: {
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					marginHorizontal: 1,
					paddingVertical: 6,
					paddingHorizontal: 2,
					borderRadius: 20,
					minWidth: 60,
				},
				tabBarButton: (props) => <CustomTabButton {...props} />,
				headerShown: false,
			})}
		>
			<Tab.Screen
				name="Home"
				component={isGuest ? GuestHomeScreen : HomeScreen}
				options={{
					title: "Trang chủ",
					tabBarBadge: null,
				}}
			/>
			<Tab.Screen
				name="Wallet"
				component={
					isGuest
						? createGuestScreen("Ví tiền", "wallet-outline")
						: WalletScreen
				}
				options={{
					title: "Ví tiền",
				}}
			/>
			<Tab.Screen
				name="Request"
				component={
					isGuest
						? createGuestScreen("Yêu cầu", "document-text-outline")
						: RequestScreen
				}
				options={{
					title: "Yêu cầu",
				}}
			/>
			<Tab.Screen
				name="Order"
				component={
					isGuest
						? createGuestScreen("Đơn hàng", "bag-handle-outline")
						: OrderScreen
				}
				options={{
					title: "Đơn hàng",
				}}
			/>
			<Tab.Screen
				name="Account"
				component={isGuest ? GuestAccountScreen : AccountScreen}
				options={{
					title: "Tài khoản",
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomTabNavigator;
