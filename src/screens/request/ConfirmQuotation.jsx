import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import PaymentSmCard from "../../components/payment-sm-card";
import QuotationCard from "../../components/quotation-card";
import { Text } from "../../components/ui/text";

export default function ConfirmQuotation({ navigation, route }) {
	const { request } = route.params || {};
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

	const getRequestTypeText = (type) => {
		switch (type) {
			case "with_link":
				return "Với link sản phẩm";
			case "without_link":
				return "Không có link";
			default:
				return "Không xác định";
		}
	};

	const getRequestTypeBorderColor = (type) => {
		switch (type) {
			case "with_link":
				return "#4CAF50";
			case "without_link":
				return "#FF9800";
			default:
				return "#757575";
		}
	};

	const getRequestTypeIcon = (type) => {
		switch (type) {
			case "with_link":
				return "link-outline";
			case "without_link":
				return "create-outline";
			default:
				return "help-outline";
		}
	};

	const handleConfirmPayment = () => {
		if (selectedPaymentMethod) {
			// Handle payment confirmation
			console.log(
				"Payment confirmed with method:",
				selectedPaymentMethod
			);
			// You can navigate to payment processing screen or show success message
			navigation.goBack();
		}
	};

	return (
		<View style={styles.container}>
			<Header
				title="Xác nhận thanh toán"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Payment Methods Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Phương thức thanh toán
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.paymentMethodsContainer}
					>
						<PaymentSmCard
							paymentMethod="wallet"
							isSelected={selectedPaymentMethod === "wallet"}
							onPress={() => setSelectedPaymentMethod("wallet")}
							balance="2,500,000 VNĐ"
						/>
						<PaymentSmCard
							paymentMethod="payos"
							isSelected={selectedPaymentMethod === "payos"}
							onPress={() => setSelectedPaymentMethod("payos")}
						/>
						<PaymentSmCard
							paymentMethod="vnpay"
							isSelected={selectedPaymentMethod === "vnpay"}
							onPress={() => setSelectedPaymentMethod("vnpay")}
						/>
					</ScrollView>
				</View>

				{/* Request Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thông tin yêu cầu</Text>
					<View style={styles.requestCard}>
						<View style={styles.cardHeader}>
							<View style={styles.leftSection}>
								<View
									style={[
										styles.requestTypeContainer,
										{
											borderColor:
												getRequestTypeBorderColor(
													request.type
												),
										},
									]}
								>
									<Ionicons
										name={getRequestTypeIcon(request.type)}
										size={20}
										color={getRequestTypeBorderColor(
											request.type
										)}
									/>
								</View>

								<View style={styles.requestInfo}>
									<Text style={styles.requestCode}>
										#{request.code}
									</Text>
									<Text style={styles.createdDate}>
										{request.createdAt}
									</Text>
								</View>
							</View>

							{/* Status badge hidden as requested */}
						</View>

						<View style={styles.typeSection}>
							<Text style={styles.typeLabel}>Loại yêu cầu:</Text>
							<Text
								style={[
									styles.typeValue,
									{
										color: getRequestTypeBorderColor(
											request.type
										),
									},
								]}
							>
								{getRequestTypeText(request.type)}
							</Text>
						</View>
					</View>
				</View>

				{/* Quotation */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Chi tiết báo giá</Text>
					<QuotationCard
						productPrice={1200000}
						serviceFee={60000}
						serviceFeePercent={5}
						internationalShipping={200000}
						importTax={120000}
						domesticShipping={35000}
						totalAmount={1615000}
						additionalFees={undefined}
						updatedTotalAmount={undefined}
						isExpanded={true}
					/>
				</View>
			</ScrollView>

			{/* Fixed Confirm Button */}
			<View style={styles.fixedButtonContainer}>
				<TouchableOpacity
					style={[
						styles.confirmButton,
						!selectedPaymentMethod && styles.confirmButtonDisabled,
					]}
					onPress={handleConfirmPayment}
					disabled={!selectedPaymentMethod}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.confirmButtonText,
							!selectedPaymentMethod &&
								styles.confirmButtonTextDisabled,
						]}
					>
						Xác nhận thanh toán
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 18,
		paddingVertical: 10,
		paddingBottom: 100, // Space for fixed button
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 10,
	},
	paymentMethodsContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 14,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	leftSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	requestTypeContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 6,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	requestInfo: {
		flex: 1,
	},
	requestCode: {
		fontSize: 16,
		fontWeight: "700",
		color: "#343a40",
		marginBottom: 2,
	},
	createdDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 10,
		minWidth: 70,
		alignItems: "center",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	typeSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	typeLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
	},
	typeValue: {
		fontSize: 14,
		fontWeight: "600",
	},
	fixedButtonContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		paddingHorizontal: 18,
		paddingVertical: 28,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	confirmButton: {
		backgroundColor: "#1976D2",
		borderRadius: 10,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	confirmButtonDisabled: {
		backgroundColor: "#E0E0E0",
		shadowOpacity: 0,
		elevation: 0,
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	confirmButtonTextDisabled: {
		color: "#9E9E9E",
	},
});
