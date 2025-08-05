import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestDetailQuery } from "../../services/gshopApi";

export default function RequestHistory({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id;

	// Fetch request details from API (which should include history)
	const {
		data: requestDetail,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetPurchaseRequestDetailQuery(requestId, {
		skip: !requestId, // Skip if no request ID
		refetchOnMountOrArgChange: true,
	});

	console.log("=== REQUEST HISTORY DEBUG ===");
	console.log("Request ID:", requestId);
	console.log("Request detail from API:", requestDetail);
	console.log("Original request:", request);
	console.log("Current request type:", currentRequest?.type);
	console.log("Current request:", currentRequest);
	console.log("Is loading:", isLoading);
	console.log("Is error:", isError);

	// Use API data if available, fallback to route params
	const currentRequest = requestDetail || request;

	// Helper function to get shortened UUID like RequestScreen
	const getShortId = (fullId) => {
		if (!fullId) return "N/A";
		if (typeof fullId === "string" && fullId.includes("-")) {
			return "#" + fullId.split("-")[0];
		}
		return "#" + fullId;
	};

	// Helper function to get request type text
	const getRequestTypeText = (type) => {
		console.log("Getting request type text for:", type);

		if (!type) {
			return "Loại yêu cầu không xác định";
		}

		switch (type?.toLowerCase()) {
			case "offline":
				return "Hàng nội địa/quốc tế";
			case "online":
				return "Hàng từ nền tảng e-commerce";
			case "domestic":
				return "Hàng nội địa";
			case "international":
				return "Hàng quốc tế";
			case "ecommerce":
			case "e-commerce":
				return "Hàng từ nền tảng e-commerce";
			default:
				return `Loại: ${type}`;
		}
	};

	// Helper function to get action text from status
	const getActionFromStatus = (status) => {
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
			case "completed":
				return "Hoàn thành";
			default:
				return "Cập nhật";
		}
	};

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
		} catch (_error) {
			return dateString;
		}
	};

	// Format history data from API response
	const formatHistoryFromAPI = (requestData) => {
		console.log("=== FORMATTING HISTORY FROM API ===");
		console.log("Request data:", requestData);

		// Check if request has history array from API
		if (requestData?.history && Array.isArray(requestData.history)) {
			console.log("Found API history array:", requestData.history);
			return requestData.history.map((item, index) => ({
				id: item.id || index.toString(),
				date: formatDate(item.createdAt || item.timestamp || item.date),
				action:
					getActionFromStatus(item.status) ||
					item.action ||
					"Cập nhật",
				description:
					item.description ||
					`Cập nhật trạng thái: ${getActionFromStatus(item.status)}`,
				status: item.status || "completed",
				isCurrent: index === 0, // First item is always current
			}));
		}

		console.log(
			"No API history found, creating fallback from request status"
		);
		// Fallback: Create basic history from request status and dates
		const historyItems = [];

		// Always add creation entry
		historyItems.push({
			id: "created",
			date: formatDate(
				requestData?.createdAt || new Date().toISOString()
			),
			action: "Đã tạo yêu cầu",
			description: "Yêu cầu mua hàng được tạo thành công",
			status: "completed",
			isCurrent: false,
		});

		// Add current status as latest entry if different from sent
		if (requestData?.status && requestData.status !== "sent") {
			historyItems.unshift({
				id: "current",
				date: formatDate(
					requestData?.updatedAt ||
						requestData?.createdAt ||
						new Date().toISOString()
				),
				action: getActionFromStatus(requestData.status),
				description: `Yêu cầu hiện tại ở trạng thái: ${getActionFromStatus(
					requestData.status
				)}`,
				status: requestData.status,
				isCurrent: true,
			});
		} else {
			// Mark creation as current if still in sent status
			historyItems[0].isCurrent = true;
		}

		return historyItems;
	};

	// Use new API-based history formatter
	const requestHistory = formatHistoryFromAPI(currentRequest);

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
								{/* Short UUID và Status hiện tại */}
								<View style={styles.requestHeader}>
									<View style={styles.requestLeftInfo}>
										<Text style={styles.requestIdText}>
											{getShortId(currentRequest?.id)}
										</Text>
										<Text style={styles.requestTypeText}>
											{getRequestTypeText(
												currentRequest?.type ||
													currentRequest?.requestType ||
													currentRequest?.category ||
													currentRequest?.purchaseType
											)}
										</Text>
									</View>
									<Text style={styles.currentStatusText}>
										{getActionFromStatus(
											currentRequest?.status
										)}
									</Text>
								</View>
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
	requestHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	requestLeftInfo: {
		flex: 1,
	},
	requestIdText: {
		fontSize: 16,
		color: "#6c757d",
		fontWeight: "600",
		marginBottom: 2,
	},
	requestTypeText: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
	},
	currentStatusText: {
		fontSize: 16,
		color: "#1976D2",
		fontWeight: "700",
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	requestCode: {
		fontSize: 18,
		fontWeight: "700",
		color: "#343a40",
		marginBottom: 4,
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
