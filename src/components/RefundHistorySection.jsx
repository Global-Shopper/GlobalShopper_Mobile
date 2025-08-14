import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
	formatDate,
	getStatusColor,
	getStatusText,
} from "../utils/statusHandler";
import { Text } from "./ui/text";

const RefundHistorySection = ({ orderData }) => {
	// Mock data - sẽ thay bằng API call thực tế
	const [refundHistory] = useState([
		{
			id: "RF001",
			orderId: orderData?.id || "ORD123456",
			reason: "Sản phẩm không đúng như mô tả. Tôi đã đặt màu xanh nhưng nhận được màu đỏ.",
			status: "PENDING",
			evidence: [
				"https://via.placeholder.com/150/FF0000/FFFFFF?text=Evidence1",
				"https://via.placeholder.com/150/00FF00/FFFFFF?text=Evidence2",
			],
			createdAt: "2024-12-15T10:30:00Z",
			updatedAt: "2024-12-15T10:30:00Z",
			adminResponse: null,
		},
		{
			id: "RF002",
			orderId: orderData?.id || "ORD123456",
			reason: "Sản phẩm bị hỏng trong quá trình vận chuyển",
			status: "APPROVED",
			evidence: [
				"https://via.placeholder.com/150/0000FF/FFFFFF?text=Evidence3",
			],
			createdAt: "2024-12-10T14:20:00Z",
			updatedAt: "2024-12-12T09:15:00Z",
			adminResponse:
				"Yêu cầu hoàn tiền đã được chấp nhận. Chúng tôi sẽ hoàn tiền trong vòng 3-5 ngày làm việc.",
		},
	]);

	const [expandedItems, setExpandedItems] = useState({});

	// Toggle expand item
	const toggleExpand = (itemId) => {
		setExpandedItems((prev) => ({
			...prev,
			[itemId]: !prev[itemId],
		}));
	};

	// Không hiển thị nếu không có lịch sử
	if (!refundHistory || refundHistory.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Ionicons name="time-outline" size={20} color="#dc3545" />
				<Text style={styles.title}>Lịch sử trả hàng/hoàn tiền</Text>
			</View>

			{refundHistory.map((item) => (
				<View key={item.id} style={styles.refundItem}>
					<TouchableOpacity
						style={styles.refundHeader}
						onPress={() => toggleExpand(item.id)}
					>
						<View style={styles.refundInfo}>
							<Text style={styles.refundId}>#{item.id}</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(item.status) + "20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{ color: getStatusColor(item.status) },
									]}
								>
									{getStatusText(item.status)}
								</Text>
							</View>
						</View>
						<View style={styles.dateAndIcon}>
							<Text style={styles.dateText}>
								{formatDate(item.createdAt)}
							</Text>
							<Ionicons
								name={
									expandedItems[item.id]
										? "chevron-up"
										: "chevron-down"
								}
								size={16}
								color="#666"
							/>
						</View>
					</TouchableOpacity>

					{expandedItems[item.id] && (
						<View style={styles.refundDetails}>
							{/* Reason */}
							<View style={styles.reasonSection}>
								<Text style={styles.reasonLabel}>Lý do:</Text>
								<Text style={styles.reasonText}>
									{item.reason}
								</Text>
							</View>

							{/* Evidence */}
							{item.evidence.length > 0 && (
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
												style={
													styles.moreEvidenceOverlay
												}
											>
												<Text
													style={
														styles.moreEvidenceText
													}
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
										{formatDate(item.updatedAt)}
									</Text>
								</View>
							)}
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
		borderRadius: 12,
		padding: 16,
		marginVertical: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginLeft: 8,
	},
	refundItem: {
		borderBottomWidth: 1,
		borderBottomColor: "#f1f3f4",
		paddingBottom: 12,
		marginBottom: 12,
	},
	refundHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	refundInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	refundId: {
		fontSize: 14,
		fontWeight: "600",
		color: "#212529",
		marginRight: 8,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 10,
		fontWeight: "600",
	},
	dateAndIcon: {
		flexDirection: "row",
		alignItems: "center",
	},
	dateText: {
		fontSize: 12,
		color: "#6c757d",
		marginRight: 4,
	},
	refundDetails: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f1f3f4",
	},
	reasonSection: {
		marginBottom: 12,
	},
	reasonLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 4,
	},
	reasonText: {
		fontSize: 12,
		color: "#495057",
		lineHeight: 16,
	},
	evidenceSection: {
		marginBottom: 12,
	},
	evidenceLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 6,
	},
	evidenceGrid: {
		flexDirection: "row",
		gap: 6,
	},
	evidenceImage: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#f8f9fa",
	},
	moreEvidenceOverlay: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		right: 0,
	},
	moreEvidenceText: {
		color: "#ffffff",
		fontSize: 10,
		fontWeight: "600",
	},
	responseSection: {
		backgroundColor: "#f8f9fa",
		padding: 8,
		borderRadius: 6,
		borderLeftWidth: 3,
		borderLeftColor: "#1d4ed8",
	},
	responseLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 4,
	},
	responseText: {
		fontSize: 12,
		color: "#495057",
		lineHeight: 16,
		marginBottom: 6,
	},
	responseDate: {
		fontSize: 10,
		color: "#6c757d",
		textAlign: "right",
	},
});

export default RefundHistorySection;
