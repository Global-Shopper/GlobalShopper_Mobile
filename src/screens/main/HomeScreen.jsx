import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import QuickAccess from "../home/QuickAccess";

export default function HomeScreen({ navigation }) {
	// Dịch vụ nổi bật
	const featuredServices = [
		{
			id: 1,
			title: "Mua hộ từ mọi sàn TMĐT",
			subtitle: "Hỗ trợ toàn bộ website quốc tế",
			icon: "bag-outline",
			color: "#42A5F5",
		},
		{
			id: 2,
			title: "Vận chuyển nhanh chóng",
			subtitle: "Giao hàng tận nơi trong 7-14 ngày",
			icon: "airplane-outline",
			color: "#42A5F5",
		},
		{
			id: 3,
			title: "Báo giá minh bạch",
			subtitle: "Không phí ẩn, rõ ràng từng khoản",
			icon: "receipt-outline",
			color: "#42A5F5",
		},
		{
			id: 4,
			title: "Theo dõi đơn hàng",
			subtitle: "Realtime tracking, giao tận nơi",
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

	// Khám phá mua hàng toàn cầu - 4 steps
	const globalShoppingSteps = [
		{
			id: 1,
			title: "Hỗ trợ mua hộ từ các quốc gia",
			description:
				"Chúng tôi hỗ trợ mua hàng từ các nước trên toàn thế giới",
			type: "countries",
			countries: [
				{ flag: "🇺🇸", name: "Hoa Kỳ", code: "US" },
				{ flag: "🇯🇵", name: "Nhật Bản", code: "JP" },
				{ flag: "🇰🇷", name: "Hàn Quốc", code: "KR" },
				{ flag: "🇨🇳", name: "Trung Quốc", code: "CN" },
				{ flag: "🇸🇬", name: "Singapore", code: "SG" },
				{ flag: "🇬🇧", name: "Anh", code: "GB" },
			],
		},
		{
			id: 2,
			title: "Loại sản phẩm nhận order hộ",
			description:
				"Đa dạng danh mục sản phẩm từ thời trang đến công nghệ",
			type: "products",
			categories: [
				{ name: "Thời trang", icon: "shirt-outline" },
				{ name: "Điện tử", icon: "phone-portrait-outline" },
				{ name: "Mỹ phẩm", icon: "heart-outline" },
				{ name: "Đồ gia dụng", icon: "home-outline" },
				{ name: "Sách", icon: "book-outline" },
				{ name: "Đồ chơi", icon: "game-controller-outline" },
			],
		},
		{
			id: 3,
			title: "Tạo yêu cầu",
			description: "Click 'Tạo yêu cầu' ngay để trải nghiệm dịch vụ",
			type: "create-request",
			action: {
				label: "Tạo yêu cầu",
				icon: "add-circle-outline",
				color: "#42A5F5",
				description: "Nhận báo giá tốt nhất trong vòng 30 phút",
			},
		},
		{
			id: 4,
			title: "Hướng dẫn",
			description: "Đừng lo, chúng tôi có hướng dẫn cho bạn",
			type: "guide",
			action: {
				label: "Xem hướng dẫn",
				icon: "play-circle-outline",
				color: "#4CAF50",
				description: "Hướng dẫn từng bước một cách đơn giản",
			},
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

				{/* Dịch vụ nổi bật */}
				<View style={styles.section}>
					<View style={styles.featuredServicesContainer}>
						<Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
						<View style={styles.featuredServicesGrid}>
							{featuredServices.map((service) => (
								<View
									key={service.id}
									style={styles.featuredServiceCard}
								>
									<View style={styles.featuredServiceContent}>
										<View
											style={[
												styles.featuredServiceIcon,
												{
													backgroundColor: `${service.color}20`,
												},
											]}
										>
											<Ionicons
												name={service.icon}
												size={18}
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
								</View>
							))}
						</View>
					</View>
				</View>

				{/* Khám phá mua hàng toàn cầu */}
				<View style={styles.section}>
					<View style={styles.globalShoppingContainer}>
						<Text style={styles.sectionTitle}>
							Khám phá mua hàng toàn cầu
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.globalScrollContainer}
						>
							{globalShoppingSteps.map((step) => (
								<View key={step.id} style={styles.globalStep}>
									<View style={styles.globalStepCard}>
										<Text style={styles.globalStepTitle}>
											{step.title}
										</Text>
										<Text
											style={styles.globalStepDescription}
										>
											{step.description}
										</Text>

										{step.type === "countries" && (
											<View style={styles.countriesGrid}>
												{step.countries.map(
													(country, index) => (
														<View
															key={index}
															style={
																styles.countryItem
															}
														>
															<Text
																style={
																	styles.countryFlag
																}
															>
																{country.flag}
															</Text>
															<Text
																style={
																	styles.countryName
																}
															>
																{country.name}
															</Text>
														</View>
													)
												)}
											</View>
										)}

										{step.type === "products" && (
											<View
												style={
													styles.categoriesContainer
												}
											>
												{step.categories.map(
													(category, index) => (
														<View
															key={index}
															style={
																styles.categoryItem
															}
														>
															<Ionicons
																name={
																	category.icon
																}
																size={20}
																color="#42A5F5"
															/>
															<Text
																style={
																	styles.categoryName
																}
															>
																{category.name}
															</Text>
														</View>
													)
												)}
											</View>
										)}

										{(step.type === "create-request" ||
											step.type === "guide") && (
											<View
												style={
													styles.singleActionContainer
												}
											>
												<View style={styles.actionIcon}>
													<Ionicons
														name={step.action.icon}
														size={48}
														color={
															step.action.color
														}
													/>
												</View>
												<TouchableOpacity
													style={[
														styles.actionButton,
														step.type ===
														"create-request"
															? styles.primaryActionButton
															: styles.secondaryActionButton,
													]}
													onPress={() => {
														if (
															step.type ===
															"create-request"
														) {
															navigation.navigate(
																"WithLink"
															);
														} else {
															navigation.navigate(
																"FAQScreen"
															);
														}
													}}
												>
													<Text
														style={[
															styles.actionButtonText,
															step.type ===
															"create-request"
																? styles.primaryActionText
																: styles.secondaryActionText,
														]}
													>
														{step.action.label}
													</Text>
												</TouchableOpacity>
												<Text
													style={
														styles.actionDescription
													}
												>
													{step.action.description}
												</Text>
											</View>
										)}
									</View>
								</View>
							))}
						</ScrollView>
					</View>
				</View>

				{/* Chúng tôi giúp bạn mua hàng */}
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
									<TouchableOpacity
										style={styles.stepButton}
										onPress={() =>
											navigation.navigate("WithLink")
										}
									>
										<Text style={styles.stepButtonText}>
											Tạo yêu cầu
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
									<TouchableOpacity
										style={styles.stepButton}
										onPress={() =>
											navigation.navigate("FAQScreen")
										}
									>
										<Text style={styles.stepButtonText}>
											Xem ngay!
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</View>
				</View>

				{/* Tại sao chọn chúng tôi */}
				<View style={styles.section}>
					<View style={styles.whyChooseContainer}>
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
											size={24}
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
				</View>

				{/* Các bước sử dụng dịch vụ */}
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
											{ backgroundColor: step.color },
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

				{/* Bảo đảm an toàn */}
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
		paddingBottom: 100,
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
	section: {
		marginHorizontal: 0,
		marginBottom: 12,
	},
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
		gap: 8,
	},
	featuredServiceCard: {
		width: "48%",
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 4,
		elevation: 2,
	},
	featuredServiceContent: {
		padding: 12,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	featuredServiceIcon: {
		width: 32,
		height: 32,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
		marginTop: 2,
	},
	featuredServiceText: {
		flex: 1,
	},
	featuredServiceTitle: {
		fontSize: 12,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 3,
		lineHeight: 15,
	},
	featuredServiceSubtitle: {
		fontSize: 11,
		color: "#64748b",
		lineHeight: 14,
		fontWeight: "500",
	},
	globalShoppingContainer: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 20,
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
	globalScrollContainer: {
		paddingHorizontal: 1,
	},
	globalStep: {
		width: 290,
		marginHorizontal: 5,
	},
	globalStepCard: {
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingTop: 20,
		paddingRight: 20,
		paddingLeft: 20,
		height: 290,
		position: "relative",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
	},
	globalStepTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: "#1e293b",
		textAlign: "center",
		lineHeight: 20,
	},
	globalStepDescription: {
		fontSize: 13,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 18,
		marginBottom: 8,
		fontWeight: "500",
	},
	countriesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 8,
		flex: 1,
		paddingVertical: 8,
	},
	countryItem: {
		width: "48%",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 6,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		marginBottom: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	countryFlag: {
		fontSize: 24,
		marginBottom: 4,
	},
	countryName: {
		fontSize: 11,
		color: "#334155",
		textAlign: "center",
		fontWeight: "600",
		lineHeight: 13,
	},
	categoriesContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 8,
		flex: 1,
	},
	categoryItem: {
		width: "30%",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		marginBottom: 8,
	},
	categoryName: {
		fontSize: 10,
		color: "#334155",
		textAlign: "center",
		fontWeight: "600",
		marginTop: 4,
		lineHeight: 12,
	},
	singleActionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	actionIcon: {
		marginBottom: 16,
		alignItems: "center",
	},
	actionButton: {
		paddingVertical: 14,
		paddingHorizontal: 28,
		borderRadius: 16,
		minWidth: 160,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: "700",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	primaryActionButton: {
		backgroundColor: "#42A5F5",
	},
	primaryActionText: {
		color: "#fff",
	},
	secondaryActionButton: {
		backgroundColor: "#4CAF50",
	},
	secondaryActionText: {
		color: "#fff",
	},
	actionDescription: {
		fontSize: 11,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 15,
		fontWeight: "500",
		paddingHorizontal: 8,
		opacity: 0.9,
	},
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
		marginBottom: 16,
		paddingVertical: 4,
	},
	stepButton: {
		backgroundColor: "#42A5F5",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 16,
		marginTop: 20,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
		alignSelf: "stretch",
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
		marginBottom: 20,
		fontWeight: "400",
	},
	marketplaceContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		width: "100%",
	},
	marketplaceItem: {
		width: "30%",
		alignItems: "center",
		marginBottom: 12,
		paddingVertical: 8,
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
		color: "#fff",
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
