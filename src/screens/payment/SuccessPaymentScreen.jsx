import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getShortId } from "../../utils/statusHandler";

const SuccessPaymentScreen = ({ navigation, route }) => {
	const { paymentMethod, amount, requestId } = route.params || {};

	const getPaymentMethodDisplay = (method) => {
		switch (method) {
			case "wallet":
				return "Ví GShop";
			case "payos":
				return "PayOS";
			case "vnpay":
				return "VNPay";
			default:
				return "Không xác định";
		}
	};

	const handleBackToHome = () => {
		navigation.navigate("Tabs", { screen: "HomeScreen" });
	};

	const handleViewOrders = () => {
		navigation.navigate("Tabs", { screen: "OrderScreen" });
	};

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<LinearGradient
					colors={["#007BFF", "#0056b3"]}
					style={styles.headerGradient}
				>
					{/* Decorative Elements */}
					<View style={styles.decorativeCircle1} />
					<View style={styles.decorativeCircle2} />

					{/* Success Icon */}
					<View style={styles.successContainer}>
						<View style={styles.successIconWrapper}>
							<Ionicons
								name="checkmark-circle"
								size={80}
								color="#FFFFFF"
							/>
						</View>
					</View>

					{/* Success Message */}
					<Text style={styles.successTitle}>
						Thanh toán thành công!
					</Text>
					<Text style={styles.successSubtitle}>
						Đơn hàng đã được tạo và tiền đã được trừ khỏi ví
					</Text>
				</LinearGradient>
			</View>

			{/* Content Section */}
			<View style={styles.content}>
				{/* Payment Amount */}
				{amount && (
					<View style={styles.amountCard}>
						<Text style={styles.amountLabel}>
							Số tiền đã thanh toán
						</Text>
						<Text style={styles.amountText}>
							{Math.round(
								parseFloat(
									amount.toString().replace(/[^\d.-]/g, "")
								)
							).toLocaleString("vi-VN")}{" "}
							VNĐ
						</Text>
					</View>
				)}

				{/* Payment Details */}
				<View style={styles.detailsCard}>
					<Text style={styles.cardTitle}>Chi tiết giao dịch</Text>

					<View style={styles.detailRow}>
						<View style={styles.detailLeft}>
							<Ionicons
								name="card-outline"
								size={16}
								color="#007BFF"
							/>
							<Text style={styles.detailLabel}>
								Phương thức thanh toán
							</Text>
						</View>
						<Text style={styles.detailValue}>
							{getPaymentMethodDisplay(paymentMethod)}
						</Text>
					</View>

					{requestId && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name="receipt-outline"
									size={16}
									color="#007BFF"
								/>
								<Text style={styles.detailLabel}>
									Mã yêu cầu
								</Text>
							</View>
							<Text style={styles.detailValue}>
								{getShortId(requestId)}
							</Text>
						</View>
					)}

					<View style={styles.detailRow}>
						<View style={styles.detailLeft}>
							<Ionicons
								name="time-outline"
								size={16}
								color="#007BFF"
							/>
							<Text style={styles.detailLabel}>Thời gian</Text>
						</View>
						<Text style={styles.detailValue}>
							{new Date().toLocaleString("vi-VN", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				</View>

				{/* Success Status */}
				<View style={styles.statusContainer}>
					<Ionicons
						name="shield-checkmark-outline"
						size={16}
						color="#007BFF"
					/>
					<Text style={styles.statusText}>
						Giao dịch được bảo mật và an toàn
					</Text>
				</View>
			</View>

			{/* Bottom Actions */}
			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.primaryButton}
					onPress={handleViewOrders}
				>
					<LinearGradient
						colors={["#007BFF", "#0056b3"]}
						style={styles.buttonGradient}
					>
						<Text style={styles.primaryButtonText}>
							Xem đơn hàng
						</Text>
					</LinearGradient>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.secondaryButton}
					onPress={handleBackToHome}
				>
					<Text style={styles.secondaryButtonText}>Về trang chủ</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	header: {
		overflow: "hidden",
		position: "relative",
	},
	headerGradient: {
		paddingTop: 50,
		paddingBottom: 35,
		paddingHorizontal: 20,
		alignItems: "center",
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		position: "relative",
	},
	decorativeCircle1: {
		position: "absolute",
		top: -40,
		right: -40,
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(255,255,255,0.08)",
	},
	decorativeCircle2: {
		position: "absolute",
		bottom: -25,
		left: -25,
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(255,255,255,0.06)",
	},
	successContainer: {
		marginBottom: 20,
		zIndex: 10,
	},
	successIconWrapper: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 7,
		elevation: 7,
	},
	successTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 7,
		textAlign: "center",
		zIndex: 10,
	},
	successSubtitle: {
		fontSize: 15,
		color: "rgba(255,255,255,0.9)",
		textAlign: "center",
		lineHeight: 21,
		zIndex: 10,
		paddingHorizontal: 10,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 22,
	},
	amountCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 22,
		marginBottom: 18,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.09,
		shadowRadius: 5,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#E8F4FD",
	},
	amountLabel: {
		fontSize: 14,
		color: "#64748B",
		marginBottom: 7,
		fontWeight: "500",
	},
	amountText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#007BFF",
	},
	detailsCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 18,
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		elevation: 3,
	},
	cardTitle: {
		fontSize: 17,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 14,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 11,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	detailLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	detailLabel: {
		fontSize: 14,
		color: "#64748B",
		marginLeft: 9,
		fontWeight: "500",
	},
	detailValue: {
		fontSize: 14,
		color: "#1F2937",
		fontWeight: "600",
		textAlign: "right",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 5,
		marginBottom: 18,
	},
	statusText: {
		fontSize: 14,
		color: "#64748B",
		marginLeft: 7,
		fontWeight: "500",
	},
	actions: {
		paddingHorizontal: 20,
		paddingBottom: 28,
		gap: 14,
	},
	primaryButton: {
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#007BFF",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
		elevation: 4,
	},
	buttonGradient: {
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	secondaryButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingVertical: 15,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#007BFF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	secondaryButtonText: {
		color: "#007BFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default SuccessPaymentScreen;
