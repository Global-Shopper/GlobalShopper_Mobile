import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	ActivityIndicator,
	FlatList,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import { Text } from "../../components/ui/text";
import {
	useDeleteBankAccountMutation,
	useGetBankAccountsQuery,
	useUpdateBankAccountMutation,
} from "../../services/gshopApi";

const WithdrawList = ({ navigation }) => {
	const { showDialog, Dialog } = useDialog();

	// Get bank accounts from API
	const {
		data: bankAccounts = [],
		isLoading,
		error,
		refetch,
	} = useGetBankAccountsQuery();

	// Debug logging
	console.log("WithdrawList - API Response:", {
		bankAccounts,
		isLoading,
		error,
		dataType: typeof bankAccounts,
		dataLength: Array.isArray(bankAccounts)
			? bankAccounts.length
			: "not array",
	});

	// Delete bank account mutation
	const [deleteBankAccount, { isLoading: isDeleting }] =
		useDeleteBankAccountMutation();

	// Update bank account mutation (for setting default)
	const [updateBankAccount, { isLoading: isUpdating }] =
		useUpdateBankAccountMutation();

	const handleAddAccount = () => {
		navigation.navigate("AddWithdraw");
	};

	const handleEditAccount = (account) => {
		navigation.navigate("AddWithdraw", {
			account,
			isEdit: true,
		});
	};

	const handleDeleteAccount = (accountId, accountInfo) => {
		showDialog({
			title: "Xác nhận xóa",
			content: `Bạn có chắc chắn muốn xóa tài khoản ${accountInfo.providerName} - ${accountInfo.bankAccountNumber}?`,
			primaryButton: {
				text: "Xóa",
				onPress: async () => {
					try {
						await deleteBankAccount(accountId).unwrap();
						showDialog({
							title: "Thành công",
							content: "Đã xóa tài khoản ngân hàng thành công",
							primaryButton: { text: "OK" },
						});
					} catch (error) {
						console.error("Delete error:", error);
						showDialog({
							title: "Lỗi",
							content:
								error.message ||
								"Có lỗi xảy ra khi xóa tài khoản",
							primaryButton: { text: "OK" },
						});
					}
				},
			},
			secondaryButton: {
				text: "Hủy",
			},
		});
	};

	const handleSetDefault = async (accountId) => {
		try {
			await updateBankAccount({
				id: accountId,
				default: true,
			}).unwrap();

			showDialog({
				title: "Thành công",
				content: "Đã đặt làm tài khoản mặc định",
				primaryButton: { text: "OK" },
			});
		} catch (error) {
			console.error("Update error:", error);
			showDialog({
				title: "Lỗi",
				content:
					error.message || "Có lỗi xảy ra khi cập nhật tài khoản",
				primaryButton: { text: "OK" },
			});
		}
	};

	const renderBankAccountItem = ({ item }) => (
		<View style={styles.accountCard}>
			<View style={styles.accountHeader}>
				<View style={styles.bankInfo}>
					<View style={styles.bankIconContainer}>
						<Ionicons name="card" size={24} color="#42A5F5" />
					</View>
					<View style={styles.bankDetails}>
						<Text style={styles.bankName}>{item.providerName}</Text>
						<Text style={styles.accountNumber}>
							**** **** **** {item.bankAccountNumber?.slice(-4)}
						</Text>
						<Text style={styles.accountHolder}>
							{item.accountHolderName}
						</Text>
						{item.expirationDate && (
							<Text style={styles.expirationDate}>
								Hết hạn: {item.expirationDate}
							</Text>
						)}
					</View>
				</View>

				{item.default && (
					<View style={styles.defaultBadge}>
						<Text style={styles.defaultText}>Mặc định</Text>
					</View>
				)}
			</View>

			<View style={styles.accountActions}>
				{!item.default && (
					<TouchableOpacity
						style={[styles.actionButton, styles.setDefaultButton]}
						onPress={() => handleSetDefault(item.id)}
						disabled={isUpdating}
					>
						{isUpdating ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<>
								<Ionicons
									name="checkmark-circle"
									size={16}
									color="#FFFFFF"
								/>
								<Text style={styles.actionButtonText}>
									Đặt mặc định
								</Text>
							</>
						)}
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={[styles.actionButton, styles.editButton]}
					onPress={() => handleEditAccount(item)}
				>
					<Ionicons name="create" size={16} color="#FFFFFF" />
					<Text style={styles.actionButtonText}>Sửa</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, styles.deleteButton]}
					onPress={() => handleDeleteAccount(item.id, item)}
					disabled={isDeleting}
				>
					{isDeleting ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : (
						<>
							<Ionicons name="trash" size={16} color="#FFFFFF" />
							<Text style={styles.actionButtonText}>Xóa</Text>
						</>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderEmptyState = () => (
		<View style={styles.emptyState}>
			<Ionicons name="card-outline" size={64} color="#CBD5E1" />
			<Text style={styles.emptyTitle}>Chưa có tài khoản nào</Text>
			<Text style={styles.emptySubtitle}>
				Thêm tài khoản ngân hàng để thuận tiện cho việc rút tiền
			</Text>
			<TouchableOpacity
				style={styles.addFirstButton}
				onPress={handleAddAccount}
			>
				<Text style={styles.addFirstButtonText}>
					Thêm tài khoản đầu tiên
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderContent = () => {
		if (isLoading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#42A5F5" />
					<Text style={styles.loadingText}>
						Đang tải danh sách tài khoản...
					</Text>
				</View>
			);
		}

		if (error) {
			return (
				<View style={styles.errorContainer}>
					<Ionicons name="alert-circle" size={48} color="#EF4444" />
					<Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
					<Text style={styles.errorMessage}>
						{error.message || "Không thể tải danh sách tài khoản"}
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={refetch}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			);
		}

		if (!bankAccounts || bankAccounts.length === 0) {
			return renderEmptyState();
		}

		return (
			<FlatList
				data={bankAccounts}
				renderItem={renderBankAccountItem}
				keyExtractor={(item) => item.id?.toString()}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1976D2" barStyle="light-content" />

			{/* Header */}
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Tài khoản rút tiền</Text>
					<TouchableOpacity
						style={styles.addButton}
						onPress={handleAddAccount}
					>
						<Ionicons name="add" size={24} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
			</LinearGradient>

			{/* Content */}
			<View style={styles.content}>{renderContent()}</View>

			{/* Dialog */}
			<Dialog />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	header: {
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	listContent: {
		paddingBottom: 20,
	},
	accountCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	accountHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 16,
	},
	bankInfo: {
		flexDirection: "row",
		flex: 1,
	},
	bankIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#F0F7FF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	bankDetails: {
		flex: 1,
	},
	bankName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F2937",
		marginBottom: 4,
	},
	accountNumber: {
		fontSize: 14,
		color: "#6B7280",
		marginBottom: 4,
	},
	accountHolder: {
		fontSize: 14,
		color: "#374151",
		marginBottom: 4,
	},
	expirationDate: {
		fontSize: 12,
		color: "#9CA3AF",
	},
	defaultBadge: {
		backgroundColor: "#10B981",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	defaultText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	accountActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		flexWrap: "wrap",
		gap: 8,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		gap: 4,
	},
	setDefaultButton: {
		backgroundColor: "#10B981",
	},
	editButton: {
		backgroundColor: "#F59E0B",
	},
	deleteButton: {
		backgroundColor: "#EF4444",
	},
	actionButtonText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#374151",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	emptySubtitle: {
		fontSize: 14,
		color: "#6B7280",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
	},
	addFirstButton: {
		backgroundColor: "#42A5F5",
		borderRadius: 12,
		paddingHorizontal: 24,
		paddingVertical: 12,
	},
	addFirstButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		fontSize: 16,
		color: "#6B7280",
		marginTop: 12,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#374151",
		marginTop: 16,
		marginBottom: 8,
	},
	errorMessage: {
		fontSize: 14,
		color: "#6B7280",
		textAlign: "center",
		marginBottom: 24,
	},
	retryButton: {
		backgroundColor: "#42A5F5",
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

export default WithdrawList;
