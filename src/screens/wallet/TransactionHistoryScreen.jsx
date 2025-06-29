import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function TransactionHistoryScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const allTransactions = [
		{
			id: 1,
			type: "deposit",
			amount: 500000,
			description: "Nạp tiền qua ngân hàng",
			date: "15/01/2024",
			time: "14:30",
			status: "completed",
			icon: "add-circle",
			color: "#4CAF50",
		},
		{
			id: 2,
			type: "payment",
			amount: -150000,
			description: "Thanh toán đơn hàng #1234",
			date: "14/01/2024",
			time: "10:15",
			status: "completed",
			icon: "card",
			color: "#2196F3",
		},
		{
			id: 3,
			type: "withdrawal",
			amount: -200000,
			description: "Rút tiền về tài khoản",
			date: "13/01/2024",
			time: "16:45",
			status: "processing",
			icon: "arrow-up-circle",
			color: "#FF9800",
		},
		{
			id: 4,
			type: "refund",
			amount: 75000,
			description: "Hoàn tiền đơn hàng #1230",
			date: "12/01/2024",
			time: "09:20",
			status: "completed",
			icon: "refresh-circle",
			color: "#9C27B0",
		},
		{
			id: 5,
			type: "deposit",
			amount: 1000000,
			description: "Nạp tiền qua ví điện tử",
			date: "11/01/2024",
			time: "11:30",
			status: "completed",
			icon: "add-circle",
			color: "#4CAF50",
		},
		{
			id: 6,
			type: "payment",
			amount: -300000,
			description: "Thanh toán đơn hàng #1228",
			date: "10/01/2024",
			time: "15:10",
			status: "completed",
			icon: "card",
			color: "#2196F3",
		},
	];

	const tabs = [
		{ id: "all", label: "Tất cả", type: null },
		{ id: "deposit", label: "Nạp tiền", type: "deposit" },
		{ id: "payment", label: "Thanh toán", type: "payment" },
		{ id: "withdrawal", label: "Rút tiền", type: "withdrawal" },
		{ id: "refund", label: "Hoàn tiền", type: "refund" },
	];

	const getFilteredTransactions = () => {
		if (activeTab === "all") return allTransactions;
		return allTransactions.filter(
			(transaction) => transaction.type === activeTab
		);
	};

	const getStatusText = (status) => {
		switch (status) {
			case "completed":
				return "Hoàn thành";
			case "processing":
				return "Đang xử lý";
			case "failed":
				return "Thất bại";
			default:
				return "Không xác định";
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "#4CAF50";
			case "processing":
				return "#FF9800";
			case "failed":
				return "#F44336";
			default:
				return "#6c757d";
		}
	};

	const filteredTransactions = getFilteredTransactions();

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Lịch sử giao dịch"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onNotificationPress={() => console.log("Notification pressed")}
				onChatPress={() => console.log("Chat pressed")}
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

			{/* Transaction List */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{filteredTransactions.length > 0 ? (
					<View style={styles.transactionsList}>
						{filteredTransactions.map((transaction) => (
							<TouchableOpacity
								key={transaction.id}
								style={styles.transactionCard}
								activeOpacity={0.7}
							>
								<View style={styles.transactionLeft}>
									<View
										style={[
											styles.transactionIcon,
											{
												backgroundColor: `${transaction.color}20`,
											},
										]}
									>
										<Ionicons
											name={transaction.icon}
											size={24}
											color={transaction.color}
										/>
									</View>
									<View style={styles.transactionInfo}>
										<Text
											style={
												styles.transactionDescription
											}
										>
											{transaction.description}
										</Text>
										<View style={styles.transactionDetails}>
											<Text
												style={styles.transactionDate}
											>
												{transaction.date} •{" "}
												{transaction.time}
											</Text>
											<View
												style={styles.statusContainer}
											>
												<View
													style={[
														styles.statusDot,
														{
															backgroundColor:
																getStatusColor(
																	transaction.status
																),
														},
													]}
												/>
												<Text
													style={[
														styles.statusText,
														{
															color: getStatusColor(
																transaction.status
															),
														},
													]}
												>
													{getStatusText(
														transaction.status
													)}
												</Text>
											</View>
										</View>
									</View>
								</View>
								<Text
									style={[
										styles.transactionAmount,
										{
											color:
												transaction.amount > 0
													? "#4CAF50"
													: "#F44336",
										},
									]}
								>
									{transaction.amount > 0 ? "+" : ""}
									{formatCurrency(
										Math.abs(transaction.amount)
									)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				) : (
					<View style={styles.emptyContainer}>
						<Ionicons
							name="receipt-outline"
							size={64}
							color="#ccc"
						/>
						<Text style={styles.emptyText}>
							Không có giao dịch nào
						</Text>
						<Text style={styles.emptySubtext}>
							Chưa có giao dịch nào trong danh mục này
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
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	tab: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginRight: 12,
		borderRadius: 20,
		backgroundColor: "#f8f9fa",
	},
	activeTab: {
		backgroundColor: "#42A5F5",
	},
	tabText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#6c757d",
	},
	activeTabText: {
		color: "#ffffff",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	transactionsList: {
		marginBottom: 20,
	},
	transactionCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	transactionLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	transactionIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	transactionInfo: {
		flex: 1,
	},
	transactionDescription: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 4,
	},
	transactionDetails: {
		flexDirection: "column",
		gap: 4,
	},
	transactionDate: {
		fontSize: 14,
		color: "#6c757d",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginRight: 6,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "500",
	},
	transactionAmount: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "right",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#6c757d",
		marginTop: 16,
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: "#6c757d",
		textAlign: "center",
	},
});
