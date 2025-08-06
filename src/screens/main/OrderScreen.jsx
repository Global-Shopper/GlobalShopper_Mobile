import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import OrderCard from "../../components/order-card";
import { Text } from "../../components/ui/text";

export default function OrderScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const orders = [
		{
			id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
			requestType: "ONLINE",
			seller: "Apple Store",
			platform: "Amazon",
			productName: "iPhone 15 Pro Max 256GB - Natural Titanium",
			productImage: "https://example.com/iphone.jpg",
			quantity: 1,
			totalPrice: 35000000,
			status: "PURCHASED",
			createdAt: "2024-01-15T08:30:00Z",
			currency: "VND",
		},
		{
			id: "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
			requestType: "ONLINE",
			seller: "Nike Official",
			platform: "Nike Store US",
			productName: "Nike Air Max 270 Black/White Size 42",
			productImage: "https://example.com/nike.jpg",
			quantity: 2,
			totalPrice: 4500000,
			status: "IN_TRANSIT",
			createdAt: "2024-01-14T10:15:00Z",
			currency: "VND",
		},
		{
			id: "c3d4e5f6-g7h8-9012-cdef-gh3456789012",
			requestType: "OFFLINE",
			storeName: "Louis Vuitton Paris",
			productName: "Louis Vuitton Neverfull MM Monogram Canvas",
			productImage: "https://example.com/lv.jpg",
			quantity: 1,
			totalPrice: 45000000,
			status: "ARRIVED_IN_DESTINATION",
			createdAt: "2024-01-12T14:20:00Z",
			currency: "VND",
		},
		{
			id: "d4e5f6g7-h8i9-0123-defg-hi4567890123",
			requestType: "ONLINE",
			seller: "Rolex Official",
			platform: "Chrono24",
			productName: "Rolex Submariner Date 41mm Steel",
			productImage: "https://example.com/rolex.jpg",
			quantity: 1,
			totalPrice: 250000000,
			status: "DELIVERED",
			createdAt: "2024-01-11T16:45:00Z",
			currency: "VND",
		},
		{
			id: "e5f6g7h8-i9j0-1234-efgh-ij5678901234",
			requestType: "OFFLINE",
			storeName: "ASUS Store NYC",
			productName: "ASUS ROG Strix G17 Gaming Laptop",
			productImage: "https://example.com/asus.jpg",
			quantity: 1,
			totalPrice: 35000000,
			status: "ORDER_REQUESTED",
			createdAt: "2024-01-10T12:00:00Z",
			currency: "VND",
		},
		{
			id: "f6g7h8i9-j0k1-2345-fghi-jk6789012345",
			requestType: "ONLINE",
			seller: "Sony Official",
			platform: "B&H Photo",
			productName: "Sony Alpha A7R V Mirrorless Camera with 24-70mm Lens",
			quantity: 1,
			totalPrice: 75000000,
			status: "CANCELED",
			createdAt: "2024-01-09T09:30:00Z",
			currency: "VND",
		},
	];

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{
			id: "ORDER_REQUESTED",
			label: "Đã đặt hàng",
			status: "ORDER_REQUESTED",
		},
		{ id: "PURCHASED", label: "Đã thanh toán", status: "PURCHASED" },
		{ id: "IN_TRANSIT", label: "Đang vận chuyển", status: "IN_TRANSIT" },
		{
			id: "ARRIVED_IN_DESTINATION",
			label: "Đã đến nơi",
			status: "ARRIVED_IN_DESTINATION",
		},
		{ id: "DELIVERED", label: "Đã giao hàng", status: "DELIVERED" },
		{ id: "CANCELED", label: "Đã hủy", status: "CANCELED" },
	];

	const handleCancelOrder = (orderId) => {
		console.log("Cancel order:", orderId);
		// TODO: Implement cancel order logic
	};

	const handleReviewOrder = (orderId) => {
		console.log("Review order:", orderId);
		// TODO: Navigate to review screen
	};

	const handleOrderPress = (orderId) => {
		console.log("Order pressed:", orderId);
		// TODO: Navigate to order details
	};

	const filteredOrders = orders.filter((order) => {
		if (activeTab === "all") return true;
		return order.status === activeTab;
	});

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

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Order List */}
				<View style={styles.ordersList}>
					{filteredOrders.map((order) => (
						<OrderCard
							key={order.id}
							order={order}
							onPress={() => handleOrderPress(order.id)}
							onCancel={() => handleCancelOrder(order.id)}
							onReview={() => handleReviewOrder(order.id)}
						/>
					))}
				</View>

				{filteredOrders.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons name="bag-outline" size={64} color="#ccc" />
						<Text className="text-lg font-medium text-muted-foreground mt-4">
							Không có đơn hàng nào
						</Text>
						<Text className="text-sm text-muted-foreground text-center mt-2">
							Các đơn hàng sẽ xuất hiện ở đây
						</Text>
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
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	ordersList: {
		marginBottom: 20,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
});
