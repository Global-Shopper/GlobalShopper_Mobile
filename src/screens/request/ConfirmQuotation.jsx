import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
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
	useDirectCheckoutMutation,
	useGetPurchaseRequestByIdQuery,
	useGetWalletQuery,
} from "../../services/gshopApi";
import { formatDate } from "../../utils/statusHandler.js";

export default function ConfirmQuotation({ navigation, route }) {
	const { request, subRequest, subRequestIndex } = route.params || {};
	const requestId = request?.id || route.params?.requestId;
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

	console.log("ConfirmQuotation params:", {
		request: !!request,
		subRequest: !!subRequest,
		subRequestIndex,
	});
	console.log("Selected subRequest:", subRequest);

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
	const { data: walletData, refetch: refetchWallet } = useGetWalletQuery();

	// API hook for checkout
	const [directCheckout, { isLoading: isCheckingOut }] =
		useDirectCheckoutMutation();

	// Helper function to get shortened UUID with #
	const getShortId = (fullId) => {
		if (!fullId) return "N/A";
		if (typeof fullId === "string" && fullId.includes("-")) {
			return "#" + fullId.split("-")[0];
		}
		return "#" + fullId;
	};

	// Use the correct data for rendering
	const displayData = requestDetails || request;

	// Get the specific sub-request for this payment
	const selectedSubRequest =
		subRequest || displayData?.subRequests?.[subRequestIndex ?? 0];

	console.log("ConfirmQuotation - subRequest param:", subRequest);
	console.log("ConfirmQuotation - subRequestIndex param:", subRequestIndex);
	console.log("ConfirmQuotation - selectedSubRequest:", selectedSubRequest);

	// Helper function to check if quotation is expired
	const isQuotationExpired = (quotationDetail) => {
		if (
			!quotationDetail?.expiryDate &&
			!quotationDetail?.expiredAt &&
			!quotationDetail?.validUntil
		) {
			return false; // No expiry date set, assume not expired
		}

		const expiryDate =
			quotationDetail.expiryDate ||
			quotationDetail.expiredAt ||
			quotationDetail.validUntil;
		const currentDate = new Date();
		const expiry = new Date(expiryDate);

		return currentDate > expiry;
	};

	// Helper function to check if any quotation in sub-request is expired
	const hasExpiredQuotations = () => {
		if (!selectedSubRequest?.requestItems) return false;

		return selectedSubRequest.requestItems.some(
			(item) =>
				item.quotationDetail && isQuotationExpired(item.quotationDetail)
		);
	};

	// Helper function to get expired quotations info
	const getExpiredQuotationsInfo = () => {
		if (!selectedSubRequest?.requestItems) return [];

		return selectedSubRequest.requestItems
			.filter(
				(item) =>
					item.quotationDetail &&
					isQuotationExpired(item.quotationDetail)
			)
			.map((item) => ({
				productName: item.productName || item.name || "Sản phẩm",
				expiryDate:
					item.quotationDetail.expiryDate ||
					item.quotationDetail.expiredAt ||
					item.quotationDetail.validUntil,
			}));
	};

	// Format wallet balance
	const formatWalletBalance = (balance) => {
		if (!balance && balance !== 0) return "0 VND";
		return `${balance.toLocaleString("vi-VN")} VND`;
	};

	// Calculate total amount consistently
	const calculateTotalAmount = (subRequest) => {
		const basePrice =
			subRequest?.quotationForPurchase?.totalPriceEstimate || 0;
		const shippingEstimate =
			subRequest?.quotationForPurchase?.shippingEstimate || 0;
		return basePrice + shippingEstimate;
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

	const handleConfirmPayment = async () => {
		console.log("🚀 STARTING PAYMENT PROCESS 🚀");
		if (selectedPaymentMethod) {
			try {
				console.log(
					"Payment confirmed with method:",
					selectedPaymentMethod
				);

				// Get sub-request data for checkout
				const subRequestData = selectedSubRequest;
				if (!subRequestData) {
					console.error("No sub-request data found");
					Alert.alert("Lỗi", "Không tìm thấy thông tin sub-request");
					return;
				}

				// Check if any quotations are expired
				if (hasExpiredQuotations()) {
					const expiredInfo = getExpiredQuotationsInfo();
					const expiredProducts = expiredInfo
						.map((info) => info.productName)
						.join(", ");

					Alert.alert(
						"Báo giá đã hết hạn",
						`Một số sản phẩm có báo giá đã hết hạn: ${expiredProducts}. Vui lòng yêu cầu báo giá mới trước khi thanh toán.`,
						[{ text: "OK", onPress: () => navigation.goBack() }]
					);
					return;
				}

				// Calculate total amount using consistent method
				const totalAmount = calculateTotalAmount(subRequestData);
				const basePrice =
					subRequestData.quotationForPurchase?.totalPriceEstimate ||
					0;
				const shippingEstimate =
					subRequestData.quotationForPurchase?.shippingEstimate || 0;

				console.log("=== PAYMENT DEBUG ===");
				console.log("SubRequest ID:", subRequestData.id);
				console.log("Payment Method:", selectedPaymentMethod);
				console.log("Total amount calculation:", {
					basePrice,
					shippingEstimate,
					totalAmount,
					expectedFromUI: 866529.53,
				});
				console.log(
					"Full QuotationForPurchase:",
					JSON.stringify(subRequestData.quotationForPurchase, null, 2)
				);
				console.log(
					"Fees details:",
					subRequestData.quotationForPurchase?.fees
				);

				// Calculate all fees to understand the total structure
				let totalFees = 0;
				if (subRequestData.quotationForPurchase?.fees) {
					subRequestData.quotationForPurchase.fees.forEach(
						(fee, index) => {
							console.log(`Fee ${index}:`, fee);
							if (fee.amount) {
								totalFees += fee.amount;
							}
						}
					);
				}
				console.log("Total calculated fees:", totalFees);
				console.log(
					"Expected grand total:",
					Number(basePrice) + Number(shippingEstimate) + totalFees
				);

				// Use the pre-calculated total from the client (matches UI display)
				// This is the total that user sees and server expects
				const payload = {
					subRequestId: subRequestData.id,
					totalPriceEstimate: totalAmount, // Use the client-calculated total
					trackingNumber: "",
					shippingFee: Number(shippingEstimate), // Shipping fee separate
					redirectUri: "globalshopper://payment-success", // Add redirect URI for mobile app
				};
				console.log("=== SENDING PAYLOAD (USING CLIENT TOTAL) ===");
				console.log(
					"Using totalAmount from calculateTotalAmount:",
					totalAmount
				);
				console.log("Base price:", Number(basePrice));
				console.log("Shipping fee:", Number(shippingEstimate));
				console.log(
					"Additional fees (not included in payload):",
					totalFees
				);
				console.log("Server expects this total in UI:", totalAmount);
				console.log(JSON.stringify(payload, null, 2));

				// Check wallet balance if using wallet
				if (selectedPaymentMethod === "wallet") {
					if (walletData?.balance < totalAmount) {
						Alert.alert(
							"Số dư không đủ",
							"Số dư trong ví không đủ để thanh toán. Vui lòng nạp thêm tiền."
						);
						return;
					}
				}

				// Try a completely different approach - use API spec format
				const response = await directCheckout(payload).unwrap();

				console.log("🎉 PAYMENT SUCCESS RESPONSE 🎉");
				console.log("Response:", JSON.stringify(response, null, 2));
				console.log("Paid SubRequest ID:", subRequestData.id);
				console.log("Should only update this sub-request, not others!");

				// Success - refetch all related data
				console.log(
					"Refetching wallet and request data after payment..."
				);
				await refetchWallet();

				// Also refetch the request data to update order status
				if (refetch) {
					await refetch();
				}

				// Small delay to ensure data is updated on server
				setTimeout(async () => {
					console.log("Additional refetch after delay...");
					await refetchWallet();
					if (refetch) {
						await refetch();
					}
				}, 2000);

				const formattedAmount =
					totalAmount.toLocaleString("vi-VN") + " VNĐ";
				navigation.navigate("SuccessPaymentScreen", {
					paymentMethod: selectedPaymentMethod,
					amount: formattedAmount,
					requestId: displayData?.id,
					orderId: response?.orderId || response?.id,
				});
			} catch (error) {
				console.error("Checkout error:", error);
				console.error("Error details:", {
					status: error?.status,
					data: error?.data,
					message: error?.message,
					originalStatus: error?.originalStatus,
				});
				Alert.alert(
					"Lỗi thanh toán",
					error?.data?.message ||
						error?.message ||
						"Không thể thực hiện thanh toán. Vui lòng thử lại."
				);
			}
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
							Chi tiết báo giá (
							{selectedSubRequest?.requestItems?.length || 0} sản
							phẩm)
						</Text>
						{(() => {
							// Check if we have quotations
							if (
								!selectedSubRequest?.requestItems ||
								selectedSubRequest.requestItems.length === 0
							) {
								return (
									<View style={styles.noQuotationContainer}>
										<Text style={styles.noQuotationText}>
											Chưa có báo giá cho yêu cầu này
										</Text>
									</View>
								);
							}

							// Display all quotations in the sub-request
							return (
								<>
									{selectedSubRequest.requestItems.map(
										(item, index) => {
											const quotationDetail =
												item.quotationDetail;

											if (!quotationDetail) {
												return (
													<View
														key={index}
														style={
															styles.quotationItem
														}
													>
														<Text
															style={
																styles.productName
															}
														>
															{item.productName ||
																item.name ||
																`Sản phẩm ${
																	index + 1
																}`}
														</Text>
														<Text
															style={
																styles.noQuotationText
															}
														>
															Chưa có báo giá
														</Text>
													</View>
												);
											}

											// Check if this quotation is expired
											const isExpired =
												isQuotationExpired(
													quotationDetail
												);

											// Extract values from quotationDetail
											const basePrice =
												quotationDetail?.basePrice || 0;
											const serviceFee =
												quotationDetail?.serviceFee ||
												0;
											const totalVNDPrice =
												quotationDetail?.totalVNDPrice ||
												0;
											const exchangeRate =
												quotationDetail?.exchangeRate ||
												1;
											// Get currency from quotationForPurchase instead of quotationDetail
											const currency =
												selectedSubRequest
													?.quotationForPurchase
													?.currency || "USD";
											const expiryDate =
												quotationDetail.expiryDate ||
												quotationDetail.expiredAt ||
												quotationDetail.validUntil;

											// Get shipping estimate from quotationForPurchase
											const shippingEstimate =
												selectedSubRequest
													?.quotationForPurchase
													?.shippingEstimate || 0;

											return (
												<View
													key={index}
													style={[
														styles.quotationItem,
														isExpired &&
															styles.expiredQuotation,
													]}
												>
													<View
														style={
															styles.quotationHeader
														}
													>
														<Text
															style={
																styles.productName
															}
														>
															{item.productName ||
																item.name ||
																`Sản phẩm ${
																	index + 1
																}`}
														</Text>
														{isExpired && (
															<View
																style={
																	styles.expiredBadge
																}
															>
																<Text
																	style={
																		styles.expiredText
																	}
																>
																	Hết hạn
																</Text>
															</View>
														)}
													</View>

													{expiryDate && (
														<Text
															style={[
																styles.expiryText,
																isExpired &&
																	styles.expiredDate,
															]}
														>
															Hạn báo giá:{" "}
															{formatDate(
																expiryDate
															)}
														</Text>
													)}

													<QuotationCard
														originalProductPrice={
															basePrice
														}
														originalCurrency={
															currency
														}
														exchangeRate={
															exchangeRate
														}
														originalServiceFee={
															serviceFee
														}
														serviceFeePercent={
															basePrice > 0
																? Number(
																		(
																			(serviceFee /
																				basePrice) *
																			100
																		).toFixed(
																			1
																		)
																  )
																: 0
														}
														totalVNDPrice={
															totalVNDPrice
														}
														totalPriceEstimate={
															selectedSubRequest
																?.quotationForPurchase
																?.totalPriceEstimate
														}
														totalPriceBeforeExchange={
															quotationDetail?.totalPriceBeforeExchange
														}
														shippingEstimate={
															shippingEstimate
														}
														adminFees={
															selectedSubRequest
																?.quotationForPurchase
																?.fees
														}
														totalAmount={Math.round(
															totalVNDPrice +
																shippingEstimate
														)}
														isExpanded={true}
													/>
												</View>
											);
										}
									)}

									{/* Total amount for all quotations */}
									<View style={styles.totalSummary}>
										<View style={styles.totalRow}>
											<Text style={styles.totalLabel}>
												Tổng cộng (
												{
													selectedSubRequest
														.requestItems.length
												}{" "}
												sản phẩm):
											</Text>
											<Text style={styles.totalAmount}>
												{Math.round(
													calculateTotalAmount(
														selectedSubRequest
													)
												).toLocaleString("vi-VN")}{" "}
												VNĐ
											</Text>
										</View>
									</View>
								</>
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
						(!selectedPaymentMethod || isCheckingOut) &&
							styles.confirmButtonDisabled,
					]}
					onPress={handleConfirmPayment}
					disabled={!selectedPaymentMethod || isCheckingOut}
					activeOpacity={0.7}
				>
					{isCheckingOut ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<Text
							style={[
								styles.confirmButtonText,
								(!selectedPaymentMethod || isCheckingOut) &&
									styles.confirmButtonTextDisabled,
							]}
						>
							Xác nhận thanh toán
						</Text>
					)}
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
	quotationItem: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	expiredQuotation: {
		backgroundColor: "#FFF5F5",
		borderColor: "#FEB2B2",
	},
	quotationHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	productName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		flex: 1,
	},
	expiredBadge: {
		backgroundColor: "#E53E3E",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	expiredText: {
		fontSize: 12,
		color: "#FFFFFF",
		fontWeight: "600",
	},
	expiryText: {
		fontSize: 12,
		color: "#666",
		marginBottom: 12,
	},
	expiredDate: {
		color: "#E53E3E",
		fontWeight: "600",
	},
	totalSummary: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 2,
		borderColor: "#1976D2",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1976D2",
	},
});
