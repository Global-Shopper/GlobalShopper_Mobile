import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import ProductCard from "../../components/product-card";
import QuotationCard from "../../components/quotation-card";
import StoreCard from "../../components/store-card";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestByIdQuery } from "../../services/gshopApi";

export default function RequestDetails({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id || route.params?.requestId;

	const [isAcceptedQuotation, setIsAcceptedQuotation] = useState(false);

	// Fetch purchase request detail from API - using getPurchaseRequestById
	const {
		data: requestDetails,
		isLoading,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId,
	});

	const getShortId = (fullId) => {
		if (!fullId) return "N/A";
		if (typeof fullId === "string" && fullId.includes("-")) {
			return "#" + fullId.split("-")[0];
		}
		return "#" + fullId;
	};

	// Helper function to get request type text
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

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1976D2" />
					<Text style={styles.loadingText}>
						Đang tải thông tin...
					</Text>
				</View>
			</View>
		);
	}

	// Show error state
	if (error || !requestDetails) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color="#dc3545"
					/>
					<Text style={styles.errorTitle}>
						Không thể tải thông tin
					</Text>
					<Text style={styles.errorMessage}>
						{error?.data?.message ||
							error?.message ||
							"Vui lòng thử lại sau"}
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => refetch()}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	// Use the correct data for rendering
	const displayData = requestDetails;

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case "sent":
				return "#28a745";
			case "checking":
				return "#17a2b8";
			case "quoted":
				return "#ffc107";
			case "confirmed":
				return "#007bff";
			case "cancelled":
				return "#dc3545";
			case "insufficient":
				return "#fd7e14";
			case "completed":
				return "#6c757d";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status?.toLowerCase()) {
			case "sent":
				return "Đã gửi";
			case "checking":
				return "Đang xử lý";
			case "quoted":
				return "Đã báo giá";
			case "confirmed":
				return "Đã xác nhận";
			case "cancelled":
				return "Đã hủy";
			case "insufficient":
				return "Cập nhật";
			case "completed":
				return "Hoàn thành";
			default:
				return "Cập nhật";
		}
	};

	const getRequestTypeIcon = (type) => {
		return type === "with_link" ? "link-outline" : "create-outline";
	};

	const getRequestTypeBorderColor = (type) => {
		return type === "with_link" ? "#42A5F5" : "#28a745";
	};

	return (
		<View style={styles.container}>
			<Header
				title="Chi tiết yêu cầu"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
				showNotificationIcon={false}
			/>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.scrollContent,
					displayData?.status?.toLowerCase() === "quoted" &&
						styles.scrollContentWithButton,
				]}
			>
				{/* Request Card - Without product count */}
				<View style={styles.section}>
					<View style={styles.requestCard}>
						{/* Header Section */}
						<View style={styles.cardHeader}>
							<View style={styles.leftSection}>
								<View style={styles.requestTypeContainer}>
									<Ionicons
										name={getRequestTypeIcon(
											displayData?.requestType?.toLowerCase() ===
												"online" ||
												displayData?.type?.toLowerCase() ===
													"online"
												? "with_link"
												: "without_link"
										)}
										size={18}
										color={getRequestTypeBorderColor(
											displayData?.requestType?.toLowerCase() ===
												"online" ||
												displayData?.type?.toLowerCase() ===
													"online"
												? "with_link"
												: "without_link"
										)}
									/>
								</View>

								<View style={styles.requestInfo}>
									<Text style={styles.requestCode}>
										{getShortId(
											displayData?.id || displayData?.code
										)}
									</Text>
									<Text style={styles.createdDate}>
										{formatDate(displayData?.createdAt)}
									</Text>
								</View>
							</View>

							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(
												displayData?.status
											) + "20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												displayData?.status
											),
										},
									]}
								>
									{getStatusText(displayData?.status)}
								</Text>
							</View>
						</View>

						{/* Request Type Section */}
						<View style={styles.typeSection}>
							<Text style={styles.typeLabel}>Loại yêu cầu:</Text>
							<Text
								style={[
									styles.typeValue,
									{
										color: getRequestTypeBorderColor(
											displayData?.requestType?.toLowerCase() ===
												"online" ||
												displayData?.type?.toLowerCase() ===
													"online"
												? "with_link"
												: "without_link"
										),
									},
								]}
							>
								{getRequestTypeText(
									displayData?.requestType ||
										displayData?.type ||
										displayData?.category ||
										displayData?.purchaseType
								)}
							</Text>
						</View>
					</View>
				</View>

				{/* Request History - Show only view details button */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.historyViewButton}
						onPress={() =>
							navigation.navigate("RequestHistory", {
								request: displayData,
							})
						}
					>
						<View style={styles.historyViewLeft}>
							<Ionicons
								name="time-outline"
								size={20}
								color="#1976D2"
							/>
							<Text style={styles.historyViewTitle}>
								Lịch sử yêu cầu
							</Text>
						</View>
						<View style={styles.historyViewRight}>
							<Text style={styles.viewDetailsText}>
								Xem chi tiết
							</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={20}
								color="#1976D2"
							/>
						</View>
					</TouchableOpacity>
				</View>

				{/* Delivery Address */}
				<View style={styles.section}>
					<AddressSmCard
						recipientName={
							displayData?.shippingAddress?.name ||
							displayData?.deliveryAddress?.name ||
							displayData?.address?.recipientName ||
							displayData?.recipientName ||
							""
						}
						phone={
							displayData?.shippingAddress?.phoneNumber ||
							displayData?.deliveryAddress?.phoneNumber ||
							displayData?.address?.phone ||
							displayData?.phone ||
							""
						}
						address={
							displayData?.shippingAddress?.location ||
							displayData?.deliveryAddress?.location ||
							displayData?.address?.address ||
							displayData?.address ||
							""
						}
						isDefault={
							displayData?.shippingAddress?.default ||
							displayData?.deliveryAddress?.default ||
							displayData?.address?.isDefault ||
							false
						}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={
							!(
								displayData?.shippingAddress?.name ||
								displayData?.deliveryAddress?.name ||
								displayData?.address?.recipientName ||
								displayData?.recipientName ||
								displayData?.shippingAddress?.phoneNumber ||
								displayData?.deliveryAddress?.phoneNumber ||
								displayData?.address?.phone ||
								displayData?.phone ||
								displayData?.shippingAddress?.location ||
								displayData?.deliveryAddress?.location ||
								displayData?.address?.address ||
								displayData?.address
							)
						}
						showEditButton={false}
					/>
				</View>

				{/* Store Information - Show only for OFFLINE requests */}
				{(displayData?.requestType?.toLowerCase() === "offline" ||
					displayData?.type?.toLowerCase() === "offline") &&
					(() => {
						// Extract store info from displayData.store OR subRequests.contactInfo
						let storeInfo = null;

						// Method 1: Direct store object
						if (displayData?.store) {
							storeInfo = {
								storeName:
									displayData.store.storeName ||
									displayData.store.name ||
									"",
								storeAddress:
									displayData.store.storeAddress ||
									displayData.store.address ||
									"",
								phoneNumber:
									displayData.store.phoneNumber ||
									displayData.store.phone ||
									"",
								email: displayData.store.email || "",
								shopLink:
									displayData.store.shopLink ||
									displayData.store.storeLink ||
									"",
							};
						}
						// Method 2: Extract from subRequests.contactInfo
						else if (displayData?.subRequests?.length > 0) {
							const firstSubRequest = displayData.subRequests[0];
							if (
								firstSubRequest?.contactInfo &&
								Array.isArray(firstSubRequest.contactInfo)
							) {
								const contactInfo = firstSubRequest.contactInfo;

								// Parse contactInfo array to extract store details
								const parseContactInfo = (infoArray) => {
									const parsed = {
										storeName: "",
										storeAddress: "",
										phoneNumber: "",
										email: "",
										shopLink: "",
									};

									infoArray.forEach((info) => {
										if (typeof info === "string") {
											if (
												info.includes(
													"Tên cửa hàng:"
												) ||
												info.includes("Store:")
											) {
												parsed.storeName = info
													.replace(
														"Tên cửa hàng:",
														""
													)
													.replace("Store:", "")
													.trim();
											} else if (
												info.includes("Địa chỉ:") ||
												info.includes("Address:")
											) {
												parsed.storeAddress = info
													.replace("Địa chỉ:", "")
													.replace("Address:", "")
													.trim();
											} else if (
												info.includes("SĐT:") ||
												info.includes("Phone:") ||
												info.includes("Số điện thoại:")
											) {
												parsed.phoneNumber = info
													.replace("SĐT:", "")
													.replace("Phone:", "")
													.replace(
														"Số điện thoại:",
														""
													)
													.trim();
											} else if (
												info.includes("Email:") ||
												info.includes("@")
											) {
												parsed.email = info
													.replace("Email:", "")
													.trim();
											} else if (
												info.includes("Link:") ||
												info.includes("Link shop:") ||
												info.includes("http")
											) {
												parsed.shopLink = info
													.replace("Link:", "")
													.replace("Link shop:", "")
													.trim();
											}
										}
									});

									return parsed;
								};

								storeInfo = parseContactInfo(contactInfo);
							}
						}

						// Only render if we have store info
						if (
							storeInfo &&
							(storeInfo.storeName ||
								storeInfo.storeAddress ||
								storeInfo.phoneNumber)
						) {
							return (
								<View style={styles.section}>
									<StoreCard
										storeName={storeInfo.storeName}
										storeAddress={storeInfo.storeAddress}
										phoneNumber={storeInfo.phoneNumber}
										email={storeInfo.email}
										shopLink={storeInfo.shopLink}
										mode="manual"
										showEditButton={false}
									/>
								</View>
							);
						}

						return null;
					})()}

				{/* Product List */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm (
							{displayData?.requestItems?.length ||
								displayData?.items?.length ||
								displayData?.products?.length ||
								displayData?.productList?.length ||
								displayData?.subRequests?.[0]?.requestItems
									?.length ||
								0}{" "}
							sản phẩm)
						</Text>
					</View>

					{/* Check if we have any products */}
					{displayData?.requestItems?.length > 0 ||
					displayData?.items?.length > 0 ||
					displayData?.products?.length > 0 ||
					displayData?.productList?.length > 0 ||
					displayData?.subRequests?.[0]?.requestItems?.length > 0 ? (
						(() => {
							// Find the product source
							const productSource =
								displayData?.requestItems?.length > 0
									? displayData.requestItems
									: displayData?.items?.length > 0
									? displayData.items
									: displayData?.products?.length > 0
									? displayData.products
									: displayData?.productList?.length > 0
									? displayData.productList
									: displayData?.subRequests?.[0]
											?.requestItems?.length > 0
									? displayData.subRequests[0].requestItems
									: [];

							return productSource.map((product, index) => {
								// Determine product mode based on request type
								const productMode =
									displayData?.requestType?.toLowerCase() ===
										"online" ||
									displayData?.type?.toLowerCase() ===
										"online"
										? "withLink"
										: "manual";

								// Parse variants array to extract color, size, and other info
								const parseVariants = (variants) => {
									if (!variants || !Array.isArray(variants))
										return {};

									const result = {};
									variants.forEach((variant) => {
										if (typeof variant === "string") {
											if (variant.includes("Màu sắc:")) {
												result.color = variant
													.replace("Màu sắc:", "")
													.trim();
											} else if (
												variant.includes("Kích cỡ:")
											) {
												result.size = variant
													.replace("Kích cỡ:", "")
													.trim();
											} else if (
												variant.includes("Chất liệu:")
											) {
												result.material = variant
													.replace("Chất liệu:", "")
													.trim();
											} else if (
												variant.includes("Thương hiệu:")
											) {
												result.brand = variant
													.replace("Thương hiệu:", "")
													.trim();
											}
										}
									});
									return result;
								};

								const parsedVariants = parseVariants(
									product.variants
								);

								return (
									<ProductCard
										key={product.id || index}
										id={product.id || index.toString()}
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
								);
							});
						})()
					) : (
						<View style={styles.emptyProductContainer}>
							<Text style={styles.emptyProductText}>
								Chưa có sản phẩm nào trong yêu cầu này
							</Text>
						</View>
					)}

					{/* Divider */}
					<View style={styles.divider} />
				</View>

				{/* Quotation Card - Show only for quoted or confirmed requests */}
				{(displayData?.status?.toLowerCase() === "quoted" ||
					displayData?.status?.toLowerCase() === "confirmed") &&
					(() => {
						// Get quotation data from the first product's quotationDetail
						const firstProduct =
							displayData?.subRequests?.[0]?.requestItems?.[0];
						const quotationDetail =
							firstProduct?.quotationDetail || {};

						// Extract values from quotationDetail
						const basePrice = quotationDetail?.basePrice || 0;
						const serviceFee = quotationDetail?.serviceFee || 0;
						const totalTaxAmount =
							quotationDetail?.totalTaxAmount || 0;
						const totalVNDPrice =
							quotationDetail?.totalVNDPrice || 0;
						const exchangeRate = quotationDetail?.exchangeRate || 1;
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
									vat: quotationDetail.taxBreakdown.vat || 0,
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
							<View style={styles.section}>
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
							</View>
						);
					})()}

				{/* Payment Agreement Checkbox - Show only for quoted requests */}
				{displayData?.status?.toLowerCase() === "quoted" && (
					<View style={styles.checkboxSection}>
						<View style={styles.checkboxContainer}>
							<TouchableOpacity
								style={[
									styles.checkbox,
									isAcceptedQuotation &&
										styles.checkboxChecked,
								]}
								onPress={() =>
									setIsAcceptedQuotation(!isAcceptedQuotation)
								}
								activeOpacity={0.7}
							>
								{isAcceptedQuotation && (
									<Ionicons
										name="checkmark"
										size={16}
										color="#FFFFFF"
									/>
								)}
							</TouchableOpacity>
							<Text style={styles.checkboxText}>
								Tôi đồng ý với giá tạm thời này và chấp nhận phí
								phát sinh (nếu có)
							</Text>
						</View>
					</View>
				)}
			</ScrollView>

			{/* Fixed Payment Button - Show only for quoted requests */}
			{displayData?.status?.toLowerCase() === "quoted" && (
				<View style={styles.fixedButtonContainer}>
					<TouchableOpacity
						style={[
							styles.fixedPaymentButton,
							!isAcceptedQuotation &&
								styles.fixedPaymentButtonDisabled,
						]}
						onPress={() => {
							if (isAcceptedQuotation) {
								navigation.navigate("ConfirmQuotation", {
									request: displayData,
								});
							}
						}}
						disabled={!isAcceptedQuotation}
						activeOpacity={0.7}
					>
						<Text
							style={[
								styles.fixedPaymentButtonText,
								!isAcceptedQuotation &&
									styles.fixedPaymentButtonTextDisabled,
							]}
						>
							Thanh toán
						</Text>
					</TouchableOpacity>
				</View>
			)}
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
		paddingVertical: 5,
		paddingBottom: 30,
	},
	scrollContentWithButton: {
		paddingBottom: 1,
	},
	section: {
		marginBottom: 10,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
		gap: 6,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
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
	totalSection: {
		backgroundColor: "#F3F4F6",
		padding: 10,
		borderRadius: 10,
		marginTop: 6,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	totalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#D32F2F",
	},
	totalNote: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 8,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		marginBottom: 4,
	},
	noteHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		flex: 1,
	},
	noteContent: {
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		marginTop: 8,
	},
	noteHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	noteContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		padding: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	noteText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
	},
	historyViewButton: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	historyViewLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
	},
	historyViewTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	historyViewRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	viewDetailsText: {
		fontSize: 14,
		color: "#1976D2",
		fontWeight: "500",
	},
	checkboxSection: {
		marginBottom: 5,
		marginTop: -5,
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		paddingHorizontal: 18,
		paddingVertical: 12,
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
		marginTop: 2, // Align with text
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
	fixedButtonContainer: {
		backgroundColor: "#fff",
		paddingHorizontal: 18,
		paddingVertical: 27,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	fixedPaymentButton: {
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
	fixedPaymentButtonDisabled: {
		backgroundColor: "#E0E0E0",
		shadowOpacity: 0,
		elevation: 0,
	},
	fixedPaymentButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	fixedPaymentButtonTextDisabled: {
		color: "#9E9E9E",
	},
	// Loading and Error States
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		marginTop: 16,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#dc3545",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	errorMessage: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
	},
	retryButton: {
		backgroundColor: "#1976D2",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#fff",
	},
	emptyProductContainer: {
		backgroundColor: "#f8f9fa",
		padding: 20,
		borderRadius: 8,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderStyle: "dashed",
	},
	emptyProductText: {
		fontSize: 14,
		color: "#666",
		fontStyle: "italic",
	},
});
