import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import OrderCard from "../../components/order-card";
import { Text } from "../../components/ui/text";
import { useGetAllOrdersQuery } from "../../services/gshopApi";

export default function OrderScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");
	const [refreshing, setRefreshing] = useState(false);

	// API query for orders
	const {
		data: ordersResponse,
		isLoading,
		error,
		refetch,
	} = useGetAllOrdersQuery({
		status: activeTab === "all" ? undefined : activeTab,
		page: 0,
		size: 50,
	});

	// Extract orders from API response
	const orders = ordersResponse?.content || [];

	// Debug: Log the structure of orders data
	console.log("Orders data structure:", JSON.stringify(orders[0], null, 2));

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{
			id: "ORDER_REQUESTED",
			label: "Đang đặt hàng",
			status: "ORDER_REQUESTED",
		},
		{ id: "IN_TRANSIT", label: "Đang vận chuyển", status: "IN_TRANSIT" },
		{
			id: "ARRIVED_IN_DESTINATION",
			label: "Đã đến nơi",
			status: "ARRIVED_IN_DESTINATION",
		},
		{ id: "DELIVERED", label: "Đã giao hàng", status: "DELIVERED" },
		{ id: "CANCELED", label: "Đã hủy", status: "CANCELED" },
	];

	const handleCancelOrder = async (orderId) => {
		// Find the selected order
		const selectedOrder = orders.find((order) => order.id === orderId);

		if (!selectedOrder) {
			Alert.alert("Lỗi", "Không tìm thấy thông tin đơn hàng");
			return;
		}

		// Navigate to CancelOrder screen
		navigation.navigate("CancelOrder", { orderData: selectedOrder });
	};

	const handleReviewOrder = (orderId) => {
		console.log("Review order:", orderId);
		// Navigate to FeedbackDetails with the selected order
		const selectedOrder = orders.find((order) => order.id === orderId);
		console.log("Selected order for review:", selectedOrder);
		console.log("Navigating to FeedbackDetails...");
		navigation.navigate("FeedbackDetails", { orderData: selectedOrder });
	};

	const handleOrderPress = (orderId) => {
		console.log("Order pressed:", orderId);
		// Navigate to order details with the selected order
		const selectedOrder = orders.find((order) => order.id === orderId);
		navigation.navigate("OrderDetails", { orderData: selectedOrder });
	};

	// Filter orders based on active tab
	const filteredOrders =
		activeTab === "all"
			? orders
			: orders.filter((order) => order.status === activeTab);

	// Handle loading state
	if (isLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Đơn hàng"
					notificationCount={1}
					chatCount={3}
					onChatPress={() => console.log("Chat pressed")}
					navigation={navigation}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1D4ED8" />
					<Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
				</View>
			</View>
		);
	}

	// Handle error state
	if (error) {
		return (
			<View style={styles.container}>
				<Header
					title="Đơn hàng"
					notificationCount={1}
					chatCount={3}
					onChatPress={() => console.log("Chat pressed")}
					navigation={navigation}
				/>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>
						Không thể tải đơn hàng:{" "}
						{error.message || "Đã xảy ra lỗi"}
					</Text>
					<TouchableOpacity
						onPress={refetch}
						style={styles.retryButton}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	const renderOrder = ({ item }) => {
		return (
			<OrderCard
				order={item}
				onPress={() => handleOrderPress(item.id)}
				onCancel={() => handleCancelOrder(item.id)}
				onReview={() => handleReviewOrder(item.id)}
			/>
		);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Đơn hàng"
				notificationCount={1}
				chatCount={3}
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

			<FlatList
				data={filteredOrders}
				renderItem={renderOrder}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.flatListContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={["#1D4ED8"]}
					/>
				}
				ListEmptyComponent={
					<View style={styles.emptyStateContainer}>
						<Text style={styles.emptyStateText}>
							{activeTab === "all"
								? "Bạn chưa có đơn hàng nào"
								: `Không có đơn hàng ${tabs
										.find((tab) => tab.id === activeTab)
										?.label.toLowerCase()}`}
						</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#6b7280",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
	},
	errorText: {
		color: "#dc2626",
		textAlign: "center",
		fontSize: 16,
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: "#1d4ed8",
		paddingHorizontal: 24,
		paddingVertical: 8,
		borderRadius: 8,
	},
	retryButtonText: {
		color: "#ffffff",
		fontWeight: "500",
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
		fontSize: 14,
		fontWeight: "500",
		color: "#6c757d",
	},
	activeTabText: {
		color: "#ffffff",
		fontWeight: "600",
	},
	flatListContent: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	emptyStateContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 80,
	},
	emptyStateText: {
		color: "#6b7280",
		fontSize: 16,
		textAlign: "center",
	},
});
