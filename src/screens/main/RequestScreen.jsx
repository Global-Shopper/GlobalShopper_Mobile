import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function RequestScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const requests = [
		{
			id: 1,
			title: "Yêu cầu mua iPhone 15 Pro Max",
			description:
				"Cần mua iPhone 15 Pro Max 256GB màu xanh dương từ Apple Store Mỹ",
			status: "sent",
			priority: "high",
			date: "2024-01-15",
			category: "electronics",
		},
		{
			id: 2,
			title: "Yêu cầu mua giày Nike Air Max",
			description: "Mua giày Nike Air Max 270 size 42 từ Nike Store Mỹ",
			status: "checking",
			priority: "medium",
			date: "2024-01-14",
			category: "fashion",
		},
		{
			id: 3,
			title: "Yêu cầu mua laptop MacBook Pro",
			description: "MacBook Pro 16 inch M3 Pro 512GB từ Apple Store",
			status: "quoted",
			priority: "high",
			date: "2024-01-13",
			category: "electronics",
		},
		{
			id: 4,
			title: "Yêu cầu mua túi Louis Vuitton",
			description: "Túi Louis Vuitton Neverfull MM từ store chính hãng",
			status: "cancelled",
			priority: "low",
			date: "2024-01-12",
			category: "fashion",
		},
	];

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{ id: "sent", label: "Đã gửi yêu cầu", status: "sent" },
		{ id: "checking", label: "Đang kiểm tra", status: "checking" },
		{ id: "quoted", label: "Đã báo giá", status: "quoted" },
		{ id: "cancelled", label: "Đã hủy yêu cầu", status: "cancelled" },
	];

	const getStatusColor = (status) => {
		switch (status) {
			case "sent":
				return "#17a2b8";
			case "checking":
				return "#ffc107";
			case "quoted":
				return "#28a745";
			case "cancelled":
				return "#dc3545";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "sent":
				return "Đã gửi yêu cầu";
			case "checking":
				return "Đang kiểm tra";
			case "quoted":
				return "Đã báo giá";
			case "cancelled":
				return "Đã hủy yêu cầu";
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
			case "electronics":
				return "phone-portrait-outline";
			case "fashion":
				return "shirt-outline";
			case "books":
				return "book-outline";
			case "home":
				return "home-outline";
			default:
				return "bag-outline";
		}
	};

	const filteredRequests = requests.filter((request) => {
		if (activeTab === "all") return true;
		return request.status === activeTab;
	});

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Yêu cầu"
				notificationCount={2}
				chatCount={0}
				onNotificationPress={() =>
					navigation.navigate("NotificationScreen")
				}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>

			{/* Tabs */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{tabs.map((tab) => (
						<TouchableOpacity
							key={tab.id}
							style={[
								styles.tab,
								activeTab === tab.id && styles.activeTab,
							]}
							onPress={() => setActiveTab(tab.id)}
						>
							<Text
								style={[
									styles.tabText,
									activeTab === tab.id &&
										styles.activeTabText,
								]}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
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
										Xem chi tiết
									</Text>
								</TouchableOpacity>

								{request.status === "sent" && (
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

								{request.status === "quoted" && (
									<TouchableOpacity
										style={styles.actionButton}
									>
										<Ionicons
											name="checkmark-circle-outline"
											size={16}
											color="#28a745"
										/>
										<Text className="text-green-600 text-sm ml-1">
											Chấp nhận
										</Text>
									</TouchableOpacity>
								)}

								{(request.status === "sent" ||
									request.status === "checking") && (
									<TouchableOpacity
										style={styles.actionButton}
									>
										<Ionicons
											name="close-circle-outline"
											size={16}
											color="#dc3545"
										/>
										<Text className="text-red-600 text-sm ml-1">
											Hủy yêu cầu
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
	tabContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	tab: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		marginRight: 16,
		borderRadius: 25,
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	activeTab: {
		backgroundColor: "#42A5F5",
		borderColor: "#42A5F5",
	},
	tabText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#6c757d",
	},
	activeTabText: {
		color: "#ffffff",
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	requestsList: {
		marginBottom: 20,
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
