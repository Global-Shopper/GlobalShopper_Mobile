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

export default function GuestHomeScreen({ navigation }) {
	// Truy cập nhanh cho guest
	const quickAccess = [
		{
			id: 1,
			title: "Hỗ trợ",
			icon: "headset-outline",
			color: "#42A5F5",
			action: () => console.log("Navigate to support"),
		},
		{
			id: 2,
			title: "Hướng dẫn",
			icon: "book-outline",
			color: "#42A5F5",
			action: () => navigation.navigate("FAQScreen"),
		},
		{
			id: 3,
			title: "Thông tin thuế",
			icon: "receipt-outline",
			color: "#42A5F5",
			action: () => console.log("Navigate to tax info"),
		},
		{
			id: 4,
			title: "Tính phí",
			icon: "calculator-outline",
			color: "#42A5F5",
			action: () => console.log("Navigate to fee calculator"),
		},
	];

	// Dịch vụ nổi bật
	const featuredServices = [
		{
			id: 1,
			title: "Mua hộ hàng từ mọi sàn thương mại điện tử",
			subtitle: "",
			icon: "bag-outline",
			color: "#42A5F5",
		},
		{
			id: 2,
			title: "Nhận order từ nước ngoài về Việt Nam nhanh chóng",
			subtitle: "",
			icon: "airplane-outline",
			color: "#42A5F5",
		},
		{
			id: 3,
			title: "Báo giá minh bạch, không phí ẩn",
			subtitle: "",
			icon: "receipt-outline",
			color: "#42A5F5",
		},
		{
			id: 4,
			title: "Theo dõi đơn hàng dễ dàng, giao tận nơi",
			subtitle: "",
			icon: "location-outline",
			color: "#42A5F5",
		},
	];

	// Sàn thương mại
	const marketplaces = [
		{
			id: 1,
			name: "Ali Express",
			image: require("../../assets/images/ecommerce/aliexpress-logo.png"),
		},
		{
			id: 2,
			name: "Amazon",
			image: require("../../assets/images/ecommerce/amazon-logo.png"),
		},
		{
			id: 3,
			name: "ASOS",
			image: require("../../assets/images/ecommerce/asos-logo.png"),
		},
		{
			id: 4,
			name: "DH Gate",
			image: require("../../assets/images/ecommerce/dhgate-logo.png"),
		},
		{
			id: 5,
			name: "Ebay",
			image: require("../../assets/images/ecommerce/ebay-logo.png"),
		},
		{
			id: 6,
			name: "Gmarket",
			image: require("../../assets/images/ecommerce/gmarket-logo.png"),
		},
		{
			id: 7,
			name: "Shein",
			image: require("../../assets/images/ecommerce/shein-logo.png"),
		},
	];

	// Lý do chọn chúng tôi
	const whyChooseUs = [
		{
			id: 1,
			title: "Giá cả cạnh tranh",
			subtitle: "Tiết kiệm tới 30% so với mua trực tiếp",
			icon: "pricetag-outline",
			color: "#42A5F5",
		},
		{
			id: 2,
			title: "Vận chuyển an toàn",
			subtitle: "Bảo hiểm 100% hàng hóa",
			icon: "shield-outline",
			color: "#42A5F5",
		},
		{
			id: 3,
			title: "Hỗ trợ 24/7",
			subtitle: "Tư vấn miễn phí mọi lúc",
			icon: "time-outline",
			color: "#42A5F5",
		},
		{
			id: 4,
			title: "Quy trình minh bạch",
			subtitle: "Theo dõi đơn hàng realtime",
			icon: "eye-outline",
			color: "#42A5F5",
		},
	];

	// Các bước sử dụng dịch vụ
	const serviceSteps = [
		{
			id: 1,
			title: "Gửi link sản phẩm",
			description: "Copy link sản phẩm từ bất kỳ sàn nào",
			icon: "link-outline",
			color: "#42A5F5",
		},
		{
			id: 2,
			title: "Nhận báo giá",
			description: "Nhận báo giá chi tiết và minh bạch",
			icon: "document-text-outline",
			color: "#BBDEFB",
		},
		{
			id: 3,
			title: "Xác nhận đơn hàng",
			description: "Thanh toán và xác nhận mua hàng",
			icon: "checkmark-circle-outline",
			color: "#90CAF9",
		},
		{
			id: 4,
			title: "Giao hàng về tay bạn",
			description: "Nhận hàng tại nhà một cách an toàn",
			icon: "home-outline",
			color: "#42A5F5",
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
							<Text style={styles.welcomeText}>
								Chào mừng đến với
							</Text>
							<Text style={styles.appName}>Global Shopper</Text>
							<Text style={styles.subtitle}>
								Mua hàng quốc tế chưa bao giờ dễ hơn đến thế
							</Text>
						</View>
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
				{/* Quick Access */}
				<View style={styles.quickAccessSection}>
					<View style={styles.quickAccessContainer}>
						<Text style={styles.sectionTitle}>Truy cập nhanh</Text>
						<View style={styles.quickAccessRow}>
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
											{
												backgroundColor: `${item.color}20`,
											},
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
				</View>

				{/* Featured Services */}
				<View style={styles.section}>
					<View style={styles.featuredServicesContainer}>
						<Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
						<View style={styles.featuredServicesGrid}>
							{featuredServices.map((service) => (
								<TouchableOpacity
									key={service.id}
									style={styles.featuredServiceCard}
									activeOpacity={0.8}
								>
									<View style={styles.featuredServiceContent}>
										<View
											style={[
												styles.featuredServiceIcon,
												{
													backgroundColor: `${service.color}15`,
												},
											]}
										>
											<Ionicons
												name={service.icon}
												size={24}
												color={service.color}
											/>
										</View>
										<View
											style={styles.featuredServiceText}
										>
											<Text
												style={
													styles.featuredServiceTitle
												}
											>
												{service.title}
											</Text>
											<Text
												style={
													styles.featuredServiceSubtitle
												}
											>
												{service.subtitle}
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>

				{/* Service Steps */}
				<View style={styles.section}>
					<View style={styles.stepsContainer}>
						<Text style={styles.sectionTitle}>
							Các bước sử dụng dịch vụ
						</Text>
						{serviceSteps.map((step, index) => (
							<View key={step.id} style={styles.stepItem}>
								<View style={styles.stepContent}>
									<View
										style={[
											styles.stepIconContainer,
											{
												backgroundColor: `${step.color}20`,
											},
										]}
									>
										<Text style={styles.stepNumber}>
											{step.id}
										</Text>
									</View>
									<View style={styles.stepInfo}>
										<Text style={styles.stepTitle}>
											{step.title}
										</Text>
										<Text style={styles.stepDescription}>
											{step.description}
										</Text>
									</View>
								</View>
								{index < serviceSteps.length - 1 && (
									<View style={styles.stepConnector}>
										<View style={styles.stepLine} />
									</View>
								)}
							</View>
						))}
					</View>
				</View>

				{/* CTA Login */}
				<View style={styles.ctaSection}>
					<View style={styles.ctaContainer}>
						<View style={styles.ctaContent}>
							<View style={styles.ctaTextContainer}>
								<Text style={styles.ctaTitle}>
									Bắt đầu trải nghiệm mua hàng dễ dàng
								</Text>
								<Text style={styles.ctaSubtitle}>
									Đăng nhập để theo dõi đơn hàng và nhận hỗ
									trợ nhanh chóng
								</Text>
							</View>
							<TouchableOpacity
								style={styles.ctaLoginButton}
								onPress={() => navigation.navigate("Login")}
							>
								<Text style={styles.ctaLoginText}>
									Đăng nhập
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* How We Help You Buy */}
				<View style={styles.section}>
					<View style={styles.helpBuyContainer}>
						<Text style={styles.sectionTitle}>
							Chúng tôi giúp bạn mua hàng
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={
								styles.purchaseScrollContainer
							}
							snapToInterval={300}
							snapToAlignment="start"
							decelerationRate="fast"
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
									<Text style={styles.purchaseStepTitle}>
										Tạo yêu cầu
									</Text>
									<Text
										style={styles.purchaseStepDescription}
									>
										Click &ldquo;Tạo yêu cầu&rdquo; để nhận
										được báo giá tốt nhất
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
									<Text style={styles.purchaseStepTitle}>
										Các sàn thương mại
									</Text>
									<Text
										style={styles.purchaseStepDescription}
									>
										Chúng tôi giúp bạn mua hàng tại các sàn
										thương mại điện tử nổi tiếng
									</Text>
									<View style={styles.marketplaceContainer}>
										{marketplaces
											.slice(0, 6)
											.map((marketplace, index) => (
												<View
													key={marketplace.id}
													style={
														styles.marketplaceItem
													}
												>
													<Image
														source={
															marketplace.image
														}
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
									<Text style={styles.purchaseStepTitle}>
										Hướng dẫn đơn giản
									</Text>
									<Text
										style={styles.purchaseStepDescription}
									>
										Hướng dẫn bạn tạo yêu cầu chỉ vài bước
										đơn giản
									</Text>
									<TouchableOpacity style={styles.stepButton}>
										<Text style={styles.stepButtonText}>
											Xem ngay!
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</View>
				</View>

				{/* Why Choose Us */}
				<View style={styles.section}>
					<View style={styles.whyChooseContainer}>
						<Text style={styles.sectionTitle}>
							Tại sao chọn chúng tôi
						</Text>
						<View style={styles.whyChooseGrid}>
							{whyChooseUs.map((reason) => (
								<View key={reason.id} style={styles.reasonCard}>
									<View style={styles.reasonIcon}>
										<Ionicons
											name={reason.icon}
											size={24}
											color="#42A5F5"
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
				</View>

				{/* Security Banner */}
				<View style={styles.section}>
					<View style={styles.securityBanner}>
						<View style={styles.securityContent}>
							<View style={styles.securityIconContainer}>
								<Ionicons
									name="shield-checkmark"
									size={32}
									color="#4CAF50"
								/>
							</View>
							<View style={styles.securityTextContainer}>
								<Text style={styles.securityTitle}>
									Bảo đảm an toàn thông tin
								</Text>
								<Text style={styles.securityDescription}>
									Thông tin khách hàng được mã hóa và bảo mật
									100%. Chúng tôi cam kết không chia sẻ dữ
									liệu cá nhân của bạn với bên thứ ba.
								</Text>
							</View>
						</View>
						<View style={styles.securityFeatures}>
							<View style={styles.securityFeature}>
								<Ionicons
									name="eye-off"
									size={16}
									color="#4CAF50"
								/>
								<Text style={styles.securityFeatureText}>
									Không chia sẻ dữ liệu
								</Text>
							</View>
							<View style={styles.securityFeature}>
								<Ionicons
									name="checkmark-circle"
									size={16}
									color="#4CAF50"
								/>
								<Text style={styles.securityFeatureText}>
									Tuân thủ quy định
								</Text>
							</View>
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
		backgroundColor: "#f8fafc",
	},
	guestHeader: {
		paddingTop: 50,
	},
	headerGradient: {
		paddingHorizontal: 24,
		paddingVertical: 24,
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
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
		color: "rgba(255, 255, 255, 0.8)",
		marginBottom: 4,
		fontWeight: "500",
	},
	appName: {
		fontSize: 28,
		fontWeight: "700",
		color: "#fff",
		marginBottom: 6,
		letterSpacing: 0.5,
	},
	subtitle: {
		fontSize: 15,
		color: "rgba(255, 255, 255, 0.85)",
		lineHeight: 20,
	},
	headerIcons: {
		flexDirection: "row",
		gap: 16,
	},
	iconButton: {
		padding: 10,
		borderRadius: 12,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
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
		marginHorizontal: 16,
		marginBottom: 12,
	},
	quickAccessSection: {
		marginHorizontal: 16,
		marginBottom: 12,
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 12,
		textAlign: "left",
		letterSpacing: 0.2,
	},

	// Quick Access Styles
	quickAccessContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	quickAccessRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 6,
	},
	quickAccessItem: {
		backgroundColor: "transparent",
		borderRadius: 12,
		padding: 12,
		alignItems: "center",
		flex: 1,
	},
	quickAccessIcon: {
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	quickAccessText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#334155",
		textAlign: "center",
		lineHeight: 14,
	},

	// Featured Services Styles
	featuredServicesContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 2,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	featuredServicesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	featuredServiceCard: {
		width: "48%",
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	featuredServiceContent: {
		padding: 14,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	featuredServiceIcon: {
		width: 36,
		height: 36,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
		marginTop: 2,
	},
	featuredServiceText: {
		flex: 1,
	},
	featuredServiceTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 4,
		lineHeight: 16,
	},
	featuredServiceSubtitle: {
		fontSize: 11,
		color: "#64748b",
		lineHeight: 14,
		fontWeight: "500",
	},

	// Service Steps Styles
	stepsContainer: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 24,
		marginHorizontal: 4,
		marginVertical: 4,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 16,
		elevation: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	stepItem: {
		position: "relative",
	},
	stepContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 4,
	},
	stepIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	stepNumber: {
		fontSize: 20,
		fontWeight: "800",
		color: "#42A5F5",
	},
	stepInfo: {
		flex: 1,
	},
	stepTitle: {
		fontSize: 17,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 6,
		textAlign: "left",
		letterSpacing: 0.2,
	},
	stepDescription: {
		fontSize: 14,
		color: "#64748b",
		lineHeight: 20,
		textAlign: "left",
		fontWeight: "500",
	},
	stepConnector: {
		position: "absolute",
		left: 28,
		top: 70,
		bottom: -20,
		width: 3,
		justifyContent: "center",
		alignItems: "center",
	},
	stepLine: {
		width: 3,
		height: "100%",
		backgroundColor: "#cbd5e1",
		borderRadius: 2,
	},

	// Purchase Steps Styles
	helpBuyContainer: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 24,
		marginHorizontal: 4,
		marginVertical: 4,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 16,
		elevation: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	purchaseScrollContainer: {
		paddingHorizontal: 6,
	},
	purchaseStep: {
		width: 290,
		marginHorizontal: 1,
	},
	stepCard: {
		backgroundColor: "#f8fafc",
		borderRadius: 20,
		padding: 20,
		height: 280,
		position: "relative",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
	},
	stepIcon: {
		alignItems: "center",
		marginBottom: 12,
		paddingVertical: 4,
	},
	stepButton: {
		backgroundColor: "#42A5F5",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 16,
		alignSelf: "stretch",
		position: "absolute",
		bottom: 20,
		left: 20,
		right: 20,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	stepButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	purchaseStepTitle: {
		fontSize: 19,
		fontWeight: "800",
		color: "#1e293b",
		textAlign: "center",
		lineHeight: 24,
		letterSpacing: 0.2,
	},
	purchaseStepDescription: {
		fontSize: 13,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 18,
		flex: 1,
		fontWeight: "400",
	},
	marketplaceContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: -8,
		flex: 1,
	},
	marketplaceItem: {
		width: "30%",
		alignItems: "center",
		marginBottom: 4,
		paddingVertical: 4,
		paddingHorizontal: 4,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
	},
	marketplaceImage: {
		width: 32,
		height: 32,
		marginBottom: 3,
		borderRadius: 8,
	},
	marketplaceName: {
		fontSize: 11,
		color: "#334155",
		textAlign: "center",
		fontWeight: "600",
		lineHeight: 13,
	},

	// Why Choose Us Styles
	whyChooseContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	whyChooseGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 10,
	},
	reasonCard: {
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		padding: 14,
		width: "48%",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	reasonIcon: {
		width: 44,
		height: 44,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
		backgroundColor: "#42A5F520",
	},
	reasonTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 6,
		letterSpacing: 0.1,
	},
	reasonSubtitle: {
		fontSize: 11,
		color: "#64748b",
		lineHeight: 14,
		fontWeight: "500",
	},

	// CTA Styles
	ctaSection: {
		marginHorizontal: 16,
		marginBottom: 12,
	},
	ctaContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
	},
	ctaContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	ctaTextContainer: {
		flex: 1,
		marginRight: 16,
	},
	ctaTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 6,
		letterSpacing: 0.1,
	},
	ctaSubtitle: {
		fontSize: 13,
		color: "#64748b",
		lineHeight: 18,
		fontWeight: "500",
	},
	ctaLoginButton: {
		backgroundColor: "#42A5F5",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		minWidth: 100,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	ctaLoginText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
		letterSpacing: 0.2,
	},

	// Security Banner Styles
	securityBanner: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#22c55e",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
	},
	securityContent: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	securityIconContainer: {
		marginRight: 12,
		marginTop: 2,
	},
	securityTextContainer: {
		flex: 1,
	},
	securityTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 6,
		letterSpacing: 0.1,
	},
	securityDescription: {
		fontSize: 13,
		color: "#64748b",
		lineHeight: 18,
		fontWeight: "500",
	},
	securityFeatures: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
	},
	securityFeature: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		paddingVertical: 2,
	},
	securityFeatureText: {
		fontSize: 11,
		color: "#22c55e",
		fontWeight: "600",
		marginLeft: 4,
		letterSpacing: 0.1,
	},
});
