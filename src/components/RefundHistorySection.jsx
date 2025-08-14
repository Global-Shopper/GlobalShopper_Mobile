import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { useGetRefundTicketsByOrderIdQuery } from "../services/gshopApi";
import {
	formatDate,
	getStatusColor,
	getStatusText,
} from "../utils/statusHandler";
import { Text } from "./ui/text";

const RefundHistorySection = ({ orderData }) => {
	// API call to get refund tickets by order ID
	const {
		data: refundTickets,
		isLoading,
		isError,
		error,
	} = useGetRefundTicketsByOrderIdQuery(orderData?.id, {
		skip: !orderData?.id, // Skip if no order ID
	});

	// Handle loading state
	if (isLoading) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Ionicons name="time-outline" size={20} color="#dc3545" />
					<Text style={styles.title}>Lịch sử trả hàng/hoàn tiền</Text>
				</View>
				<Text style={styles.loadingText}>Đang tải...</Text>
			</View>
		);
	}

	// Handle error state
	if (isError) {
		console.log("Error loading refund tickets:", error);

		// If it's a 400 error with "source cannot be null", it might mean no refund tickets exist
		// In this case, just hide the component instead of showing error
		if (error?.status === 400 || error?.data?.statusCode === 400) {
			return null; // Hide component for 400 errors (likely no refund tickets)
		}

		// For other errors, show a generic message
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Ionicons name="time-outline" size={20} color="#dc3545" />
					<Text style={styles.title}>Lịch sử trả hàng/hoàn tiền</Text>
				</View>
				<Text style={styles.errorText}>
					Không thể tải thông tin hoàn tiền
				</Text>
			</View>
		);
	}

	// Process refund data - handle both array and object responses
	let refundHistory = [];
	if (refundTickets) {
		// If API returns a single object (like in the log), wrap it in an array
		if (refundTickets.id && refundTickets.status) {
			refundHistory = [refundTickets];
		}
		// If API returns an array
		else if (Array.isArray(refundTickets)) {
			refundHistory = refundTickets;
		}
		// If API returns wrapped data
		else if (refundTickets.data && Array.isArray(refundTickets.data)) {
			refundHistory = refundTickets.data;
		} else if (
			refundTickets.content &&
			Array.isArray(refundTickets.content)
		) {
			refundHistory = refundTickets.content;
		}
	}

	// Không hiển thị nếu không có lịch sử hoàn tiền
	if (!refundHistory || refundHistory.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Thông tin trả hàng/hoàn tiền</Text>
				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor:
								getStatusColor(refundHistory[0].status) + "20",
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{ color: getStatusColor(refundHistory[0].status) },
						]}
					>
						{getStatusText(refundHistory[0].status)}
					</Text>
				</View>
			</View>

			{refundHistory.map((item) => (
				<View key={item.id} style={styles.refundItem}>
					<View style={styles.refundDetails}>
						{/* Reason */}
						<View style={styles.reasonSection}>
							<Text style={styles.reasonLabel}>Lý do:</Text>
							<Text style={styles.reasonText}>
								{item.reason || "Không có lý do"}
							</Text>
						</View>

						{/* Amount - Only show for APPROVED status */}
						{item.status === "APPROVED" &&
							item.amount !== undefined && (
								<View style={styles.reasonSection}>
									<Text style={styles.reasonLabel}>
										Phần trăm hoàn:
									</Text>
									<Text style={styles.percentText}>
										{item.amount > 0
											? `${(item.amount * 100).toFixed(
													1
											  )}%`
											: "Chưa xác định"}
									</Text>
								</View>
							)}

						{/* Date - Only show if createdAt exists */}
						{item.createdAt && (
							<View style={styles.reasonSection}>
								<Text style={styles.reasonLabel}>
									Ngày tạo:
								</Text>
								<Text style={styles.reasonText}>
									{formatDate(item.createdAt)}
								</Text>
							</View>
						)}

						{/* Evidence */}
						{item.evidence && item.evidence.length > 0 && (
							<View style={styles.evidenceSection}>
								<Text style={styles.evidenceLabel}>
									Minh chứng ({item.evidence.length} ảnh):
								</Text>
								<View style={styles.evidenceGrid}>
									{item.evidence
										.slice(0, 3)
										.map((imageUri, index) => (
											<Image
												key={index}
												source={{ uri: imageUri }}
												style={styles.evidenceImage}
											/>
										))}
									{item.evidence.length > 3 && (
										<View
											style={styles.moreEvidenceOverlay}
										>
											<Text
												style={styles.moreEvidenceText}
											>
												+{item.evidence.length - 3}
											</Text>
										</View>
									)}
								</View>
							</View>
						)}

						{/* Admin Response */}
						{item.adminResponse && (
							<View style={styles.responseSection}>
								<Text style={styles.responseLabel}>
									Phản hồi từ admin:
								</Text>
								<Text style={styles.responseText}>
									{item.adminResponse}
								</Text>
								<Text style={styles.responseDate}>
									{formatDate(
										item.updatedAt || item.updatedDate
									)}
								</Text>
							</View>
						)}
					</View>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		marginHorizontal: 0, // Remove horizontal margin to fit with OrderDetails layout
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
		flex: 1,
	},
	refundItem: {
		marginBottom: 0, // Remove margin since we don't have multiple items with expand/collapse
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: "flex-start",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	refundDetails: {
		backgroundColor: "#fafbfc",
		borderRadius: 12,
		padding: 16,
	},
	reasonSection: {
		marginBottom: 16,
	},
	reasonLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: "#333",
		marginBottom: 6,
	},
	reasonText: {
		fontSize: 14,
		color: "#555",
		lineHeight: 20,
	},
	percentText: {
		fontSize: 16,
		color: "#28a745",
		fontWeight: "700",
		lineHeight: 20,
	},
	evidenceSection: {
		marginBottom: 16,
	},
	evidenceLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: "#333",
		marginBottom: 10,
	},
	evidenceGrid: {
		flexDirection: "row",
		gap: 10,
	},
	evidenceImage: {
		width: 60,
		height: 60,
		borderRadius: 10,
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	moreEvidenceOverlay: {
		width: 60,
		height: 60,
		borderRadius: 10,
		backgroundColor: "rgba(0,0,0,0.75)",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		right: 0,
	},
	moreEvidenceText: {
		color: "#ffffff",
		fontSize: 12,
		fontWeight: "700",
	},
	responseSection: {
		backgroundColor: "#e3f2fd",
		padding: 16,
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#1976d2",
	},
	responseLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1976d2",
		marginBottom: 8,
	},
	responseText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
		marginBottom: 8,
	},
	responseDate: {
		fontSize: 12,
		color: "#666",
		textAlign: "right",
		fontStyle: "italic",
	},
	loadingText: {
		fontSize: 16,
		color: "#8e8e93",
		textAlign: "center",
		paddingVertical: 24,
		fontWeight: "500",
	},
	errorText: {
		fontSize: 16,
		color: "#dc3545",
		textAlign: "center",
		paddingVertical: 24,
		fontWeight: "500",
	},
});

export default RefundHistorySection;
