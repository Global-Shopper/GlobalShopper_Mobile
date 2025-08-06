import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface OrderCardProps {
	order: {
		id: string;
		requestType: "ONLINE" | "OFFLINE";
		seller?: string;
		platform?: string;
		storeName?: string;
		productName: string;
		productImage?: string;
		quantity: number;
		totalPrice: number;
		status:
			| "ORDER_REQUESTED"
			| "PURCHASED"
			| "IN_TRANSIT"
			| "ARRIVED_IN_DESTINATION"
			| "DELIVERED"
			| "CANCELED";
		createdAt: string;
		currency?: string;
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
		if (order.requestType === "ONLINE") {
			// Online: "ABC Store (Amazon)"
			if (order.seller && order.platform) {
				return `${order.seller} (${order.platform})`;
			} else if (order.seller) {
				return order.seller;
			} else if (order.platform) {
				return order.platform;
			}
			return "Cửa hàng online";
		} else {
			// Offline: "Tên cửa hàng"
			return order.storeName || "Cửa hàng ngoại tuyến";
		}
	};

	// Format date to Vietnamese format: dd/mm/yyyy hh:mm
	const formatDate = (dateString: string) => {
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

	const getStatusColor = (status: string) => {
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

	const getStatusText = (status: string) => {
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
	const formatCurrency = (amount: number, currency: string = "VND") => {
		if (currency === "VND") {
			return `${amount.toLocaleString("vi-VN")} VND`;
		}
		return `${amount.toLocaleString("vi-VN")} ${currency}`;
	};

	// Check if can cancel (only PURCHASED status)
	const canCancel = order.status === "PURCHASED";

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
					{order.productImage ? (
						<Image
							source={{ uri: order.productImage }}
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
						{order.productName}
					</Text>

					<View style={styles.quantityRow}>
						<Text style={styles.quantityLabel}>Số lượng:</Text>
						<Text style={styles.quantityValue}>
							x{order.quantity}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.totalPrice}>
							{formatCurrency(order.totalPrice, order.currency)}
						</Text>
					</View>
				</View>
			</View>

			{/* Actions Section */}
			{(canCancel || canReview) && (
				<View style={styles.actionsSection}>
					{canCancel && (
						<TouchableOpacity
							style={[styles.actionButton, styles.cancelButton]}
							onPress={onCancel}
						>
							<Ionicons
								name="close-circle-outline"
								size={16}
								color="#dc3545"
							/>
							<Text style={styles.cancelButtonText}>Hủy đơn</Text>
						</TouchableOpacity>
					)}

					{canReview && (
						<TouchableOpacity
							style={[styles.actionButton, styles.reviewButton]}
							onPress={onReview}
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
