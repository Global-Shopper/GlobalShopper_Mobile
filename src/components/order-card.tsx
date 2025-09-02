import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { getStatusColor, getStatusText } from "../utils/statusHandler";
import { Text } from "./ui/text";

// Helper function to extract store name from contactInfo
const getStoreNameFromContactInfo = (contactInfo: any[]) => {
	if (!contactInfo || !Array.isArray(contactInfo)) return null;

	// Try different possible formats for store name
	const possiblePrefixes = [
		"Tên cửa hàng:",
		"Store name:",
		"Store Name:",
		"STORE_NAME:",
		"Cửa hàng:",
		"Shop name:",
		"Shop Name:",
	];

	for (const prefix of possiblePrefixes) {
		const storeNameEntry = contactInfo.find(
			(info) => typeof info === "string" && info.startsWith(prefix)
		);

		if (storeNameEntry) {
			const storeName = storeNameEntry.replace(prefix, "").trim();
			if (storeName) {
				return storeName;
			}
		}
	}

	// If no prefixed entry found, look for any entry that might be a store name
	// Skip entries that look like contact details (phone, email, address)
	const potentialStoreName = contactInfo.find((info) => {
		if (typeof info !== "string") return false;

		// Skip if it looks like contact info
		if (
			info.includes("@") || // Email
			info.includes("+") || // Phone
			info.includes("địa chỉ") || // Address
			info.includes("phone") ||
			info.includes("email") ||
			info.includes("address") ||
			info.length > 50
		) {
			// Too long to be store name
			return false;
		}

		return info.length > 2; // At least 3 characters
	});

	return potentialStoreName || null;
};

interface OrderCardProps {
	order: {
		id: string;
		seller?: string;
		ecommercePlatform?: string;
		status: string;
		totalPrice: number;
		shippingFee?: number;
		contactInfo?: string[];
		requestType?: string;
		orderItems?: {
			id: string;
			productName: string;
			images?: string[];
			quantity: number;
			basePrice: number;
			currency: string;
			totalVNDPrice: number;
			variants?: string[];
		}[];
		createdAt: number;
	};
	onPress?: () => void;
	onCancel?: () => void;
	onReview?: () => void;
	hasFeedback?: boolean; // To determine if feedback exists
}

export default function OrderCard({
	order,
	onPress,
	onCancel,
	onReview,
	hasFeedback = false,
}: OrderCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	// Get display title (store name or seller)
	const getDisplayTitle = () => {
		// Debug logging to see full order structure for orders with contactInfo
		if (order.contactInfo && Array.isArray(order.contactInfo)) {
			console.log("🏪 OrderCard - Order with contactInfo:", {
				id: order.id,
				seller: order.seller,
				ecommercePlatform: order.ecommercePlatform,
				contactInfo: order.contactInfo,
				requestType: order.requestType,
			});
		}

		// Try to get store name from contactInfo if it exists (regardless of requestType)
		if (order.contactInfo && Array.isArray(order.contactInfo)) {
			const storeName = getStoreNameFromContactInfo(order.contactInfo);

			if (storeName) {
				return storeName;
			}
		}

		// Fallback to existing logic for online requests or when no store name found
		if (order.seller && order.ecommercePlatform) {
			return `${order.seller} (${order.ecommercePlatform})`;
		} else if (order.seller) {
			return order.seller;
		} else if (order.ecommercePlatform) {
			return order.ecommercePlatform;
		}

		// Better fallback based on request type or presence of contactInfo
		if (
			order.requestType?.toLowerCase() === "offline" ||
			(order.contactInfo &&
				Array.isArray(order.contactInfo) &&
				order.contactInfo.length > 0)
		) {
			return "Cửa hàng offline";
		} else {
			return "Cửa hàng online";
		}
	};

	// Format date from timestamp to Vietnamese format: dd/mm/yyyy hh:mm
	const formatDate = (timestamp: number) => {
		if (!timestamp) return "N/A";

		try {
			const date = new Date(timestamp);
			const day = date.getDate().toString().padStart(2, "0");
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const year = date.getFullYear();
			const hours = date.getHours().toString().padStart(2, "0");
			const minutes = date.getMinutes().toString().padStart(2, "0");

			return `${day}/${month}/${year} ${hours}:${minutes}`;
		} catch {
			return "N/A";
		}
	};

	// Format currency without decimals
	const formatCurrency = (amount: number) => {
		return `${Math.round(amount).toLocaleString("vi-VN")} VNĐ`;
	};

	// Get total quantity of all products
	const getTotalQuantity = () => {
		if (!order.orderItems) return 0;
		return order.orderItems.reduce(
			(total, item) => total + (item.quantity || 0),
			0
		);
	}; // Check if can cancel (only ORDER_REQUESTED status since we removed PURCHASED)
	const canCancel = order.status === "ORDER_REQUESTED";

	// Check if can review (DELIVERED status)
	const canReview = order.status === "DELIVERED";

	return (
		<TouchableOpacity style={styles.orderCard} onPress={onPress}>
			{/* Header Section */}
			<View style={styles.cardHeader}>
				<View style={styles.leftSection}>
					<Text style={styles.orderId} numberOfLines={2}>
						{getDisplayTitle()}
					</Text>
					<Text style={styles.createdDate}>
						{formatDate(order.createdAt)}
					</Text>
				</View>

				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor:
								getStatusColor(order.status) + "20",
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{
								color: getStatusColor(order.status),
							},
						]}
					>
						{getStatusText(order.status)}
					</Text>
				</View>
			</View>

			{/* Product Section */}
			<View style={styles.productSection}>
				{/* First product always shows */}
				{order.orderItems && order.orderItems.length > 0 && (
					<View style={styles.productRow}>
						{/* Product Image */}
						<View style={styles.productImageContainer}>
							{order.orderItems[0].images?.[0] ? (
								<Image
									source={{
										uri: order.orderItems[0].images[0],
									}}
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
							<Text style={styles.productName} numberOfLines={2}>
								{order.orderItems[0].productName ||
									"Tên sản phẩm không có"}
							</Text>
							<View style={styles.productQuantityContainer}>
								<Text style={styles.quantityValue}>
									x{order.orderItems[0].quantity || 0}
								</Text>
							</View>
						</View>
					</View>
				)}

				{/* Additional products when expanded */}
				{isExpanded &&
					order.orderItems &&
					order.orderItems.length > 1 && (
						<View>
							{order.orderItems.slice(1).map((item, index) => (
								<View
									key={item.id || index}
									style={styles.productRow}
								>
									{/* Product Image */}
									<View style={styles.productImageContainer}>
										{item.images?.[0] ? (
											<Image
												source={{ uri: item.images[0] }}
												style={styles.productImage}
												resizeMode="cover"
											/>
										) : (
											<View
												style={styles.placeholderImage}
											>
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
										<View
											style={
												styles.productQuantityContainer
											}
										>
											<Text style={styles.quantityValue}>
												x{item.quantity || 0}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					)}
			</View>

			{/* Show more button if there are more products */}
			{order.orderItems && order.orderItems.length > 1 && (
				<TouchableOpacity
					style={styles.showMoreButton}
					onPress={() => setIsExpanded(!isExpanded)}
				>
					<Text style={styles.showMoreText}>
						{isExpanded ? "Thu gọn" : "Xem thêm"}
					</Text>
					<Ionicons
						name={isExpanded ? "chevron-up" : "chevron-down"}
						size={16}
						color="#1976D2"
					/>
				</TouchableOpacity>
			)}

			{/* Total Summary */}
			<View style={styles.totalSummary}>
				<Text style={styles.totalSummaryText}>
					<Text style={styles.totalLabelText}>
						Tổng số tiền ({getTotalQuantity()} sản phẩm):{" "}
					</Text>
					<Text style={styles.totalPriceText}>
						{formatCurrency(
							order.totalPrice + (order.shippingFee || 0)
						)}
					</Text>
				</Text>
			</View>

			{/* Actions Section */}
			{(canCancel || canReview) && (
				<View style={styles.actionsSection}>
					{canCancel && onCancel && (
						<TouchableOpacity
							style={[styles.actionButton, styles.cancelButton]}
							onPress={() => onCancel()}
						>
							<Ionicons
								name="close-circle-outline"
								size={16}
								color="#dc3545"
							/>
							<Text style={styles.cancelButtonText}>Hủy đơn</Text>
						</TouchableOpacity>
					)}

					{canReview && onReview && (
						<TouchableOpacity
							style={[styles.actionButton, styles.reviewButton]}
							onPress={() => onReview()}
						>
							<Text style={styles.reviewButtonText}>
								{hasFeedback ? "Xem đánh giá" : "Đánh giá"}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	orderCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
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
		flex: 1,
	},
	orderId: {
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
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
	productSection: {
		marginBottom: 12,
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
		paddingVertical: 2,
		justifyContent: "space-between",
	},
	productName: {
		fontSize: 15,
		color: "#212529",
		fontWeight: "600",
		lineHeight: 20,
	},
	storeInfoRow: {
		marginBottom: 6,
	},
	storeInfoText: {
		fontSize: 12,
		color: "#6c757d",
		marginBottom: 2,
	},
	variantsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 6,
		gap: 6,
	},
	variantBadge: {
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#42A5F5",
	},
	variantText: {
		fontSize: 11,
		color: "#1976d2",
		fontWeight: "500",
	},
	quantityRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	quantityLabel: {
		fontSize: 13,
		color: "#6c757d",
		fontWeight: "500",
	},
	quantityValue: {
		fontSize: 13,
		color: "#495057",
		fontWeight: "600",
	},
	priceRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	totalPrice: {
		fontSize: 16,
		color: "#dc3545",
		fontWeight: "700",
	},
	actionsSection: {
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingTop: 8,
		gap: 12,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
	},
	cancelButton: {
		backgroundColor: "#fff5f5",
		borderColor: "#dc3545",
	},
	cancelButtonText: {
		color: "#dc3545",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
	reviewButton: {
		backgroundColor: "#fffbf0",
		borderColor: "#ffc107",
	},
	reviewButtonText: {
		color: "#ffc107",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
	productRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		marginBottom: 8,
	},
	additionalProduct: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	productPrice: {
		fontSize: 14,
		color: "#dc3545",
		fontWeight: "600",
		marginLeft: "auto",
	},
	showMoreButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 1,
		marginTop: 1,
		marginBottom: 1,
	},
	showMoreText: {
		fontSize: 13,
		color: "#1976d2",
		fontWeight: "500",
	},
	totalSummary: {
		paddingTop: 8,
		alignItems: "flex-end",
	},
	totalSummaryText: {
		fontSize: 15,
		color: "#dc3545",
		fontWeight: "700",
	},
	additionalProductsList: {
		paddingLeft: 16,
		marginTop: 8,
	},
	simpleProductName: {
		fontSize: 14,
		color: "#495057",
		marginBottom: 4,
		lineHeight: 20,
	},
	productNameRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	productQuantityRow: {
		paddingLeft: 16,
	},
	productQuantityContainer: {
		alignItems: "flex-end",
		marginTop: 4,
	},
	totalLabelText: {
		fontSize: 15,
		color: "#212529",
		fontWeight: "600",
	},
	totalPriceText: {
		fontSize: 15,
		color: "#dc3545",
		fontWeight: "700",
	},
});
