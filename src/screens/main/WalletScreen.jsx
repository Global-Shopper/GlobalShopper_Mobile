import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function WalletScreen() {
	const [balance] = useState(2500000);

	const transactions = [
		{
			id: 1,
			type: "income",
			amount: 500000,
			description: "Hoàn thành đơn hàng #1234",
			date: "2024-01-15",
		},
		{
			id: 2,
			type: "expense",
			amount: -50000,
			description: "Phí dịch vụ",
			date: "2024-01-14",
		},
		{
			id: 3,
			type: "income",
			amount: 750000,
			description: "Hoàn thành đơn hàng #1233",
			date: "2024-01-13",
		},
	];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

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
					<Text style={styles.headerTitle}>Ví tiền</Text>
					<TouchableOpacity style={styles.historyButton}>
						<Ionicons
							name="time-outline"
							size={24}
							color="#ffffff"
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Balance Card */}
				<View style={styles.balanceCard}>
					<View style={styles.balanceHeader}>
						<Text className="text-sm text-muted-foreground">
							Số dư khả dụng
						</Text>
						<Ionicons name="eye-outline" size={20} color="#666" />
					</View>
					<Text style={styles.balanceAmount}>
						{formatCurrency(balance)}
					</Text>

					<View style={styles.balanceActions}>
						<TouchableOpacity style={styles.actionButton}>
							<Ionicons
								name="add-circle-outline"
								size={24}
								color="#007bff"
							/>
							<Text className="text-sm font-medium text-blue-600 mt-1">
								Nạp tiền
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton}>
							<Ionicons
								name="arrow-up-circle-outline"
								size={24}
								color="#28a745"
							/>
							<Text className="text-sm font-medium text-green-600 mt-1">
								Rút tiền
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton}>
							<Ionicons
								name="swap-horizontal-outline"
								size={24}
								color="#ffc107"
							/>
							<Text className="text-sm font-medium text-yellow-600 mt-1">
								Chuyển
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Ionicons
							name="trending-up-outline"
							size={20}
							color="#28a745"
						/>
						<View style={styles.statContent}>
							<Text className="text-sm text-muted-foreground">
								Thu nhập tháng
							</Text>
							<Text className="font-semibold text-green-600">
								{formatCurrency(1200000)}
							</Text>
						</View>
					</View>

					<View style={styles.statItem}>
						<Ionicons
							name="trending-down-outline"
							size={20}
							color="#dc3545"
						/>
						<View style={styles.statContent}>
							<Text className="text-sm text-muted-foreground">
								Chi tiêu tháng
							</Text>
							<Text className="font-semibold text-red-600">
								{formatCurrency(300000)}
							</Text>
						</View>
					</View>
				</View>

				{/* Recent Transactions */}
				<View style={styles.transactionsContainer}>
					<View style={styles.transactionsHeader}>
						<Text className="text-lg font-semibold">
							Giao dịch gần đây
						</Text>
						<TouchableOpacity>
							<Text className="text-blue-600 font-medium">
								Xem tất cả
							</Text>
						</TouchableOpacity>
					</View>

					{transactions.map((transaction) => (
						<View
							key={transaction.id}
							style={styles.transactionItem}
						>
							<View style={styles.transactionIcon}>
								<Ionicons
									name={
										transaction.type === "income"
											? "arrow-down-circle"
											: "arrow-up-circle"
									}
									size={24}
									color={
										transaction.type === "income"
											? "#28a745"
											: "#dc3545"
									}
								/>
							</View>

							<View style={styles.transactionContent}>
								<Text className="font-medium">
									{transaction.description}
								</Text>
								<Text className="text-sm text-muted-foreground">
									{transaction.date}
								</Text>
							</View>

							<Text
								style={[
									styles.transactionAmount,
									{
										color:
											transaction.type === "income"
												? "#28a745"
												: "#dc3545",
									},
								]}
							>
								{transaction.type === "income" ? "+" : ""}
								{formatCurrency(Math.abs(transaction.amount))}
							</Text>
						</View>
					))}
				</View>

				{/* Financial Tips */}
				<View style={styles.tipsContainer}>
					<Text className="text-lg font-semibold mb-3">
						Mẹo tài chính
					</Text>

					<View style={styles.tipCard}>
						<Ionicons
							name="bulb-outline"
							size={20}
							color="#ffc107"
						/>
						<Text className="text-sm ml-3 flex-1">
							Tiết kiệm ít nhất 20% thu nhập hàng tháng để đảm bảo
							tài chính ổn định.
						</Text>
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
	historyButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
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
	actionButton: {
		alignItems: "center",
		padding: 12,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	statItem: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 4,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	statContent: {
		marginLeft: 12,
		flex: 1,
	},
	transactionsContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	transactionsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	transactionItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	transactionIcon: {
		marginRight: 12,
	},
	transactionContent: {
		flex: 1,
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: "600",
	},
	tipsContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	tipCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff9c4",
		borderRadius: 8,
		padding: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#ffc107",
	},
});
