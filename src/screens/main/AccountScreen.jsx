import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../components/dialogHelpers";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { signout } from "../../features/user";

export default function AccountScreen({ navigation }) {
	// Get user data from Redux
	const reduxUser = useSelector((state) => state?.rootReducer?.user);
	const dispatch = useDispatch();
	const { showDialog, Dialog } = useDialog();

	const [user] = useState({
		name: reduxUser?.name,
		email: reduxUser?.email,
		phone: "+84 123 456 789",
		avatar: reduxUser?.avatar,
		memberSince: "2023",
		isVerified: true,
	});

	const [chatNotificationCount] = useState(3); // Số tin nhắn chưa đọc

	const handleChatPress = () => {
		console.log("Chat pressed");
	};

	// Stats để hiển thị tổng quan nhanh
	const userStats = [
		{
			id: 1,
			title: "Yêu cầu",
			icon: "clipboard",
			color: "#667eea",
			value: "12",
			subtitle: "Đang xử lý",
		},
		{
			id: 2,
			title: "Đơn hàng",
			icon: "bag-check",
			color: "#f093fb",
			value: "8",
			subtitle: "Hoàn thành",
		},
		{
			id: 3,
			title: "Số dư ví",
			icon: "card",
			color: "#4facfe",
			value: "2.5M",
			subtitle: "VNĐ",
		},
	];

	// Quản lý tài khoản
	const accountManagement = [
		{
			id: 1,
			title: "Cài đặt tài khoản",
			subtitle: "Cập nhật thông tin cá nhân",
			icon: "settings-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => navigation.navigate("AccountSettingList"),
		},
		{
			id: 2,
			title: "Thay đổi mật khẩu",
			subtitle: "Bảo mật tài khoản",
			icon: "lock-closed-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => navigation.navigate("ChangePassword"),
		},
		{
			id: 3,
			title: "Ngôn ngữ / Language",
			subtitle: "Tiếng Việt",
			icon: "language-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => console.log("Navigate to language"),
		},
	];

	// Hỗ trợ & Thông tin
	const supportAndInfo = [
		{
			id: 1,
			title: "Câu hỏi thường gặp (FAQ)",
			subtitle: "Tìm câu trả lời nhanh chóng",
			icon: "help-circle-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => navigation.navigate("FAQScreen"),
		},
		{
			id: 2,
			title: "Gửi yêu cầu hỗ trợ",
			subtitle: "Liên hệ đội ngũ hỗ trợ",
			icon: "mail-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => console.log("Navigate to support request"),
		},
		{
			id: 3,
			title: "Điều khoản sử dụng",
			subtitle: "Quy định và điều khoản",
			icon: "document-text-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => navigation.navigate("TermsScreen"),
		},
		{
			id: 4,
			title: "Chính sách bảo mật",
			subtitle: "Quyền riêng tư của bạn",
			icon: "shield-checkmark-outline",
			gradientColors: ["#4FC3F7", "#29B6F6"],
			action: () => navigation.navigate("PolicyScreen"),
		},
	];

	const handleLogout = () => {
		showDialog({
			title: "Đăng xuất",
			message: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
			primaryButton: {
				text: "Đăng xuất",
				onPress: () => {
					// Clear user data from Redux
					dispatch(signout());
					// Navigate to login screen
					navigation.reset({
						index: 0,
						routes: [{ name: "Tabs" }],
					});
				},
				style: "danger",
			},
			secondaryButton: {
				text: "Hủy",
				onPress: () => {},
				style: "outline",
			},
			showCloseButton: false,
		});
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				userName={user.name}
				userEmail={user.email}
				avatar={user.avatar}
				isVerified={user.isVerified}
				notificationCount={3}
				chatCount={chatNotificationCount}
				onChatPress={handleChatPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Tổng quan nhanh */}
				<View style={styles.statsContainer}>
					<Text style={styles.sectionTitle}>Tổng quan</Text>
					<View style={styles.statsRow}>
						{userStats.map((stat) => (
							<TouchableOpacity
								key={stat.id}
								style={styles.statCard}
								activeOpacity={0.7}
								onPress={() =>
									console.log(
										`Navigate to ${stat.title} details`
									)
								}
							>
								<LinearGradient
									colors={[
										stat.color + "40",
										stat.color + "10",
									]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.statIcon}
								>
									<Ionicons
										name={stat.icon}
										size={26}
										color={stat.color}
									/>
								</LinearGradient>
								<Text style={styles.statValue}>
									{stat.value}
								</Text>
								<Text style={styles.statTitle}>
									{stat.title}
								</Text>
								<Text style={styles.statSubtitle}>
									{stat.subtitle}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Quản lý tài khoản */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Quản lý tài khoản</Text>
					<View style={styles.menuContainer}>
						{accountManagement.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.menuItem}
								onPress={item.action}
								activeOpacity={0.7}
							>
								<View style={styles.menuItemLeft}>
									<View style={styles.iconContainer}>
										<LinearGradient
											colors={item.gradientColors}
											style={styles.iconGradient}
										>
											<Ionicons
												name={item.icon}
												size={24}
												color="#FFFFFF"
											/>
										</LinearGradient>
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

				{/* Hỗ trợ & Thông tin */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Hỗ trợ</Text>
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
										<LinearGradient
											colors={item.gradientColors}
											style={styles.iconGradient}
										>
											<Ionicons
												name={item.icon}
												size={24}
												color="#FFFFFF"
											/>
										</LinearGradient>
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

				{/* Thông tin ứng dụng */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
					<View style={styles.appInfoCard}>
						<View style={styles.appInfoItem}>
							<Text style={styles.appInfoLabel}>
								Phiên bản ứng dụng
							</Text>
							<Text style={styles.appInfoValue}>1.0.0</Text>
						</View>
						<View style={styles.appInfoItem}>
							<Text style={styles.appInfoLabel}>
								Hotline hỗ trợ
							</Text>
							<Text style={styles.appInfoValue}>1900 1234</Text>
						</View>
						<View style={styles.appInfoItem}>
							<Text style={styles.appInfoLabel}>
								Email hỗ trợ
							</Text>
							<Text style={styles.appInfoValue}>
								sep490gshop@gmail.com
							</Text>
						</View>
					</View>
				</View>

				{/* Đăng xuất */}
				<TouchableOpacity
					style={styles.logoutButton}
					onPress={handleLogout}
				>
					<Ionicons
						name="log-out-outline"
						size={20}
						color="#dc3545"
					/>
					<Text className="text-red-600 font-medium ml-2">
						Đăng xuất
					</Text>
				</TouchableOpacity>
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
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#2c3e50",
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	statsContainer: {
		marginBottom: 28,
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	statCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 6,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.02)",
	},
	statIcon: {
		width: 52,
		height: 52,
		borderRadius: 26,
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
	statValue: {
		fontSize: 24,
		fontWeight: "800",
		color: "#2c3e50",
		marginBottom: 4,
	},
	statTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#34495e",
		marginBottom: 2,
		textAlign: "center",
	},
	statSubtitle: {
		fontSize: 12,
		color: "#7f8c8d",
		textAlign: "center",
	},
	sectionContainer: {
		marginBottom: 24,
	},
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
	iconGradient: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	menuIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f0f8ff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
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
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		paddingVertical: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#fee",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	appInfoContainer: {
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		marginBottom: 20,
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
