import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DialogTemplates, useDialog } from "../../components/dialogHelpers";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function GuestScreen({ navigation, route }) {
	// Dialog hook
	const { showDialog, Dialog } = useDialog();

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

	// Handle notification và chat press
	const handleNotificationPress = () => {
		showDialog(
			DialogTemplates.requireLogin(
				() => {
					// Chuyển đến màn hình đăng nhập
					navigation.navigate("Login");
				},
				() => {
					// Hủy - không làm gì
					console.log("Hủy thông báo");
				}
			)
		);
	};

	const handleChatPress = () => {
		showDialog(
			DialogTemplates.requireLogin(
				() => {
					// Chuyển đến màn hình đăng nhập
					navigation.navigate("Login");
				},
				() => {
					// Hủy - không làm gì
					console.log("Hủy chat");
				}
			)
		);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title={tabName}
				onNotificationPress={handleNotificationPress}
				onChatPress={handleChatPress}
				showNotificationIcon={true}
				showChatIcon={true}
				variant="gradient"
			/>

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
			<Dialog />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
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
