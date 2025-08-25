import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Header from "../../components/header";
import {
	useCurrentUserTransactionsQuery,
	useGetAllOrdersQuery,
	useGetAllRefundTicketsQuery,
	useGetPurchaseRequestQuery,
} from "../../services/gshopApi";

const StatisticScreen = ({ navigation }) => {
	console.log("StatisticScreen component mounted");

	const [statistics, setStatistics] = useState({
		totalRequests: 0,
		onlineRequests: 0,
		offlineRequests: 0,
		requestsByStatus: {
			PENDING: 0,
			PROCESSING: 0,
			COMPLETED: 0,
			CANCELLED: 0,
			QUOTED: 0,
			PAID: 0,
		},
		totalOrders: 0,
		ordersByStatus: {
			PENDING: 0,
			CONFIRMED: 0,
			PROCESSING: 0,
			SHIPPING: 0,
			DELIVERED: 0,
			CANCELLED: 0,
		},
		totalRefunds: 0,
		totalWithdrawals: 0,
	});

	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// API queries
	const {
		data: purchaseRequestsData,
		isLoading: loadingPR,
		refetch: refetchPR,
	} = useGetPurchaseRequestQuery({ size: 1000 });
	const {
		data: ordersData,
		isLoading: loadingOrders,
		refetch: refetchOrders,
	} = useGetAllOrdersQuery({ size: 1000 });
	const {
		data: transactionsData,
		isLoading: loadingTransactions,
		refetch: refetchTransactions,
	} = useCurrentUserTransactionsQuery();
	const {
		data: refundsData,
		isLoading: loadingRefunds,
		refetch: refetchRefunds,
	} = useGetAllRefundTicketsQuery({ size: 1000 });

	useEffect(() => {
		if (
			!loadingPR &&
			!loadingOrders &&
			!loadingTransactions &&
			!loadingRefunds
		) {
			calculateStatistics();
			setLoading(false);
		}
	}, [
		purchaseRequestsData,
		ordersData,
		transactionsData,
		refundsData,
		loadingPR,
		loadingOrders,
		loadingTransactions,
		loadingRefunds,
		calculateStatistics,
	]);

	const calculateStatistics = useCallback(() => {
		console.log("Calculating statistics...");
		console.log("Purchase requests data:", purchaseRequestsData);
		console.log("Orders data:", ordersData);
		console.log("Transactions data:", transactionsData);
		console.log("Refunds data:", refundsData);

		// Xử lý Purchase Requests
		let totalRequests = 0;
		let onlineRequests = 0;
		let offlineRequests = 0;
		const requestsByStatus = {
			PENDING: 0,
			PROCESSING: 0,
			COMPLETED: 0,
			CANCELLED: 0,
			QUOTED: 0,
			PAID: 0,
		};

		if (purchaseRequestsData?.content) {
			const requests = purchaseRequestsData.content;
			totalRequests = requests.length; // Tổng số tất cả yêu cầu

			console.log("Total requests found:", totalRequests);

			requests.forEach((request, index) => {
				const status = request.status?.toUpperCase();

				// Đếm theo status
				if (requestsByStatus.hasOwnProperty(status)) {
					requestsByStatus[status]++;
				}

				// Phân loại online/offline theo requestType
				const requestType = request.requestType?.toUpperCase();

				if (index < 5) {
					// Log first 5 requests for debugging
					console.log(`Request ${index + 1}:`, {
						id: request.id,
						requestType: request.requestType,
						status: request.status,
					});
				}

				if (requestType === "ONLINE") {
					onlineRequests++;
				} else if (requestType === "OFFLINE") {
					offlineRequests++;
				}
			});

			console.log("Final counts:", {
				totalRequests,
				onlineRequests,
				offlineRequests,
			});
		}

		// Xử lý Orders
		let totalOrders = 0;
		const ordersByStatus = {
			PENDING: 0,
			CONFIRMED: 0,
			PROCESSING: 0,
			SHIPPING: 0,
			DELIVERED: 0,
			CANCELLED: 0,
		};

		if (ordersData?.content) {
			const orders = ordersData.content;
			totalOrders = orders.length; // Tổng số tất cả đơn hàng

			orders.forEach((order) => {
				const status = order.status?.toUpperCase();

				// Đếm theo status
				if (ordersByStatus.hasOwnProperty(status)) {
					ordersByStatus[status]++;
				}
			});
		}

		// Xử lý Transactions để đếm withdrawals
		let totalWithdrawals = 0;
		if (transactionsData?.content) {
			const transactions = transactionsData.content;
			totalWithdrawals = transactions.filter(
				(transaction) =>
					transaction.type === "WITHDRAW" ||
					transaction.description?.includes("rút tiền")
			).length;
		}

		// Xử lý Refunds
		let totalRefunds = 0;
		if (refundsData?.content) {
			totalRefunds = refundsData.content.length;
		}

		setStatistics({
			totalRequests,
			onlineRequests,
			offlineRequests,
			requestsByStatus,
			totalOrders,
			ordersByStatus,
			totalRefunds,
			totalWithdrawals,
		});
	}, [purchaseRequestsData, ordersData, transactionsData, refundsData]);

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([
			refetchPR(),
			refetchOrders(),
			refetchTransactions(),
			refetchRefunds(),
		]);
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
			quoted: "#5AC8FA",
			paid: "#30D158",
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
				{/* Requests Statistics */}
				<StatCard
					title="Yêu cầu mua hàng"
					value={statistics.totalRequests}
					icon="document-text-outline"
					color="#007AFF"
				>
					<View style={styles.statusList}>
						<StatusItem
							label="Online"
							count={statistics.onlineRequests}
							status="processing"
						/>
						<StatusItem
							label="Offline"
							count={statistics.offlineRequests}
							status="pending"
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
							label="Đã giao"
							count={statistics.ordersByStatus.DELIVERED}
							status="delivered"
						/>
						<StatusItem
							label="Đã hủy"
							count={statistics.ordersByStatus.CANCELLED}
							status="cancelled"
						/>
					</View>
				</StatCard>

				{/* Refunds and Withdrawals Statistics - Side by Side */}
				<View style={styles.rowContainer}>
					<View style={styles.halfCard}>
						<StatCard
							title="Yêu cầu hoàn tiền"
							value={statistics.totalRefunds}
							icon="return-down-back-outline"
							color="#FF9500"
						/>
					</View>
					<View style={styles.halfCard}>
						<StatCard
							title="Yêu cầu rút tiền"
							value={statistics.totalWithdrawals}
							icon="wallet-outline"
							color="#FF6B35"
						/>
					</View>
				</View>

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: "#8E8E93",
	},
	statCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderLeftWidth: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
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
		marginBottom: 12,
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
	comingSoonText: {
		fontSize: 14,
		color: "#8E8E93",
		fontStyle: "italic",
		textAlign: "center",
		paddingVertical: 12,
	},
	bottomSpacing: {
		height: 20,
	},
	rowContainer: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 16,
	},
	halfCard: {
		flex: 1,
	},
});

export default StatisticScreen;
