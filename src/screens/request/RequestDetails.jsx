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

	const [isNoteExpanded, setIsNoteExpanded] = useState(false);
	const [isAcceptedQuotation, setIsAcceptedQuotation] = useState(false);

	// Fetch purchase request detail from API
	const {
		data: requestDetails,
		isLoading,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId,
	});

	console.log("Request ID:", requestId);
	console.log("API Response:", requestDetails);
	console.log("Loading:", isLoading);
	console.log("Error:", error);

	// Show loading spinner
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

	const getStatusColor = (status) => {
		switch (status?.toUpperCase()) {
			case "PENDING":
			case "PROCESSING":
				return "#FFA726";
			case "QUOTED":
				return "#1976D2";
			case "CONFIRMED":
				return "#4CAF50";
			case "CANCELLED":
			case "CANCELED":
				return "#F44336";
			case "COMPLETED":
				return "#6c757d";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status?.toUpperCase()) {
			case "PENDING":
				return "Chờ xử lý";
			case "PROCESSING":
				return "Đang xử lý";
			case "QUOTED":
				return "Đã báo giá";
			case "CONFIRMED":
				return "Đã xác nhận";
			case "CANCELLED":
			case "CANCELED":
				return "Đã huỷ";
			case "COMPLETED":
				return "Hoàn thành";
			default:
				return "Không xác định";
		}
	};

	const getRequestTypeIcon = (type) => {
		return type === "with_link" ? "link-outline" : "create-outline";
	};

	const getRequestTypeBorderColor = (type) => {
		return type === "with_link" ? "#42A5F5" : "#28a745";
	};

	const getRequestTypeText = (type) => {
		return type === "with_link" ? "Có link sản phẩm" : "Không có link";
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
					requestDetails?.status === "QUOTED" &&
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
											requestDetails?.type?.toLowerCase() ===
												"online"
												? "with_link"
												: "without_link"
										)}
										size={18}
										color={getRequestTypeBorderColor(
											requestDetails?.type?.toLowerCase() ===
												"online"
												? "with_link"
												: "without_link"
										)}
									/>
								</View>

								<View style={styles.requestInfo}>
									<Text style={styles.requestCode}>
										#
										{requestDetails?.code ||
											requestDetails?.id}
									</Text>
									<Text style={styles.createdDate}>
										{requestDetails?.createdAt ||
											new Date().toLocaleDateString()}
									</Text>
								</View>
							</View>

							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(
												requestDetails?.status
											) + "20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												requestDetails?.status
											),
										},
									]}
								>
									{getStatusText(requestDetails?.status)}
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
											requestDetails?.type?.toLowerCase() ===
												"online"
												? "with_link"
												: "without_link"
										),
									},
								]}
							>
								{getRequestTypeText(
									requestDetails?.type?.toLowerCase() ===
										"online"
										? "with_link"
										: "without_link"
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
								request: requestDetails,
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
							requestDetails?.shippingAddress?.recipientName ||
							requestDetails?.deliveryAddress?.recipientName
						}
						phone={
							requestDetails?.shippingAddress?.phone ||
							requestDetails?.deliveryAddress?.phone
						}
						address={
							requestDetails?.shippingAddress?.address ||
							requestDetails?.deliveryAddress?.address
						}
						isDefault={
							requestDetails?.shippingAddress?.isDefault ||
							requestDetails?.deliveryAddress?.isDefault
						}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={false}
						showEditButton={false}
					/>
				</View>

				{/* Store Information - Show only for OFFLINE requests */}
				{requestDetails?.type === "OFFLINE" &&
					requestDetails?.store && (
						<View style={styles.section}>
							<StoreCard
								storeName={
									requestDetails.store.storeName ||
									requestDetails.store.name
								}
								storeAddress={
									requestDetails.store.storeAddress ||
									requestDetails.store.address
								}
								phoneNumber={
									requestDetails.store.phoneNumber ||
									requestDetails.store.phone
								}
								email={requestDetails.store.email}
								shopLink={
									requestDetails.store.shopLink ||
									requestDetails.store.storeLink
								}
								mode="manual"
								showEditButton={false}
							/>
						</View>
					)}

				{/* Product List */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm (
							{requestDetails?.items?.length ||
								requestDetails?.products?.length ||
								0}{" "}
							sản phẩm)
						</Text>
					</View>

					{(
						requestDetails?.items ||
						requestDetails?.products ||
						[]
					).map((product, index) => {
						// Determine product mode based on request type
						const productMode =
							requestDetails?.type === "ONLINE"
								? "withLink"
								: "manual";

						return (
							<ProductCard
								key={product.id || index}
								id={product.id || index.toString()}
								name={
									product.name ||
									product.productName ||
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
									product.category || product.productCategory
								}
								brand={product.brand || product.productBrand}
								material={
									product.material || product.productMaterial
								}
								size={product.size || product.productSize}
								color={product.color || product.productColor}
								platform={
									product.platform ||
									product.ecommercePlatform
								}
								productLink={product.productLink || product.url}
								quantity={product.quantity || 1}
								mode={productMode}
								sellerInfo={
									productMode === "manual"
										? {
												name: product.sellerName || "",
												phone:
													product.sellerPhone || "",
												email:
													product.sellerEmail || "",
												address:
													product.sellerAddress || "",
												storeLink:
													product.sellerStoreLink ||
													"",
										  }
										: undefined
								}
							/>
						);
					})}

					{/* Divider */}
					<View style={styles.divider} />
				</View>

				{/* Note Section */}
				{(requestDetails?.note || requestDetails?.customerNote) && (
					<View style={styles.section}>
						<TouchableOpacity
							style={styles.noteHeader}
							onPress={() => setIsNoteExpanded(!isNoteExpanded)}
						>
							<View style={styles.noteHeaderLeft}>
								<Ionicons
									name="chatbox-outline"
									size={20}
									color="#1976D2"
								/>
								<Text style={styles.sectionTitle}>
									Lời nhắn từ khách hàng
								</Text>
							</View>
							<Ionicons
								name={
									isNoteExpanded
										? "chevron-up-outline"
										: "chevron-down-outline"
								}
								size={22}
								color="#1976D2"
							/>
						</TouchableOpacity>

						{isNoteExpanded && (
							<View style={styles.noteContent}>
								<Text style={styles.noteText}>
									{requestDetails?.note ||
										requestDetails?.customerNote}
								</Text>
							</View>
						)}
					</View>
				)}

				{/* Quotation Card - Show only for quoted or confirmed requests */}
				{(requestDetails?.status === "QUOTED" ||
					requestDetails?.status === "CONFIRMED") && (
					<View style={styles.section}>
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
				)}

				{/* Payment Agreement Checkbox - Show only for quoted requests */}
				{requestDetails?.status === "QUOTED" && (
					<View style={styles.section}>
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
			{requestDetails?.status === "QUOTED" && (
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
									request: requestDetails,
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
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		paddingHorizontal: 18,
		paddingVertical: 16,
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
});
