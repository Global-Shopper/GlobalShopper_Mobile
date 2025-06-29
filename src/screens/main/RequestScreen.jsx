import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function RequestScreen() {
	const [activeTab, setActiveTab] = useState("all");

	const requests = [
		{
			id: 1,
			title: "Yêu cầu hỗ trợ kỹ thuật",
			description: "Cần hỗ trợ cài đặt ứng dụng trên thiết bị mới",
			status: "pending",
			priority: "high",
			date: "2024-01-15",
			category: "technical",
		},
		{
			id: 2,
			title: "Yêu cầu hoàn tiền",
			description: "Hoàn tiền cho đơn hàng #1234 do sản phẩm lỗi",
			status: "processing",
			priority: "medium",
			date: "2024-01-14",
			category: "financial",
		},
		{
			id: 3,
			title: "Cập nhật thông tin tài khoản",
			description: "Thay đổi số điện thoại và địa chỉ email",
			status: "completed",
			priority: "low",
			date: "2024-01-13",
			category: "account",
		},
	];

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "#ffc107";
			case "processing":
				return "#007bff";
			case "completed":
				return "#28a745";
			case "rejected":
				return "#dc3545";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "pending":
				return "Chờ xử lý";
			case "processing":
				return "Đang xử lý";
			case "completed":
				return "Hoàn thành";
			case "rejected":
				return "Từ chối";
			default:
				return "Không xác định";
		}
	};

	const getPriorityIcon = (priority) => {
		switch (priority) {
			case "high":
				return "arrow-up-circle";
			case "medium":
				return "remove-circle";
			case "low":
				return "arrow-down-circle";
			default:
				return "help-circle";
		}
	};

	const getCategoryIcon = (category) => {
		switch (category) {
			case "technical":
				return "settings-outline";
			case "financial":
				return "card-outline";
			case "account":
				return "person-outline";
			default:
				return "document-outline";
		}
	};

	const filteredRequests = requests.filter((request) => {
		if (activeTab === "all") return true;
		return request.status === activeTab;
	});

	return (
		<View style={styles.container}>
			{/* Header */}
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>Yêu cầu</Text>
					<TouchableOpacity style={styles.addButton}>
						<Ionicons name="add" size={24} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
			</LinearGradient>

			{/* Tabs */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === "all" && styles.activeTab,
						]}
						onPress={() => setActiveTab("all")}
					>
						<Text
							className={
								activeTab === "all"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Tất cả
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === "pending" && styles.activeTab,
						]}
						onPress={() => setActiveTab("pending")}
					>
						<Text
							className={
								activeTab === "pending"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Chờ xử lý
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === "processing" && styles.activeTab,
						]}
						onPress={() => setActiveTab("processing")}
					>
						<Text
							className={
								activeTab === "processing"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Đang xử lý
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === "completed" && styles.activeTab,
						]}
						onPress={() => setActiveTab("completed")}
					>
						<Text
							className={
								activeTab === "completed"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Hoàn thành
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Stats */}
				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<Text className="text-2xl font-bold text-blue-600">
							{
								requests.filter((r) => r.status === "pending")
									.length
							}
						</Text>
						<Text className="text-sm text-muted-foreground">
							Chờ xử lý
						</Text>
					</View>

					<View style={styles.statCard}>
						<Text className="text-2xl font-bold text-orange-600">
							{
								requests.filter(
									(r) => r.status === "processing"
								).length
							}
						</Text>
						<Text className="text-sm text-muted-foreground">
							Đang xử lý
						</Text>
					</View>

					<View style={styles.statCard}>
						<Text className="text-2xl font-bold text-green-600">
							{
								requests.filter((r) => r.status === "completed")
									.length
							}
						</Text>
						<Text className="text-sm text-muted-foreground">
							Hoàn thành
						</Text>
					</View>
				</View>

				{/* Request List */}
				<View style={styles.requestsList}>
					{filteredRequests.map((request) => (
						<TouchableOpacity
							key={request.id}
							style={styles.requestCard}
						>
							<View style={styles.requestHeader}>
								<View style={styles.requestInfo}>
									<Ionicons
										name={getCategoryIcon(request.category)}
										size={24}
										color="#007bff"
									/>
									<View style={styles.requestTitleContainer}>
										<Text className="font-semibold">
											{request.title}
										</Text>
										<Text className="text-sm text-muted-foreground">
											{request.date}
										</Text>
									</View>
								</View>

								<View style={styles.requestMeta}>
									<Ionicons
										name={getPriorityIcon(request.priority)}
										size={16}
										color={
											request.priority === "high"
												? "#dc3545"
												: request.priority === "medium"
												? "#ffc107"
												: "#28a745"
										}
									/>
									<View
										style={[
											styles.statusBadge,
											{
												backgroundColor:
													getStatusColor(
														request.status
													) + "20",
											},
										]}
									>
										<Text
											style={[
												styles.statusText,
												{
													color: getStatusColor(
														request.status
													),
												},
											]}
										>
											{getStatusText(request.status)}
										</Text>
									</View>
								</View>
							</View>

							<Text className="text-sm text-muted-foreground mt-2 leading-5">
								{request.description}
							</Text>

							<View style={styles.requestActions}>
								<TouchableOpacity style={styles.actionButton}>
									<Ionicons
										name="eye-outline"
										size={16}
										color="#007bff"
									/>
									<Text className="text-blue-600 text-sm ml-1">
										Xem
									</Text>
								</TouchableOpacity>

								{request.status !== "completed" && (
									<TouchableOpacity
										style={styles.actionButton}
									>
										<Ionicons
											name="create-outline"
											size={16}
											color="#28a745"
										/>
										<Text className="text-green-600 text-sm ml-1">
											Chỉnh sửa
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</TouchableOpacity>
					))}
				</View>

				{filteredRequests.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons
							name="document-outline"
							size={64}
							color="#ccc"
						/>
						<Text className="text-lg font-medium text-muted-foreground mt-4">
							Không có yêu cầu nào
						</Text>
						<Text className="text-sm text-muted-foreground text-center mt-2">
							Tạo yêu cầu mới để được hỗ trợ
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Floating Action Button */}
			<TouchableOpacity style={styles.fab}>
				<Ionicons name="add" size={24} color="#ffffff" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 25,
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 10,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	tabContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	tab: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 12,
		borderRadius: 20,
	},
	activeTab: {
		backgroundColor: "#e7f3ff",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: 20,
	},
	statCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginHorizontal: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	requestsList: {
		marginBottom: 100,
	},
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	requestHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	requestInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	requestTitleContainer: {
		marginLeft: 12,
		flex: 1,
	},
	requestMeta: {
		alignItems: "flex-end",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginTop: 4,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
	requestActions: {
		flexDirection: "row",
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	fab: {
		position: "absolute",
		bottom: 30,
		right: 30,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#007bff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
});
