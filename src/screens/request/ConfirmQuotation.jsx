import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import PaymentSmCard from "../../components/payment-sm-card";
import QuotationCard from "../../components/quotation-card";
import { Text } from "../../components/ui/text";
import {
	useGetPurchaseRequestByIdQuery,
	useGetWalletQuery,
} from "../../services/gshopApi";

export default function ConfirmQuotation({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id || route.params?.requestId;
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

	// Fetch purchase request detail from API
	const {
		data: requestDetails,
		isLoading,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId,
	});

	// Fetch wallet balance
	const { data: walletData } = useGetWalletQuery();

	// Helper function to get shortened UUID with #
	const getShortId = (fullId) => {
		if (!fullId) return "N/A";
		if (typeof fullId === "string" && fullId.includes("-")) {
			return "#" + fullId.split("-")[0];
		}
		return "#" + fullId;
	};

	// Format date to Vietnamese format: dd/mm/yyyy hh:mm
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";

		try {
			const date = new Date(dateString);
			const day = date.getDate().toString().padStart(2, "0");
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const year = date.getFullYear();
			const hours = date.getHours().toString().padStart(2, "0");
			const minutes = date.getMinutes().toString().padStart(2, "0");

			return `${day}/${month}/${year} ${hours}:${minutes}`;
		} catch (_error) {
			return dateString;
		}
	};

	// Use the correct data for rendering
	const displayData = requestDetails || request;

	// Format wallet balance
	const formatWalletBalance = (balance) => {
		if (!balance && balance !== 0) return "0 VND";
		return `${balance.toLocaleString("vi-VN")} VND`;
	};

	const getRequestTypeText = (type) => {
		if (!type) {
			return "Loại yêu cầu không xác định";
		}

		switch (type?.toLowerCase()) {
			case "offline":
				return "Hàng nội địa/quốc tế";
			case "online":
				return "Hàng từ nền tảng e-commerce";
			default:
				return ` ${type}`;
		}
	};

	const getRequestTypeBorderColor = (type) => {
		// Match logic from RequestDetails
		const normalizedType = type?.toLowerCase();
		return normalizedType === "online" ? "#42A5F5" : "#28a745";
	};

	const getRequestTypeIcon = (type) => {
		// Match logic from RequestDetails
		const normalizedType = type?.toLowerCase();
		return normalizedType === "online" ? "link-outline" : "create-outline";
	};

	const handleConfirmPayment = () => {
		if (selectedPaymentMethod) {
			// Handle payment confirmation
			console.log(
				"Payment confirmed with method:",
				selectedPaymentMethod
			);

			// Get total amount from quotation or fallback to default
			const firstProduct =
				displayData?.subRequests?.[0]?.requestItems?.[0];
			const quotationDetail = firstProduct?.quotationDetail || {};
			const totalVNDPrice = quotationDetail?.totalVNDPrice;

			const totalAmount = totalVNDPrice
				? `${Math.round(totalVNDPrice).toLocaleString("vi-VN")} VND`
				: "1,615,000 VND";

			// Navigate to success payment screen
			navigation.navigate("SuccessPaymentScreen", {
				paymentMethod: selectedPaymentMethod,
				amount: totalAmount,
				requestId: displayData?.id || "REQ001",
			});
		}
	};

	return (
		<View style={styles.container}>
			<Header
				title="Xác nhận thanh toán"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				onNotificationPress={() =>
					navigation.navigate("NotificationScreen")
				}
			/>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#007AFF" />
					<Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
				</View>
			) : error ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>
						Có lỗi xảy ra khi tải dữ liệu
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => refetch()}
					>
						<Text style={styles.retryText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			) : (
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
							contentContainerStyle={
								styles.paymentMethodsContainer
							}
						>
							<PaymentSmCard
								paymentMethod="wallet"
								isSelected={selectedPaymentMethod === "wallet"}
								onPress={() =>
									setSelectedPaymentMethod("wallet")
								}
								balance={formatWalletBalance(
									walletData?.balance
								)}
							/>
							<PaymentSmCard
								paymentMethod="vnpay"
								isSelected={selectedPaymentMethod === "vnpay"}
								onPress={() =>
									setSelectedPaymentMethod("vnpay")
								}
							/>
						</ScrollView>
					</View>

					{/* Request Information */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							Thông tin yêu cầu
						</Text>
						<View style={styles.requestCard}>
							<View style={styles.cardHeader}>
								<View style={styles.leftSection}>
									<View
										style={[
											styles.requestTypeContainer,
											{
												borderColor:
													getRequestTypeBorderColor(
														displayData?.requestType ||
															displayData?.type
													),
											},
										]}
									>
										<Ionicons
											name={getRequestTypeIcon(
												displayData?.requestType ||
													displayData?.type
											)}
											size={20}
											color={getRequestTypeBorderColor(
												displayData?.requestType ||
													displayData?.type
											)}
										/>
									</View>

									<View style={styles.requestInfo}>
										<Text style={styles.requestCode}>
											{getShortId(displayData?.id)}
										</Text>
										<Text style={styles.createdDate}>
											{formatDate(displayData?.createdAt)}
										</Text>
									</View>
								</View>

								{/* Status badge hidden as requested */}
							</View>

							<View style={styles.typeSection}>
								<Text style={styles.typeLabel}>
									Loại yêu cầu:
								</Text>
								<Text
									style={[
										styles.typeValue,
										{
											color: getRequestTypeBorderColor(
												displayData?.requestType ||
													displayData?.type
											),
										},
									]}
								>
									{getRequestTypeText(
										displayData?.requestType ||
											displayData?.type
									)}
								</Text>
							</View>
						</View>
					</View>

					{/* Quotation */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							Chi tiết báo giá
						</Text>
						{(() => {
							// Get quotation detail from first product in subRequests
							const firstProduct =
								displayData?.subRequests?.[0]
									?.requestItems?.[0];
							const quotationDetail =
								firstProduct?.quotationDetail || {};

							// If no quotation detail found, show fallback message
							if (!quotationDetail?.basePrice) {
								return (
									<View style={styles.noQuotationContainer}>
										<Text style={styles.noQuotationText}>
											Chưa có báo giá cho yêu cầu này
										</Text>
									</View>
								);
							}

							// Extract values from quotationDetail
							const basePrice = quotationDetail?.basePrice || 0;
							const serviceFee = quotationDetail?.serviceFee || 0;
							const totalTaxAmount =
								quotationDetail?.totalTaxAmount || 0;
							const totalVNDPrice =
								quotationDetail?.totalVNDPrice || 0;
							const exchangeRate =
								quotationDetail?.exchangeRate || 1;
							const currency = quotationDetail?.currency || "USD";
							const taxRates = quotationDetail?.taxRates || [];

							// Calculate VND values
							const productPriceVND = Math.round(
								basePrice * exchangeRate
							);
							const serviceFeeVND = Math.round(
								((serviceFee * exchangeRate) / 100) * basePrice
							);
							const importTaxVND = Math.round(
								totalTaxAmount * exchangeRate
							);

							// Prepare tax details if available in quotationDetail
							const taxDetails = quotationDetail?.taxBreakdown
								? {
										importDuty:
											quotationDetail.taxBreakdown
												.importDuty || 0,
										vat:
											quotationDetail.taxBreakdown.vat ||
											0,
										specialConsumptionTax:
											quotationDetail.taxBreakdown
												.specialConsumptionTax || 0,
										environmentTax:
											quotationDetail.taxBreakdown
												.environmentTax || 0,
										totalTaxAmount: totalTaxAmount,
								  }
								: undefined;

							return (
								<QuotationCard
									// Original price data
									originalProductPrice={basePrice}
									originalCurrency={currency}
									exchangeRate={exchangeRate}
									// VND converted prices
									productPrice={productPriceVND}
									serviceFee={serviceFeeVND}
									serviceFeePercent={serviceFee}
									internationalShipping={0} // Not specified in quotationDetail
									importTax={importTaxVND}
									domesticShipping={0} // Not specified in quotationDetail
									// Tax details (legacy format)
									taxDetails={taxDetails}
									// Tax rates from API
									taxRates={taxRates}
									// Total amount
									totalAmount={Math.round(totalVNDPrice)}
									additionalFees={undefined}
									updatedTotalAmount={undefined}
									isExpanded={true}
								/>
							);
						})()}
					</View>
				</ScrollView>
			)}

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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	errorText: {
		fontSize: 16,
		color: "#E53E3E",
		textAlign: "center",
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: "#1976D2",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	retryText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	noQuotationContainer: {
		backgroundColor: "#F7F7F7",
		borderRadius: 8,
		padding: 20,
		alignItems: "center",
	},
	noQuotationText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
	},
});
