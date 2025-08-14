import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
	useGetAllOrdersQuery,
	useLazyGetOrderByIdQuery,
} from "../../services/gshopApi";

export default function OrderScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");
	const [refreshing, setRefreshing] = useState(false);
	const [feedbackMap, setFeedbackMap] = useState({}); // Track which orders have feedback

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

	// Lazy query to get order details with feedback info
	const [getOrderById] = useLazyGetOrderByIdQuery();

	// Function to manually refresh feedback status for a specific order
	/* const refreshFeedbackStatus = async (orderId) => {
		try {
			const result = await getOrderById(orderId);
			if (result.data) {
				const hasFeedback =
					result.data.feedback &&
					(result.data.feedback.id ||
						result.data.feedback.rating ||
						result.data.feedback.comment);

				setFeedbackMap((prev) => ({
					...prev,
					[orderId]: hasFeedback,
				}));

				console.log(`Refreshed feedback status for order ${orderId}: ${hasFeedback}`);
			}
		} catch (error) {
			console.error(`Error refreshing feedback for order ${orderId}:`, error);
		}
	}; */

	// Extract orders from API response and sort by newest first
	const orders = useMemo(() => {
		const ordersList = ordersResponse?.content || [];
		// Create a copy of the array before sorting to avoid read-only property error
		return [...ordersList].sort((a, b) => b.createdAt - a.createdAt);
	}, [ordersResponse]);

	// Load feedback status for delivered orders
	useEffect(() => {
		const loadFeedbackStatus = async () => {
			// Find all delivered orders
			const deliveredOrders = orders.filter(
				(order) => order.status === "DELIVERED"
			);

			if (deliveredOrders.length === 0) return;

			console.log(
				`Loading feedback status for ${deliveredOrders.length} delivered orders...`
			);

			// Always load feedback for all delivered orders to ensure fresh data
			for (const order of deliveredOrders) {
				try {
					console.log(`Loading feedback for order ${order.id}...`);
					const result = await getOrderById(order.id);
					if (result.data) {
						console.log(
							`Order ${order.id} full response:`,
							JSON.stringify(result.data, null, 2)
						);
						console.log(
							`Order ${order.id} feedback field:`,
							result.data.feedback
						);

						// Check if feedback exists in the order detail
						const hasFeedback =
							result.data.feedback &&
							(result.data.feedback.id ||
								result.data.feedback.rating ||
								result.data.feedback.comment);

						console.log(
							`Order ${order.id}: hasFeedback = ${hasFeedback}`,
							`feedback object:`,
							result.data.feedback
						);

						// Update feedback map for this specific order
						setFeedbackMap((prev) => ({
							...prev,
							[order.id]: hasFeedback,
						}));
					}
				} catch (error) {
					console.error(
						`Error loading feedback for order ${order.id}:`,
						error
					);
					// Set to false on error
					setFeedbackMap((prev) => ({
						...prev,
						[order.id]: false,
					}));
				}
			}
		};

		// Only load feedback if we have delivered orders
		const hasDeliveredOrders = orders.some(
			(order) => order.status === "DELIVERED"
		);
		if (hasDeliveredOrders) {
			loadFeedbackStatus();
		}
	}, [orders, getOrderById]);

	// Refresh orders when screen comes into focus (e.g., after checkout or feedback)
	useFocusEffect(
		useCallback(() => {
			console.log("OrderScreen focused, refreshing orders...");
			refetch();

			// Force refresh feedback status for delivered orders when screen comes back into focus
			// This ensures we get updated feedback status after user creates/updates feedback
			const deliveredOrders = orders.filter(
				(order) => order.status === "DELIVERED"
			);

			if (deliveredOrders.length > 0) {
				console.log(
					"Screen focused: Force reloading feedback status for delivered orders"
				);
				// Force reload feedback for all delivered orders
				deliveredOrders.forEach(async (order) => {
					try {
						console.log(
							`Force loading feedback for order ${order.id}`
						);
						const result = await getOrderById(order.id);
						if (result.data) {
							const hasFeedback =
								result.data.feedback &&
								(result.data.feedback.id ||
									result.data.feedback.rating ||
									result.data.feedback.comment);

							console.log(`Order ${order.id} feedback check:`, {
								feedback: result.data.feedback,
								hasFeedback: hasFeedback,
							});

							setFeedbackMap((prev) => ({
								...prev,
								[order.id]: hasFeedback,
							}));
						}
					} catch (error) {
						console.error(
							`Error force loading feedback for order ${order.id}:`,
							error
						);
					}
				});
			}
		}, [refetch, orders, getOrderById])
	);

	const onRefresh = async () => {
		setRefreshing(true);
		// Don't clear feedback map on refresh to maintain feedback state
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

	const handleReviewOrder = async (orderId) => {
		console.log("Review order:", orderId);
		// Find the selected order
		const selectedOrder = orders.find((order) => order.id === orderId);
		console.log("Selected order for review:", selectedOrder);

		// Only allow review for delivered orders
		if (selectedOrder.status !== "DELIVERED") {
			Alert.alert(
				"Thông báo",
				"Chỉ có thể đánh giá đơn hàng đã được giao"
			);
			return;
		}

		try {
			// Get detailed order info to get complete feedback data
			console.log("Fetching order details to navigate...");
			const result = await getOrderById(orderId);

			if (result.data) {
				const orderDetail = result.data;
				console.log("Order detail with feedback info:", orderDetail);

				// Check if order has feedback - use fresh data from API
				const hasFeedback =
					orderDetail.feedback &&
					(orderDetail.feedback.id ||
						orderDetail.feedback.rating ||
						orderDetail.feedback.comment);

				console.log("Order has feedback from API:", hasFeedback);
				console.log("Feedback object structure:", {
					feedback: orderDetail.feedback,
					hasId: !!orderDetail.feedback?.id,
					hasRating: !!orderDetail.feedback?.rating,
					hasComment: !!orderDetail.feedback?.comment,
				});

				// Update feedback map with fresh data
				setFeedbackMap((prev) => ({
					...prev,
					[orderId]: hasFeedback,
				}));

				if (hasFeedback) {
					// Navigate to view feedback
					console.log(
						"Navigating to FeedbackOrder to view existing feedback..."
					);
					navigation.navigate("FeedbackOrder", {
						orderData: orderDetail,
					});
				} else {
					// Navigate to create feedback
					console.log(
						"Navigating to FeedbackDetails to create feedback..."
					);
					navigation.navigate("FeedbackDetails", {
						orderData: orderDetail,
					});
				}
			} else {
				Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
			}
		} catch (error) {
			console.error("Error fetching order details:", error);
			Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
		}
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
		const isDelivered = item.status === "DELIVERED";
		const hasFeedback = feedbackMap[item.id] || false;

		// Debug log for each order rendering
		console.log(
			`Rendering order ${item.id}: status=${item.status}, isDelivered=${isDelivered}, hasFeedback=${hasFeedback}`
		);

		return (
			<OrderCard
				order={item}
				onPress={() => handleOrderPress(item.id)}
				onCancel={() => handleCancelOrder(item.id)}
				onReview={() => handleReviewOrder(item.id)}
				hasFeedback={hasFeedback}
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
				contentContainerStyle={[
					styles.flatListContent,
					filteredOrders.length === 0 && styles.emptyListContent,
				]}
				showsVerticalScrollIndicator={true}
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
		flexGrow: 1,
	},
	emptyListContent: {
		flexGrow: 1,
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
