import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Alert,
	Clipboard,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function OrderDetails({ navigation, route }) {
	// Get order data from route params or use mock data
	const routeOrderData = route?.params?.orderData;

	// State for price breakdown
	const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

	// Mock data - replace with real API data
	const [orderData] = useState(
		routeOrderData || {
			id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
			requestType: "ONLINE",
			seller: "Apple Store",
			platform: "Amazon",
			productName: "iPhone 15 Pro Max 256GB - Natural Titanium",
			productImage: "https://example.com/iphone.jpg",
			quantity: 1,
			totalPrice: 35000000,
			status: "DELIVERED",
			createdAt: "2024-01-15T08:30:00Z",
			currency: "VND",
			trackingCode: "VN123456789",
			shippingUnit: "Giao Hàng Nhanh",
			paymentMethod: "Ví GShop",
			deliveryAddress: {
				recipientName: "Nguyễn Văn A",
				phone: "0901234567",
				address: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
				isDefault: true,
			},
			latestStatus: {
				title: "Đã giao hàng thành công",
				date: "2024-01-20T14:30:00Z",
			},
			priceBreakdown: {
				productPrice: 32000000,
				shippingFee: 500000,
				serviceFee: 800000,
				discount: 0,
				tax: 1700000,
				total: 35000000,
			},
		}
	);

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
		} catch {
			return dateString;
		}
	};

	// Get status color and text
	const getStatusColor = (status) => {
		switch (status) {
			case "ORDER_REQUESTED":
				return "#007bff";
			case "PURCHASED":
				return "#17a2b8";
			case "IN_TRANSIT":
				return "#6610f2";
			case "ARRIVED_IN_DESTINATION":
				return "#fd7e14";
			case "DELIVERED":
				return "#28a745";
			case "CANCELED":
				return "#dc3545";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "ORDER_REQUESTED":
				return "Đã đặt hàng";
			case "PURCHASED":
				return "Đã thanh toán";
			case "IN_TRANSIT":
				return "Đang vận chuyển";
			case "ARRIVED_IN_DESTINATION":
				return "Đã đến nơi";
			case "DELIVERED":
				return "Đã giao hàng";
			case "CANCELED":
				return "Đã hủy";
			default:
				return "Không xác định";
		}
	};

	// Format currency
	const formatCurrency = (amount, currency = "VND") => {
		if (currency === "VND") {
			return `${amount.toLocaleString("vi-VN")} VND`;
		}
		return `${amount.toLocaleString("vi-VN")} ${currency}`;
	};

	// Copy order ID to clipboard
	const copyOrderId = () => {
		Clipboard.setString(orderData.id);
		Alert.alert("Thành công", "Đã sao chép mã đơn hàng");
	};

	// Navigation handlers
	const handleOrderHistory = () => {
		navigation.navigate("OrderHistory", { orderId: orderData.id });
	};

	const handleReturnRefund = () => {
		Alert.alert("Thông báo", "Tính năng đang phát triển");
	};

	const handleContactGShop = () => {
		Alert.alert("Thông báo", "Tính năng đang phát triển");
	};

	const handleSupportCenter = () => {
		Alert.alert("Thông báo", "Tính năng đang phát triển");
	};

	const handleReview = () => {
		navigation.navigate("FeedbackDetails", { orderData });
	};

	const handleEditAddress = () => {
		Alert.alert("Thông báo", "Tính năng đang phát triển");
	};

	const togglePriceBreakdown = () => {
		setShowPriceBreakdown(!showPriceBreakdown);
	};

	const handleBackPress = () => {
		navigation.goBack();
	};

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

						<View style={styles.shippingInfo}>
							<Text style={styles.shippingLabel}>
								Đơn vị vận chuyển:
							</Text>
							<Text style={styles.shippingValue}>
								{orderData.shippingUnit}
							</Text>
						</View>

						<View style={styles.shippingInfo}>
							<Text style={styles.shippingLabel}>
								Mã vận đơn:
							</Text>
							<Text style={styles.shippingValue}>
								{orderData.trackingCode}
							</Text>
						</View>

						{/* Latest Status */}
						<View style={styles.latestStatus}>
							<Text style={styles.latestStatusTitle}>
								{orderData.latestStatus.title}
							</Text>
							<Text style={styles.latestStatusDate}>
								{formatDate(orderData.latestStatus.date)}
							</Text>
						</View>
					</View>

					{/* Delivery Address Section */}
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
				</View>

				{/* Product Info Card */}
				<View style={styles.productCard}>
					<Text style={styles.cardTitle}>Thông tin sản phẩm</Text>

					<View style={styles.productSection}>
						<View style={styles.productImageContainer}>
							{orderData.productImage ? (
								<Image
									source={{ uri: orderData.productImage }}
									style={styles.productImage}
									resizeMode="cover"
								/>
							) : (
								<View style={styles.placeholderImage}>
									<Ionicons
										name="image-outline"
										size={32}
										color="#ccc"
									/>
								</View>
							)}
						</View>

						<View style={styles.productInfo}>
							<Text style={styles.productName} numberOfLines={2}>
								{orderData.productName}
							</Text>

							<View style={styles.productDetails}>
								<Text style={styles.quantityText}>
									Số lượng: x{orderData.quantity}
								</Text>
								<TouchableOpacity
									style={styles.priceContainer}
									onPress={togglePriceBreakdown}
								>
									<Text style={styles.priceText}>
										{formatCurrency(
											orderData.totalPrice,
											orderData.currency
										)}
									</Text>
									<Ionicons
										name={
											showPriceBreakdown
												? "chevron-up"
												: "chevron-down"
										}
										size={16}
										color="#dc3545"
										style={styles.priceChevron}
									/>
								</TouchableOpacity>
							</View>

							{/* Price Breakdown */}
							{showPriceBreakdown && orderData.priceBreakdown && (
								<View style={styles.priceBreakdownContainer}>
									<View style={styles.breakdownItem}>
										<Text style={styles.breakdownLabel}>
											Giá sản phẩm
										</Text>
										<Text style={styles.breakdownValue}>
											{formatCurrency(
												orderData.priceBreakdown
													.productPrice,
												orderData.currency
											)}
										</Text>
									</View>

									<View style={styles.breakdownItem}>
										<Text style={styles.breakdownLabel}>
											Phí vận chuyển
										</Text>
										<Text style={styles.breakdownValue}>
											{formatCurrency(
												orderData.priceBreakdown
													.shippingFee,
												orderData.currency
											)}
										</Text>
									</View>

									<View style={styles.breakdownItem}>
										<Text style={styles.breakdownLabel}>
											Phí dịch vụ
										</Text>
										<Text style={styles.breakdownValue}>
											{formatCurrency(
												orderData.priceBreakdown
													.serviceFee,
												orderData.currency
											)}
										</Text>
									</View>

									{orderData.priceBreakdown.discount > 0 && (
										<View style={styles.breakdownItem}>
											<Text style={styles.breakdownLabel}>
												Giảm giá
											</Text>
											<Text
												style={[
													styles.breakdownValue,
													styles.discountText,
												]}
											>
												-
												{formatCurrency(
													orderData.priceBreakdown
														.discount,
													orderData.currency
												)}
											</Text>
										</View>
									)}

									<View style={styles.breakdownItem}>
										<Text style={styles.breakdownLabel}>
											Thuế & phí
										</Text>
										<Text style={styles.breakdownValue}>
											{formatCurrency(
												orderData.priceBreakdown.tax,
												orderData.currency
											)}
										</Text>
									</View>

									<View
										style={[
											styles.breakdownItem,
											styles.totalBreakdown,
										]}
									>
										<Text
											style={styles.totalBreakdownLabel}
										>
											Tổng cộng
										</Text>
										<Text
											style={styles.totalBreakdownValue}
										>
											{formatCurrency(
												orderData.priceBreakdown.total,
												orderData.currency
											)}
										</Text>
									</View>
								</View>
							)}
						</View>
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
							onPress={copyOrderId}
						>
							<Text style={styles.orderIdText}>
								{getShortId(orderData.id)}
							</Text>
							<Ionicons
								name="copy-outline"
								size={16}
								color="#007bff"
							/>
						</TouchableOpacity>
					</View>

					{/* Payment Method */}
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>
							Phương thức thanh toán
						</Text>
						<Text style={styles.detailValue}>
							{orderData.paymentMethod}
						</Text>
					</View>
				</View>

				{/* Review Button (only for completed orders) */}
				{orderData.status === "DELIVERED" && (
					<TouchableOpacity
						style={styles.reviewButton}
						onPress={handleReview}
					>
						<Ionicons name="star-outline" size={20} color="#fff" />
						<Text style={styles.reviewButtonText}>
							Đánh giá sản phẩm
						</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
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
	productCard: {
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
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 16,
	},
	productSection: {
		flexDirection: "row",
	},
	productImageContainer: {
		width: 80,
		height: 80,
		borderRadius: 8,
		overflow: "hidden",
		marginRight: 16,
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
		justifyContent: "space-between",
	},
	productName: {
		fontSize: 16,
		color: "#212529",
		fontWeight: "600",
		lineHeight: 22,
		marginBottom: 12,
	},
	productDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	quantityText: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	priceText: {
		fontSize: 18,
		color: "#dc3545",
		fontWeight: "700",
	},
	priceChevron: {
		marginLeft: 4,
	},
	priceBreakdownContainer: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	breakdownItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
	},
	breakdownLabel: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	breakdownValue: {
		fontSize: 14,
		color: "#212529",
		fontWeight: "600",
	},
	discountText: {
		color: "#28a745",
	},
	totalBreakdown: {
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	totalBreakdownLabel: {
		fontSize: 16,
		color: "#212529",
		fontWeight: "700",
	},
	totalBreakdownValue: {
		fontSize: 18,
		color: "#dc3545",
		fontWeight: "700",
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
	reviewButton: {
		backgroundColor: "#ffc107",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
		gap: 8,
		marginBottom: 16,
	},
	reviewButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
});
