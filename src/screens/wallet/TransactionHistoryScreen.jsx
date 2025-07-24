import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useCurrentUserTransactionsQuery } from "../../services/gshopApi";

export default function TransactionHistoryScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	// Fetch transaction data from API
	const { data, isLoading, isError, error, refetch } =
		useCurrentUserTransactionsQuery();

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	// Icon mapping for transaction types
	const iconMap = {
		deposit: { icon: "add-circle", color: "#4CAF50" },
		payment: { icon: "card", color: "#2196F3" },
		withdrawal: { icon: "arrow-up-circle", color: "#FF9800" },
		refund: { icon: "refresh-circle", color: "#9C27B0" },
		// Alternative naming
		topup: { icon: "add-circle", color: "#4CAF50" },
		purchase: { icon: "card", color: "#2196F3" },
		withdraw: { icon: "arrow-up-circle", color: "#FF9800" },
		cashback: { icon: "refresh-circle", color: "#9C27B0" },
		commission: { icon: "trending-up", color: "#4CAF50" },
		fee: { icon: "remove-circle", color: "#F44336" },
	};

	// Transform API data
	const allTransactions = (() => {
		// Handle different possible response formats
		let transactions = [];

		if (Array.isArray(data)) {
			transactions = data;
		} else if (data?.data && Array.isArray(data.data)) {
			transactions = data.data;
		} else if (data?.content && Array.isArray(data.content)) {
			transactions = data.content;
		} else if (data?.transactions && Array.isArray(data.transactions)) {
			transactions = data.transactions;
		}

		return transactions.map((item) => {
			const mapped = {
				...item,
				type: (item.type || item.transactionType || "").toLowerCase(),
				status: (
					item.status ||
					item.transactionStatus ||
					""
				).toLowerCase(),
				description:
					item.description ||
					item.note ||
					item.remarks ||
					`Giao dịch ${item.type || "không xác định"}`,
				amount: item.amount || item.value || item.total || 0,
				createdAt:
					item.createdAt ||
					item.createAt ||
					item.timestamp ||
					item.date ||
					Date.now(),
			};
			return mapped;
		});
	})();

	const tabs = [
		{ id: "all", label: "Tất cả", type: null },
		{ id: "deposit", label: "Nạp tiền", type: ["deposit", "topup"] },
		{ id: "payment", label: "Thanh toán", type: ["payment", "purchase"] },
		{
			id: "withdrawal",
			label: "Rút tiền",
			type: ["withdrawal", "withdraw"],
		},
		{ id: "refund", label: "Hoàn tiền", type: ["refund", "cashback"] },
	];

	const getFilteredTransactions = () => {
		if (activeTab === "all") return allTransactions;

		const selectedTab = tabs.find((tab) => tab.id === activeTab);
		if (!selectedTab || !selectedTab.type) return allTransactions;

		return allTransactions.filter((transaction) => {
			if (Array.isArray(selectedTab.type)) {
				return selectedTab.type.includes(transaction.type);
			}
			return transaction.type === selectedTab.type;
		});
	};

	const getStatusText = (status) => {
		switch ((status || "").toLowerCase()) {
			case "completed":
			case "success":
				return "Hoàn thành";
			case "processing":
			case "pending":
				return "Đang xử lý";
			case "fail":
				return "Thất bại";
			case "cancelled":
				return "Đã huỷ";
			default:
				return status || "Không xác định";
		}
	};

	const getStatusColor = (status) => {
		switch ((status || "").toLowerCase()) {
			case "completed":
			case "success":
				return "#4CAF50";
			case "processing":
			case "pending":
				return "#FF9800";
			case "failed":
			case "failure":
				return "#F44336";
			case "cancelled":
				return "#F44336";
			default:
				return "#6c757d";
		}
	};

	const filteredTransactions = getFilteredTransactions();

	// Loading state
	if (isLoading) {
		return (
			<View
				style={[
					styles.container,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color="#1976D2" />
				<Text style={{ marginTop: 16, color: "#1976D2" }}>
					Đang tải lịch sử giao dịch...
				</Text>
			</View>
		);
	}

	// Show error banner but still show data if available
	const showErrorBanner = isError && allTransactions.length === 0;

	if (showErrorBanner) {
		return (
			<View
				style={[
					styles.container,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<Text
					style={{
						color: "#dc3545",
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					Không thể tải lịch sử giao dịch
				</Text>
				<Text style={{ color: "#6c757d", marginTop: 8 }}>
					{error?.data?.message || error?.message || "Có lỗi xảy ra"}
				</Text>
				<TouchableOpacity
					style={{
						marginTop: 20,
						backgroundColor: "#1976D2",
						paddingHorizontal: 24,
						paddingVertical: 12,
						borderRadius: 8,
					}}
					onPress={refetch}
				>
					<Text style={{ color: "#fff", fontWeight: "600" }}>
						Thử lại
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Lịch sử giao dịch"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>

			{/* Error banner if there's an error but still have data */}
			{isError && allTransactions.length > 0 && (
				<View
					style={{
						backgroundColor: "#fff3cd",
						padding: 12,
						margin: 16,
						borderRadius: 8,
					}}
				>
					<Text style={{ color: "#856404", fontSize: 14 }}>
						⚠️ Có lỗi khi tải dữ liệu, hiển thị dữ liệu cũ
					</Text>
				</View>
			)}

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
						{filteredTransactions.map((transaction) => {
							const iconInfo = iconMap[transaction.type] || {
								icon: "card",
								color: "#2196F3",
							};

							// Parse date/time from createdAt (multiple formats supported)
							let dateStr = "";
							let timeStr = "";
							if (transaction.createdAt) {
								let d;
								// Try different date formats
								if (typeof transaction.createdAt === "string") {
									d = new Date(transaction.createdAt);
								} else if (
									typeof transaction.createdAt === "number"
								) {
									// Handle both timestamp (ms) and Unix timestamp (seconds)
									d = new Date(
										transaction.createdAt > 10000000000
											? transaction.createdAt
											: transaction.createdAt * 1000
									);
								} else {
									d = new Date();
								}

								if (!isNaN(d.getTime())) {
									dateStr = `${d
										.getDate()
										.toString()
										.padStart(2, "0")}/${(d.getMonth() + 1)
										.toString()
										.padStart(2, "0")}/${d.getFullYear()}`;
									timeStr = `${d
										.getHours()
										.toString()
										.padStart(2, "0")}:${d
										.getMinutes()
										.toString()
										.padStart(2, "0")}`;
								}
							}

							return (
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
													backgroundColor: `${iconInfo.color}20`,
												},
											]}
										>
											<Ionicons
												name={iconInfo.icon}
												size={24}
												color={iconInfo.color}
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
											<View
												style={
													styles.transactionDetails
												}
											>
												<Text
													style={
														styles.transactionDate
													}
												>
													{dateStr} • {timeStr}
												</Text>
												<View
													style={
														styles.statusContainer
													}
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
							);
						})}
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
