import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function OrderScreen() {
	const [activeTab, setActiveTab] = useState("all");

	const orders = [
		{
			id: "ORD001",
			title: "Đơn hàng thực phẩm",
			items: ["2x Cơm gà", "1x Nước cam"],
			total: 150000,
			status: "delivered",
			date: "2024-01-15",
			customer: "Nguyễn Văn A",
			address: "123 Đường ABC, Quận 1, TP.HCM",
		},
		{
			id: "ORD002",
			title: "Đơn hàng điện tử",
			items: ["1x Tai nghe Bluetooth", "1x Cáp sạc"],
			total: 500000,
			status: "shipping",
			date: "2024-01-14",
			customer: "Trần Thị B",
			address: "456 Đường XYZ, Quận 2, TP.HCM",
		},
		{
			id: "ORD003",
			title: "Đơn hàng thời trang",
			items: ["1x Áo thun", "1x Quần jeans"],
			total: 800000,
			status: "processing",
			date: "2024-01-13",
			customer: "Lê Văn C",
			address: "789 Đường DEF, Quận 3, TP.HCM",
		},
		{
			id: "ORD004",
			title: "Đơn hàng sách",
			items: ["3x Sách giáo khoa", "1x Vở ghi chú"],
			total: 250000,
			status: "cancelled",
			date: "2024-01-12",
			customer: "Phạm Thị D",
			address: "321 Đường GHI, Quận 4, TP.HCM",
		},
	];

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "#ffc107";
			case "processing":
				return "#007bff";
			case "shipping":
				return "#17a2b8";
			case "delivered":
				return "#28a745";
			case "cancelled":
				return "#dc3545";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "pending":
				return "Chờ xác nhận";
			case "processing":
				return "Đang xử lý";
			case "shipping":
				return "Đang giao";
			case "delivered":
				return "Đã giao";
			case "cancelled":
				return "Đã hủy";
			default:
				return "Không xác định";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return "time-outline";
			case "processing":
				return "settings-outline";
			case "shipping":
				return "car-outline";
			case "delivered":
				return "checkmark-circle-outline";
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
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>Đơn hàng</Text>
					<TouchableOpacity style={styles.searchButton}>
						<Ionicons
							name="search-outline"
							size={24}
							color="#FFFFFF"
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>

			{/* Stats */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<Text className="text-xl font-bold text-blue-600">
						{orders.filter((o) => o.status === "processing").length}
					</Text>
					<Text className="text-xs text-muted-foreground">
						Đang xử lý
					</Text>
				</View>

				<View style={styles.statCard}>
					<Text className="text-xl font-bold text-teal-600">
						{orders.filter((o) => o.status === "shipping").length}
					</Text>
					<Text className="text-xs text-muted-foreground">
						Đang giao
					</Text>
				</View>

				<View style={styles.statCard}>
					<Text className="text-xl font-bold text-green-600">
						{orders.filter((o) => o.status === "delivered").length}
					</Text>
					<Text className="text-xs text-muted-foreground">
						Đã giao
					</Text>
				</View>

				<View style={styles.statCard}>
					<Text className="text-xl font-bold text-red-600">
						{orders.filter((o) => o.status === "cancelled").length}
					</Text>
					<Text className="text-xs text-muted-foreground">
						Đã hủy
					</Text>
				</View>
			</View>

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
							activeTab === "shipping" && styles.activeTab,
						]}
						onPress={() => setActiveTab("shipping")}
					>
						<Text
							className={
								activeTab === "shipping"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Đang giao
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === "delivered" && styles.activeTab,
						]}
						onPress={() => setActiveTab("delivered")}
					>
						<Text
							className={
								activeTab === "delivered"
									? "font-semibold text-blue-600"
									: "text-muted-foreground"
							}
						>
							Đã giao
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
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

									{order.status === "processing" && (
										<TouchableOpacity
											style={[
												styles.actionButton,
												{ marginLeft: 12 },
											]}
										>
											<Ionicons
												name="car-outline"
												size={16}
												color="#28a745"
											/>
											<Text className="text-green-600 text-sm ml-1">
												Giao hàng
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
	searchButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	statsContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
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
	ordersList: {
		marginTop: 16,
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
