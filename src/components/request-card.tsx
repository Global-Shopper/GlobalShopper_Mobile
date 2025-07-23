import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface RequestCardProps {
	request: {
		id: number;
		code: string;
		productCount: number;
		status:
			| "sent"
			| "checking"
			| "quoted"
			| "confirmed"
			| "cancelled"
			| "insufficient";
		date: number;
		createdAt: string;
		requestType: "ONLINE" | "OFFLINE";
		requestItems: {
			productName?: string;
			name?: string;
			[key: string]: any;
		}[];
		contactInfo?: string[];
		subRequests?: {
			contactInfo?: string[];
			requestItems?: {
				quantity?: number | string;
				[key: string]: any;
			}[];
			[key: string]: any;
		}[];
	};
	onPress?: () => void;
	onCancel?: () => void;
}

export default function RequestCard({
	request,
	onPress,
	onCancel,
}: RequestCardProps) {
	const getRequestTitle = (request: any) => {
		console.log("=== REQUEST TITLE DEBUG ===");
		console.log("Request Type:", request.requestType);
		console.log("Request contactInfo:", request.contactInfo);
		console.log("Request requestItems:", request.requestItems);

		// Nếu là request ONLINE (có link), hiển thị ID
		if (request.requestType === "ONLINE") {
			console.log("Using ONLINE logic - showing ID");
			return `#${request.id || request.code || "N/A"}`;
		}

		// Nếu là request OFFLINE từ subRequests nếu requestItems rỗng
		if (request.requestType !== "ONLINE") {
			console.log(
				"Using OFFLINE/NON-ONLINE logic - checking subRequests and sub-request contactInfo"
			);

			let storeName = null;
			let quantity = 0;

			//lấy từ subRequests nếu có
			if (
				Array.isArray(request.subRequests) &&
				request.subRequests.length > 0
			) {
				const firstSub = request.subRequests[0];
				if (
					firstSub &&
					Array.isArray(firstSub.contactInfo) &&
					firstSub.contactInfo.length > 0
				) {
					const storeNameInfo = firstSub.contactInfo.find(
						(info: string) =>
							info.includes("Tên cửa hàng:") ||
							info.includes("Store name:") ||
							info.includes("Shop name:") ||
							info.includes("Cửa hàng:") ||
							info.includes("Tên shop:")
					);
					if (storeNameInfo) {
						storeName = storeNameInfo
							.replace("Tên cửa hàng:", "")
							.replace("Store name:", "")
							.replace("Shop name:", "")
							.replace("Cửa hàng:", "")
							.replace("Tên shop:", "")
							.trim();
						console.log(
							"Found store name in subRequests[0]:",
							storeName
						);
					} else {
						storeName = firstSub.contactInfo[0];
						console.log(
							"No store name pattern found in subRequests[0], using first contactInfo:",
							storeName
						);
					}
				}
				// Lấy quantity từ requestItems
				if (
					Array.isArray(firstSub.requestItems) &&
					firstSub.requestItems.length > 0
				) {
					const firstProduct = firstSub.requestItems[0];
					quantity = parseInt(firstProduct.quantity) || 0;
					console.log(
						"Quantity from subRequests[0].requestItems[0]:",
						quantity
					);
				}
			}

			// Nếu không có subRequests
			if (
				!storeName &&
				request.contactInfo &&
				request.contactInfo.length > 0
			) {
				const storeNameInfo = request.contactInfo.find(
					(info: string) =>
						info.includes("Tên cửa hàng:") ||
						info.includes("Store name:") ||
						info.includes("Shop name:") ||
						info.includes("Cửa hàng:") ||
						info.includes("Tên shop:")
				);
				if (storeNameInfo) {
					storeName = storeNameInfo
						.replace("Tên cửa hàng:", "")
						.replace("Store name:", "")
						.replace("Shop name:", "")
						.replace("Cửa hàng:", "")
						.replace("Tên shop:", "")
						.trim();
					console.log(
						"Found store name in main contactInfo:",
						storeName
					);
				} else {
					storeName = request.contactInfo[0];
					console.log(
						"No store name pattern found in main contactInfo, using first contactInfo:",
						storeName
					);
				}
			}

			if (
				!storeName &&
				request.requestItems &&
				request.requestItems.length > 0
			) {
				const firstItem = request.requestItems[0];
				if (firstItem.storeName) {
					storeName = firstItem.storeName;
					console.log("Using storeName from item:", storeName);
				} else if (firstItem.shopName) {
					storeName = firstItem.shopName;
					console.log("Using shopName from item:", storeName);
				}
			}

			if (!storeName) {
				storeName = "Cửa hàng không xác định";
				console.log("Using fallback: Cửa hàng không xác định");
			}

			return storeName;
		}

		// Default fallback
		console.log("Using default fallback - showing ID");
		return `#${request.id || request.code || "N/A"}`;
	};

	const getStatusColor = (status: string) => {
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
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status: string) => {
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
			default:
				return "Không xác định";
		}
	};

	const getRequestTypeIcon = (type: string) => {
		return type === "with_link" ? "link-outline" : "create-outline";
	};

	const getRequestTypeBorderColor = (type: string) => {
		return type === "with_link" ? "#42A5F5" : "#28a745";
	};

	return (
		<TouchableOpacity
			style={[
				styles.requestCard,
				{
					borderLeftWidth: 4,
					borderLeftColor: getRequestTypeBorderColor(
						request.requestType
					),
				},
			]}
			onPress={onPress}
		>
			{/* Header Section */}
			<View style={styles.cardHeader}>
				<View style={styles.leftSection}>
					<View style={styles.requestTypeContainer}>
						<Ionicons
							name={getRequestTypeIcon(request.requestType)}
							size={18}
							color={getRequestTypeBorderColor(
								request.requestType
							)}
						/>
					</View>

					<View style={styles.requestInfo}>
						<Text style={styles.requestCode}>
							{getRequestTitle(request)}
						</Text>
						<Text style={styles.createdDate}>
							{new Date(
								Number(request.createdAt)
							).toLocaleDateString("vi-VN")}{" "}
							-{" "}
							{new Date(
								Number(request.createdAt)
							).toLocaleTimeString(["vi-VN"], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				</View>

				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor:
								getStatusColor(request.status) + "20",
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{
								color: getStatusColor(request.status),
							},
						]}
					>
						{getStatusText(request.status)}
					</Text>
				</View>
			</View>

			{/* Product Count Section */}
			<View style={styles.productSection}>
				<View style={styles.productCountContainer}>
					<Ionicons name="cube-outline" size={20} color="#6c757d" />
					<Text style={styles.productCountLabel}>
						Số lượng sản phẩm:
					</Text>
					<Text style={styles.productCountValue}>
						{(() => {
							// Tổng số lượng sản phẩm
							const sumQuantity = (items: any[] | undefined) => {
								if (!Array.isArray(items)) return 0;
								return items.reduce((total, item) => {
									const qty = parseInt(item.quantity) || 0;
									return total + qty;
								}, 0);
							};
							if (
								Array.isArray(request.requestItems) &&
								request.requestItems.length > 0
							) {
								return sumQuantity(request.requestItems);
							} else if (
								Array.isArray(request.subRequests) &&
								request.subRequests.length > 0
							) {
								const firstSub = request.subRequests[0];
								if (Array.isArray(firstSub.requestItems)) {
									return sumQuantity(firstSub.requestItems);
								}
							}
							return 0;
						})()}
					</Text>
				</View>
			</View>

			{/* Actions Section */}
			<View style={styles.requestActions}>
				<TouchableOpacity
					style={styles.viewDetailButton}
					onPress={onPress}
				>
					<Ionicons name="eye-outline" size={14} color="#007bff" />
					<Text style={styles.viewDetailText}>Chi tiết</Text>
				</TouchableOpacity>

				{onCancel && (
					<TouchableOpacity
						style={styles.cancelButton}
						onPress={onCancel}
					>
						<Ionicons
							name="close-circle-outline"
							size={14}
							color="#dc3545"
						/>
						<Text style={styles.cancelButtonText}>Hủy</Text>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
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
	productSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	productCountContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	productCountLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
		marginLeft: 6,
		flex: 1,
	},
	productCountValue: {
		fontSize: 17,
		fontWeight: "700",
		color: "#1976D2",
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 6,
		minWidth: 35,
		textAlign: "center",
	},
	requestActions: {
		flexDirection: "row",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		alignItems: "center",
		justifyContent: "space-between",
	},
	viewDetailButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#1976D2",
		flex: 1,
		marginRight: 6,
		justifyContent: "center",
	},
	viewDetailText: {
		color: "#1976D2",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
	cancelButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffebee",
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#dc3545",
	},
	cancelButtonText: {
		color: "#dc3545",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
});
