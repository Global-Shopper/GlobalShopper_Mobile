import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";

const StatisticScreen = ({ navigation }) => {
	console.log("StatisticScreen component mounted");

	const [statistics, setStatistics] = useState({
		totalRequests: 0,
		requestsByStatus: {
			pending: 0,
			processing: 0,
			completed: 0,
			cancelled: 0,
		},
		totalOrders: 0,
		ordersByStatus: {
			pending: 0,
			confirmed: 0,
			shipping: 0,
			delivered: 0,
			cancelled: 0,
		},
		totalRefunds: 0,
		refundsByStatus: {
			pending: 0,
			approved: 0,
			rejected: 0,
		},
		totalWithdrawals: 0,
		withdrawalsByStatus: {
			pending: 0,
			approved: 0,
			rejected: 0,
		},
	});

	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState("month"); // day, week, month, year

	useEffect(() => {
		loadStatistics();
	}, [selectedPeriod]);

	const loadStatistics = async () => {
		try {
			setLoading(true);
			// TODO: Implement API call to fetch statistics
			// const response = await gshopApi.getStatistics(selectedPeriod);

			// Mock data for demo
			setTimeout(() => {
				setStatistics({
					totalRequests: 245,
					requestsByStatus: {
						pending: 23,
						processing: 45,
						completed: 156,
						cancelled: 21,
					},
					totalOrders: 189,
					ordersByStatus: {
						pending: 12,
						confirmed: 34,
						shipping: 28,
						delivered: 98,
						cancelled: 17,
					},
					totalRefunds: 32,
					refundsByStatus: {
						pending: 8,
						approved: 20,
						rejected: 4,
					},
					totalWithdrawals: 56,
					withdrawalsByStatus: {
						pending: 5,
						approved: 45,
						rejected: 6,
					},
				});
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Error loading statistics:", error);
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadStatistics();
		setRefreshing(false);
	};

	const getStatusColor = (status) => {
		const colors = {
			pending: "#FF9500",
			processing: "#007AFF",
			confirmed: "#007AFF",
			shipping: "#5856D6",
			completed: "#34C759",
			delivered: "#34C759",
			approved: "#34C759",
			cancelled: "#FF3B30",
			rejected: "#FF3B30",
		};
		return colors[status] || "#8E8E93";
	};

	const StatCard = ({ title, value, icon, color = "#007AFF", children }) => (
		<View style={[styles.statCard, { borderLeftColor: color }]}>
			<View style={styles.statHeader}>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: color + "20" },
					]}
				>
					<Ionicons name={icon} size={24} color={color} />
				</View>
				<View style={styles.statInfo}>
					<Text style={styles.statTitle}>{title}</Text>
					<Text style={[styles.statValue, { color }]}>{value}</Text>
				</View>
			</View>
			{children}
		</View>
	);

	const StatusItem = ({ label, count, status }) => (
		<View style={styles.statusItem}>
			<View style={styles.statusLeft}>
				<View
					style={[
						styles.statusDot,
						{ backgroundColor: getStatusColor(status) },
					]}
				/>
				<Text style={styles.statusLabel}>{label}</Text>
			</View>
			<Text
				style={[styles.statusCount, { color: getStatusColor(status) }]}
			>
				{count}
			</Text>
		</View>
	);

	const PeriodSelector = () => (
		<View style={styles.periodSelector}>
			{["day", "week", "month", "year"].map((period) => (
				<TouchableOpacity
					key={period}
					style={[
						styles.periodButton,
						selectedPeriod === period && styles.periodButtonActive,
					]}
					onPress={() => setSelectedPeriod(period)}
				>
					<Text
						style={[
							styles.periodText,
							selectedPeriod === period &&
								styles.periodTextActive,
						]}
					>
						{period === "day" && "Ngày"}
						{period === "week" && "Tuần"}
						{period === "month" && "Tháng"}
						{period === "year" && "Năm"}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor="#fff" barStyle="dark-content" />
				<Header
					title="Thống kê"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#007AFF" />
					<Text style={styles.loadingText}>Đang tải thống kê...</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />
			<Header
				title="Thống kê"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<ScrollView
				style={styles.content}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<PeriodSelector />

				{/* Requests Statistics */}
				<StatCard
					title="Yêu cầu mua hàng"
					value={statistics.totalRequests}
					icon="document-text-outline"
					color="#007AFF"
				>
					<View style={styles.statusList}>
						<StatusItem
							label="Đang chờ"
							count={statistics.requestsByStatus.pending}
							status="pending"
						/>
						<StatusItem
							label="Đang xử lý"
							count={statistics.requestsByStatus.processing}
							status="processing"
						/>
						<StatusItem
							label="Hoàn thành"
							count={statistics.requestsByStatus.completed}
							status="completed"
						/>
						<StatusItem
							label="Đã hủy"
							count={statistics.requestsByStatus.cancelled}
							status="cancelled"
						/>
					</View>
				</StatCard>

				{/* Orders Statistics */}
				<StatCard
					title="Đơn hàng"
					value={statistics.totalOrders}
					icon="bag-outline"
					color="#5856D6"
				>
					<View style={styles.statusList}>
						<StatusItem
							label="Chờ xác nhận"
							count={statistics.ordersByStatus.pending}
							status="pending"
						/>
						<StatusItem
							label="Đã xác nhận"
							count={statistics.ordersByStatus.confirmed}
							status="confirmed"
						/>
						<StatusItem
							label="Đang giao"
							count={statistics.ordersByStatus.shipping}
							status="shipping"
						/>
						<StatusItem
							label="Đã giao"
							count={statistics.ordersByStatus.delivered}
							status="delivered"
						/>
						<StatusItem
							label="Đã hủy"
							count={statistics.ordersByStatus.cancelled}
							status="cancelled"
						/>
					</View>
				</StatCard>

				{/* Refunds Statistics */}
				<StatCard
					title="Hoàn tiền"
					value={statistics.totalRefunds}
					icon="return-down-back-outline"
					color="#FF9500"
				>
					<View style={styles.statusList}>
						<StatusItem
							label="Đang chờ"
							count={statistics.refundsByStatus.pending}
							status="pending"
						/>
						<StatusItem
							label="Đã duyệt"
							count={statistics.refundsByStatus.approved}
							status="approved"
						/>
						<StatusItem
							label="Từ chối"
							count={statistics.refundsByStatus.rejected}
							status="rejected"
						/>
					</View>
				</StatCard>

				{/* Withdrawals Statistics */}
				<StatCard
					title="Rút tiền"
					value={statistics.totalWithdrawals}
					icon="wallet-outline"
					color="#FF6B35"
				>
					<View style={styles.statusList}>
						<StatusItem
							label="Đang chờ"
							count={statistics.withdrawalsByStatus.pending}
							status="pending"
						/>
						<StatusItem
							label="Đã duyệt"
							count={statistics.withdrawalsByStatus.approved}
							status="approved"
						/>
						<StatusItem
							label="Từ chối"
							count={statistics.withdrawalsByStatus.rejected}
							status="rejected"
						/>
					</View>
				</StatCard>

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#8E8E93",
	},
	periodSelector: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 4,
		marginVertical: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	periodButton: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	periodButtonActive: {
		backgroundColor: "#007AFF",
	},
	periodText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#8E8E93",
	},
	periodTextActive: {
		color: "#FFFFFF",
	},
	statCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		borderLeftWidth: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	statHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	statInfo: {
		flex: 1,
	},
	statTitle: {
		fontSize: 14,
		color: "#8E8E93",
		marginBottom: 4,
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
	},
	statusList: {
		gap: 8,
	},
	statusItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
	},
	statusLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 8,
	},
	statusLabel: {
		fontSize: 14,
		color: "#1C1C1E",
	},
	statusCount: {
		fontSize: 16,
		fontWeight: "600",
	},
	bottomSpacing: {
		height: 20,
	},
});

export default StatisticScreen;
