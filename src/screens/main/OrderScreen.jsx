import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function OrderScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const orders = [
		{
			id: "ORD001",
			title: "iPhone 15 Pro Max từ Apple Store",
			items: ["1x iPhone 15 Pro Max 256GB", "1x Ốp lưng chính hãng"],
			total: 35000000,
			status: "paid",
			date: "2024-01-15",
			customer: "Nguyễn Văn A",
			address: "123 Đường ABC, Quận 1, TP.HCM",
		},
		{
			id: "ORD002",
			title: "Giày Nike từ Nike Store US",
			items: ["1x Nike Air Max 270", "1x Tất Nike"],
			total: 4500000,
			status: "purchased",
			date: "2024-01-14",
			customer: "Trần Thị B",
			address: "456 Đường XYZ, Quận 2, TP.HCM",
		},
		{
			id: "ORD003",
			title: "MacBook Pro từ Apple Store",
			items: ["1x MacBook Pro 16 inch M3", "1x Magic Mouse"],
			total: 55000000,
			status: "international_shipping",
			date: "2024-01-13",
			customer: "Lê Văn C",
			address: "789 Đường DEF, Quận 3, TP.HCM",
		},
		{
			id: "ORD004",
			title: "Túi Louis Vuitton từ Paris",
			items: ["1x Louis Vuitton Neverfull MM", "1x Wallet"],
			total: 45000000,
			status: "customs_cleared",
			date: "2024-01-12",
			customer: "Phạm Thị D",
			address: "321 Đường GHI, Quận 4, TP.HCM",
		},
		{
			id: "ORD005",
			title: "Đồng hồ Rolex từ Switzerland",
			items: ["1x Rolex Submariner", "1x Hộp đựng"],
			total: 250000000,
			status: "domestic_shipping",
			date: "2024-01-11",
			customer: "Hoàng Văn E",
			address: "555 Đường JKL, Quận 5, TP.HCM",
		},
		{
			id: "ORD006",
			title: "Laptop Gaming từ Newegg",
			items: ["1x ASUS ROG Strix", "1x Gaming Mouse"],
			total: 35000000,
			status: "delivered",
			date: "2024-01-10",
			customer: "Võ Thị F",
			address: "777 Đường MNO, Quận 6, TP.HCM",
		},
		{
			id: "ORD007",
			title: "Camera Sony từ B&H",
			items: ["1x Sony A7R V", "1x Lens 24-70mm"],
			total: 75000000,
			status: "completed",
			date: "2024-01-09",
			customer: "Đặng Văn G",
			address: "888 Đường PQR, Quận 7, TP.HCM",
		},
		{
			id: "ORD008",
			title: "Perfume Chanel từ France",
			items: ["1x Chanel No.5", "1x Travel Size"],
			total: 8500000,
			status: "cancelled",
			date: "2024-01-08",
			customer: "Bùi Thị H",
			address: "999 Đường STU, Quận 8, TP.HCM",
		},
	];

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{ id: "paid", label: "Đã thanh toán", status: "paid" },
		{ id: "purchased", label: "Đã mua hàng", status: "purchased" },
		{
			id: "international_shipping",
			label: "Đang vận chuyển quốc tế",
			status: "international_shipping",
		},
		{
			id: "customs_cleared",
			label: "Đã thông quan",
			status: "customs_cleared",
		},
		{
			id: "domestic_shipping",
			label: "Đang giao nội địa",
			status: "domestic_shipping",
		},
		{ id: "delivered", label: "Đã giao hàng", status: "delivered" },
		{ id: "completed", label: "Hoàn tất", status: "completed" },
		{ id: "cancelled", label: "Đã hủy đơn", status: "cancelled" },
	];

	const getStatusColor = (status) => {
		switch (status) {
			case "paid":
				return "#007bff";
			case "purchased":
				return "#17a2b8";
			case "international_shipping":
				return "#6610f2";
			case "customs_cleared":
				return "#6f42c1";
			case "domestic_shipping":
				return "#fd7e14";
			case "delivered":
				return "#20c997";
			case "completed":
				return "#28a745";
			case "cancelled":
				return "#dc3545";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "paid":
				return "Đã thanh toán";
			case "purchased":
				return "Đã mua hàng";
			case "international_shipping":
				return "Vận chuyển quốc tế";
			case "customs_cleared":
				return "Đã thông quan";
			case "domestic_shipping":
				return "Giao nội địa";
			case "delivered":
				return "Đã giao hàng";
			case "completed":
				return "Hoàn tất";
			case "cancelled":
				return "Đã hủy đơn";
			default:
				return "Không xác định";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "paid":
				return "card-outline";
			case "purchased":
				return "bag-check-outline";
			case "international_shipping":
				return "airplane-outline";
			case "customs_cleared":
				return "shield-checkmark-outline";
			case "domestic_shipping":
				return "car-outline";
			case "delivered":
				return "checkmark-circle-outline";
			case "completed":
				return "trophy-outline";
			case "cancelled":
				return "close-circle-outline";
			default:
				return "help-circle-outline";
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
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
						<TouchableOpacity
							key={order.id}
							style={styles.orderCard}
						>
							<View style={styles.orderHeader}>
								<View style={styles.orderIdContainer}>
									<Text className="font-bold text-blue-600">
										#{order.id}
									</Text>
									<Text className="text-sm text-muted-foreground">
										{order.date}
									</Text>
								</View>

								<View
									style={[
										styles.statusBadge,
										{
											backgroundColor:
												getStatusColor(order.status) +
												"20",
										},
									]}
								>
									<Ionicons
										name={getStatusIcon(order.status)}
										size={12}
										color={getStatusColor(order.status)}
									/>
									<Text
										style={[
											styles.statusText,
											{
												color: getStatusColor(
													order.status
												),
											},
										]}
									>
										{getStatusText(order.status)}
									</Text>
								</View>
							</View>

							<Text className="font-semibold text-lg mb-2">
								{order.title}
							</Text>

							<View style={styles.customerInfo}>
								<Ionicons
									name="person-outline"
									size={16}
									color="#666"
								/>
								<Text className="text-sm text-muted-foreground ml-2">
									{order.customer}
								</Text>
							</View>

							<View style={styles.addressInfo}>
								<Ionicons
									name="location-outline"
									size={16}
									color="#666"
								/>
								<Text className="text-sm text-muted-foreground ml-2 flex-1">
									{order.address}
								</Text>
							</View>

							<View style={styles.itemsList}>
								{order.items.map((item, index) => (
									<Text
										key={index}
										className="text-sm text-muted-foreground"
									>
										• {item}
									</Text>
								))}
							</View>

							<View style={styles.orderFooter}>
								<Text className="text-lg font-bold text-green-600">
									{formatCurrency(order.total)}
								</Text>

								<View style={styles.orderActions}>
									<TouchableOpacity
										style={styles.actionButton}
									>
										<Ionicons
											name="eye-outline"
											size={16}
											color="#007bff"
										/>
										<Text className="text-blue-600 text-sm ml-1">
											Chi tiết
										</Text>
									</TouchableOpacity>

									{order.status === "delivered" && (
										<TouchableOpacity
											style={[
												styles.actionButton,
												{ marginLeft: 12 },
											]}
										>
											<Ionicons
												name="checkmark-circle-outline"
												size={16}
												color="#28a745"
											/>
											<Text className="text-green-600 text-sm ml-1">
												Xác nhận
											</Text>
										</TouchableOpacity>
									)}

									{(order.status === "paid" ||
										order.status === "purchased") && (
										<TouchableOpacity
											style={[
												styles.actionButton,
												{ marginLeft: 12 },
											]}
										>
											<Ionicons
												name="close-circle-outline"
												size={16}
												color="#dc3545"
											/>
											<Text className="text-red-600 text-sm ml-1">
												Hủy đơn
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</TouchableOpacity>
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
	orderCard: {
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
	orderHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	orderIdContainer: {
		flex: 1,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		marginLeft: 4,
	},
	customerInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	addressInfo: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	itemsList: {
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
	},
	orderFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	orderActions: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
});
