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

		// Nếu là request OFFLINE hoặc không phải ONLINE (không có link), hiển thị tên cửa hàng từ contact info trước
		if (request.requestType !== "ONLINE") {
			console.log(
				"Using OFFLINE/NON-ONLINE logic - checking contactInfo first"
			);

			// Ưu tiên 1: Lấy tên cửa hàng từ contactInfo trước
			if (request.contactInfo && request.contactInfo.length > 0) {
				console.log("Found contactInfo:", request.contactInfo);

				// Tìm tên cửa hàng trong contactInfo với nhiều pattern khác nhau
				const storeNameInfo = request.contactInfo.find(
					(info: string) =>
						info.includes("Tên cửa hàng:") ||
						info.includes("Store name:") ||
						info.includes("Shop name:") ||
						info.includes("Cửa hàng:") ||
						info.includes("Tên shop:")
				);

				if (storeNameInfo) {
					const storeName = storeNameInfo
						.replace("Tên cửa hàng:", "")
						.replace("Store name:", "")
						.replace("Shop name:", "")
						.replace("Cửa hàng:", "")
						.replace("Tên shop:", "")
						.trim();
					console.log("Found store name:", storeName);
					return storeName;
				}

				// Nếu không có tên cửa hàng, lấy info đầu tiên (có thể chính là tên cửa hàng)
				console.log(
					"No store name pattern found, using first contactInfo:",
					request.contactInfo[0]
				);
				return request.contactInfo[0];
			}

			console.log("No contactInfo found, checking requestItems");

			// Ưu tiên 2: Nếu không có contactInfo, mới lấy tên sản phẩm từ requestItems
			if (request.requestItems && request.requestItems.length > 0) {
				const firstItem = request.requestItems[0];
				console.log("Found requestItems, first item:", firstItem);

				if (firstItem.productName) {
					console.log("Using productName:", firstItem.productName);
					return firstItem.productName;
				}
				if (firstItem.name) {
					console.log("Using name:", firstItem.name);
					return firstItem.name;
				}
			}

			// Fallback: hiển thị "Yêu cầu không có link"
			console.log("Using fallback: Yêu cầu không có link");
			return "Yêu cầu không có link";
		}

		// Default fallback
		console.log("Using default fallback - showing ID");
		return `#${request.id || request.code || "N/A"}`;
	};

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "sent":
				return "#28a745"; // Green for sent
			case "checking":
				return "#17a2b8"; // Teal for checking
			case "quoted":
				return "#ffc107"; // Yellow for quoted
			case "confirmed":
				return "#007bff"; // Blue for confirmed
			case "cancelled":
				return "#dc3545"; // Red for cancelled
			case "insufficient":
				return "#fd7e14"; // Orange for insufficient
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
						{request.requestItems?.length}
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
