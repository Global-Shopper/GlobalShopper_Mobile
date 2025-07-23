import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import RequestCard from "../../components/request-card";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestByIdQuery } from "../../services/gshopApi";

export default function RequestHistory({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id;

	// Fetch request details from API
	const {
		data: requestDetail,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId, // Skip if no request ID
		refetchOnMountOrArgChange: true,
	});

	console.log("=== REQUEST HISTORY DEBUG ===");
	console.log("Request ID:", requestId);
	console.log("Request detail from API:", requestDetail);
	console.log("Original request:", request);
	console.log("Is loading:", isLoading);
	console.log("Is error:", isError);
	console.log("Error:", error);

	// Use API data if available, fallback to route params
	const currentRequest = requestDetail || request;

	// Generate history based on request status from API or fallback data
	const getHistoryByStatus = (status, requestData) => {
		// Base history from API if available
		const baseHistory = [
			{
				id: "1",
				date: requestData?.createdAt || "15/01/2024 14:30",
				action: "Đã gửi",
				description: "Yêu cầu được tạo và gửi thành công",
				status: "completed",
				isCurrent: status === "sent",
			},
		];

		if (status === "checking") {
			return [
				{
					id: "2",
					date: requestData?.updatedAt || "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "checking",
					isCurrent: true,
				},
				...baseHistory,
			];
		}

		if (status === "confirmed") {
			return [
				{
					id: "4",
					date: requestData?.updatedAt || "17/01/2024 14:20",
					action: "Đã xác nhận",
					description: "Khách hàng đã xác nhận báo giá và thanh toán",
					status: "confirmed",
					isCurrent: true,
				},
				{
					id: "3",
					date: "16/01/2024 10:30",
					action: "Đã báo giá",
					description:
						"Nhân viên đã gửi báo giá chi tiết cho yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		if (status === "quoted") {
			return [
				{
					id: "3",
					date: requestData?.updatedAt || "16/01/2024 10:30",
					action: "Đã báo giá",
					description:
						"Nhân viên đã gửi báo giá chi tiết cho yêu cầu",
					status: "quoted",
					isCurrent: true,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		if (status === "cancelled") {
			return [
				{
					id: "3",
					date: requestData?.updatedAt || "16/01/2024 09:15",
					action: "Đã hủy",
					description:
						"Yêu cầu đã được hủy theo yêu cầu của khách hàng",
					status: "cancelled",
					isCurrent: true,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		if (status === "insufficient") {
			return [
				{
					id: "3",
					date: requestData?.updatedAt || "16/01/2024 09:30",
					action: "Cập nhật",
					description:
						"Yêu cầu cần cập nhật thêm thông tin hoặc thanh toán",
					status: "insufficient",
					isCurrent: true,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		// Default case for sent status
		if (status === "sent") {
			return baseHistory.map((item) => ({
				...item,
				isCurrent: true,
				status: "sent",
			}));
		}

		return baseHistory;
	};

	const requestHistory = getHistoryByStatus(
		currentRequest?.status,
		currentRequest
	);

	const getStatusColor = (status) => {
		switch (status) {
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
			case "completed":
				return "#6c757d"; // Gray for completed steps
			default:
				return "#6c757d";
		}
	};

	return (
		<View style={styles.container}>
			<Header
				title="Lịch sử yêu cầu"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
				showNotificationIcon={false}
			/>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Loading State */}
				{isLoading && (
					<View style={styles.loadingState}>
						<Ionicons
							name="reload-outline"
							size={64}
							color="#ccc"
						/>
						<Text style={styles.loadingText}>
							Đang tải lịch sử yêu cầu...
						</Text>
					</View>
				)}

				{/* Error State */}
				{isError && (
					<View style={styles.errorState}>
						<Ionicons
							name="warning-outline"
							size={64}
							color="#dc3545"
						/>
						<Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
						<Text style={styles.errorMessage}>
							{error?.data?.message ||
								error?.message ||
								"Không thể tải lịch sử yêu cầu"}
						</Text>
						<TouchableOpacity
							style={styles.retryButton}
							onPress={() => refetch()}
						>
							<Text style={styles.retryButtonText}>Thử lại</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Content */}
				{!isLoading && !isError && (
					<>
						{/* Request Info */}
						<View style={styles.requestInfoSection}>
							<View style={styles.requestInfoCard}>
								{/* Title is now handled by RequestCard, so remove this line */}
								<Text style={styles.requestDate}>
									Tạo ngày:{" "}
									{currentRequest?.createdAt ||
										"Không có thông tin"}
								</Text>

								{/* Hiển thị số lượng sản phẩm */}
								<RequestCard request={currentRequest} />

								{currentRequest?.note && (
									<Text style={styles.requestNote}>
										Ghi chú: {currentRequest.note}
									</Text>
								)}
							</View>
						</View>

						{/* History Timeline */}
						<View style={styles.historySection}>
							<View style={styles.historyContainer}>
								{requestHistory.map((item, index) => (
									<View
										key={item.id}
										style={[
											styles.historyItem,
											item.isCurrent &&
												styles.currentHistoryItem,
										]}
									>
										<View style={styles.historyLeft}>
											<View
												style={[
													styles.historyDot,
													{
														backgroundColor:
															getStatusColor(
																item.status
															),
													},
													item.isCurrent &&
														styles.currentHistoryDot,
												]}
											/>
											{index <
												requestHistory.length - 1 && (
												<View
													style={styles.historyLine}
												/>
											)}
										</View>
										<View
											style={[
												styles.historyContent,
												item.isCurrent &&
													styles.currentHistoryContent,
											]}
										>
											<View style={styles.historyHeader}>
												<Text
													style={[
														styles.historyAction,
														item.isCurrent &&
															styles.currentHistoryAction,
													]}
												>
													{item.action}
												</Text>
												<Text
													style={[
														styles.historyDate,
														item.isCurrent &&
															styles.currentHistoryDate,
													]}
												>
													{item.date}
												</Text>
											</View>
											<Text
												style={[
													styles.historyDescription,
													item.isCurrent &&
														styles.currentHistoryDescription,
												]}
											>
												{item.description}
											</Text>
										</View>
									</View>
								))}
							</View>
						</View>
					</>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 18,
		paddingVertical: 8,
		paddingBottom: 30,
	},
	requestInfoSection: {
		marginBottom: 20,
	},
	requestInfoCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	requestCode: {
		fontSize: 18,
		fontWeight: "700",
		color: "#343a40",
		marginBottom: 4,
	},
	requestDate: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	requestQuantity: {
		fontSize: 14,
		color: "#28a745",
		fontWeight: "600",
		marginTop: 4,
	},
	requestNote: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
		marginTop: 8,
		fontStyle: "italic",
	},
	loadingState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	loadingText: {
		fontSize: 16,
		color: "#6c757d",
		marginTop: 16,
	},
	errorState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#dc3545",
		marginTop: 16,
	},
	errorMessage: {
		fontSize: 14,
		color: "#6c757d",
		textAlign: "center",
		marginTop: 8,
		marginHorizontal: 20,
	},
	retryButton: {
		backgroundColor: "#007bff",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		marginTop: 16,
	},
	retryButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	historySection: {
		flex: 1,
	},
	historyContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 18,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	historyItem: {
		flexDirection: "row",
		marginBottom: 20,
		paddingVertical: 4,
	},
	currentHistoryItem: {
		backgroundColor: "#f0f8ff",
		marginHorizontal: -12,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e3f2fd",
	},
	historyLeft: {
		alignItems: "center",
		marginRight: 14,
	},
	historyDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginTop: 6,
	},
	currentHistoryDot: {
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 3,
		borderColor: "#ffffff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
	},
	historyLine: {
		width: 2,
		flex: 1,
		backgroundColor: "#e9ecef",
		marginTop: 10,
	},
	historyContent: {
		flex: 1,
	},
	currentHistoryContent: {
		paddingLeft: 4,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 6,
		flexWrap: "wrap",
	},
	historyAction: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		flex: 1,
	},
	currentHistoryAction: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1976D2",
	},
	historyDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	currentHistoryDate: {
		fontSize: 13,
		color: "#1976D2",
		fontWeight: "600",
	},
	historyDescription: {
		fontSize: 13,
		color: "#666",
		lineHeight: 19,
	},
	currentHistoryDescription: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		fontWeight: "500",
	},
});
