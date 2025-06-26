import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui/text";

// Import screens
import HomeScreen from "../screens/main/HomeScreen";
import WalletScreen from "../screens/main/WalletScreen";
import RequestScreen from "../screens/main/RequestScreen";
import OrderScreen from "../screens/main/OrderScreen";
import AccountScreen from "../screens/main/AccountScreen";

// Create navigators
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main app screens
const BottomTabNavigator = () => {
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
						<Ionicons name={iconName} size={size} color={color} />
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
								color,
								fontSize: 12,
								fontWeight: focused ? "600" : "400",
								marginTop: -4,
							}}
						>
							{label}
						</Text>
					);
				},
				tabBarActiveTintColor: "#007bff",
				tabBarInactiveTintColor: "#8e8e93",
				tabBarStyle: {
					backgroundColor: "#ffffff",
					borderTopWidth: 1,
					borderTopColor: "#e9ecef",
					paddingTop: 8,
					paddingBottom: 8,
					height: 88,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: -2,
					},
					shadowOpacity: 0.1,
					shadowRadius: 3,
					elevation: 8,
				},
				tabBarItemStyle: {
					paddingVertical: 4,
				},
				headerShown: false,
			})}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Trang chủ",
					tabBarBadge: null, // You can add notification badges here
				}}
			/>
			<Tab.Screen
				name="Wallet"
				component={WalletScreen}
				options={{
					title: "Ví tiền",
				}}
			/>
			<Tab.Screen
				name="Request"
				component={RequestScreen}
				options={{
					title: "Yêu cầu",
					tabBarBadge: 3, // Example badge showing 3 pending requests
				}}
			/>
			<Tab.Screen
				name="Order"
				component={OrderScreen}
				options={{
					title: "Đơn hàng",
					tabBarBadge: 2, // Example badge showing 2 active orders
				}}
			/>
			<Tab.Screen
				name="Account"
				component={AccountScreen}
				options={{
					title: "Tài khoản",
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomTabNavigator;
