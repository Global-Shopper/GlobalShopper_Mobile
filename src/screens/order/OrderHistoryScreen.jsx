import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function OrderHistoryScreen({ navigation, route }) {
	const { orderId } = route.params || {};

	// Mock tracking history data
	const [trackingHistory] = useState([
		{
			id: 1,
			status: "DELIVERED",
			title: "Đã giao hàng thành công",
			description: "Đơn hàng đã được giao đến người nhận",
			date: "2024-01-20T14:30:00Z",
			location: "123 Đường ABC, Quận 1, TP.HCM",
			isCompleted: true,
			isLatest: true,
		},
		{
			id: 2,
			status: "OUT_FOR_DELIVERY",
			title: "Đang giao hàng",
			description: "Shipper đang trên đường giao hàng đến bạn",
			date: "2024-01-20T08:00:00Z",
			location: "Kho phân loại Quận 1",
			isCompleted: true,
			isLatest: false,
		},
		{
			id: 3,
			status: "ARRIVED_IN_DESTINATION",
			title: "Đã đến kho giao hàng",
			description: "Hàng đã về đến kho giao hàng cuối cùng",
			date: "2024-01-19T16:45:00Z",
			location: "Kho phân loại Quận 1",
			isCompleted: true,
			isLatest: false,
		},
		{
			id: 4,
			status: "IN_TRANSIT",
			title: "Đang vận chuyển",
			description: "Hàng đang được vận chuyển đến kho giao hàng",
			date: "2024-01-18T10:20:00Z",
			location: "Trung tâm phân loại TP.HCM",
			isCompleted: true,
			isLatest: false,
		},
		{
			id: 5,
			status: "SHIPPED",
			title: "Đã xuất kho",
			description: "Hàng đã được xuất khỏi kho và bắt đầu vận chuyển",
			date: "2024-01-17T14:15:00Z",
			location: "Kho Amazon Việt Nam",
			isCompleted: true,
			isLatest: false,
		},
		{
			id: 6,
			status: "PURCHASED",
			title: "Đã thanh toán",
			description: "Đơn hàng đã được thanh toán thành công",
			date: "2024-01-15T08:30:00Z",
			location: "Hệ thống GShop",
			isCompleted: true,
			isLatest: false,
		},
	]);

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

	// Get status icon
	const getStatusIcon = (status) => {
		switch (status) {
			case "DELIVERED":
				return "checkmark-circle";
			case "OUT_FOR_DELIVERY":
				return "bicycle";
			case "ARRIVED_IN_DESTINATION":
				return "location";
			case "IN_TRANSIT":
				return "airplane";
			case "SHIPPED":
				return "cube";
			case "PURCHASED":
				return "card";
			default:
				return "ellipse";
		}
	};

	// Get status color
	const getStatusColor = (status, isCompleted) => {
		if (!isCompleted) return "#ccc";

		switch (status) {
			case "DELIVERED":
				return "#28a745";
			case "OUT_FOR_DELIVERY":
				return "#fd7e14";
			case "ARRIVED_IN_DESTINATION":
				return "#6610f2";
			case "IN_TRANSIT":
				return "#007bff";
			case "SHIPPED":
				return "#17a2b8";
			case "PURCHASED":
				return "#20c997";
			default:
				return "#6c757d";
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Lịch sử vận chuyển"
				showBackButton
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Tracking Info */}
				<View style={styles.trackingCard}>
					<View style={styles.trackingHeader}>
						<Text style={styles.trackingTitle}>
							Mã vận đơn: VN123456789
						</Text>
						<Text style={styles.trackingSubtitle}>
							Giao Hàng Nhanh
						</Text>
					</View>

					{/* Timeline */}
					<View style={styles.timeline}>
						{trackingHistory.map((item, index) => (
							<View key={item.id} style={styles.timelineItem}>
								{/* Timeline Line */}
								<View style={styles.timelineLineContainer}>
									{/* Icon */}
									<View
										style={[
											styles.timelineIcon,
											{
												backgroundColor: getStatusColor(
													item.status,
													item.isCompleted
												),
											},
											item.isLatest && styles.latestIcon,
										]}
									>
										<Ionicons
											name={getStatusIcon(item.status)}
											size={16}
											color="#ffffff"
										/>
									</View>

									{/* Connecting Line */}
									{index < trackingHistory.length - 1 && (
										<View
											style={[
												styles.timelineLine,
												{
													backgroundColor:
														item.isCompleted
															? getStatusColor(
																	item.status,
																	item.isCompleted
															  )
															: "#e9ecef",
												},
											]}
										/>
									)}
								</View>

								{/* Content */}
								<View style={styles.timelineContent}>
									<View style={styles.timelineHeader}>
										<Text
											style={[
												styles.timelineTitle,
												item.isLatest &&
													styles.latestTitle,
											]}
										>
											{item.title}
										</Text>
										<Text style={styles.timelineDate}>
											{formatDate(item.date)}
										</Text>
									</View>

									<Text style={styles.timelineDescription}>
										{item.description}
									</Text>

									<View style={styles.timelineLocation}>
										<Ionicons
											name="location-outline"
											size={14}
											color="#6c757d"
										/>
										<Text style={styles.locationText}>
											{item.location}
										</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Additional Info */}
				<View style={styles.infoCard}>
					<Text style={styles.infoTitle}>Thông tin bổ sung</Text>

					<View style={styles.infoItem}>
						<Ionicons
							name="time-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Thời gian giao hàng dự kiến: 3-5 ngày làm việc
						</Text>
					</View>

					<View style={styles.infoItem}>
						<Ionicons
							name="call-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Hotline hỗ trợ: 1900 1234
						</Text>
					</View>

					<View style={styles.infoItem}>
						<Ionicons
							name="information-circle-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Liên hệ shipper trước khi giao hàng 30 phút
						</Text>
					</View>
				</View>
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
	trackingCard: {
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
	trackingHeader: {
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	trackingTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 4,
	},
	trackingSubtitle: {
		fontSize: 14,
		color: "#6c757d",
	},
	timeline: {
		paddingLeft: 8,
	},
	timelineItem: {
		flexDirection: "row",
		marginBottom: 20,
	},
	timelineLineContainer: {
		alignItems: "center",
		marginRight: 16,
	},
	timelineIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
	},
	latestIcon: {
		transform: [{ scale: 1.1 }],
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	timelineLine: {
		width: 2,
		height: 40,
		marginTop: 4,
	},
	timelineContent: {
		flex: 1,
		paddingTop: 2,
	},
	timelineHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 6,
	},
	timelineTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#212529",
		flex: 1,
		marginRight: 8,
	},
	latestTitle: {
		color: "#28a745",
		fontSize: 16,
	},
	timelineDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	timelineDescription: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		marginBottom: 8,
	},
	timelineLocation: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	locationText: {
		fontSize: 13,
		color: "#6c757d",
		fontStyle: "italic",
	},
	infoCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 16,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12,
		gap: 8,
	},
	infoText: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		flex: 1,
	},
});
