import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
	formatDate,
	getStatusColor,
	getStatusText,
	shouldShowQuotation,
} from "../../utils/statusHandler";
import PlatformLogo from "../platform-logo";
import ProductCard from "../product-card";
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

	// Check if sub-request is rejected
	const statusLower = subRequest.status?.toLowerCase();
	const isRejected =
		statusLower === "rejected" || statusLower === "cancelled";
	const rejectionReason = subRequest.rejectionReason;

	// For online requests, if main request is paid, sub-request is also paid
	const isSubRequestPaid =
		statusLower === "paid" ||
		statusLower === "shipping" ||
		statusLower === "delivered" ||
		statusLower === "completed" ||
		(requestType?.toLowerCase() === "online" && isCompleted);

	// Check if this sub-request has quotation (only for non-rejected items)
	const hasQuotation =
		!isRejected &&
		(subRequest.requestItems.some((item) => {
			return (
				item?.quotationDetail &&
				Object.keys(item.quotationDetail).length > 0
			);
		}) ||
			// For offline requests, also check quotationForPurchase
			(requestType?.toLowerCase() === "offline" &&
				subRequest?.quotationForPurchase &&
				Object.keys(subRequest.quotationForPurchase).length > 0));

	// Check if quotations are expired
	const isExpired = hasExpiredQuotations(subRequest, displayData);
	const expiryDate = getExpiryDate(subRequest, displayData);

	// Calculate sub-request total if has quotation
	let subRequestTotal = 0;
	if (hasQuotation) {
		// Use quotationForPurchase.totalPriceEstimate + shippingEstimate for consistency with ConfirmQuotation
		const basePrice =
			subRequest?.quotationForPurchase?.totalPriceEstimate || 0;
		const shippingEstimate =
			subRequest?.quotationForPurchase?.shippingEstimate || 0;
		subRequestTotal = basePrice + shippingEstimate;

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
				{/* Always show status badge */}
				<View style={styles.subRequestHeaderRight}>
					{isRejected ? (
						<View
							style={[
								styles.quotationBadge,
								{
									backgroundColor: getStatusColor(
										subRequest.status
									),
								},
							]}
						>
							<Text style={styles.quotationBadgeText}>
								{getStatusText(subRequest.status)}
							</Text>
						</View>
					) : hasQuotation || isSubRequestPaid ? (
						<View
							style={[
								styles.quotationBadge,
								isSubRequestPaid && {
									backgroundColor: getStatusColor("PAID"),
								},
								!isSubRequestPaid &&
									hasQuotation && {
										backgroundColor:
											getStatusColor("QUOTED"),
									},
							]}
						>
							<Text style={styles.quotationBadgeText}>
								{isSubRequestPaid
									? getStatusText("PAID")
									: getStatusText("QUOTED")}
							</Text>
						</View>
					) : null}
				</View>
			</View>

			{/* Show rejection reason if rejected */}
			{isRejected && subRequest.rejectionReason && (
				<View style={styles.rejectionContainer}>
					<Text style={styles.rejectionLabel}>Lý do từ chối:</Text>
					<Text style={styles.rejectionText}>
						{subRequest.rejectionReason}
					</Text>
				</View>
			)}

			{/* Products in this sub-request */}
			<View style={styles.subRequestProductsContainer}>
				{requestType?.toLowerCase() === "offline"
					? /* Offline: Show each product with its individual quotation */
					  subRequest.requestItems.map((product, productIndex) => {
							const parsedVariants = parseVariants(
								product.variants
							);
							const productQuotation = product.quotationDetail;

							return (
								<View
									key={`${subIndex}-${productIndex}`}
									style={styles.productWithQuotationContainer}
								>
									{/* Product Card */}
									<ProductCard
										id={
											product.id ||
											`${subIndex}-${productIndex}`
										}
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
											product.images ||
											product.productImages ||
											[]
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
											product.platform ||
											product.ecommercePlatform
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
														name:
															product.sellerName ||
															"",
														phone:
															product.sellerPhone ||
															"",
														email:
															product.sellerEmail ||
															"",
														address:
															product.sellerAddress ||
															"",
														storeLink:
															product.sellerStoreLink ||
															"",
												  }
												: undefined
										}
									/>

									{/* Individual Product Quotation */}
									{productQuotation && (
										<View
											style={
												styles.individualQuotationContainer
											}
										>
											<Text style={styles.quotationTitle}>
												Báo giá sản phẩm
											</Text>

											{/* Exchange Rate */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Tỉ giá:
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													1 USD ={" "}
													{Number(
														productQuotation.exchangeRate ||
															0
													).toLocaleString(
														"vi-VN"
													)}{" "}
													VNĐ
												</Text>
											</View>

											{/* Base Price */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Giá gốc:
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													$
													{Number(
														productQuotation.basePrice ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Service Fee */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Phí dịch vụ (
													{(
														(productQuotation.serviceRate ||
															0) * 100
													).toFixed(0)}
													%):
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													$
													{Number(
														productQuotation.serviceFee ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Tax Details */}
											{productQuotation.taxAmounts &&
												Object.keys(
													productQuotation.taxAmounts
												).length > 0 && (
													<>
														{Object.entries(
															productQuotation.taxAmounts
														).map(
															([
																taxType,
																amount,
															]) => {
																const taxRate =
																	productQuotation.taxRates?.find(
																		(tax) =>
																			tax.taxType ===
																			taxType
																	);
																return (
																	<View
																		key={
																			taxType
																		}
																		style={
																			styles.quotationRow
																		}
																	>
																		<Text
																			style={
																				styles.quotationLabel
																			}
																		>
																			{taxRate?.taxName ||
																				taxType}{" "}
																			(
																			{taxRate?.rate ||
																				0}
																			%):
																		</Text>
																		<Text
																			style={
																				styles.quotationValue
																			}
																		>
																			$
																			{Number(
																				amount ||
																					0
																			).toFixed(
																				2
																			)}{" "}
																			USD
																		</Text>
																	</View>
																);
															}
														)}
													</>
												)}

											{/* Total Before Exchange */}
											<View
												style={[
													styles.quotationRow,
													styles.totalRow,
												]}
											>
												<Text style={styles.totalLabel}>
													Tổng trước quy đổi:
												</Text>
												<Text style={styles.totalValue}>
													$
													{Number(
														productQuotation.totalPriceBeforeExchange ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Total VND */}
											<View
												style={[
													styles.quotationRow,
													styles.finalTotalRow,
												]}
											>
												<Text
													style={
														styles.finalTotalLabel
													}
												>
													Tổng VNĐ:
												</Text>
												<Text
													style={
														styles.finalTotalValue
													}
												>
													{Number(
														productQuotation.totalVNDPrice ||
															0
													).toLocaleString(
														"vi-VN"
													)}{" "}
													VNĐ
												</Text>
											</View>
										</View>
									)}
								</View>
							);
					  })
					: /* Online: Show each product with its individual quotation (same as offline) */
					  subRequest.requestItems.map((product, productIndex) => {
							const parsedVariants = parseVariants(
								product.variants
							);
							const productQuotation = product.quotationDetail;

							return (
								<View
									key={`${subIndex}-${productIndex}`}
									style={styles.productWithQuotationContainer}
								>
									{/* Product Card */}
									<ProductCard
										id={
											product.id ||
											`${subIndex}-${productIndex}`
										}
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
											product.images ||
											product.productImages ||
											[]
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
											product.platform ||
											product.ecommercePlatform
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
														name:
															product.sellerName ||
															"",
														phone:
															product.sellerPhone ||
															"",
														email:
															product.sellerEmail ||
															"",
														address:
															product.sellerAddress ||
															"",
														storeLink:
															product.sellerStoreLink ||
															"",
												  }
												: undefined
										}
									/>

									{/* Individual Product Quotation for online - Same as offline */}
									{productQuotation && (
										<View
											style={
												styles.individualQuotationContainer
											}
										>
											<Text style={styles.quotationTitle}>
												Báo giá sản phẩm
											</Text>

											{/* Exchange Rate */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Tỉ giá:
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													1 USD ={" "}
													{Number(
														productQuotation.exchangeRate ||
															0
													).toLocaleString(
														"vi-VN"
													)}{" "}
													VNĐ
												</Text>
											</View>

											{/* Base Price */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Giá gốc:
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													$
													{Number(
														productQuotation.basePrice ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Service Fee */}
											<View style={styles.quotationRow}>
												<Text
													style={
														styles.quotationLabel
													}
												>
													Phí dịch vụ (
													{(
														(productQuotation.serviceRate ||
															0) * 100
													).toFixed(0)}
													%):
												</Text>
												<Text
													style={
														styles.quotationValue
													}
												>
													$
													{Number(
														productQuotation.serviceFee ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Tax Details */}
											{productQuotation.taxAmounts &&
												Object.keys(
													productQuotation.taxAmounts
												).length > 0 && (
													<>
														{Object.entries(
															productQuotation.taxAmounts
														).map(
															([
																taxType,
																amount,
															]) => {
																const taxRate =
																	productQuotation.taxRates?.find(
																		(tax) =>
																			tax.taxType ===
																			taxType
																	);
																return (
																	<View
																		key={
																			taxType
																		}
																		style={
																			styles.quotationRow
																		}
																	>
																		<Text
																			style={
																				styles.quotationLabel
																			}
																		>
																			{taxRate?.taxName ||
																				taxType}{" "}
																			(
																			{taxRate?.rate ||
																				0}
																			%):
																		</Text>
																		<Text
																			style={
																				styles.quotationValue
																			}
																		>
																			$
																			{Number(
																				amount ||
																					0
																			).toFixed(
																				2
																			)}{" "}
																			USD
																		</Text>
																	</View>
																);
															}
														)}
													</>
												)}

											{/* Total Before Exchange */}
											<View
												style={[
													styles.quotationRow,
													styles.totalRow,
												]}
											>
												<Text style={styles.totalLabel}>
													Tổng trước quy đổi:
												</Text>
												<Text style={styles.totalValue}>
													$
													{Number(
														productQuotation.totalPriceBeforeExchange ||
															0
													).toFixed(2)}{" "}
													USD
												</Text>
											</View>

											{/* Total VND */}
											<View
												style={[
													styles.quotationRow,
													styles.finalTotalRow,
												]}
											>
												<Text
													style={
														styles.finalTotalLabel
													}
												>
													Tổng (VNĐ):
												</Text>
												<Text
													style={
														styles.finalTotalValue
													}
												>
													{Number(
														productQuotation.totalVNDPrice ||
															0
													).toLocaleString(
														"vi-VN"
													)}{" "}
													VNĐ
												</Text>
											</View>
										</View>
									)}

									{/* Show "No quotation yet" if no quotation */}
									{!productQuotation && (
										<View
											style={styles.noQuotationContainer}
										>
											<Text
												style={styles.noQuotationText}
											>
												Chưa có báo giá cho sản phẩm này
											</Text>
										</View>
									)}
								</View>
							);
					  })}
			</View>

			{/* Sub-Request Summary - Show shipping fee and total */}
			{hasQuotation && (
				<View style={styles.subRequestSummaryContainer}>
					{/* Only show shipping fee for online requests */}
					{requestType?.toLowerCase() === "online" && (
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>
								Phí vận chuyển:
							</Text>
							<Text style={styles.summaryValue}>
								{Math.round(
									subRequest?.quotationForPurchase
										?.shippingEstimate || 0
								).toLocaleString("vi-VN")}{" "}
								VNĐ
							</Text>
						</View>
					)}
					<View style={styles.summaryTotalRow}>
						<Text style={styles.summaryTotalLabel}>
							Tổng thanh toán:
						</Text>
						<Text style={styles.summaryTotalValue}>
							{Math.round(subRequestTotal || 0).toLocaleString(
								"vi-VN"
							)}{" "}
							VNĐ
						</Text>
					</View>
				</View>
			)}

			{/* Payment Section - Only show if status allows quotation display and not paid */}
			{shouldShowQuotation(statusLower) && !isSubRequestPaid && (
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
								Tôi đồng ý với báo giá này và chấp nhận phí phát
								sinh (nếu có)
							</Text>
						</View>
					)}

					{/* Payment Section */}
					{isRejected ? (
						/* Rejected Sub-request Message */
						<View style={styles.rejectedContainer}>
							<View style={styles.rejectedIcon}>
								<Ionicons
									name="close-circle-outline"
									size={24}
									color="#E53E3E"
								/>
							</View>
							<View style={styles.rejectedContent}>
								<Text style={styles.rejectedTitle}>
									{statusLower === "cancelled"
										? "Yêu cầu đã hủy"
										: "Yêu cầu bị từ chối"}
								</Text>
								<Text style={styles.rejectedMessage}>
									{rejectionReason ||
										"Sản phẩm này không thể được xử lý"}
								</Text>
								<View style={styles.rejectedStatus}>
									<Text style={styles.rejectedStatusLabel}>
										Trạng thái:
									</Text>
									<Text style={styles.rejectedStatusValue}>
										{statusLower === "cancelled"
											? "Đã hủy"
											: "Bị từ chối"}
									</Text>
								</View>
							</View>
						</View>
					) : isExpired ? (
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
									Bạn không thể thực hiện thanh toán cho yêu
									cầu này vì đã quá hạn.
								</Text>
								{expiryDate && (
									<Text style={styles.expiredDate}>
										Hạn thanh toán: {formatDate(expiryDate)}
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
									navigation.navigate("ConfirmQuotation", {
										request: displayData,
										subRequest: subRequest,
										subRequestIndex: subIndex,
									});
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
	rejectedContainer: {
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
	rejectedIcon: {
		marginTop: 2,
	},
	rejectedContent: {
		flex: 1,
	},
	rejectedTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#E53E3E",
		marginBottom: 4,
	},
	rejectedMessage: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		marginBottom: 8,
	},
	rejectedStatus: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
	},
	rejectedStatusLabel: {
		fontSize: 12,
		color: "#666",
		marginRight: 6,
	},
	rejectedStatusValue: {
		fontSize: 12,
		fontWeight: "600",
		color: "#E53E3E",
	},
	rejectionContainer: {
		backgroundColor: "#FEF5F5",
		borderColor: "#FED7D7",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginHorizontal: 12,
		marginTop: 8,
	},
	rejectionLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#E53E3E",
	},
	rejectionText: {
		fontSize: 14,
		color: "#2D3748",
		lineHeight: 20,
	},
	// Individual quotation styles for offline requests

	individualQuotationContainer: {
		backgroundColor: "#F8FAFC",
		borderRadius: 12,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	quotationTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 12,
	},
	quotationRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
	},
	quotationLabel: {
		fontSize: 14,
		color: "#64748B",
		flex: 1,
	},
	quotationValue: {
		fontSize: 14,
		fontWeight: "500",
		color: "#1E293B",
		textAlign: "right",
		flex: 1,
	},
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: "#E2E8F0",
		marginTop: 8,
		paddingTop: 8,
	},
	offlineTotalLabel: {
		fontSize: 16, // Increased from 14
		fontWeight: "600",
		color: "#000000", // Changed to black
	},
	offlineTotalValue: {
		fontSize: 18, // Increased from 14
		fontWeight: "700",
		color: "#DC2626", // Red color
	},
	finalTotalRow: {
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#E2E8F0",
	},
	finalTotalLabel: {
		fontSize: 16,
		fontWeight: "700",
		color: "#374151",
	},
	finalTotalValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#DC2626",
	},
	// Offline agreement section
	offlineAgreementContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 12,
		marginTop: 8, // Reduced from 16 to 8
		marginBottom: 16, // Added bottom margin for spacing
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	// Total price row
	totalPriceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#D1D5DB",
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	checkboxChecked: {
		backgroundColor: "#1976D2", // App blue color instead of green
		borderColor: "#1976D2",
	},
	checkboxLabel: {
		fontSize: 14,
		color: "#374151",
		flex: 1,
	},
	paymentButton: {
		backgroundColor: "#1976D2", // Blue like online payment button
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
	},
	paymentButtonDisabled: {
		backgroundColor: "#E0E0E0", // Gray when disabled
	},
	paymentButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	paymentButtonTextDisabled: {
		color: "#9E9E9E", // Gray text when disabled
	},
	// Simple quotation display styles
	simpleQuotationDisplay: {
		paddingTop: 8,
		paddingHorizontal: 4,
	},
	priceText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#E53E3E", // Red color for price
		textAlign: "right",
	},
	exchangeRateText: {
		fontSize: 12,
		color: "#666",
		textAlign: "right",
		marginTop: 2,
	},
	// Shipping summary styles
	shippingSummaryContainer: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 12,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	shippingSummaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	shippingSummaryLabel: {
		fontSize: 14,
		color: "#666",
	},
	shippingSummaryValue: {
		fontSize: 14,
		color: "#333",
		fontWeight: "500",
	},
	shippingSummaryTotalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	shippingSummaryTotalValue: {
		fontSize: 15,
		fontWeight: "700",
		color: "#E53E3E", // Red color for total
	},
	// Sub-request summary styles
	subRequestSummaryContainer: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 12,
		marginHorizontal: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	summaryLabel: {
		fontSize: 14,
		color: "#666",
	},
	summaryValue: {
		fontSize: 14,
		color: "#333",
		fontWeight: "500",
	},
	summaryTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		paddingTop: 8,
	},
	summaryTotalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	summaryTotalValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#E53E3E", // Red color for total
	},
});

export default SubRequestItem;
