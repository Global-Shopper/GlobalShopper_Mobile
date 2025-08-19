import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { formatDate } from "../../utils/statusHandler";
import PlatformLogo from "../platform-logo";
import ProductCard from "../product-card";
import QuotationCard from "../quotation-card";
import { Text } from "../ui/text";

// Helper function to check if quotation is expired
const isQuotationExpired = (subRequest, displayData) => {
	// First check expiredAt from main request
	if (displayData?.expiredAt) {
		const currentDate = new Date();
		const expiry = new Date(displayData.expiredAt);
		return currentDate > expiry;
	}

	// Then check expiredDate in quotationForPurchase
	if (!subRequest?.quotationForPurchase?.expiredDate) {
		return false; // No expiry date set, assume not expired
	}

	const expiredDays = subRequest.quotationForPurchase.expiredDate;
	const currentDate = new Date();

	// If expiredDate is a number of days, need to calculate from creation date
	if (typeof expiredDays === "number") {
		// If it's a small number, it's likely days from creation
		if (expiredDays < 1000) {
			// For very small numbers like 1, assume it's expired
			return expiredDays <= 1;
		} else {
			// If it's a large number, treat it as timestamp
			const expiry = new Date(expiredDays);
			return currentDate > expiry;
		}
	}

	return false;
};

// Helper function to check if any quotation in sub-request is expired
const hasExpiredQuotations = (subRequest, displayData) => {
	return isQuotationExpired(subRequest, displayData);
};

// Helper function to get expiry date
const getExpiryDate = (subRequest, displayData) => {
	// First check expiredAt from main request
	if (displayData?.expiredAt) {
		return new Date(displayData.expiredAt);
	}

	if (!subRequest?.quotationForPurchase?.expiredDate) return null;

	const expiredDays = subRequest.quotationForPurchase.expiredDate;

	if (typeof expiredDays === "number") {
		if (expiredDays >= 1000) {
			// It's a timestamp
			return new Date(expiredDays);
		} else {
			// It's days from creation - calculate from createdAt if available
			if (displayData?.createdAt) {
				const creationDate = new Date(displayData.createdAt);
				const expiryDate = new Date(
					creationDate.getTime() + expiredDays * 24 * 60 * 60 * 1000
				);
				return expiryDate;
			}
		}
	}

	return null;
};

// Helper function to extract store name from contactInfo
const getStoreNameFromContactInfo = (contactInfo) => {
	if (!contactInfo || !Array.isArray(contactInfo)) return null;

	const storeNameEntry = contactInfo.find(
		(info) => typeof info === "string" && info.startsWith("Tên cửa hàng:")
	);

	if (storeNameEntry) {
		return storeNameEntry.replace("Tên cửa hàng:", "").trim();
	}

	return null;
};

const SubRequestItem = ({
	subRequest,
	subIndex,
	requestType,
	isCompleted,
	acceptedQuotations,
	setAcceptedQuotations,
	expandedQuotations,
	setExpandedQuotations,
	navigation,
	displayData,
}) => {
	if (!subRequest?.requestItems?.length) return null;

	// Check if this sub-request has quotation
	const hasQuotation = subRequest.requestItems.some((item) => {
		return (
			item?.quotationDetail &&
			Object.keys(item.quotationDetail).length > 0
		);
	});

	// Check if quotations are expired
	const isExpired = hasExpiredQuotations(subRequest, displayData);
	const expiryDate = getExpiryDate(subRequest, displayData);

	// Debug logging
	console.log("SubRequestItem Debug:", {
		subRequestId: subRequest?.id,
		requestExpiredAt: displayData?.expiredAt,
		quotationExpiredDate: subRequest?.quotationForPurchase?.expiredDate,
		isExpired,
		expiryDate: expiryDate?.toString(),
	});

	// Calculate sub-request total if has quotation
	let subRequestTotal = 0;
	if (hasQuotation) {
		// Use quotationForPurchase.totalPriceEstimate + shippingEstimate for consistency with ConfirmQuotation
		const basePrice =
			subRequest?.quotationForPurchase?.totalPriceEstimate || 0;
		const shippingEstimate =
			subRequest?.quotationForPurchase?.shippingEstimate || 0;
		subRequestTotal = basePrice + shippingEstimate;

		console.log("SubRequestItem Quotation Debug:", {
			subRequestId: subRequest?.id,
			totalPriceEstimate: basePrice,
			shippingEstimate: shippingEstimate,
			subRequestTotal,
			quotationForPurchase: subRequest?.quotationForPurchase,
		});

		// Fallback: If no quotationForPurchase, calculate from individual items
		if (basePrice === 0) {
			subRequest.requestItems.forEach((item) => {
				if (item?.quotationDetail) {
					const qd = item.quotationDetail;
					const totalVNDPrice = qd.totalVNDPrice || 0;
					subRequestTotal += totalVNDPrice;
				}
			});
		}
	}

	// Parse variants helper function
	const parseVariants = (variants) => {
		if (!variants || !Array.isArray(variants)) return {};

		const result = {};
		variants.forEach((variant) => {
			if (typeof variant === "string") {
				if (variant.includes("Màu sắc:")) {
					result.color = variant.replace("Màu sắc:", "").trim();
				} else if (variant.includes("Kích cỡ:")) {
					result.size = variant.replace("Kích cỡ:", "").trim();
				} else if (variant.includes("Chất liệu:")) {
					result.material = variant.replace("Chất liệu:", "").trim();
				} else if (variant.includes("Thương hiệu:")) {
					result.brand = variant.replace("Thương hiệu:", "").trim();
				}
			}
		});
		return result;
	};

	const productMode =
		requestType?.toLowerCase() === "online" ? "withLink" : "manual";

	return (
		<View style={styles.subRequestContainer}>
			{/* Sub-Request Header */}
			<View style={styles.subRequestHeaderContainer}>
				<View style={styles.subRequestHeaderLeft}>
					<PlatformLogo
						platform={
							subRequest.platform || subRequest.ecommercePlatform
						}
						productUrl={
							subRequest.requestItems?.[0]?.productURL ||
							subRequest.requestItems?.[0]?.productLink ||
							subRequest.requestItems?.[0]?.url
						}
						size={20}
						color="#1976D2"
					/>
					<View style={styles.subRequestHeaderInfo}>
						<Text style={styles.subRequestHeaderTitle}>
							{subRequest.platform ||
								subRequest.ecommercePlatform ||
								getStoreNameFromContactInfo(
									subRequest.contactInfo
								) ||
								subRequest.requestItems?.[0]?.sellerName ||
								"Tự tìm kiếm"}
						</Text>
						<Text style={styles.subRequestHeaderSubtitle}>
							{subRequest.requestItems.length} sản phẩm
							{subRequest.seller && ` • ${subRequest.seller}`}
						</Text>
					</View>
				</View>
				{(hasQuotation || isCompleted) && (
					<View style={styles.subRequestHeaderRight}>
						<View
							style={[
								styles.quotationBadge,
								isCompleted && {
									backgroundColor: "#28a745",
								},
							]}
						>
							<Text style={styles.quotationBadgeText}>
								{isCompleted ? "Đã thanh toán" : "Đã báo giá"}
							</Text>
						</View>
					</View>
				)}
			</View>

			{/* Products in this sub-request */}
			<View style={styles.subRequestProductsContainer}>
				{subRequest.requestItems.map((product, productIndex) => {
					const parsedVariants = parseVariants(product.variants);

					return (
						<ProductCard
							key={`${subIndex}-${productIndex}`}
							id={product.id || `${subIndex}-${productIndex}`}
							name={
								product.productName ||
								product.name ||
								"Sản phẩm không tên"
							}
							description={
								product.description ||
								product.productDescription
							}
							images={
								product.images || product.productImages || []
							}
							price={
								productMode === "manual"
									? ""
									: product.price ||
									  product.productPrice ||
									  ""
							}
							convertedPrice={
								productMode === "manual"
									? ""
									: product.convertedPrice
							}
							exchangeRate={
								productMode === "manual"
									? undefined
									: product.exchangeRate
							}
							category={
								product.category ||
								product.productCategory ||
								parsedVariants.category
							}
							brand={
								product.brand ||
								product.productBrand ||
								parsedVariants.brand
							}
							material={
								product.material ||
								product.productMaterial ||
								parsedVariants.material
							}
							size={
								product.size ||
								product.productSize ||
								parsedVariants.size
							}
							color={
								product.color ||
								product.productColor ||
								parsedVariants.color
							}
							platform={
								product.platform || product.ecommercePlatform
							}
							productLink={
								product.productURL ||
								product.productLink ||
								product.url
							}
							quantity={product.quantity || 1}
							mode={productMode}
							sellerInfo={
								productMode === "manual"
									? {
											name: product.sellerName || "",
											phone: product.sellerPhone || "",
											email: product.sellerEmail || "",
											address:
												product.sellerAddress || "",
											storeLink:
												product.sellerStoreLink || "",
									  }
									: undefined
							}
						/>
					);
				})}
			</View>

			{/* Quotation Section */}
			{(hasQuotation || isCompleted) && (
				<View style={styles.subRequestQuotation}>
					{/* Quotation Summary */}
					<View style={styles.quotationSummaryContainer}>
						<TouchableOpacity
							style={styles.quotationSummaryHeader}
							onPress={() =>
								setExpandedQuotations((prev) => ({
									...prev,
									[subIndex]: !prev[subIndex],
								}))
							}
							activeOpacity={0.7}
						>
							<View style={styles.quotationSummaryLeft}>
								<Ionicons
									name="receipt-outline"
									size={20}
									color="#1976D2"
								/>
								<Text style={styles.quotationSummaryTitle}>
									Báo giá
								</Text>
							</View>
							<View style={styles.quotationSummaryRight}>
								<Text style={styles.quotationSummaryTotal}>
									{Math.round(subRequestTotal).toLocaleString(
										"vi-VN"
									)}{" "}
									VNĐ
								</Text>
								<Ionicons
									name={
										expandedQuotations[subIndex]
											? "chevron-up-outline"
											: "chevron-down-outline"
									}
									size={20}
									color="#666"
								/>
							</View>
						</TouchableOpacity>

						{/* Expanded Quotation Details */}
						{expandedQuotations[subIndex] && (
							<View style={styles.quotationDetailsContainer}>
								{subRequest.requestItems
									.map((product, productIndex) => {
										const quotationDetail =
											product?.quotationDetail;

										if (
											!quotationDetail ||
											Object.keys(quotationDetail)
												.length === 0
										) {
											return null;
										}

										// Extract values from quotationDetail
										const basePrice =
											quotationDetail?.basePrice || 0;
										const serviceFeeUSD =
											quotationDetail?.serviceFee || 0; // This is in USD
										const serviceRate =
											quotationDetail?.serviceRate || 0.1; // This is the percentage (0.1 = 10%)
										const totalTaxAmount =
											quotationDetail?.totalTaxAmount ||
											0;
										const exchangeRate =
											quotationDetail?.exchangeRate ||
											25000; // Default VND exchange rate
										const currency =
											quotationDetail?.currency || "USD";
										const taxRates =
											quotationDetail?.taxRates || [];

										// Get shipping info from quotationForPurchase level
										const shippingEstimate =
											subRequest?.quotationForPurchase
												?.shippingEstimate || 0;
										const shippingVND =
											Math.round(shippingEstimate);

										// Calculate VND values
										const productPriceVND = Math.round(
											basePrice * exchangeRate
										);
										const serviceFeeVND = Math.round(
											serviceFeeUSD * exchangeRate
										);
										const importTaxVND = Math.round(
											totalTaxAmount * exchangeRate
										);

										// Calculate total including shipping
										const calculatedTotal =
											productPriceVND +
											serviceFeeVND +
											importTaxVND +
											shippingVND;

										// Use calculated total (which includes shipping) instead of API totalVNDPrice
										const finalTotalVND =
											Math.round(calculatedTotal);

										// Prepare tax details
										const taxDetails =
											quotationDetail?.taxBreakdown
												? {
														importDuty:
															quotationDetail
																.taxBreakdown
																.importDuty ||
															0,
														vat:
															quotationDetail
																.taxBreakdown
																.vat || 0,
														specialConsumptionTax:
															quotationDetail
																.taxBreakdown
																.specialConsumptionTax ||
															0,
														environmentTax:
															quotationDetail
																.taxBreakdown
																.environmentTax ||
															0,
														totalTaxAmount:
															totalTaxAmount,
												  }
												: undefined;

										return (
											<View
												key={`${subIndex}-${productIndex}-quotation`}
												style={
													styles.quotationContainer
												}
											>
												<QuotationCard
													// Original price data
													originalProductPrice={
														basePrice
													}
													originalCurrency={currency}
													exchangeRate={exchangeRate}
													// USD service fee
													originalServiceFee={
														serviceFeeUSD
													}
													// VND converted prices (fallback only)
													productPrice={
														productPriceVND
													}
													serviceFee={serviceFeeVND}
													serviceFeePercent={
														Math.round(
															serviceRate *
																100 *
																10
														) / 10 // Convert 0.1 to 10.0%
													}
													// New API props
													totalVNDPrice={
														quotationDetail?.totalVNDPrice
													}
													totalPriceEstimate={
														subRequest
															?.quotationForPurchase
															?.totalPriceEstimate
													}
													totalPriceBeforeExchange={
														quotationDetail?.totalPriceBeforeExchange
													}
													shippingEstimate={
														subRequest
															?.quotationForPurchase
															?.shippingEstimate
													}
													adminFees={
														subRequest
															?.quotationForPurchase
															?.fees
													}
													isExpanded={false}
												/>
											</View>
										);
									})
									.filter(Boolean)}
							</View>
						)}
					</View>

					{/* Payment Section - Only show if not completed */}
					{!isCompleted && (
						<View style={styles.subRequestPayment}>
							{/* Checkbox - Only show if not expired */}
							{!isExpired && (
								<View style={styles.subRequestCheckbox}>
									<TouchableOpacity
										style={[
											styles.checkbox,
											acceptedQuotations[subIndex] &&
												styles.checkboxChecked,
										]}
										onPress={() =>
											setAcceptedQuotations((prev) => ({
												...prev,
												[subIndex]: !prev[subIndex],
											}))
										}
										activeOpacity={0.7}
									>
										{acceptedQuotations[subIndex] && (
											<Ionicons
												name="checkmark"
												size={16}
												color="#FFFFFF"
											/>
										)}
									</TouchableOpacity>
									<Text style={styles.checkboxText}>
										Tôi đồng ý với báo giá này và chấp nhận
										phí phát sinh (nếu có)
									</Text>
								</View>
							)}

							{/* Payment Section */}
							{isExpired ? (
								/* Expired Quotation Message */
								<View style={styles.expiredContainer}>
									<View style={styles.expiredIcon}>
										<Ionicons
											name="time-outline"
											size={24}
											color="#E53E3E"
										/>
									</View>
									<View style={styles.expiredContent}>
										<Text style={styles.expiredTitle}>
											Yêu cầu đã hết hạn
										</Text>
										<Text style={styles.expiredMessage}>
											Bạn không thể thực hiện thanh toán
											cho yêu cầu này vì đã quá hạn.
										</Text>
										{expiryDate && (
											<Text style={styles.expiredDate}>
												Hạn thanh toán:{" "}
												{formatDate(expiryDate)}
											</Text>
										)}
									</View>
								</View>
							) : (
								/* Normal Payment Button */
								<TouchableOpacity
									style={[
										styles.subRequestPayButton,
										!acceptedQuotations[subIndex] &&
											styles.subRequestPayButtonDisabled,
									]}
									onPress={() => {
										if (acceptedQuotations[subIndex]) {
											console.log(
												`🚀 PAYMENT NAVIGATION DEBUG:`
											);
											console.log(
												`SubIndex: ${subIndex}`
											);
											console.log(
												`SubRequest ID: ${subRequest.id}`
											);
											console.log(
												`SubRequest Platform: ${subRequest.ecommercePlatform}`
											);
											console.log(
												`SubRequest Status: ${subRequest.status}`
											);
											console.log(
												`Display Data Request ID: ${displayData?.id}`
											);

											navigation.navigate(
												"ConfirmQuotation",
												{
													request: displayData,
													subRequest: subRequest,
													subRequestIndex: subIndex,
												}
											);
										}
									}}
									disabled={!acceptedQuotations[subIndex]}
									activeOpacity={0.7}
								>
									<Text
										style={[
											styles.subRequestPayButtonText,
											!acceptedQuotations[subIndex] &&
												styles.subRequestPayButtonTextDisabled,
										]}
									>
										Thanh toán
									</Text>
								</TouchableOpacity>
							)}
						</View>
					)}

					{/* Completed status message */}
					{isCompleted && (
						<View style={styles.completedStatusContainer}>
							<View style={styles.completedStatusBadge}>
								<Ionicons
									name="checkmark-circle"
									size={20}
									color="#28a745"
								/>
								<Text style={styles.completedStatusText}>
									Đã thanh toán thành công
								</Text>
							</View>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	subRequestContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	subRequestHeaderContainer: {
		backgroundColor: "#f8f9fa",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	subRequestHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		gap: 10,
	},
	subRequestHeaderInfo: {
		flex: 1,
	},
	subRequestHeaderTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 2,
	},
	subRequestHeaderSubtitle: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},
	subRequestHeaderRight: {
		alignItems: "flex-end",
	},
	quotationBadge: {
		backgroundColor: "#28a745",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	quotationBadgeText: {
		fontSize: 12,
		color: "#fff",
		fontWeight: "600",
	},
	subRequestProductsContainer: {
		padding: 16,
	},
	subRequestQuotation: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	quotationSummaryContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		overflow: "hidden",
	},
	quotationSummaryHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#f8f9fa",
	},
	quotationSummaryLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		gap: 8,
	},
	quotationSummaryTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	quotationSummaryRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	quotationSummaryTotal: {
		fontSize: 16,
		fontWeight: "700",
		color: "#D32F2F",
	},
	quotationDetailsContainer: {
		padding: 16,
		paddingTop: 0,
	},
	quotationContainer: {
		marginBottom: 12,
	},
	subRequestPayment: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	subRequestCheckbox: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 16,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#D0D5DD",
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 2,
	},
	checkboxChecked: {
		backgroundColor: "#1976D2",
		borderColor: "#1976D2",
	},
	checkboxText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
		flex: 1,
	},
	subRequestPayButton: {
		backgroundColor: "#1976D2",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	subRequestPayButtonDisabled: {
		backgroundColor: "#E0E0E0",
	},
	subRequestPayButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	subRequestPayButtonTextDisabled: {
		color: "#9E9E9E",
	},
	completedStatusContainer: {
		backgroundColor: "#f8fff8",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#d4edda",
	},
	completedStatusBadge: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	completedStatusText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#28a745",
	},
	expiredContainer: {
		backgroundColor: "#FFF5F5",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#FEB2B2",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	expiredIcon: {
		marginTop: 2,
	},
	expiredContent: {
		flex: 1,
	},
	expiredTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#E53E3E",
		marginBottom: 4,
	},
	expiredMessage: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		marginBottom: 8,
	},
	expiredDate: {
		fontSize: 12,
		color: "#E53E3E",
		fontWeight: "600",
	},
});

export default SubRequestItem;
