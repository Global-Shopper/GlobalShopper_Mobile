import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { DialogTemplates, useDialog } from "../../components/dialogHelpers";
import { Text } from "../../components/ui/text";

export default function GuestAccountScreen({ navigation }) {
	// Dialog hook
	const { showDialog, Dialog } = useDialog();

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

	// Hỗ trợ & Thông tin
	const supportAndInfo = [
		{
			id: 1,
			title: "Câu hỏi thường gặp (FAQ)",
			subtitle: "Tìm câu trả lời nhanh chóng",
			icon: "help-circle-outline",
			action: () => navigation.navigate("FAQScreen"),
		},
		{
			id: 2,
			title: "Gửi yêu cầu hỗ trợ",
			subtitle: "Liên hệ đội ngũ hỗ trợ",
			icon: "mail-outline",
			action: () => console.log("Navigate to support request"),
		},
		{
			id: 3,
			title: "Điều khoản sử dụng",
			subtitle: "Quy định và điều khoản",
			icon: "document-text-outline",
			action: () => navigation.navigate("TermsScreen"),
		},
		{
			id: 4,
			title: "Chính sách bảo mật",
			subtitle: "Quyền riêng tư của bạn",
			icon: "shield-checkmark-outline",
			action: () => navigation.navigate("PolicyScreen"),
		},
	];

	const appInfo = [
		{
			label: "Phiên bản ứng dụng",
			value: "1.0.0",
		},
		{
			label: "Hotline hỗ trợ",
			value: "1900 1234",
		},
		{
			label: "Email hỗ trợ",
			value: "sep490gshop@gmail.com",
		},
	];

	return (
		<View style={styles.container}>
			{/* Custom Header for Auth Actions */}
			<View style={styles.header}>
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.headerGradient}
				>
					<View style={styles.headerContent}>
						<View style={styles.headerLeft}>
							<View style={styles.authActions}>
								<TouchableOpacity
									style={styles.authActionButton}
									onPress={handleLoginPress}
								>
									<Text style={styles.authActionText}>
										Đăng nhập
									</Text>
								</TouchableOpacity>
								<Text style={styles.authSeparator}>|</Text>
								<TouchableOpacity
									style={styles.authActionButton}
									onPress={handleRegisterPress}
								>
									<Text style={styles.authActionText}>
										Đăng ký
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.headerIcons}>
							<TouchableOpacity
								style={styles.iconButton}
								onPress={handleNotificationPress}
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

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Hỗ trợ & Thông tin */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Hỗ trợ </Text>
					<View style={styles.menuContainer}>
						{supportAndInfo.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.menuItem}
								onPress={item.action}
								activeOpacity={0.7}
							>
								<View style={styles.menuItemLeft}>
									<View style={styles.iconContainer}>
										<View style={styles.iconBackground}>
											<Ionicons
												name={item.icon}
												size={24}
												color="#007AFF"
											/>
										</View>
									</View>
									<View style={styles.menuItemContent}>
										<Text style={styles.menuTitle}>
											{item.title}
										</Text>
										<Text style={styles.menuSubtitle}>
											{item.subtitle}
										</Text>
									</View>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color="#B0BEC5"
								/>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* App Info */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
					<View style={styles.appInfoCard}>
						{appInfo.map((info, index) => (
							<View key={index} style={styles.appInfoItem}>
								<Text style={styles.appInfoLabel}>
									{info.label}
								</Text>
								<Text style={styles.appInfoValue}>
									{info.value}
								</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
			<Dialog />
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
		shadowColor: "#007AFF",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLeft: {
		flex: 1,
	},
	authActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	authActionButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	authActionText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
	},
	authSeparator: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 16,
		marginHorizontal: 4,
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
	},
	scrollContent: {
		paddingBottom: 100,
		paddingTop: 20,
	},
	section: {
		marginHorizontal: 20,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 16,
	},

	// Menu Container Styles
	menuContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		marginRight: 15,
	},
	iconBackground: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F0F8FF",
	},
	menuItemContent: {
		flex: 1,
	},
	menuTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	menuSubtitle: {
		fontSize: 13,
		color: "#78909C",
	},

	// App Info Styles
	appInfoCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	appInfoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f8f9fa",
	},
	appInfoLabel: {
		fontSize: 16,
		color: "#1a1a1a",
		fontWeight: "500",
	},
	appInfoValue: {
		fontSize: 16,
		color: "#6c757d",
	},
});
