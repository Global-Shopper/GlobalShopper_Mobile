import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import {
	useCurrentUserTransactionsQuery,
	useGetWalletQuery,
} from "../../services/gshopApi";
import { getStatusColor, getStatusText } from "../../utils/statusHandler.js";

export default function WalletScreen({ navigation }) {
	const {
		data: wallet,
		isLoading: isWalletLoading,
		refetch,
	} = useGetWalletQuery();
	const {
		data: transactions,
		isLoading: isTransactionsLoading,
		refetch: refetchTransactions,
	} = useCurrentUserTransactionsQuery();
	const [isBalanceVisible, setIsBalanceVisible] = useState(true);

	useFocusEffect(
		useCallback(() => {
			refetch();
			refetchTransactions();
		}, [refetch, refetchTransactions])
	);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	// Get recent transactions (latest 3)
	const getTransactionsArray = () => {
		if (Array.isArray(transactions)) {
			return transactions;
		} else if (transactions?.data && Array.isArray(transactions.data)) {
			return transactions.data;
		} else if (
			transactions?.content &&
			Array.isArray(transactions.content)
		) {
			return transactions.content;
		} else if (
			transactions?.transactions &&
			Array.isArray(transactions.transactions)
		) {
			return transactions.transactions;
		}
		return [];
	};

	// Transform and format transactions with Vietnamese descriptions
	const formatTransactionForDisplay = (transaction) => {
		// Get Vietnamese description based on transaction type and data
		const getVietnameseDescription = (item) => {
			const type = (
				item.type ||
				item.transactionType ||
				""
			).toLowerCase();

			// If it's a payment/purchase transaction, show order info
			if (
				[
					"payment",
					"purchase",
					"buy",
					"order",
					"checkout",
					"pay",
				].includes(type)
			) {
				const orderId =
					item.orderId ||
					item.orderCode ||
					item.referenceId ||
					item.id;
				const shortId = orderId
					? orderId.toString().split("-")[0]
					: "N/A";
				return `Thanh toán đơn hàng #${shortId}`;
			}

			// For other types, use Vietnamese descriptions
			switch (type) {
				case "deposit":
				case "topup":
				case "top_up":
				case "add_money":
					return "Nạp tiền vào ví";
				case "withdrawal":
				case "withdraw":
				case "withdraw_money":
					return "Rút tiền từ ví";
				case "refund":
				case "cashback":
				case "return":
					return "Hoàn tiền";
				case "commission":
					return "Hoa hồng";
				case "fee":
					return "Phí dịch vụ";
				default:
					return (
						transaction.description ||
						transaction.note ||
						transaction.remarks ||
						`Giao dịch ${type || "không xác định"}`
					);
			}
		};

		return {
			...transaction,
			type: (
				transaction.type ||
				transaction.transactionType ||
				""
			).toLowerCase(),
			status: (
				transaction.status ||
				transaction.transactionStatus ||
				""
			).toLowerCase(),
			description: getVietnameseDescription(transaction),
		};
	};

	const recentTransactions = getTransactionsArray()
		.slice(0, 3)
		.map(formatTransactionForDisplay);

	// Format transaction data for display - updated to match TransactionHistoryScreen
	const formatTransactionIcon = (type) => {
		const iconMap = {
			deposit: { icon: "add-circle", color: "#4CAF50" },
			payment: { icon: "card", color: "#2196F3" },
			withdrawal: { icon: "arrow-up-circle", color: "#FF9800" },
			refund: { icon: "refresh-circle", color: "#9C27B0" },
			// Alternative naming
			topup: { icon: "add-circle", color: "#4CAF50" },
			top_up: { icon: "add-circle", color: "#4CAF50" },
			add_money: { icon: "add-circle", color: "#4CAF50" },
			purchase: { icon: "card", color: "#2196F3" },
			buy: { icon: "card", color: "#2196F3" },
			order: { icon: "card", color: "#2196F3" },
			checkout: { icon: "card", color: "#2196F3" },
			pay: { icon: "card", color: "#2196F3" },
			withdraw: { icon: "arrow-up-circle", color: "#FF9800" },
			withdraw_money: { icon: "arrow-up-circle", color: "#FF9800" },
			cashback: { icon: "refresh-circle", color: "#9C27B0" },
			return: { icon: "refresh-circle", color: "#9C27B0" },
			cancel: { icon: "refresh-circle", color: "#9C27B0" },
			commission: { icon: "trending-up", color: "#4CAF50" },
			fee: { icon: "remove-circle", color: "#F44336" },
			// Legacy support
			DEPOSIT: { icon: "add-circle", color: "#4CAF50" },
			WITHDRAWAL: { icon: "arrow-up-circle", color: "#FF9800" },
			REFUND: { icon: "refresh-circle", color: "#9C27B0" },
			SERVICE_FEE: { icon: "remove-circle", color: "#F44336" },
		};

		return (
			iconMap[type] ||
			iconMap[type?.toLowerCase()] || { icon: "card", color: "#2196F3" }
		);
	};

	const formatTransactionDate = (dateString) => {
		let dateStr = "";
		let timeStr = "";
		if (dateString) {
			let d;
			// Try different date formats
			if (typeof dateString === "string") {
				d = new Date(dateString);
			} else if (typeof dateString === "number") {
				// Handle both timestamp (ms) and Unix timestamp (seconds)
				d = new Date(
					dateString > 10000000000 ? dateString : dateString * 1000
				);
			} else {
				d = new Date();
			}

			if (!isNaN(d.getTime())) {
				dateStr = `${d.getDate().toString().padStart(2, "0")}/${(
					d.getMonth() + 1
				)
					.toString()
					.padStart(2, "0")}/${d.getFullYear()}`;
				timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
					.getMinutes()
					.toString()
					.padStart(2, "0")}`;
			}
		}
		return { dateStr, timeStr };
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Ví của tôi"
				notificationCount={3}
				chatCount={1}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Balance Card */}
				<View style={styles.balanceCard}>
					<View style={styles.balanceHeader}>
						<Text style={styles.balanceLabel}>Số dư khả dụng</Text>
						<TouchableOpacity
							onPress={() =>
								setIsBalanceVisible(!isBalanceVisible)
							}
						>
							<Ionicons
								name={
									isBalanceVisible
										? "eye-outline"
										: "eye-off-outline"
								}
								size={20}
								color="#666"
							/>
						</TouchableOpacity>
					</View>

					<Text style={styles.balanceAmount}>
						{isBalanceVisible
							? formatCurrency(wallet?.balance)
							: "*******"}
					</Text>

					<View style={styles.balanceActions}>
						<TouchableOpacity
							style={styles.primaryActionButton}
							onPress={() => navigation.navigate("TopUp")}
						>
							<LinearGradient
								colors={["#42A5F5", "#1976D2"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.actionGradient}
							>
								<Ionicons
									name="add-circle-outline"
									size={28}
									color="#ffffff"
								/>
								<Text style={styles.actionText}>Nạp tiền</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.secondaryActionButton}
							onPress={() => navigation.navigate("Withdraw")}
						>
							<View style={styles.actionContainer}>
								<Ionicons
									name="arrow-up-circle-outline"
									size={28}
									color="#42A5F5"
								/>
								<Text style={styles.secondaryActionText}>
									Rút tiền
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.secondaryActionButton}
							onPress={() =>
								navigation.navigate("TransactionHistory", {
									initialTab: "refund",
								})
							}
						>
							<View style={styles.actionContainer}>
								<Ionicons
									name="refresh-circle-outline"
									size={28}
									color="#42A5F5"
								/>
								<Text style={styles.secondaryActionText}>
									Hoàn tiền
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				{/* Recent Transactions */}
				<View style={styles.transactionsContainer}>
					<View style={styles.transactionsHeader}>
						<Text style={styles.sectionTitle}>
							Giao dịch gần đây
						</Text>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("TransactionHistory")
							}
						>
							<Text style={styles.viewAllText}>
								Lịch sử giao dịch
							</Text>
						</TouchableOpacity>
					</View>

					{isTransactionsLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" color="#42A5F5" />
							<Text style={styles.loadingText}>Đang tải...</Text>
						</View>
					) : recentTransactions.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Ionicons
								name="receipt-outline"
								size={48}
								color="#ccc"
							/>
							<Text style={styles.emptyText}>
								Chưa có giao dịch nào
							</Text>
						</View>
					) : (
						recentTransactions.map((transaction, index) => {
							const iconData = formatTransactionIcon(
								transaction.type
							);
							const { dateStr, timeStr } = formatTransactionDate(
								transaction.createdAt
							);
							return (
								<View
									key={transaction.id}
									style={[
										styles.transactionItem,
										index ===
											recentTransactions.length - 1 && {
											borderBottomWidth: 0,
										},
									]}
								>
									<View style={styles.transactionLeft}>
										<View
											style={[
												styles.transactionIcon,
												{
													backgroundColor: `${iconData.color}20`,
												},
											]}
										>
											<Ionicons
												name={iconData.icon}
												size={24}
												color={iconData.color}
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
												color: (() => {
													// Payment/purchase transactions should always be red (money going out)
													if (
														[
															"payment",
															"purchase",
															"buy",
															"order",
															"checkout",
															"pay",
														].includes(
															transaction.type
														)
													) {
														return "#F44336"; // Red for payments
													}
													// For other transactions, use amount to determine color
													return transaction.amount >
														0
														? "#4CAF50"
														: "#F44336";
												})(),
											},
										]}
									>
										{(() => {
											// Payment/purchase transactions should show minus sign
											if (
												[
													"payment",
													"purchase",
													"buy",
													"order",
													"checkout",
													"pay",
												].includes(transaction.type)
											) {
												return "-"; // Always minus for payments
											}
											// For other transactions, show + for positive amounts
											return transaction.amount > 0
												? "+"
												: "";
										})()}
										{formatCurrency(
											Math.abs(transaction.amount)
										)}
									</Text>
								</View>
							);
						})
					)}
				</View>

				{/* Quick Info */}
				<View style={styles.quickInfoContainer}>
					<View style={styles.infoCard}>
						<Ionicons
							name="shield-checkmark-outline"
							size={24}
							color="#42A5F5"
						/>
						<View style={styles.infoContent}>
							<Text style={styles.infoTitle}>Bảo mật</Text>
							<Text style={styles.infoSubtitle}>
								Ví được bảo vệ bởi mã PIN
							</Text>
						</View>
					</View>

					<View style={styles.infoCard}>
						<Ionicons
							name="flash-outline"
							size={24}
							color="#42A5F5"
						/>
						<View style={styles.infoContent}>
							<Text style={styles.infoTitle}>
								Giao dịch nhanh
							</Text>
							<Text style={styles.infoSubtitle}>
								Xử lý trong vòng 24h
							</Text>
						</View>
					</View>

					<View style={[styles.infoCard, { borderBottomWidth: 0 }]}>
						<Ionicons
							name="headset-outline"
							size={24}
							color="#42A5F5"
						/>
						<View style={styles.infoContent}>
							<Text style={styles.infoTitle}>Hỗ trợ 24/7</Text>
							<Text style={styles.infoSubtitle}>
								Luôn sẵn sàng hỗ trợ bạn
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	balanceCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 24,
		marginTop: -30,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	balanceHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	balanceLabel: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	balanceAmount: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
	},
	balanceActions: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	primaryActionButton: {
		flex: 1,
		marginRight: 8,
		borderRadius: 12,
		overflow: "hidden",
	},
	actionGradient: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	actionText: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "600",
		marginTop: 4,
	},
	secondaryActionButton: {
		flex: 1,
		marginHorizontal: 4,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E3F2FD",
		overflow: "hidden",
	},
	actionContainer: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	secondaryActionText: {
		color: "#42A5F5",
		fontSize: 14,
		fontWeight: "600",
		marginTop: 4,
	},
	transactionsContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	transactionsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#f8f9fa",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1a1a1a",
	},
	viewAllText: {
		fontSize: 14,
		color: "#42A5F5",
		fontWeight: "500",
	},
	transactionItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f8f9fa",
	},
	transactionLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	transactionIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
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
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	loadingText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#6c757d",
	},
	emptyContainer: {
		alignItems: "center",
		paddingVertical: 30,
	},
	emptyText: {
		fontSize: 14,
		color: "#6c757d",
		marginTop: 8,
	},
	quickInfoContainer: {
		marginTop: 10,
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f8f9fa",
	},
	infoContent: {
		marginLeft: 12,
		flex: 1,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
		marginBottom: 2,
	},
	infoSubtitle: {
		fontSize: 14,
		color: "#6c757d",
	},
});
