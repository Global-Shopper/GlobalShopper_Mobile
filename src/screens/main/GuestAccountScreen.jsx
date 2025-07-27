import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	Image,
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

	// Truy cập nhanh cho guest
	const quickAccess = [
		{
			id: 1,
			title: "Hỗ trợ",
			icon: "headset-outline",
			color: "#4CAF50",
			action: () => console.log("Navigate to support"),
		},
		{
			id: 2,
			title: "Hướng dẫn",
			icon: "book-outline",
			color: "#2196F3",
			action: () => navigation.navigate("FAQScreen"),
		},
		{
			id: 3,
			title: "Thông tin thuế",
			icon: "receipt-outline",
			color: "#FF9800",
			action: () => console.log("Navigate to tax info"),
		},
		{
			id: 4,
			title: "Tính phí",
			icon: "calculator-outline",
			color: "#9C27B0",
			action: () => console.log("Navigate to fee calculator"),
		},
	];

	// Dịch vụ nổi bật
	const featuredServices = [
		{
			id: 1,
			title: "Mua hàng Taobao",
			subtitle: "Hàng triệu sản phẩm",
			icon: "bag-outline",
			gradient: ["#FF6B6B", "#FF8E8E"],
		},
		{
			id: 2,
			title: "Vận chuyển nhanh",
			subtitle: "7-14 ngày",
			icon: "airplane-outline",
			gradient: ["#4ECDC4", "#6EE6DD"],
		},
		{
			id: 3,
			title: "Thanh toán an toàn",
			subtitle: "Bảo mật 100%",
			icon: "shield-checkmark-outline",
			gradient: ["#45B7D1", "#5DCCF2"],
		},
	];

	// Sàn thương mại
	const marketplaces = [
		{
			id: 1,
			name: "Taobao",
			image: require("../../assets/images/ecommerce/aliexpress-logo.png"),
		},
		{
			id: 2,
			name: "Tmall",
			image: require("../../assets/images/ecommerce/amazon-logo.png"),
		},
		{
			id: 3,
			name: "1688",
			image: require("../../assets/images/ecommerce/asos-logo.png"),
		},
		{
			id: 4,
			name: "AliExpress",
			image: require("../../assets/images/ecommerce/dhgate-logo.png"),
		},
		{
			id: 5,
			name: "DHgate",
			image: require("../../assets/images/ecommerce/ebay-logo.png"),
		},
		{
			id: 6,
			name: "Alibaba",
			image: require("../../assets/images/ecommerce/gmarket-logo.png"),
		},
		{
			id: 7,
			name: "PDD",
			image: require("../../assets/images/ecommerce/shein-logo.png"),
		},
	];

	// Quy trình mua hàng
	const purchaseSteps = [
		{
			id: 1,
			title: "Tạo yêu cầu",
			subtitle: 'Click "Tạo yêu cầu" để nhận được báo giá tốt nhất',
			type: "step",
		},
		{
			id: 2,
			title: "Chọn sàn",
			subtitle: "marketplaces",
			type: "marketplace",
		},
		{
			id: 3,
			title: "Hướng dẫn đơn giản",
			subtitle: "Hướng dẫn bạn tạo yêu cầu chỉ vài bước đơn giản",
			type: "guide",
		},
	];

	// Lý do chọn chúng tôi
	const whyChooseUs = [
		{
			id: 1,
			title: "Giá cả cạnh tranh",
			subtitle: "Tiết kiệm tới 30% so với mua trực tiếp",
			icon: "pricetag-outline",
			color: "#4CAF50",
		},
		{
			id: 2,
			title: "Vận chuyển an toàn",
			subtitle: "Bảo hiểm 100% hàng hóa",
			icon: "shield-outline",
			color: "#2196F3",
		},
		{
			id: 3,
			title: "Hỗ trợ 24/7",
			subtitle: "Tư vấn miễn phí mọi lúc",
			icon: "time-outline",
			color: "#FF9800",
		},
		{
			id: 4,
			title: "Quy trình minh bạch",
			subtitle: "Theo dõi đơn hàng realtime",
			icon: "eye-outline",
			color: "#9C27B0",
		},
	];

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
			title: "Chính sách & Điều khoản",
			subtitle: "Quy định sử dụng",
			icon: "document-text-outline",
			action: () => navigation.navigate("PolicyScreen"),
		},
		{
			id: 3,
			title: "Điều khoản dịch vụ",
			subtitle: "Terms of Service",
			icon: "reader-outline",
			action: () => navigation.navigate("TermsScreen"),
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

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Guest Profile Section */}
				<View style={styles.guestProfileSection}>
					<View style={styles.guestAvatar}>
						<Ionicons
							name="person-outline"
							size={32}
							color="#6c757d"
						/>
					</View>
					<Text style={styles.guestTitle}>Khách</Text>
					<Text style={styles.heroText}>
						Mua hàng quốc tế chưa bao giờ dễ hơn thế
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

				{/* Quick Access */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Truy cập nhanh</Text>
					<View style={styles.quickAccessGrid}>
						{quickAccess.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.quickAccessItem}
								onPress={item.action}
								activeOpacity={0.7}
							>
								<View
									style={[
										styles.quickAccessIcon,
										{ backgroundColor: `${item.color}20` },
									]}
								>
									<Ionicons
										name={item.icon}
										size={24}
										color={item.color}
									/>
								</View>
								<Text style={styles.quickAccessText}>
									{item.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Featured Services */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.featuredScrollContainer}
					>
						{featuredServices.map((service) => (
							<TouchableOpacity
								key={service.id}
								style={styles.featuredServiceCard}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={service.gradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.featuredServiceGradient}
								>
									<Ionicons
										name={service.icon}
										size={32}
										color="#fff"
									/>
									<Text style={styles.featuredServiceTitle}>
										{service.title}
									</Text>
									<Text
										style={styles.featuredServiceSubtitle}
									>
										{service.subtitle}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{/* How We Help You Buy */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Chúng tôi giúp bạn mua hàng
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.purchaseScrollContainer}
						pagingEnabled
					>
						{/* Step 1: Create Request */}
						<View style={styles.purchaseStep}>
							<View style={styles.stepCard}>
								<View style={styles.stepIcon}>
									<Ionicons
										name="add-circle-outline"
										size={48}
										color="#42A5F5"
									/>
								</View>
								<Text style={styles.stepTitle}>
									Tạo yêu cầu
								</Text>
								<Text style={styles.stepDescription}>
									Click &ldquo;Tạo yêu cầu&rdquo; để nhận được
									báo giá tốt nhất
								</Text>
								<TouchableOpacity style={styles.stepButton}>
									<Text style={styles.stepButtonText}>
										Tạo ngay
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Step 2: Marketplaces */}
						<View style={styles.purchaseStep}>
							<View style={styles.stepCard}>
								<Text style={styles.stepTitle}>
									Chọn sàn mua hàng
								</Text>
								<Text style={styles.stepDescription}>
									Hỗ trợ mua hàng từ các sàn lớn nhất Trung
									Quốc
								</Text>
								<View style={styles.marketplaceGrid}>
									{marketplaces
										.slice(0, 6)
										.map((marketplace) => (
											<View
												key={marketplace.id}
												style={styles.marketplaceItem}
											>
												<Image
													source={marketplace.image}
													style={
														styles.marketplaceImage
													}
													resizeMode="contain"
												/>
												<Text
													style={
														styles.marketplaceName
													}
												>
													{marketplace.name}
												</Text>
											</View>
										))}
								</View>
							</View>
						</View>

						{/* Step 3: Guide */}
						<View style={styles.purchaseStep}>
							<View style={styles.stepCard}>
								<View style={styles.stepIcon}>
									<Ionicons
										name="book-outline"
										size={48}
										color="#4CAF50"
									/>
								</View>
								<Text style={styles.stepTitle}>
									Hướng dẫn đơn giản
								</Text>
								<Text style={styles.stepDescription}>
									Hướng dẫn bạn tạo yêu cầu chỉ vài bước đơn
									giản
								</Text>
								<TouchableOpacity
									style={[
										styles.stepButton,
										{
											position: "absolute",
											bottom: 20,
											right: 20,
										},
									]}
								>
									<Text style={styles.stepButtonText}>
										Xem ngay!
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</View>

				{/* Why Choose Us */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Tại sao chọn chúng tôi
					</Text>
					<View style={styles.whyChooseGrid}>
						{whyChooseUs.map((reason) => (
							<View key={reason.id} style={styles.reasonCard}>
								<View
									style={[
										styles.reasonIcon,
										{
											backgroundColor: `${reason.color}20`,
										},
									]}
								>
									<Ionicons
										name={reason.icon}
										size={28}
										color={reason.color}
									/>
								</View>
								<Text style={styles.reasonTitle}>
									{reason.title}
								</Text>
								<Text style={styles.reasonSubtitle}>
									{reason.subtitle}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Settings */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Cài đặt</Text>
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
	heroText: {
		fontSize: 18,
		color: "#42A5F5",
		textAlign: "center",
		marginBottom: 24,
		lineHeight: 24,
		fontWeight: "600",
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

	// Quick Access Styles
	quickAccessGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
	},
	quickAccessItem: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		width: "48%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	quickAccessIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	quickAccessText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#1a1a1a",
		textAlign: "center",
	},

	// Featured Services Styles
	featuredScrollContainer: {
		paddingRight: 20,
	},
	featuredServiceCard: {
		width: 160,
		marginRight: 16,
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	featuredServiceGradient: {
		padding: 20,
		alignItems: "center",
		minHeight: 140,
		justifyContent: "center",
	},
	featuredServiceTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
		textAlign: "center",
		marginTop: 12,
		marginBottom: 4,
	},
	featuredServiceSubtitle: {
		fontSize: 12,
		color: "rgba(255,255,255,0.8)",
		textAlign: "center",
	},

	// Purchase Steps Styles
	purchaseScrollContainer: {
		paddingRight: 20,
	},
	purchaseStep: {
		width: 280,
		marginRight: 16,
	},
	stepCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		minHeight: 320,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		position: "relative",
	},
	stepIcon: {
		alignItems: "center",
		marginBottom: 16,
	},
	stepTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 12,
		textAlign: "center",
	},
	stepDescription: {
		fontSize: 14,
		color: "#6c757d",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 20,
	},
	stepButton: {
		backgroundColor: "#42A5F5",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignSelf: "center",
	},
	stepButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
	marketplaceGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
		marginTop: 16,
	},
	marketplaceItem: {
		width: "30%",
		alignItems: "center",
		marginBottom: 12,
	},
	marketplaceImage: {
		width: 40,
		height: 40,
		marginBottom: 8,
		borderRadius: 8,
	},
	marketplaceName: {
		fontSize: 12,
		color: "#6c757d",
		textAlign: "center",
	},

	// Why Choose Us Styles
	whyChooseGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
	},
	reasonCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		width: "48%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	reasonIcon: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	reasonTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 8,
	},
	reasonSubtitle: {
		fontSize: 12,
		color: "#6c757d",
		lineHeight: 16,
	},

	// Features List Styles
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
