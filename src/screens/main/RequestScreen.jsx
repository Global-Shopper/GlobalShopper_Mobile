import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import RequestCard from "../../components/request-card";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestQuery } from "../../services/gshopApi";

export default function RequestScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{ id: "sent", label: "Đã gửi", status: "SENT" },
		{ id: "checking", label: "Đang xử lý", status: "CHECKING" },
		{ id: "quoted", label: "Đã báo giá", status: "QUOTED" },
		{
			id: "completed",
			label: "Đã thanh toán",
			status: "PAID",
			alternativeStatuses: ["COMPLETED", "CONFIRMED", "SUCCESS"],
		},
		{ id: "cancelled", label: "Đã hủy", status: "CANCELLED" },
		{ id: "insufficient", label: "Cập nhật", status: "INSUFFICIENT" },
	];

	const getAPIParams = () => {
		const baseParams = {
			page: 0,
			size: 1000,
		};

		if (activeTab !== "all") {
			const selectedTab = tabs.find((tab) => tab.id === activeTab);
			if (selectedTab?.status) {
				baseParams.status = selectedTab.status; // Send exact status to API
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
		refetchOnMountOrArgChange: true,
	});

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await refetch();
		} finally {
			setRefreshing(false);
		}
	}, [refetch]);
	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [refetch])
	);
	useEffect(() => {
		refetch();
	}, [activeTab, refetch]);

	const handleRequestPress = (request) => {
		navigation.navigate("RequestDetails", { request });
	};

	const handleRequestCancel = (request) => {};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		refetch();
	};

	const handleTestAPI = () => {
		refetch();
	};

	// Filter requests based on active tab
	const getFilteredRequests = () => {
		let allRequests = [];

		if (requests) {
			if (requests.content) {
				allRequests = requests.content;
			} else if (requests.data) {
				allRequests = Array.isArray(requests.data)
					? requests.data
					: requests.data.content || [];
			} else if (Array.isArray(requests)) {
				allRequests = requests;
			}
		}

		// Debug: Log all unique statuses to understand what API returns
		const uniqueStatuses = [
			...new Set(allRequests.map((req) => req.status)),
		];

		if (activeTab === "all") {
			return allRequests;
		}

		const selectedTab = tabs.find((tab) => tab.id === activeTab);
		if (selectedTab?.status) {
			if (selectedTab.alternativeStatuses) {
				console.log(
					`Alternative statuses: ${selectedTab.alternativeStatuses.join(
						", "
					)}`
				);
			}

			const filtered = allRequests.filter((request) => {
				const requestStatus = request.status; // Keep original case from API
				const primaryStatus = selectedTab.status; // Use uppercase status

				// Check primary status (exact match)
				if (requestStatus === primaryStatus) {
					return true;
				}

				// Check alternative statuses for "Đã thanh toán" tab
				if (
					selectedTab.alternativeStatuses &&
					Array.isArray(selectedTab.alternativeStatuses)
				) {
					const isAltMatch = selectedTab.alternativeStatuses.some(
						(altStatus) => requestStatus === altStatus
					);
					if (isAltMatch) {
						return true;
					}
				}

				return false;
			});

			if (activeTab === "completed") {
			}

			return filtered;
		}

		return allRequests;
	};

	const filteredRequests = getFilteredRequests();

	// Sort requests by createdAt descending (newest first)
	const sortedRequests = useMemo(() => {
		if (!filteredRequests || filteredRequests.length === 0) {
			return [];
		}
		const requestsCopy = filteredRequests.map((request) => ({
			...request,
		}));

		return requestsCopy.sort((a, b) => {
			const dateA = Number(a.createdAt) || 0;
			const dateB = Number(b.createdAt) || 0;
			return dateB - dateA;
		});
	}, [filteredRequests]);

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
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={["#007bff"]}
						tintColor="#007bff"
					/>
				}
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
						{sortedRequests?.length === 0 && (
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

						{sortedRequests?.map((request, index) => (
							<RequestCard
								key={`${request.id}-${request.status}-${index}`}
								request={request}
								onPress={() => handleRequestPress(request)}
								onCancel={() => handleRequestCancel(request)}
							/>
						))}
					</View>
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
	quickActionsContainer: {
		backgroundColor: "#ffffff",
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 8,
		borderRadius: 12,
		padding: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	checkoutButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#f8f9ff",
		borderWidth: 1,
		borderColor: "#e6f2ff",
	},
	checkoutButtonText: {
		fontSize: 14,
		color: "#007bff",
		fontWeight: "500",
		marginLeft: 8,
		flex: 1,
	},
	tabContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 18,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	tab: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginRight: 6,
		borderRadius: 10,
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	activeTab: {
		backgroundColor: "#42A5F5",
		borderColor: "#42A5F5",
	},
	tabText: {
		fontSize: 15,
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
});
