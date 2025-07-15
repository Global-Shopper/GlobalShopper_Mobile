import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import ProductCard from "../../components/product-card";
import QuotationCard from "../../components/quotation-card";
import StoreCard from "../../components/store-card";
import { Text } from "../../components/ui/text";

export default function RequestDetails({ navigation, route }) {
	const { request } = route.params || {};
	const [isNoteExpanded, setIsNoteExpanded] = useState(false);
	const [isAcceptedQuotation, setIsAcceptedQuotation] = useState(false);

	// Mock data
	const requestDetails = {
		...request,
		deliveryAddress: {
			recipientName: "Nguyễn Văn A",
			phone: "0123456789",
			address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
			isDefault: true,
		},
		note: "Vui lòng kiểm tra kỹ chất lượng sản phẩm trước khi gửi.",
		products: [
			{
				id: "1",
				name: "iPhone 15 Pro Max 256GB",
				description: "Màu xanh dương, chính hãng Apple",
				images: [],
				price: "$1,199",
				convertedPrice: "29,500,000 VNĐ",
				exchangeRate: "24,600",
				category: "Điện tử",
				brand: "Apple",
				material: "Titanium",
				size: "6.7 inch",
				color: "Xanh dương",
				platform: "Apple Store",
				productLink: "https://apple.com/iphone-15-pro",
				mode: request?.type === "with_link" ? "withLink" : "manual",
				status: "pending",
			},
			{
				id: "2",
				name: "AirPods Pro 2nd Gen",
				description: "Có Active Noise Cancellation",
				images: [],
				price: "$249",
				convertedPrice: "6,125,000 VNĐ",
				exchangeRate: "24,600",
				category: "Điện tử",
				brand: "Apple",
				material: "Silicone",
				size: "Standard",
				color: "Trắng",
				platform: "Apple Store",
				productLink: "https://apple.com/airpods-pro",
				mode: request?.type === "with_link" ? "withLink" : "manual",
				status: "pending",
			},
		],
		storeData:
			request?.type === "without_link"
				? {
						storeName: "Tech Store Vietnam",
						storeAddress: "456 Nguyễn Huệ, Quận 1, TP.HCM",
						phoneNumber: "028-3829-5555",
						email: "contact@techstore.vn",
						shopLink: "https://techstore.vn",
				  }
				: null,
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "processing":
				return "#1976D2";
			case "quoted":
				return "#1976D2";
			case "confirmed":
				return "#1976D2";
			case "cancelled":
				return "#1976D2";
			case "completed":
				return "#6c757d";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "processing":
				return "Đang xử lý";
			case "quoted":
				return "Đã báo giá";
			case "confirmed":
				return "Đã xác nhận";
			case "cancelled":
				return "Đã huỷ";
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
					request.status === "quoted" &&
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
										name={getRequestTypeIcon(request.type)}
										size={18}
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

							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(request.status) +
											"20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												request.status
											),
										},
									]}
								>
									{getStatusText(request.status)}
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

				{/* Request History - Show only view details button */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.historyViewButton}
						onPress={() =>
							navigation.navigate("RequestHistory", { request })
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
							requestDetails.deliveryAddress?.recipientName
						}
						phone={requestDetails.deliveryAddress?.phone}
						address={requestDetails.deliveryAddress?.address}
						isDefault={requestDetails.deliveryAddress?.isDefault}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={false}
						showEditButton={false}
					/>
				</View>

				{/* Store Information - Show only for without_link requests */}
				{request.type === "without_link" &&
					requestDetails.storeData && (
						<View style={styles.section}>
							<StoreCard
								storeName={requestDetails.storeData.storeName}
								storeAddress={
									requestDetails.storeData.storeAddress
								}
								phoneNumber={
									requestDetails.storeData.phoneNumber
								}
								email={requestDetails.storeData.email}
								shopLink={requestDetails.storeData.shopLink}
								mode="manual"
								showEditButton={false}
							/>
						</View>
					)}

				{/* Product List */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm ({requestDetails.products.length}{" "}
							sản phẩm)
						</Text>
					</View>

					{requestDetails.products.map((product, index) => (
						<ProductCard
							key={product.id || index}
							id={product.id || index.toString()}
							name={product.name || "Sản phẩm không tên"}
							description={product.description}
							images={product.images}
							price={
								product.mode === "manual" ||
								request.status === "processing"
									? ""
									: product.price || ""
							}
							convertedPrice={
								product.mode === "manual" ||
								request.status === "processing"
									? ""
									: product.convertedPrice
							}
							exchangeRate={
								product.mode === "manual" ||
								request.status === "processing"
									? undefined
									: product.exchangeRate
							}
							category={product.category}
							brand={product.brand}
							material={product.material}
							size={product.size}
							color={product.color}
							platform={product.platform}
							productLink={product.productLink}
							mode={product.mode}
							sellerInfo={product.sellerInfo}
							status="pending"
							showEditButton={false}
						/>
					))}

					{/* Divider */}
					<View style={styles.divider} />
				</View>

				{/* Note Section */}
				{requestDetails.note && (
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
							<View style={styles.noteHeaderRight}>
								<Ionicons
									name={
										isNoteExpanded
											? "chevron-up-outline"
											: "chevron-down-outline"
									}
									size={22}
									color="#1976D2"
								/>
							</View>
						</TouchableOpacity>

						{isNoteExpanded && (
							<View style={styles.noteContainer}>
								<Text style={styles.noteText}>
									{requestDetails.note}
								</Text>
							</View>
						)}
					</View>
				)}

				{/* Quotation Card - Show only for quoted or confirmed requests */}
				{(request.status === "quoted" ||
					request.status === "confirmed") && (
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
				{request.status === "quoted" && (
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
			{request.status === "quoted" && (
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
									request,
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
});
