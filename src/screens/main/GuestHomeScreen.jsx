import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function GuestHomeScreen({ navigation }) {
	const handleLoginPress = () => {
		navigation.navigate("Login");
	};

	const handleRegisterPress = () => {
		navigation.navigate("Signup");
	};

	const featuredServices = [
		{
			id: 1,
			title: "Mua hàng từ link",
			description: "Dán link sản phẩm, chúng tôi mua hộ",
			icon: "link-outline",
			color: "#42A5F5",
		},
		{
			id: 2,
			title: "Tìm kiếm sản phẩm",
			description: "Hỗ trợ tìm kiếm sản phẩm theo yêu cầu",
			icon: "search-outline",
			color: "#FF9800",
		},
		{
			id: 3,
			title: "Vận chuyển nhanh",
			description: "Giao hàng tận nơi, an toàn",
			icon: "rocket-outline",
			color: "#4CAF50",
		},
	];

	const popularStores = [
		{
			id: 1,
			name: "Taobao",
			logo: "🛒",
			description: "Mua sắm từ Taobao với giá tốt nhất",
		},
		{
			id: 2,
			name: "Tmall",
			logo: "🏪",
			description: "Thương hiệu chính hãng từ Tmall",
		},
		{
			id: 3,
			name: "1688",
			logo: "🏭",
			description: "Nguồn hàng sỉ trực tiếp từ nhà máy",
		},
	];

	return (
		<View style={styles.container}>
			{/* Header for Guest */}
			<View style={styles.guestHeader}>
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.headerGradient}
				>
					<View style={styles.headerContent}>
						<View style={styles.headerLeft}>
							<Text style={styles.welcomeText}>Chào mừng đến với</Text>
							<Text style={styles.appName}>Global Shopper</Text>
							<Text style={styles.subtitle}>
								Dịch vụ mua hàng Trung Quốc uy tín
							</Text>
						</View>
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
				{/* Login/Register Actions */}
				<View style={styles.authSection}>
					<Text style={styles.authTitle}>
						Đăng nhập để trải nghiệm đầy đủ
					</Text>
					<Text style={styles.authSubtitle}>
						Quản lý đơn hàng, theo dõi vận chuyển và nhiều tính năng khác
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
							<Text style={styles.registerButtonText}>Đăng ký ngay</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Featured Services */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
					<View style={styles.servicesGrid}>
						{featuredServices.map((service) => (
							<View key={service.id} style={styles.serviceCard}>
								<View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
									<Ionicons
										name={service.icon}
										size={32}
										color={service.color}
									/>
								</View>
								<Text style={styles.serviceTitle}>{service.title}</Text>
								<Text style={styles.serviceDescription}>
									{service.description}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Popular Stores */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Kênh mua hàng phổ biến</Text>
					{popularStores.map((store) => (
						<View key={store.id} style={styles.storeCard}>
							<View style={styles.storeInfo}>
								<Text style={styles.storeLogo}>{store.logo}</Text>
								<View style={styles.storeDetails}>
									<Text style={styles.storeName}>{store.name}</Text>
									<Text style={styles.storeDescription}>
										{store.description}
									</Text>
								</View>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#ccc" />
						</View>
					))}
				</View>

				{/* Benefits */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tại sao chọn chúng tôi?</Text>
					<View style={styles.benefitsContainer}>
						<View style={styles.benefitItem}>
							<Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
							<Text style={styles.benefitText}>Uy tín, đảm bảo chất lượng</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="flash" size={24} color="#FF9800" />
							<Text style={styles.benefitText}>Giao hàng nhanh chóng</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="card" size={24} color="#42A5F5" />
							<Text style={styles.benefitText}>Thanh toán an toàn</Text>
						</View>
						<View style={styles.benefitItem}>
							<Ionicons name="headset" size={24} color="#9C27B0" />
							<Text style={styles.benefitText}>Hỗ trợ 24/7</Text>
						</View>
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
	guestHeader: {
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
	headerLeft: {
		flex: 1,
	},
	welcomeText: {
		fontSize: 14,
		color: "#E3F2FD",
		marginBottom: 4,
	},
	appName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: "#E3F2FD",
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
	authSection: {
		backgroundColor: "#fff",
		margin: 20,
		padding: 24,
		borderRadius: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	authTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1a1a1a",
		textAlign: "center",
		marginBottom: 8,
	},
	authSubtitle: {
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
	servicesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	serviceCard: {
		flex: 1,
		minWidth: "30%",
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	serviceIcon: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	serviceTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1a1a1a",
		textAlign: "center",
		marginBottom: 4,
	},
	serviceDescription: {
		fontSize: 12,
		color: "#6c757d",
		textAlign: "center",
		lineHeight: 16,
	},
	storeCard: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	storeInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	storeLogo: {
		fontSize: 32,
		marginRight: 16,
	},
	storeDetails: {
		flex: 1,
	},
	storeName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 4,
	},
	storeDescription: {
		fontSize: 14,
		color: "#6c757d",
	},
	benefitsContainer: {
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
});
