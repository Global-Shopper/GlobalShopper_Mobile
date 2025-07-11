import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import PurchaseProcess from "../home/PurchaseProcess";
import QuickAccess from "../home/QuickAccess";

export default function HomeScreen({ navigation }) {
	const handleNotificationPress = () => {
		navigation.navigate("NotificationScreen");
	};

	const handleChatPress = () => {
		console.log("Chat pressed");
	};

	const handleAvatarPress = () => {
		console.log("Avatar pressed");
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				userName="Hoài Phương"
				subtitle="Hôm nay bạn muốn mua gì?"
				avatar="https://github.com/shadcn.png"
				notificationCount={3}
				chatCount={3}
				onNotificationPress={handleNotificationPress}
				onChatPress={handleChatPress}
				onAvatarPress={handleAvatarPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<View style={styles.mainActionGrid}>
						<TouchableOpacity
							style={styles.mainActionCard}
							onPress={() => navigation.navigate("WithLink")}
						>
							<LinearGradient
								colors={["#42A5F5", "#1976D2"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.actionGradient}
							>
								<View style={styles.actionIconContainer}>
									<Ionicons
										name="link-outline"
										size={28}
										color="#FFFFFF"
									/>
								</View>
								<Text style={styles.mainActionTitle}>
									Dán link sản phẩm
								</Text>
								<View style={styles.actionArrow}>
									<Ionicons
										name="arrow-forward"
										size={16}
										color="#FFFFFF"
									/>
								</View>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.mainActionCard}
							onPress={() => navigation.navigate("AddStore")}
						>
							<LinearGradient
								colors={["#E3F2FD", "#BBDEFB"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.actionGradient}
							>
								<View style={styles.actionIconContainer}>
									<Ionicons
										name="create-outline"
										size={28}
										color="#1976D2"
									/>
								</View>
								<Text
									style={[
										styles.mainActionTitle,
										styles.lightCardText,
									]}
								>
									Nhập thông tin sản phẩm
								</Text>
								<View style={styles.actionArrow}>
									<Ionicons
										name="arrow-forward"
										size={16}
										color="#1976D2"
									/>
								</View>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</View>

				{/* Quick Access */}
				<QuickAccess navigation={navigation} />

				{/* Purchase Process */}
				<PurchaseProcess />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 25,
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 10,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	avatar: {
		marginRight: 12,
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	greetingContainer: {
		flex: 1,
	},
	greetingText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 2,
	},
	subGreeting: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.8)",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	notificationContainer: {
		position: "relative",
		marginRight: 16,
	},
	chatIcon: {
		marginLeft: 0,
	},
	notificationBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#dc3545",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	notificationText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		marginTop: 10,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	quickActions: {
		marginTop: 16,
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 16,
	},
	mainActionGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16,
	},
	mainActionCard: {
		flex: 1,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
	},
	actionGradient: {
		borderRadius: 16,
		padding: 20,
		alignItems: "flex-start",
		justifyContent: "flex-start",
		minHeight: 110,
		paddingRight: 60,
		position: "relative",
	},
	actionIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	mainActionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "left",
		lineHeight: 22,
	},
	lightCardText: {
		color: "#1976D2",
	},
	actionArrow: {
		position: "absolute",
		bottom: 18,
		right: 18,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
});
