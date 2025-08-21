import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	Clipboard,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Dialog from "../../components/dialog";
import Header from "../../components/header";
import RefundHistorySection from "../../components/RefundHistorySection";
import { Text } from "../../components/ui/text";
import { useGetOrderByIdQuery } from "../../services/gshopApi";
import {
	formatDate,
	getStatusColor,
	getStatusText,
} from "../../utils/statusHandler.js";

export default function OrderDetails({ navigation, route }) {
	// Get order data from route params
	const routeOrderData = route?.params?.orderData;
	const orderId = routeOrderData?.id;

	// Dialog states
	const [showDialog, setShowDialog] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMessage, setDialogMessage] = useState("");
	const [showTotalDetails, setShowTotalDetails] = useState(false);

	// API query for order details
	const {
		data: orderData,
		isLoading,
		error,
		refetch,
	} = useGetOrderByIdQuery(orderId, {
		skip: !orderId, // Skip if no orderId
	});

	// Format order ID to show only first part before dash
	const getShortOrderId = (fullId) => {
		if (!fullId) return "N/A";
		if (typeof fullId === "string" && fullId.includes("-")) {
			return fullId.split("-")[0];
		}
		return fullId;
	};

	// Format currency without decimals
	const formatCurrency = (amount) => {
		return `${Math.round(amount).toLocaleString("vi-VN")} VNĐ`;
	};

	// Copy order ID to clipboard
	const copyToClipboard = () => {
		Clipboard.setString(orderData.id);
		showInfoDialog("Thành công", "Đã sao chép mã đơn hàng");
	};

	// Helper function to show dialog
	const showInfoDialog = (title, message) => {
		setDialogTitle(title);
		setDialogMessage(message);
		setShowDialog(true);
	}; // Navigation handlers
	const handleOrderHistory = () => {
		navigation.navigate("OrderHistory", { orderId: orderData.id });
	};

	const handleReturnRefund = () => {
		navigation.navigate("RequestRefund", { orderData });
	};

	const handleContactGShop = () => {
		showInfoDialog("Thông báo", "Tính năng đang phát triển");
	};

	const handleSupportCenter = () => {
		navigation.navigate("FAQScreen");
	};

	const handleReview = () => {
		// Nếu đã có feedback thì xem feedback, nếu chưa thì tạo feedback
		if (orderData.feedback || orderData.feedbacks?.length > 0) {
			navigation.navigate("FeedbackOrder", { orderData });
		} else {
			navigation.navigate("FeedbackDetails", { orderData });
		}
	};

	const handleEditAddress = () => {
		showInfoDialog("Thông báo", "Tính năng đang phát triển");
	};

	const handleBackPress = () => {
		navigation.goBack();
	};

	// Handle loading state
	if (isLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Thông tin đơn hàng"
					showBackButton
					onBackPress={handleBackPress}
					navigation={navigation}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1D4ED8" />
					<Text style={styles.loadingText}>
						Đang tải thông tin đơn hàng...
					</Text>
				</View>
			</View>
		);
	}

	// Handle error state
	if (error || !orderData) {
		return (
			<View style={styles.container}>
				<Header
					title="Thông tin đơn hàng"
					showBackButton
					onBackPress={handleBackPress}
					navigation={navigation}
				/>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>
						Không thể tải thông tin đơn hàng:{" "}
						{error?.message || "Đã xảy ra lỗi"}
					</Text>
					<TouchableOpacity
						onPress={refetch}
						style={styles.retryButton}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Thông tin đơn hàng"
				showBackButton
				onBackPress={handleBackPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Main Info Card */}
				<View style={styles.mainCard}>
					{/* Order Status Section */}
					<View style={styles.statusSection}>
						<View style={styles.statusHeader}>
							<Text style={styles.sectionTitle}>
								Trạng thái đơn hàng
							</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(orderData.status) +
											"20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												orderData.status
											),
										},
									]}
								>
									{getStatusText(orderData.status)}
								</Text>
							</View>
						</View>
					</View>

					{/* Shipping Info Section */}
					<View style={styles.shippingSection}>
						<TouchableOpacity
							style={styles.shippingHeader}
							onPress={handleOrderHistory}
						>
							<Text style={styles.sectionTitle}>
								Thông tin vận chuyển
							</Text>
							<Ionicons
								name="chevron-forward"
								size={20}
								color="#666"
							/>
						</TouchableOpacity>

						{orderData.shippingUnit && (
							<View style={styles.shippingInfo}>
								<Text style={styles.shippingLabel}>
									Đơn vị vận chuyển:
								</Text>
								<Text style={styles.shippingValue}>
									{orderData.shippingUnit}
								</Text>
							</View>
						)}

						{orderData.trackingCode && (
							<View style={styles.shippingInfo}>
								<Text style={styles.shippingLabel}>
									Mã vận đơn:
								</Text>
								<Text style={styles.shippingValue}>
									{orderData.trackingCode}
								</Text>
							</View>
						)}

						{/* Latest Status */}
						<View style={styles.latestStatus}>
							<Text style={styles.latestStatusTitle}>
								{getStatusText(orderData.status)}
							</Text>
							<Text style={styles.latestStatusDate}>
								{formatDate(orderData.createdAt)}
							</Text>
						</View>
					</View>

					{/* Delivery Address Section */}
					{orderData.deliveryAddress && (
						<View style={styles.addressSection}>
							<Text style={styles.sectionTitle}>
								Địa chỉ giao hàng
							</Text>
							<AddressSmCard
								recipientName={
									orderData.deliveryAddress.recipientName
								}
								phone={orderData.deliveryAddress.phone}
								address={orderData.deliveryAddress.address}
								isDefault={orderData.deliveryAddress.isDefault}
								onEdit={handleEditAddress}
								showEditButton={false}
							/>
						</View>
					)}
				</View>

				{/* Product Info Card */}
				<View style={styles.productCard}>
					<Text style={styles.cardTitle}>
						{orderData.seller && orderData.ecommercePlatform
							? `${orderData.seller} (${orderData.ecommercePlatform})`
							: orderData.seller ||
							  orderData.ecommercePlatform ||
							  "Thông tin sản phẩm"}
					</Text>

					{/* All Products */}
					{orderData.orderItems &&
						orderData.orderItems.length > 0 &&
						orderData.orderItems.map((item, index) => (
							<View
								key={item.id || index}
								style={styles.productRow}
							>
								{/* Product Image */}
								<View style={styles.productImageContainer}>
									{item.images && item.images.length > 0 ? (
										<Image
											source={{ uri: item.images[0] }}
											style={styles.productImage}
											resizeMode="cover"
										/>
									) : (
										<View style={styles.placeholderImage}>
											<Ionicons
												name="image-outline"
												size={24}
												color="#ccc"
											/>
										</View>
									)}
								</View>

								{/* Product Info */}
								<View style={styles.productInfo}>
									<Text
										style={styles.productName}
										numberOfLines={2}
									>
										{item.productName ||
											"Tên sản phẩm không có"}
									</Text>
									<View style={styles.productDetailsRow}>
										<Text style={styles.quantityText}>
											x{item.quantity || 1}
										</Text>
										<Text style={styles.productPrice}>
											{formatCurrency(
												item.totalVNDPrice ||
													item.basePrice *
														item.quantity
											)}
										</Text>
									</View>
								</View>
							</View>
						))}

					{/* Total Summary with Expandable Details */}
					<View style={styles.totalSummarySection}>
						<TouchableOpacity
							style={styles.totalSummaryHeader}
							onPress={() =>
								setShowTotalDetails(!showTotalDetails)
							}
						>
							<View style={styles.totalTextContainer}>
								<Text style={styles.totalLabel}>
									Tổng tiền:{" "}
								</Text>
								<Text style={styles.totalAmount}>
									{formatCurrency(
										orderData.totalPrice +
											(orderData.shippingFee || 0)
									)}
								</Text>
							</View>
							<Ionicons
								name={
									showTotalDetails
										? "chevron-up"
										: "chevron-down"
								}
								size={20}
								color="#1976D2"
							/>
						</TouchableOpacity>

						{showTotalDetails && (
							<View style={styles.totalDetails}>
								<View style={styles.totalDetailRow}>
									<Text style={styles.totalDetailLabel}>
										Tổng sản phẩm:
									</Text>
									<Text style={styles.totalDetailValue}>
										{formatCurrency(orderData.totalPrice)}
									</Text>
								</View>
								<View style={styles.totalDetailRow}>
									<Text style={styles.totalDetailLabel}>
										Phí vận chuyển:
									</Text>
									<Text style={styles.totalDetailValue}>
										{formatCurrency(
											orderData.shippingFee || 0
										)}
									</Text>
								</View>
							</View>
						)}
					</View>
				</View>

				{/* Support Section */}
				<View style={styles.supportCard}>
					<Text style={styles.cardTitle}>Bạn cần hỗ trợ?</Text>

					<TouchableOpacity
						style={styles.supportItem}
						onPress={handleReturnRefund}
					>
						<Ionicons
							name="return-down-back-outline"
							size={20}
							color="#dc3545"
						/>
						<Text style={styles.supportText}>
							Gửi yêu cầu trả hàng/hoàn tiền
						</Text>
						<Ionicons
							name="chevron-forward"
							size={16}
							color="#666"
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.supportItem}
						onPress={handleContactGShop}
					>
						<Ionicons
							name="chatbubble-outline"
							size={20}
							color="#007bff"
						/>
						<Text style={styles.supportText}>Liên hệ GShop</Text>
						<Ionicons
							name="chevron-forward"
							size={16}
							color="#666"
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.supportItem}
						onPress={handleSupportCenter}
					>
						<Ionicons
							name="help-circle-outline"
							size={20}
							color="#28a745"
						/>
						<Text style={styles.supportText}>Trung tâm hỗ trợ</Text>
						<Ionicons
							name="chevron-forward"
							size={16}
							color="#666"
						/>
					</TouchableOpacity>
				</View>

				{/* Order Details Card */}
				<View style={styles.detailsCard}>
					{/* Order ID */}
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Mã đơn hàng</Text>
						<TouchableOpacity
							style={styles.copyButton}
							onPress={copyToClipboard}
						>
							<Text style={styles.orderIdText}>
								{getShortOrderId(orderData.id)}
							</Text>
							<Ionicons
								name="copy-outline"
								size={16}
								color="#007bff"
							/>
						</TouchableOpacity>
					</View>

					{/* Payment Method */}
					{orderData.paymentMethod && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>
								Phương thức thanh toán
							</Text>
							<Text style={styles.detailValue}>
								{orderData.paymentMethod}
							</Text>
						</View>
					)}
				</View>

				{/* Refund History Section */}
				<RefundHistorySection orderData={orderData} />
			</ScrollView>

			{/* Review Button (only for completed orders) - Fixed at bottom */}
			{orderData.status === "DELIVERED" && (
				<View style={styles.reviewButtonContainer}>
					<TouchableOpacity
						style={styles.reviewButton}
						onPress={handleReview}
					>
						<Text style={styles.reviewButtonText}>
							{orderData.feedback ||
							orderData.feedbacks?.length > 0
								? "Xem đánh giá"
								: "Đánh giá"}
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Dialog */}
			<Dialog
				visible={showDialog}
				title={dialogTitle}
				message={dialogMessage}
				onClose={() => setShowDialog(false)}
				primaryButton={{
					text: "OK",
					onPress: () => setShowDialog(false),
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#6b7280",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
	},
	errorText: {
		color: "#dc2626",
		textAlign: "center",
		fontSize: 16,
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: "#1d4ed8",
		paddingHorizontal: 24,
		paddingVertical: 8,
		borderRadius: 8,
	},
	retryButtonText: {
		color: "#ffffff",
		fontWeight: "500",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	mainCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	statusSection: {
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	statusHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	statusText: {
		fontSize: 13,
		fontWeight: "600",
	},
	shippingSection: {
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	shippingHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	shippingInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	shippingLabel: {
		fontSize: 14,
		color: "#6c757d",
	},
	shippingValue: {
		fontSize: 14,
		color: "#212529",
		fontWeight: "500",
	},
	latestStatus: {
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		marginTop: 8,
	},
	latestStatusTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#28a745",
		marginBottom: 4,
	},
	latestStatusDate: {
		fontSize: 12,
		color: "#6c757d",
	},
	addressSection: {
		marginBottom: 8,
	},
	supportCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	supportItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	supportText: {
		flex: 1,
		fontSize: 15,
		color: "#212529",
		marginLeft: 12,
		fontWeight: "500",
	},
	detailsCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	detailLabel: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	detailValue: {
		fontSize: 14,
		color: "#212529",
		fontWeight: "600",
	},
	copyButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	orderIdText: {
		fontSize: 14,
		color: "#007bff",
		fontWeight: "600",
	},
	reviewButtonContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
		paddingVertical: 22,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	reviewButton: {
		backgroundColor: "#42A5F5",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
		gap: 8,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3,
	},
	reviewButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	productCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#212529",
		marginBottom: 16,
	},
	productRow: {
		flexDirection: "row",
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	productImageContainer: {
		width: 60,
		height: 60,
		borderRadius: 8,
		overflow: "hidden",
		marginRight: 12,
	},
	productImage: {
		width: "100%",
		height: "100%",
	},
	placeholderImage: {
		width: "100%",
		height: "100%",
		backgroundColor: "#f8f9fa",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 8,
	},
	productDetailsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	quantityText: {
		fontSize: 13,
		color: "#6c757d",
		fontWeight: "600",
	},
	productPrice: {
		fontSize: 14,
		fontWeight: "700",
		color: "#dc3545",
	},
	totalSummarySection: {
		marginTop: 8,
	},
	totalSummaryHeader: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		gap: 8,
	},
	totalTextContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
	},
	totalAmount: {
		fontSize: 16,
		fontWeight: "700",
		color: "#dc3545",
	},
	totalDetails: {
		paddingTop: 8,
	},
	totalDetailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	totalDetailLabel: {
		fontSize: 14,
		color: "#6c757d",
	},
	totalDetailValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#212529",
	},
});
