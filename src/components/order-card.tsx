import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface OrderCardProps {
	order: {
		id: string;
		seller?: string;
		ecommercePlatform?: string;
		status: string;
		totalPrice: number;
		shippingFee?: number;
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
}

export default function OrderCard({
	order,
	onPress,
	onCancel,
	onReview,
}: OrderCardProps) {
	// Get display title (store name or seller)
	const getDisplayTitle = () => {
		if (order.seller && order.ecommercePlatform) {
			return `${order.seller} (${order.ecommercePlatform})`;
		} else if (order.seller) {
			return order.seller;
		} else if (order.ecommercePlatform) {
			return order.ecommercePlatform;
		}
		return "Cửa hàng online";
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ORDER_REQUESTED":
				return "#007bff";
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

	const getStatusText = (status: string) => {
		switch (status) {
			case "ORDER_REQUESTED":
				return "Đang đặt hàng";
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

	// Format currency without decimals
	const formatCurrency = (amount: number) => {
		return `${Math.round(amount).toLocaleString("vi-VN")} VND`;
	};

	// Check if can cancel (only ORDER_REQUESTED status since we removed PURCHASED)
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
				{/* Product Image */}
				<View style={styles.productImageContainer}>
					{order.orderItems?.[0]?.images?.[0] ? (
						<Image
							source={{ uri: order.orderItems[0].images[0] }}
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
						{order.orderItems?.[0]?.productName ||
							"Tên sản phẩm không có"}
					</Text>

					{/* Product Variants Info */}
					{order.orderItems?.[0]?.variants &&
						order.orderItems[0].variants.length > 0 && (
							<View style={styles.variantsContainer}>
								{order.orderItems[0].variants.map(
									(variant, index) => (
										<View
											key={index}
											style={styles.variantBadge}
										>
											<Text style={styles.variantText}>
												{variant}
											</Text>
										</View>
									)
								)}
							</View>
						)}

					<View style={styles.quantityRow}>
						<Text style={styles.quantityLabel}>Số lượng:</Text>
						<Text style={styles.quantityValue}>
							x{order.orderItems?.[0]?.quantity || 0}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.totalPrice}>
							{formatCurrency(order.totalPrice)}
						</Text>
					</View>
				</View>
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
							<Ionicons
								name="star-outline"
								size={16}
								color="#ffc107"
							/>
							<Text style={styles.reviewButtonText}>
								Đánh giá
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
		flexDirection: "row",
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
		justifyContent: "space-between",
	},
	productName: {
		fontSize: 15,
		color: "#212529",
		fontWeight: "600",
		lineHeight: 20,
		marginBottom: 8,
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
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
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
});
