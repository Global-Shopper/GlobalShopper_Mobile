import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Platform } from "react-native";
import { Text } from "../components/ui/text";

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

					// Custom icon container with gradient background for active state
					if (focused) {
						return (
							<View style={{
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: 2,
							}}>
								<LinearGradient
									colors={['#42A5F5', '#1976D2']}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={{
										width: 44,
										height: 32,
										borderRadius: 16,
										justifyContent: 'center',
										alignItems: 'center',
										shadowColor: '#1976D2',
										shadowOffset: {
											width: 0,
											height: 2,
										},
										shadowOpacity: 0.25,
										shadowRadius: 4,
										elevation: 5,
									}}
								>
									<Ionicons name={iconName} size={size - 2} color="#FFFFFF" />
								</LinearGradient>
							</View>
						);
					}

					return (
						<View style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: 2,
							width: 44,
							height: 32,
						}}>
							<Ionicons name={iconName} size={size} color={color} />
						</View>
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
								color: focused ? '#1976D2' : color,
								fontSize: 10,
								fontWeight: focused ? "600" : "500",
								marginTop: 4,
								textAlign: 'center',
								paddingHorizontal: 2,
							}}
						>
							{label}
						</Text>
					);
				},
				tabBarActiveTintColor: "#1976D2",
				tabBarInactiveTintColor: "#9E9E9E",
				tabBarStyle: {
					backgroundColor: "#FFFFFF",
					borderTopWidth: 0,
					paddingTop: 6,
					paddingBottom: Platform.OS === 'ios' ? 30 : 10,
					height: Platform.OS === 'ios' ? 85 : 70,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: -4,
					},
					shadowOpacity: 0.15,
					shadowRadius: 12,
					elevation: 20,
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
				},
				tabBarItemStyle: {
					paddingVertical: 4,
					marginHorizontal: 2,
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
					tabBarBadge: 3,
					tabBarBadgeStyle: {
						backgroundColor: '#FF5722',
						color: '#FFFFFF',
						fontSize: 10,
						fontWeight: '600',
						minWidth: 18,
						height: 18,
						borderRadius: 9,
						marginLeft: 8,
						marginTop: 2,
					},
				}}
			/>
			<Tab.Screen
				name="Order"
				component={OrderScreen}
				options={{
					title: "Đơn hàng",
					tabBarBadge: 2,
					tabBarBadgeStyle: {
						backgroundColor: '#FF5722',
						color: '#FFFFFF',
						fontSize: 10,
						fontWeight: '600',
						minWidth: 18,
						height: 18,
						borderRadius: 9,
						marginLeft: 8,
						marginTop: 2,
					},
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
