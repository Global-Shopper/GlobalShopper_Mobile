import { Image, StyleSheet, View } from "react-native";
import { useGetRefundTicketsByOrderIdQuery } from "../services/gshopApi";
import {
	formatDate,
	getStatusColor,
	getStatusText,
} from "../utils/statusHandler";
import { Text } from "./ui/text";

const RefundHistorySection = ({ orderData }) => {
	console.log("RefundHistorySection RENDER STARTED", {
		hasOrderData: !!orderData,
		orderId: orderData?.id,
	});

	const {
		data: refundTickets,
		isLoading,
		error,
	} = useGetRefundTicketsByOrderIdQuery(orderData?.id || "", {
		skip: !orderData?.id,
	});

	console.log("RefundHistorySection DATA", {
		refundTickets,
		isLoading,
		error,
		refundTicketsType: typeof refundTickets,
		isArray: Array.isArray(refundTickets),
		isObject: typeof refundTickets === "object" && refundTickets !== null,
	});

	if (isLoading) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>
						Thông tin trả hàng/hoàn tiền
					</Text>
				</View>
				<Text style={styles.loadingText}>Đang tải thông tin...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>
						Thông tin trả hàng/hoàn tiền
					</Text>
				</View>
				<Text style={styles.errorText}>
					Lỗi khi tải thông tin: {error.message || "Unknown error"}
				</Text>
			</View>
		);
	}

	// Handle both array and single object responses
	let ticketsArray = [];
	if (Array.isArray(refundTickets)) {
		ticketsArray = refundTickets;
	} else if (
		refundTickets &&
		typeof refundTickets === "object" &&
		refundTickets.id
	) {
		// Single refund ticket object - convert to array
		ticketsArray = [refundTickets];
	}

	if (ticketsArray.length === 0) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>
						Thông tin trả hàng/hoàn tiền
					</Text>
				</View>
				<Text style={styles.noDataText}>
					Chưa có yêu cầu trả hàng/hoàn tiền nào.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Thông tin trả hàng/hoàn tiền</Text>
			</View>
			{ticketsArray.map((ticket, index) => (
				<View key={ticket.id || index} style={styles.ticketItem}>
					<View style={styles.ticketHeader}>
						<Text style={styles.ticketId} numberOfLines={1}>
							#{ticket.id ? ticket.id.slice(-8) : "N/A"}
						</Text>
						<View
							style={[
								styles.statusBadge,
								{
									backgroundColor: getStatusColor(
										ticket.status
									),
								},
							]}
						>
							<Text style={styles.statusText} numberOfLines={1}>
								{getStatusText(ticket.status)}
							</Text>
						</View>
					</View>

					<Text style={styles.reasonText}>
						Lý do: {ticket.reason || "Không có lý do"}
					</Text>

					<Text style={styles.dateText}>
						Ngày tạo: {formatDate(ticket.createdAt)}
					</Text>

					{ticket.amount && (
						<Text style={styles.amountText}>
							Số tiền hoàn: {ticket.amount.toLocaleString()}đ
						</Text>
					)}

					{ticket.refundRate && (
						<Text style={styles.refundRateText}>
							Tỷ lệ hoàn tiền:{" "}
							{Math.round(ticket.refundRate * 100)}%
						</Text>
					)}

					{ticket.evidence && ticket.evidence.length > 0 && (
						<View style={styles.imagesContainer}>
							<Text style={styles.imagesLabel}>
								Hình ảnh đính kèm:
							</Text>
							<View style={styles.imagesList}>
								{ticket.evidence
									.slice(0, 3)
									.map((imageUrl, imgIndex) => (
										<Image
											key={imgIndex}
											source={{ uri: imageUrl }}
											style={styles.attachedImage}
										/>
									))}
								{ticket.evidence.length > 3 && (
									<View style={styles.moreImagesIndicator}>
										<Text style={styles.moreImagesText}>
											+{ticket.evidence.length - 3}
										</Text>
									</View>
								)}
							</View>
						</View>
					)}
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
		marginHorizontal: 0,
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
	loadingText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		paddingVertical: 20,
		fontStyle: "italic",
	},
	errorText: {
		fontSize: 16,
		color: "#ff6b6b",
		textAlign: "center",
		paddingVertical: 20,
	},
	noDataText: {
		fontSize: 16,
		color: "#8e8e93",
		textAlign: "center",
		paddingVertical: 12,
		fontWeight: "500",
		fontStyle: "italic",
	},
	ticketItem: {
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	ticketHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
		flexWrap: "wrap",
		gap: 8,
	},
	ticketId: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		flex: 0,
		minWidth: 100,
		maxWidth: 150,
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		maxWidth: 140,
		alignItems: "center",
		justifyContent: "center",
		flex: 0,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#fff",
		textAlign: "center",
		numberOfLines: 1,
	},
	reasonText: {
		fontSize: 14,
		color: "#555",
		marginBottom: 8,
		lineHeight: 20,
	},
	dateText: {
		fontSize: 14,
		color: "#666",
		marginBottom: 8,
	},
	amountText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2e7d32",
		marginBottom: 8,
	},
	refundRateText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#1976d2",
		marginBottom: 12,
	},
	imagesContainer: {
		marginTop: 12,
	},
	imagesLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	imagesList: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	attachedImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	moreImagesIndicator: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: "#333",
		justifyContent: "center",
		alignItems: "center",
	},
	moreImagesText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "600",
	},
});

export default RefundHistorySection;
