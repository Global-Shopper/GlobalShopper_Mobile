import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function GuestScreen({ navigation, route }) {
	// Get the tab info from route params
	const { tabName, tabIcon } = route.params || {
		tabName: "Tính năng",
		tabIcon: "apps-outline",
	};

	const handleLoginPress = () => {
		navigation.navigate("Login");
	};

	const handleRegisterPress = () => {
		navigation.navigate("Signup");
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.headerGradient}
				>
					<View style={styles.headerContent}>
						<Text style={styles.headerTitle}>{tabName}</Text>
						<View style={styles.headerIcons}>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() => console.log("Chat pressed")}
							>
								<Ionicons
									name="chatbubble-outline"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={() =>
									console.log("Notification pressed")
								}
							>
								<Ionicons
									name="notifications-outline"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</LinearGradient>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<View style={styles.messageContainer}>
					{/* Icon */}
					<View style={styles.iconContainer}>
						<LinearGradient
							colors={["#42A5F5", "#1976D2"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.iconGradient}
						>
							<Ionicons name={tabIcon} size={64} color="#fff" />
						</LinearGradient>
					</View>

					{/* Message */}
					<Text style={styles.title}>Bạn cần đăng nhập</Text>
					<Text style={styles.subtitle}>
						Để sử dụng tính năng {tabName.toLowerCase()}, vui lòng
						đăng nhập vào tài khoản của bạn
					</Text>

					{/* Auth Buttons */}
					<View style={styles.authButtons}>
						<TouchableOpacity
							style={styles.loginButton}
							onPress={handleLoginPress}
						>
							<LinearGradient
								colors={["#42A5F5", "#1976D2"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.buttonGradient}
							>
								<Text style={styles.loginButtonText}>
									Đăng nhập
								</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.registerButton}
							onPress={handleRegisterPress}
						>
							<Text style={styles.registerButtonText}>
								Tạo tài khoản mới
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		paddingTop: 50,
	},
	headerGradient: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	headerIcons: {
		flexDirection: "row",
		gap: 12,
	},
	iconButton: {
		padding: 8,
	},
	content: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 30,
		paddingTop: 80,
	},
	messageContainer: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 32,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 6,
		width: "100%",
		maxWidth: 350,
	},
	iconContainer: {
		marginBottom: 24,
	},
	iconGradient: {
		width: 120,
		height: 120,
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1a1a1a",
		marginBottom: 12,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: "#6c757d",
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 32,
	},
	authButtons: {
		width: "100%",
		gap: 12,
	},
	loginButton: {
		borderRadius: 12,
		overflow: "hidden",
	},
	buttonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	loginButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	registerButton: {
		paddingVertical: 16,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#42A5F5",
		borderRadius: 12,
	},
	registerButtonText: {
		color: "#42A5F5",
		fontSize: 16,
		fontWeight: "600",
	},
});
