import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface RequestCardProps {
	request: {
		id: number;
		code: string;
		productCount: number;
		status: "SENT" | "QUOTED" | "CHECKING" | "CANCELLED";
		date: number;
		createdAt: string;
		requestType: "ONLINE" | "OFFLINE";
		requestItems: []
	};
	onPress?: () => void;
	onCancel?: () => void;
}

export default function RequestCard({
	request,
	onPress,
	onCancel,
}: RequestCardProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "SENT":
				return "#ff9800"; // Orange thay vì yellow để rõ hơn
			case "QUOTED":
				return "#28a745";
			case "CHECKING":
				return "#1976D2"; // Blue for confirmed
			case "CANCELLED":
				return "#6c757d"; // Xám thay vì đỏ
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "SENT":
				return "Đang xử lý";
			case "QUOTED":
				return "Đã báo giá";
			case "CHECKING":
				return "Đã xác nhận";
			case "CANCELLED":
				return "Đã huỷ";
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
					borderLeftColor: getRequestTypeBorderColor(request.requestType),
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
							color={getRequestTypeBorderColor(request.requestType)}
						/>
					</View>

					<View style={styles.requestInfo}>
						<Text style={styles.requestCode}>#{request.code || "Yêu cầu mua hàng"}</Text>
						<Text style={styles.createdDate}>
							{new Date(Number(request.createdAt)).toLocaleDateString("vi-VN")} - {new Date(Number(request.createdAt)).toLocaleTimeString(["vi-VN"], { hour: "2-digit", minute: "2-digit" })}
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
