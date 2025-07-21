import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useGetWalletQuery } from "../../services/gshopApi";

import { useRoute } from '@react-navigation/native';

export default function WalletScreen({ navigation }) {
	const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
	const [isBalanceVisible, setIsBalanceVisible] = useState(true);
	const route = useRoute();

	useEffect(() => {
		console.log('VNPayGateWay URL:', route?.path);
	}, [route?.path]);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const recentTransactions = [
		{
			id: 1,
			type: "income",
			amount: 500000,
			description: "Nạp tiền",
			date: "Hôm nay",
			icon: "add-circle",
			color: "#4CAF50",
		},
		{
			id: 2,
			type: "expense",
			amount: -50000,
			description: "Phí dịch vụ",
			date: "Hôm qua",
			icon: "remove-circle",
			color: "#F44336",
		},
		{
			id: 3,
			type: "income",
			amount: 750000,
			description: "Hoàn tiền đơn #1234",
			date: "2 ngày trước",
			icon: "refresh-circle",
			color: "#FF9800",
		},
	];

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

						<TouchableOpacity style={styles.secondaryActionButton}>
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

						<TouchableOpacity style={styles.secondaryActionButton}>
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

					{recentTransactions.map((transaction, index) => (
						<View
							key={transaction.id}
							style={[
								styles.transactionItem,
								index === recentTransactions.length - 1 && {
									borderBottomWidth: 0,
								},
							]}
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
										size={20}
										color={transaction.color}
									/>
								</View>
								<View style={styles.transactionInfo}>
									<Text style={styles.transactionDescription}>
										{transaction.description}
									</Text>
									<Text style={styles.transactionDate}>
										{transaction.date}
									</Text>
								</View>
							</View>
							<Text
								style={[
									styles.transactionAmount,
									{
										color:
											transaction.type === "income"
												? "#4CAF50"
												: "#F44336",
									},
								]}
							>
								{transaction.type === "income" ? "+" : ""}
								{formatCurrency(Math.abs(transaction.amount))}
							</Text>
						</View>
					))}
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
		fontWeight: "500",
		color: "#1a1a1a",
		marginBottom: 2,
	},
	transactionDate: {
		fontSize: 14,
		color: "#6c757d",
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: "600",
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
