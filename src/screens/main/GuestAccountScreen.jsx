import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "../../components/ui/text";

export default function GuestAccountScreen({ navigation }) {
	const handleLoginPress = () => {
		navigation.navigate("Login");
	};

	const handleRegisterPress = () => {
		navigation.navigate("Signup");
	};

	// Thông tin cơ bản cho guest
	const guestFeatures = [
		{
			id: 1,
			title: "Ngôn ngữ / Language",
			subtitle: "Tiếng Việt",
			icon: "language-outline",
			action: () => console.log("Navigate to language"),
		},
		{
			id: 2,
			title: "Hỗ trợ khách hàng",
			subtitle: "Liên hệ với chúng tôi",
			icon: "headset-outline",
			action: () => console.log("Navigate to support"),
		},
		{
			id: 3,
			title: "Câu hỏi thường gặp",
			subtitle: "FAQ & Hướng dẫn",
			icon: "help-circle-outline",
			action: () => navigation.navigate("FAQScreen"),
		},
		{
			id: 4,
			title: "Chính sách & Điều khoản",
			subtitle: "Quy định sử dụng",
			icon: "document-text-outline",
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
			value: "support@globalshopper.vn",
		},
	];

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
						<Text style={styles.headerTitle}>Tài khoản</Text>
						<TouchableOpacity
							style={styles.notificationButton}
							onPress={() => console.log("Notification pressed")}
						>
							<Ionicons name="notifications-outline" size={24} color="#fff" />
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Guest Profile Section */}
				<View style={styles.guestProfileSection}>
					<View style={styles.guestAvatar}>
						<Ionicons name="person-outline" size={32} color="#6c757d" />
					</View>
					<Text style={styles.guestTitle}>Khách</Text>
					<Text style={styles.guestSubtitle}>
						Đăng nhập để trải nghiệm đầy đủ tính năng
					</Text>
					
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
								<Text style={styles.loginButtonText}>Đăng nhập</Text>
							</LinearGradient>
						</TouchableOpacity>
						
						<TouchableOpacity
							style={styles.registerButton}
							onPress={handleRegisterPress}
						>
							<Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Tính năng dành cho Guest */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Cài đặt chung</Text>
					<View style={styles.featuresList}>
						{guestFeatures.map((feature) => (
							<TouchableOpacity
								key={feature.id}
								style={styles.featureItem}
								onPress={feature.action}
								activeOpacity={0.7}
							>
								<View style={styles.featureLeft}>
									<View style={styles.featureIconContainer}>
										<Ionicons
											name={feature.icon}
											size={24}
											color="#42A5F5"
										/>
									</View>
									<View style={styles.featureInfo}>
										<Text style={styles.featureTitle}>
											{feature.title}
										</Text>
										<Text style={styles.featureSubtitle}>
											{feature.subtitle}
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

				{/* Lợi ích khi đăng nhập */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Lợi ích khi đăng nhập</Text>
					<View style={styles.benefitsCard}>
						<View style={styles.benefitItem}>
							<Ionicons name="wallet-outline" size={24} color="#4CAF50" />
							<Text style={styles.benefitText}>Quản lý ví tiền điện tử</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="receipt-outline" size={24} color="#FF9800" />
							<Text style={styles.benefitText}>Theo dõi lịch sử đơn hàng</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="clipboard-outline" size={24} color="#2196F3" />
							<Text style={styles.benefitText}>Tạo yêu cầu mua hàng</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="star-outline" size={24} color="#9C27B0" />
							<Text style={styles.benefitText}>Tích điểm thành viên</Text>
						</View>
					</View>
				</View>

				{/* Thông tin ứng dụng */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
					<View style={styles.appInfoCard}>
						{appInfo.map((info, index) => (
							<View key={index} style={styles.appInfoItem}>
								<Text style={styles.appInfoLabel}>{info.label}</Text>
								<Text style={styles.appInfoValue}>{info.value}</Text>
							</View>
						))}
					</View>
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
	notificationButton: {
		padding: 8,
	},
	content: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	guestProfileSection: {
		backgroundColor: "#fff",
		margin: 20,
		padding: 32,
		borderRadius: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	guestAvatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#f8f9fa",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		borderWidth: 2,
		borderColor: "#e9ecef",
	},
	guestTitle: {
		fontSize: 24,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 8,
	},
	guestSubtitle: {
		fontSize: 14,
		color: "#6c757d",
		textAlign: "center",
		marginBottom: 24,
		lineHeight: 20,
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
	featuresList: {
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f8f9fa",
	},
	featureLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	featureIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#E3F2FD",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	featureInfo: {
		flex: 1,
	},
	featureTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: "#1a1a1a",
		marginBottom: 2,
	},
	featureSubtitle: {
		fontSize: 14,
		color: "#6c757d",
	},
	benefitsCard: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	benefitItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	benefitText: {
		fontSize: 16,
		color: "#1a1a1a",
		marginLeft: 12,
		fontWeight: "500",
	},
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
