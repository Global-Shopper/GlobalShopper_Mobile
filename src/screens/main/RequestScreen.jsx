import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import RequestCard from "../../components/request-card";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestQuery } from "../../services/gshopApi";

export default function RequestScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize] = useState(10); // Remove setPageSize since it's not used

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{ id: "sent", label: "Đã gửi", status: "sent" },
		{ id: "checking", label: "Đang xử lý", status: "checking" },
		{ id: "quoted", label: "Đã báo giá", status: "quoted" },
		{ id: "confirmed", label: "Đã xác nhận", status: "confirmed" },
		{ id: "cancelled", label: "Đã hủy", status: "cancelled" },
		{ id: "insufficient", label: "Cập nhật", status: "insufficient" },
	];

	// Prepare API params based on active tab
	const getAPIParams = () => {
		const baseParams = {
			page: currentPage,
			size: pageSize,
		};

		// Add status filter if not "all"
		if (activeTab !== "all") {
			const selectedTab = tabs.find((tab) => tab.id === activeTab);
			if (selectedTab?.status) {
				baseParams.status = selectedTab.status.toUpperCase(); // API có thể yêu cầu uppercase
			}
		}

		return baseParams;
	};

	const {
		data: requests,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetPurchaseRequestQuery(getAPIParams(), {
		// Refetch when activeTab changes
		refetchOnMountOrArgChange: true,
		// Skip if user not authenticated
		skip: false,
	});

	const handleRequestPress = (request) => {
		console.log("Request pressed:", request);
		// Navigate to request detail screen
		navigation.navigate("RequestDetails", { request });
	};

	const handleRequestCancel = (request) => {
		console.log("Cancel request:", request.id);
		// Handle cancel request logic
		// TODO: Implement cancel request API
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		setCurrentPage(0); // Reset to first page when changing tabs
	};

	const handleTestAPI = () => {
		refetch();
	};

	// Filter requests based on active tab (fallback client-side filtering)
	const getFilteredRequests = () => {
		// Try different possible response structures
		let allRequests = [];

		if (requests) {
			// Check common API response patterns
			if (requests.content) {
				allRequests = requests.content;
			} else if (requests.data) {
				allRequests = Array.isArray(requests.data)
					? requests.data
					: requests.data.content || [];
			} else if (Array.isArray(requests)) {
				allRequests = requests;
			} else {
				//console.log("Unknown response structure:", requests);
				allRequests = [];
			}
		}

		if (activeTab === "all") {
			return allRequests;
		}

		const selectedTab = tabs.find((tab) => tab.id === activeTab);
		if (selectedTab?.status) {
			return allRequests.filter((request) => {
				const requestStatus = request.status?.toLowerCase();
				const targetStatus = selectedTab.status.toLowerCase();
				console.log(`Filtering: ${requestStatus} === ${targetStatus}`);
				return requestStatus === targetStatus;
			});
		}

		return allRequests;
	};

	const filteredRequests = getFilteredRequests();

	console.log("Filtered requests final:", filteredRequests);
	console.log("Filtered requests count:", filteredRequests?.length);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Yêu cầu"
				notificationCount={2}
				chatCount={0}
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
							onPress={() => handleTabChange(tab.id)}
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
				{/* Loading State */}
				{isLoading && (
					<View style={styles.loadingState}>
						<Ionicons
							name="reload-outline"
							size={64}
							color="#ccc"
						/>
						<Text className="text-lg font-medium text-muted-foreground mt-4">
							Đang tải dữ liệu...
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
						<Text className="text-lg font-medium text-red-600 mt-4">
							Có lỗi xảy ra
						</Text>
						<Text className="text-sm text-muted-foreground text-center mt-2">
							{error?.data?.message ||
								error?.message ||
								"Không thể tải dữ liệu"}
						</Text>
						<TouchableOpacity
							style={styles.retryButton}
							onPress={() => refetch()}
						>
							<Text style={styles.retryButtonText}>Thử lại</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.retryButton,
								{ backgroundColor: "#28a745", marginTop: 8 },
							]}
							onPress={handleTestAPI}
						>
							<Text style={styles.retryButtonText}>Test API</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Request List */}
				{!isLoading && !isError && (
					<View style={styles.requestsList}>
						{filteredRequests?.length === 0 && (
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

						{filteredRequests?.map((request) => (
							<RequestCard
								key={request.id}
								request={request}
								onPress={() => handleRequestPress(request)}
								onCancel={() => handleRequestCancel(request)}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{/* Floating Action Button */}
			<TouchableOpacity
				style={styles.fab}
				onPress={() => navigation.navigate("WithLink")}
			>
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
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	loadingState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	errorState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
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
