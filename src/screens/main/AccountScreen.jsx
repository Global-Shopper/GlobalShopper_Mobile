import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "../../components/ui/text";

export default function AccountScreen({ navigation }) {
	const [user] = useState({
		name: "Hoài Phương",
		email: "hoaiphuong1328@gmail.com",
		phone: "+84 123 456 789",
		avatar: "https://github.com/shadcn.png",
		memberSince: "2023",
		isVerified: true,
	});

	const [chatNotificationCount] = useState(3); // Số tin nhắn chưa đọc

	// Stats để hiển thị tổng quan nhanh
	const userStats = [
		{
			id: 1,
			title: "Yêu cầu",
			icon: "document-text-outline",
			color: "#007bff",
			value: "12",
			subtitle: "Đang xử lý",
		},
		{
			id: 2,
			title: "Đơn hàng",
			icon: "bag-outline",
			color: "#28a745",
			value: "8",
			subtitle: "Hoàn thành",
		},
		{
			id: 3,
			title: "Số dư ví",
			icon: "wallet-outline",
			color: "#ffc107",
			value: "2.5M",
			subtitle: "₫",
		},
	];

	// Quản lý tài khoản
	const accountManagement = [
		{
			id: 1,
			title: "Cài đặt tài khoản",
			subtitle: "Cập nhật thông tin cá nhân",
			icon: "settings-outline",
			action: () => console.log("Navigate to account settings"),
		},
		{
			id: 2,
			title: "Thay đổi mật khẩu",
			subtitle: "Bảo mật tài khoản",
			icon: "lock-closed-outline",
			action: () => console.log("Navigate to change password"),
		},
		{
			id: 3,
			title: "Ngôn ngữ / Language",
			subtitle: "Tiếng Việt",
			icon: "language-outline",
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
			action: () => console.log("Navigate to FAQ"),
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
			action: () => console.log("Navigate to terms"),
		},
		{
			id: 4,
			title: "Chính sách bảo mật",
			subtitle: "Quyền riêng tư của bạn",
			icon: "shield-checkmark-outline",
			action: () => console.log("Navigate to privacy policy"),
		},
	];

	const handleAvatarPress = () => {
		Alert.alert("Đổi ảnh đại diện", "Chọn nguồn ảnh", [
			{
				text: "Hủy",
				style: "cancel",
			},
			{
				text: "Thư viện ảnh",
				onPress: () => console.log("Open photo library"),
			},
			{
				text: "Chụp ảnh",
				onPress: () => console.log("Open camera"),
			},
		]);
	};

	const handleLogout = () => {
		Alert.alert(
			"Đăng xuất",
			"Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Đăng xuất",
					style: "destructive",
					onPress: () => {
						// Clear user data and navigate to login
						navigation.reset({
							index: 0,
							routes: [{ name: "Login" }],
						});
					},
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			{/* Header với thông tin người dùng */}
			<LinearGradient
				colors={["#4a90e2", "#357abd", "#2c6aa0"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.header}
			>
				{/* Profile Info trong header */}
				<View style={styles.headerProfileSection}>
					<View style={styles.avatarWrapper}>
						<TouchableOpacity
							onPress={handleAvatarPress}
							style={styles.avatarContainer}
						>
							<Image
								source={{ uri: user.avatar }}
								style={styles.avatarImage}
								defaultSource={require("../../assets/images/icon.png")}
							/>
						</TouchableOpacity>

						{/* Verified status ở góc avatar */}
						<View style={styles.verifiedBadge}>
							{user.isVerified ? (
								<Ionicons
									name="checkmark-circle"
									size={20}
									color="#28a745"
								/>
							) : (
								<Ionicons
									name="close-circle"
									size={20}
									color="#dc3545"
								/>
							)}
						</View>
					</View>

					<View style={styles.headerProfileInfo}>
						<View style={styles.nameContainer}>
							<Text style={styles.userName}>{user.name}</Text>
						</View>
						<Text style={styles.userEmail}>{user.email}</Text>
					</View>
				</View>

				<TouchableOpacity style={styles.chatButton}>
					<Ionicons
						name="chatbubble-outline"
						size={28}
						color="#ffffff"
					/>
					{/* Notification badge cho chat */}
					{chatNotificationCount > 0 && (
						<View style={styles.chatNotificationBadge}>
							<Text style={styles.chatNotificationText}>
								{chatNotificationCount > 9
									? "9+"
									: chatNotificationCount}
							</Text>
						</View>
					)}
				</TouchableOpacity>
			</LinearGradient>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Tổng quan nhanh */}
				<View style={styles.statsContainer}>
					<Text className="text-lg font-semibold mb-4">
						Tổng quan
					</Text>
					<View style={styles.statsRow}>
						{userStats.map((stat) => (
							<View key={stat.id} style={styles.statCard}>
								<View
									style={[
										styles.statIcon,
										{ backgroundColor: stat.color + "20" },
									]}
								>
									<Ionicons
										name={stat.icon}
										size={20}
										color={stat.color}
									/>
								</View>
								<Text className="text-xl font-bold">
									{stat.value}
								</Text>
								<Text className="text-sm text-muted-foreground">
									{stat.title}
								</Text>
								<Text className="text-xs text-muted-foreground">
									{stat.subtitle}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Quản lý tài khoản */}
				<View style={styles.sectionContainer}>
					<Text className="text-lg font-semibold mb-3">
						Quản lý tài khoản
					</Text>
					<View style={styles.menuContainer}>
						{accountManagement.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.menuItem}
								onPress={item.action}
							>
								<View style={styles.menuItemLeft}>
									<View style={styles.menuIconContainer}>
										<Ionicons
											name={item.icon}
											size={22}
											color="#007bff"
										/>
									</View>
									<View style={styles.menuItemContent}>
										<Text className="font-medium">
											{item.title}
										</Text>
										<Text className="text-sm text-muted-foreground">
											{item.subtitle}
										</Text>
									</View>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color="#ccc"
								/>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Hỗ trợ & Thông tin */}
				<View style={styles.sectionContainer}>
					<Text className="text-lg font-semibold mb-3">
						Hỗ trợ & Thông tin
					</Text>
					<View style={styles.menuContainer}>
						{supportAndInfo.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.menuItem}
								onPress={item.action}
							>
								<View style={styles.menuItemLeft}>
									<View style={styles.menuIconContainer}>
										<Ionicons
											name={item.icon}
											size={22}
											color="#007bff"
										/>
									</View>
									<View style={styles.menuItemContent}>
										<Text className="font-medium">
											{item.title}
										</Text>
										<Text className="text-sm text-muted-foreground">
											{item.subtitle}
										</Text>
									</View>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color="#ccc"
								/>
							</TouchableOpacity>
						))}
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

				{/* Phiên bản & Branding */}
				<View style={styles.appInfoContainer}>
					<Text className="text-center text-sm text-muted-foreground">
						GlobalShopper Mobile v1.0.0
					</Text>
					<Text className="text-center text-xs text-muted-foreground mt-1">
						© 2024 GlobalShopper. All rights reserved.
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 20,
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	chatButton: {
		padding: 8,
		marginTop: 8,
		position: "relative",
	},
	chatNotificationBadge: {
		position: "absolute",
		top: 4,
		right: 4,
		backgroundColor: "#dc3545",
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#4a90e2",
	},
	chatNotificationText: {
		color: "#ffffff",
		fontSize: 12,
		fontWeight: "bold",
		paddingHorizontal: 4,
	},
	headerProfileSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		paddingRight: 16,
	},
	avatarWrapper: {
		position: "relative",
		width: 64,
		height: 64,
	},
	avatarContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	avatarImage: {
		width: 64,
		height: 64,
		borderRadius: 32,
	},
	verifiedBadge: {
		position: "absolute",
		bottom: -2,
		right: -2,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		width: 24,
		height: 24,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 3,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.05)",
	},
	headerProfileInfo: {
		flex: 1,
		marginLeft: 16,
		justifyContent: "center",
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	userName: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#ffffff",
	},
	userEmail: {
		fontSize: 15,
		color: "rgba(255, 255, 255, 0.85)",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	statsContainer: {
		marginBottom: 24,
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginHorizontal: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	statIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	sectionContainer: {
		marginBottom: 20,
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
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
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
});
