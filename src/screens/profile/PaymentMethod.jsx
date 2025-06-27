import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Image,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function PaymentMethod({ navigation }) {
	const [paymentMethods] = useState([
		{
			id: 1,
			name: "Ví GShop",
			type: "wallet",
			balance: "2,500,000 VNĐ",
			icon: "wallet-outline",
			description: "Ví điện tử GlobalShopper",
			isDefault: true,
			gradientColors: ["#4CAF50", "#45A049"],
		},
		{
			id: 2,
			name: "PayOS",
			type: "gateway",
			description: "Cổng thanh toán PayOS",
			icon: "card-outline",
			isDefault: false,
			gradientColors: ["#FFB74D", "#FFA726"],
		},
		{
			id: 3,
			name: "VNPay",
			type: "gateway",
			description: "Cổng thanh toán VNPay",
			icon: "card-outline",
			isDefault: false,
			gradientColors: ["#81C784", "#66BB6A"],
		},
	]);

	const [cards] = useState([
		{
			id: 1,
			type: "payos",
			provider: "PayOS",
			lastFourDigits: "8765",
			holderName: "HOAI PHUONG",
			expiryDate: "08/26",
			isDefault: true,
		},
	]);

	const handleAddNewCard = () => {
		// Navigate to Add Card screen
		console.log("Navigate to Add Card");
	};

	const handleSetDefaultPayment = (methodId, type) => {
		console.log("Set as default payment:", methodId, type);
	};

	const handleEditCard = (cardId) => {
		console.log("Edit card:", cardId);
	};

	const renderPaymentMethodItem = (item) => (
		<TouchableOpacity
			key={item.id}
			style={styles.paymentCard}
			activeOpacity={0.7}
		>
			<View style={styles.paymentContent}>
				{/* Icon with gradient */}
				<View style={styles.iconContainer}>
					<LinearGradient
						colors={item.gradientColors}
						style={styles.iconGradient}
					>
						{item.name === "PayOS" ? (
							<Image
								source={require("../../assets/images/payment/payos-logo.png")}
								style={styles.paymentLogo}
								resizeMode="contain"
							/>
						) : item.name === "VNPay" ? (
							<Image
								source={require("../../assets/images/payment/vnpay-logo.png")}
								style={styles.paymentLogo}
								resizeMode="contain"
							/>
						) : (
							<Ionicons
								name={item.icon}
								size={24}
								color="#FFFFFF"
							/>
						)}
					</LinearGradient>
				</View>

				{/* Payment info */}
				<View style={styles.paymentInfo}>
					<Text style={styles.paymentName}>{item.name}</Text>
					<Text style={styles.paymentDescription}>
						{item.description}
					</Text>
					{item.balance && (
						<Text style={styles.balanceText}>
							Số dư: {item.balance}
						</Text>
					)}
				</View>

				{/* Actions */}
				<View style={styles.actionContainer}>
					{!item.isDefault && (
						<TouchableOpacity
							style={styles.setDefaultButton}
							onPress={() =>
								handleSetDefaultPayment(item.id, "method")
							}
						>
							<Ionicons
								name="checkmark-circle-outline"
								size={16}
								color="#4CAF50"
							/>
						</TouchableOpacity>
					)}
					<Ionicons
						name="chevron-forward"
						size={20}
						color="#B0BEC5"
					/>
				</View>
			</View>

			{/* Default badge - moved to avoid overlap */}
			{item.isDefault && (
				<View style={styles.defaultBadge}>
					<Text style={styles.defaultText}>Mặc định</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	const renderCardItem = (item) => (
		<TouchableOpacity
			key={item.id}
			style={styles.cardItem}
			onPress={() => handleEditCard(item.id)}
			activeOpacity={0.7}
		>
			<View style={styles.cardContent}>
				{/* Card icon */}
				<View style={styles.cardIconContainer}>
					<View style={styles.cardIcon}>
						{item.type === "payos" ? (
							<Image
								source={require("../../assets/images/payment/payos-logo.png")}
								style={styles.cardLogo}
								resizeMode="contain"
							/>
						) : item.type === "vnpay" ? (
							<Image
								source={require("../../assets/images/payment/vnpay-logo.png")}
								style={styles.cardLogo}
								resizeMode="contain"
							/>
						) : (
							<Text style={styles.cardTypeText}>
								{item.type === "visa" ? "VISA" : "MC"}
							</Text>
						)}
					</View>
				</View>

				{/* Card info */}
				<View style={styles.cardInfo}>
					<Text style={styles.cardNumber}>
						{item.provider} •••• •••• •••• {item.lastFourDigits}
					</Text>
					<Text style={styles.cardHolder}>{item.holderName}</Text>
					<Text style={styles.cardExpiry}>
						Hết hạn: {item.expiryDate}
					</Text>
				</View>

				{/* Actions */}
				<View style={styles.actionContainer}>
					{!item.isDefault && (
						<TouchableOpacity
							style={styles.setDefaultButton}
							onPress={() =>
								handleSetDefaultPayment(item.id, "card")
							}
						>
							<Ionicons
								name="checkmark-circle-outline"
								size={16}
								color="#4CAF50"
							/>
						</TouchableOpacity>
					)}
					<Ionicons
						name="chevron-forward"
						size={20}
						color="#B0BEC5"
					/>
				</View>
			</View>

			{/* Default badge - moved to avoid overlap */}
			{item.isDefault && (
				<View style={styles.defaultBadge}>
					<Text style={styles.defaultText}>Mặc định</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1976D2" barStyle="light-content" />

			{/* Header */}
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						Phương thức thanh toán
					</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Payment Methods Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Ví & Cổng thanh toán
					</Text>
					<View style={styles.methodsContainer}>
						{paymentMethods.map(renderPaymentMethodItem)}
					</View>
				</View>

				{/* Cards Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thẻ đã lưu</Text>
					<View style={styles.cardsContainer}>
						{cards.map(renderCardItem)}
					</View>
				</View>

				{/* Add New Card Button */}
				<TouchableOpacity
					style={styles.addButton}
					onPress={handleAddNewCard}
					activeOpacity={0.7}
				>
					<View style={styles.addButtonContent}>
						<View style={styles.addIconContainer}>
							<LinearGradient
								colors={["#4FC3F7", "#29B6F6"]}
								style={styles.addIconGradient}
							>
								<Ionicons
									name="add"
									size={24}
									color="#FFFFFF"
								/>
							</LinearGradient>
						</View>
						<View style={styles.addTextContainer}>
							<Text style={styles.addButtonTitle}>
								Thêm thẻ mới
							</Text>
							<Text style={styles.addButtonSubtitle}>
								Thêm thẻ tín dụng hoặc thẻ ghi nợ
							</Text>
						</View>
						<Ionicons
							name="chevron-forward"
							size={20}
							color="#B0BEC5"
						/>
					</View>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	header: {
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	section: {
		marginTop: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#263238",
		marginBottom: 15,
		paddingHorizontal: 5,
	},
	methodsContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		marginBottom: 8,
	},
	cardsContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	paymentCard: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
		position: "relative",
	},
	paymentContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
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
	paymentLogo: {
		width: 32,
		height: 32,
	},
	paymentInfo: {
		flex: 1,
	},
	paymentName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	paymentDescription: {
		fontSize: 13,
		color: "#78909C",
		marginBottom: 2,
	},
	balanceText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#4CAF50",
	},
	cardItem: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
		position: "relative",
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	cardIconContainer: {
		marginRight: 15,
	},
	cardIcon: {
		width: 48,
		height: 32,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F5F5F5",
	},
	cardLogo: {
		width: 30,
		height: 20,
	},
	visaCard: {
		backgroundColor: "#1A1F71",
	},
	mastercardCard: {
		backgroundColor: "#EB001B",
	},
	cardTypeText: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	cardInfo: {
		flex: 1,
	},
	cardNumber: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	cardHolder: {
		fontSize: 13,
		color: "#78909C",
		marginBottom: 2,
	},
	cardExpiry: {
		fontSize: 13,
		color: "#78909C",
	},
	defaultBadge: {
		position: "absolute",
		top: 12,
		right: 50, // Moved left to avoid overlap with chevron
		backgroundColor: "#4CAF50",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		zIndex: 1,
	},
	defaultText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	actionContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	setDefaultButton: {
		padding: 4,
	},
	addButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginTop: 16,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	addButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	addIconContainer: {
		marginRight: 15,
	},
	addIconGradient: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	addTextContainer: {
		flex: 1,
	},
	addButtonTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",

		marginBottom: 2,
	},
	addButtonSubtitle: {
		fontSize: 13,
		color: "#78909C",
	},
});
