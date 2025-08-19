import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import PaymentSmCard from "../../components/payment-sm-card";
import { Text } from "../../components/ui/text";
import {
	useCheckoutMutation,
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
		requestId,
	});
	console.log("Selected subRequest:", subRequest);
	console.log("SubRequest ID being processed:", subRequest?.id);
	console.log("SubRequest status:", subRequest?.status);

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

	// API hooks for checkout
	const [directCheckout, { isLoading: isDirectCheckingOut }] =
		useDirectCheckoutMutation(); // For VNPay
	const [walletCheckout, { isLoading: isWalletCheckingOut }] =
		useCheckoutMutation(); // For Wallet

	const isCheckingOut = isDirectCheckingOut || isWalletCheckingOut;

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

	// Debug all subRequests to understand the array order
	console.log(
		"ConfirmQuotation - displayData.subRequests:",
		displayData?.subRequests?.map((sr, i) => ({
			index: i,
			id: sr.id,
			platform: sr.ecommercePlatform,
			status: sr.status,
		}))
	);

	// Get the specific sub-request for this payment
	const selectedSubRequest =
		subRequest || displayData?.subRequests?.[subRequestIndex ?? 0];

	console.log("ConfirmQuotation - subRequest param:", subRequest);
	console.log("ConfirmQuotation - subRequestIndex param:", subRequestIndex);
	console.log("ConfirmQuotation - selectedSubRequest:", selectedSubRequest);
	console.log(
		"ConfirmQuotation - selectedSubRequest platform:",
		selectedSubRequest?.ecommercePlatform
	);
	console.log(
		"ConfirmQuotation - selectedSubRequest status:",
		selectedSubRequest?.status
	);

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
				};

				// Add redirectUri for VNPay (direct-checkout) using deep linking
				if (selectedPaymentMethod !== "wallet") {
					payload.redirectUri = `${Linking.createURL(
						"/"
					)}payment-success`;
				}

				console.log("=== SENDING PAYLOAD ===");
				console.log("Payment method:", selectedPaymentMethod);
				console.log(
					"API endpoint:",
					selectedPaymentMethod === "wallet"
						? "/orders/checkout"
						: "/orders/direct-checkout"
				);
				console.log("Payload:", JSON.stringify(payload, null, 2));

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

				// Use correct API based on payment method
				let response;
				if (selectedPaymentMethod === "wallet") {
					console.log(
						"💰 Using WALLET CHECKOUT API (/orders/checkout)"
					);
					response = await walletCheckout(payload).unwrap();
				} else {
					console.log(
						"💳 Using VNPAY CHECKOUT API (/orders/direct-checkout)"
					);
					response = await directCheckout(payload).unwrap();
				}

				console.log("🎉 PAYMENT SUCCESS RESPONSE 🎉");
				console.log("Response:", JSON.stringify(response, null, 2));

				// Handle different payment methods
				if (selectedPaymentMethod === "wallet") {
					// Wallet payment - process success immediately
					console.log("Paid SubRequest ID:", subRequestData.id);
					console.log("Expected changes after payment:");
					console.log(
						"1. Sub-request status should change from 'QUOTED' to 'PAID'"
					);
					console.log(
						"2. Wallet transaction should be created with 'SUCCESS' status"
					);
					console.log(
						"3. Order should be created with 'ORDER_REQUESTED' status"
					);

					// Success - refetch all related data
					console.log(
						"Refetching wallet and request data after payment..."
					);
					await refetchWallet();

					// Also refetch the request data to update order status
					if (refetch) {
						console.log("🔄 Immediate refetch after payment...");
						const updatedData = await refetch();
						console.log(
							"Updated request data:",
							JSON.stringify(updatedData?.data, null, 2)
						);

						// Check if sub-request status was updated
						const updatedSubRequest =
							updatedData?.data?.subRequests?.find(
								(sr) => sr.id === subRequestData.id
							);
						if (updatedSubRequest) {
							console.log("✅ Updated sub-request found:", {
								id: updatedSubRequest.id,
								oldStatus: subRequestData.status,
								newStatus: updatedSubRequest.status,
								statusChanged:
									subRequestData.status !==
									updatedSubRequest.status,
							});
						} else {
							console.log(
								"❌ Sub-request not found in updated data!"
							);
						}
					}

					// Multiple delayed refetches to ensure server-side processing is complete
					setTimeout(async () => {
						console.log("First delayed refetch (2s)...");
						await refetchWallet();
						if (refetch) {
							await refetch();
						}
					}, 2000);

					setTimeout(async () => {
						console.log("Second delayed refetch (5s)...");
						await refetchWallet();
						if (refetch) {
							await refetch();
						}
					}, 5000);

					setTimeout(async () => {
						console.log("Final delayed refetch (10s)...");
						await refetchWallet();
						if (refetch) {
							const finalData = await refetch();
							console.log("Final refetch result:");

							// Check final sub-request status
							const finalSubRequest =
								finalData?.data?.subRequests?.find(
									(sr) => sr.id === subRequestData.id
								);
							if (finalSubRequest) {
								console.log("🔍 Final sub-request status:", {
									id: finalSubRequest.id,
									status: finalSubRequest.status,
									isPaid: finalSubRequest.status === "PAID",
									platform: finalSubRequest.ecommercePlatform,
								});

								if (finalSubRequest.status !== "PAID") {
									console.warn(
										"⚠️ Sub-request status is still not 'PAID' after 10s. API might need more time or there's an issue."
									);
								}
							}
						}
					}, 10000);

					const formattedAmount =
						totalAmount.toLocaleString("vi-VN") + " VNĐ";
					navigation.navigate("SuccessPaymentScreen", {
						paymentMethod: selectedPaymentMethod,
						amount: formattedAmount,
						requestId: displayData?.id,
						orderId: response?.orderId || response?.id,
					});
				} else {
					// VNPay payment - navigate to VNPay gateway
					console.log("💳 VNPay response:", response);
					if (response.url) {
						console.log(
							"🔗 Redirecting to VNPay URL:",
							response.url
						);
						navigation.navigate("VNPayGateWay", {
							url: response.url,
						});
					} else {
						console.error("❌ No VNPay URL in response");
						Alert.alert(
							"Lỗi thanh toán",
							"Không nhận được URL thanh toán từ VNPay"
						);
					}
				}
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
						{/* Shipping Section for Offline Requests - moved to top */}
						{(() => {
							const requestType =
								displayData?.requestType || displayData?.type;
							const isOfflineRequest =
								requestType?.toLowerCase() === "offline";

							if (isOfflineRequest) {
								return (
									<View style={styles.shippingSection}>
										<Text
											style={styles.shippingSectionTitle}
										>
											Chọn phương thức vận chuyển
										</Text>
										<Text style={styles.shippingNote}>
											Vui lòng chọn phương thức vận chuyển
											để tính phí chính xác
										</Text>
										<TouchableOpacity
											style={styles.shippingSelectButton}
											onPress={() => {
												// TODO: Navigate to shipping selection screen
												Alert.alert(
													"Thông báo",
													"Tính năng chọn vận chuyển sẽ được cập nhật soon"
												);
											}}
										>
											<Text
												style={
													styles.shippingSelectText
												}
											>
												Chọn phương thức vận chuyển
											</Text>
											<Ionicons
												name="chevron-forward"
												size={20}
												color="#1976D2"
											/>
										</TouchableOpacity>
									</View>
								);
							}
							return null;
						})()}

						<Text style={styles.sectionTitle}>
							<Text>Chi tiết báo giá (</Text>
							<Text>
								{selectedSubRequest?.requestItems?.length || 0}
							</Text>
							<Text> sản phẩm)</Text>
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
							// Check if this is an offline request
							const requestType =
								displayData?.requestType || displayData?.type;
							const isOfflineRequest =
								requestType?.toLowerCase() === "offline";

							if (isOfflineRequest) {
								// Simple display - just product name and total price
								return (
									<>
										{selectedSubRequest.requestItems.map(
											(item, index) => {
												const quotationDetail =
													item.quotationDetail;
												const totalPrice =
													quotationDetail?.totalVNDPrice ||
													0;

												return (
													<View
														key={index}
														style={
															styles.simpleQuotationItem
														}
													>
														<View
															style={
																styles.productRow
															}
														>
															{/* Product Image */}
															<View
																style={
																	styles.productImageContainer
																}
															>
																{item.images &&
																item.images
																	.length >
																	0 ? (
																	<Image
																		source={{
																			uri: item
																				.images[0],
																		}}
																		style={
																			styles.productImage
																		}
																		resizeMode="cover"
																	/>
																) : (
																	<View
																		style={
																			styles.placeholderImage
																		}
																	>
																		<Ionicons
																			name="image-outline"
																			size={
																				24
																			}
																			color="#999"
																		/>
																	</View>
																)}
															</View>

															{/* Product Info */}
															<View
																style={
																	styles.productInfo
																}
															>
																<Text
																	style={
																		styles.simpleProductName
																	}
																>
																	{item.productName ||
																		item.name ||
																		`Sản phẩm ${
																			index +
																			1
																		}`}
																</Text>
															</View>

															{/* Price */}
															<View
																style={
																	styles.priceContainer
																}
															>
																{quotationDetail ? (
																	<Text
																		style={
																			styles.totalPrice
																		}
																	>
																		{totalPrice.toLocaleString(
																			"vi-VN"
																		)}{" "}
																		VNĐ
																	</Text>
																) : (
																	<Text
																		style={
																			styles.noQuotationText
																		}
																	>
																		Chưa có
																		báo giá
																	</Text>
																)}
															</View>
														</View>
													</View>
												);
											}
										)}
									</>
								);
							}

							// For online requests, use simple layout like offline
							return (
								<>
									{selectedSubRequest.requestItems.map(
										(item, index) => {
											const quotationDetail =
												item.quotationDetail;
											const totalPrice =
												quotationDetail?.totalVNDPrice ||
												0;

											return (
												<View
													key={index}
													style={
														styles.simpleQuotationItem
													}
												>
													<View
														style={
															styles.productRow
														}
													>
														{/* Product Image */}
														<View
															style={
																styles.productImageContainer
															}
														>
															{item.images &&
															item.images.length >
																0 ? (
																<Image
																	source={{
																		uri: item
																			.images[0],
																	}}
																	style={
																		styles.productImage
																	}
																	resizeMode="cover"
																/>
															) : (
																<View
																	style={
																		styles.placeholderImage
																	}
																>
																	<Ionicons
																		name="image-outline"
																		size={
																			24
																		}
																		color="#999"
																	/>
																</View>
															)}
														</View>

														{/* Product Info */}
														<View
															style={
																styles.productInfo
															}
														>
															<Text
																style={
																	styles.simpleProductName
																}
															>
																{item.productName ||
																	item.name ||
																	`Sản phẩm ${
																		index +
																		1
																	}`}
															</Text>
														</View>

														{/* Price */}
														<View
															style={
																styles.priceContainer
															}
														>
															{quotationDetail ? (
																<Text
																	style={
																		styles.totalPrice
																	}
																>
																	{totalPrice.toLocaleString(
																		"vi-VN"
																	)}{" "}
																	VNĐ
																</Text>
															) : (
																<Text
																	style={
																		styles.noQuotationText
																	}
																>
																	Chưa có báo
																	giá
																</Text>
															)}
														</View>
													</View>
												</View>
											);
										}
									)}

									{/* Shipping Fee */}
									<View style={styles.shippingContainer}>
										<Text style={styles.shippingLabel}>
											Phí vận chuyển:
										</Text>
										<Text style={styles.shippingValue}>
											{Math.round(
												selectedSubRequest
													?.quotationForPurchase
													?.shippingEstimate || 0
											).toLocaleString("vi-VN")}{" "}
											VNĐ
										</Text>
									</View>

									{/* Total amount for all quotations - only for online requests */}
									{!isOfflineRequest && (
										<View style={styles.totalSummary}>
											<View style={styles.totalRow}>
												<Text style={styles.totalLabel}>
													<Text>Tổng cộng (</Text>
													<Text>
														{
															selectedSubRequest
																.requestItems
																.length
														}
													</Text>
													<Text> sản phẩm):</Text>
												</Text>
												<Text
													style={styles.totalAmount}
												>
													<Text>
														{Math.round(
															calculateTotalAmount(
																selectedSubRequest
															)
														).toLocaleString(
															"vi-VN"
														)}
													</Text>
													<Text> VNĐ</Text>
												</Text>
											</View>
										</View>
									)}
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
		paddingBottom: 100,
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
	shippingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 12,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	shippingLabel: {
		fontSize: 15,
		fontWeight: "500",
		color: "#333",
	},
	shippingValue: {
		fontSize: 15,
		fontWeight: "600",
		color: "#666",
	},
	totalSummary: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
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
		color: "#E53E3E",
	},
	// Shipping section styles
	shippingSection: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 16,
		marginTop: 2,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	shippingSectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	shippingNote: {
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
		lineHeight: 20,
	},
	shippingSelectButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	shippingSelectText: {
		fontSize: 16,
		color: "#1976D2",
		fontWeight: "600",
	},
	// Simple quotation item styles
	simpleQuotationItem: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 16,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	productRow: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	productImageContainer: {
		marginRight: 12,
	},
	productImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	placeholderImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	productInfo: {
		flex: 1,
		marginRight: 12,
	},
	simpleProductName: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
		lineHeight: 20,
		flexWrap: "wrap",
	},
	priceContainer: {
		alignItems: "flex-end",
		minWidth: 80,
		flexShrink: 0,
	},
	totalPrice: {
		fontSize: 16,
		fontWeight: "700",
		color: "#E53E3E",
		textAlign: "right",
		flexWrap: "wrap",
	},
});
