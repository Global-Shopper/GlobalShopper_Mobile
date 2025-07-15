import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function RequestHistory({ navigation, route }) {
	const { request } = route.params || {};

	// Generate history based on request status
	const getHistoryByStatus = (status) => {
		const baseHistory = [
			{
				id: "1",
				date: "15/01/2024 14:30",
				action: "Tạo yêu cầu",
				description: "Yêu cầu được tạo với 3 sản phẩm",
				status: "completed",
				isCurrent: false,
			},
		];

		if (status === "processing") {
			return [
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "processing",
					isCurrent: true,
				},
				...baseHistory,
			];
		}

		if (status === "confirmed") {
			return [
				{
					id: "4",
					date: "17/01/2024 14:20",
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
					date: "16/01/2024 10:30",
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
					date: "16/01/2024 09:15",
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

		// Default case
		return baseHistory;
	};

	const requestHistory = getHistoryByStatus(request?.status);

	const getStatusColor = (status) => {
		switch (status) {
			case "processing":
				return "#1976D2";
			case "quoted":
				return "#1976D2";
			case "confirmed":
				return "#1976D2";
			case "cancelled":
				return "#1976D2";
			case "completed":
				return "#6c757d";
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
				{/* Request Info */}
				<View style={styles.requestInfoSection}>
					<View style={styles.requestInfoCard}>
						<Text style={styles.requestCode}>#{request?.code}</Text>
						<Text style={styles.requestDate}>
							Tạo ngày: {request?.createdAt}
						</Text>
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
									item.isCurrent && styles.currentHistoryItem,
								]}
							>
								<View style={styles.historyLeft}>
									<View
										style={[
											styles.historyDot,
											{
												backgroundColor: getStatusColor(
													item.status
												),
											},
											item.isCurrent &&
												styles.currentHistoryDot,
										]}
									/>
									{index < requestHistory.length - 1 && (
										<View style={styles.historyLine} />
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
