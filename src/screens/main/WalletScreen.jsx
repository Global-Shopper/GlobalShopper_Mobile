import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function WalletScreen() {
	const [balance] = useState(2500000);
	const [isBalanceVisible, setIsBalanceVisible] = useState(true);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Ví của tôi"
				notificationCount={3}
				chatCount={1}
				onNotificationPress={() => console.log("Notification pressed")}
				onChatPress={() => console.log("Chat pressed")}
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
							? formatCurrency(balance)
							: "●●●●●●●●"}
					</Text>

					<View style={styles.balanceActions}>
						<TouchableOpacity style={styles.primaryActionButton}>
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

				{/* Quick Info */}
				<View style={styles.infoContainer}>
					<Text style={styles.sectionTitle}>Thông tin ví</Text>

					<View style={styles.infoCard}>
						<View style={styles.infoItem}>
							<Ionicons
								name="shield-checkmark"
								size={20}
								color="#4CAF50"
							/>
							<Text style={styles.infoText}>
								Ví của bạn được bảo mật bằng công nghệ mã hóa
								tiên tiến
							</Text>
						</View>

						<View style={styles.infoItem}>
							<Ionicons name="time" size={20} color="#2196F3" />
							<Text style={styles.infoText}>
								Giao dịch được xử lý trong vòng 24h
							</Text>
						</View>

						<View style={styles.infoItem}>
							<Ionicons name="call" size={20} color="#FF9800" />
							<Text style={styles.infoText}>
								Hỗ trợ 24/7 qua hotline: 1900-xxxx
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
	quickInfoContainer: {
		marginTop: 20,
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 16,
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
