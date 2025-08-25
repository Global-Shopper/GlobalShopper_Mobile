import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import {
	useDeleteBankAccountMutation,
	useGetBankAccountsQuery,
	useUpdateBankAccountMutation,
} from "../../services/gshopApi";
import { getBanks } from "../../services/vietqrAPI";

const WithdrawList = ({ navigation }) => {
	const { showDialog, Dialog } = useDialog();
	const [banks, setBanks] = useState([]);

	// Get bank accounts from API
	const {
		data: bankAccounts = [],
		isLoading,
		error,
		refetch,
	} = useGetBankAccountsQuery();

	// Load banks data for logos
	useEffect(() => {
		const loadBanks = async () => {
			try {
				const banksData = await getBanks();
				setBanks(banksData);
			} catch (error) {
				console.error("Error loading banks:", error);
			}
		};
		loadBanks();
	}, []);

	// Function to get bank logo URL
	const getBankLogo = (bankAccount) => {
		if (!bankAccount?.providerName || banks.length === 0) {
			return null;
		}

		const providerName = bankAccount.providerName.toUpperCase().trim();

		console.log("getBankLogo debug:", {
			providerName: providerName,
			banksAvailable: banks.length,
			searchingIn: banks
				.map((b) => ({
					id: b.id,
					name: b.name?.toUpperCase(),
					shortName: b.short_name?.toUpperCase(),
					code: b.code?.toUpperCase(),
				}))
				.slice(0, 5),
		});

		// Try to match by different name variations
		const bank = banks.find((b) => {
			const bankName = b.name?.toUpperCase().trim() || "";
			const bankShortName = b.short_name?.toUpperCase().trim() || "";
			const bankCode = b.code?.toUpperCase().trim() || "";

			// Direct name match
			if (bankName === providerName) return true;
			if (bankShortName === providerName) return true;
			if (bankCode === providerName) return true;

			// Partial matches for common variations
			if (
				bankName.includes(providerName) ||
				providerName.includes(bankName)
			)
				return true;
			if (
				bankShortName.includes(providerName) ||
				providerName.includes(bankShortName)
			)
				return true;

			// Special cases for Vietnamese bank name variations
			if (
				providerName === "VIETINBANK" &&
				(bankName.includes("VIETINBANK") ||
					bankShortName.includes("VTB") ||
					bankCode === "VTB")
			)
				return true;
			if (
				providerName === "VIETCOMBANK" &&
				(bankName.includes("VIETCOMBANK") ||
					bankShortName.includes("VCB") ||
					bankCode === "VCB")
			)
				return true;
			if (
				providerName === "TECHCOMBANK" &&
				(bankName.includes("TECHCOMBANK") ||
					bankShortName.includes("TCB") ||
					bankCode === "TCB")
			)
				return true;
			if (
				providerName === "AGRIBANK" &&
				(bankName.includes("AGRIBANK") ||
					bankShortName.includes("AGRI") ||
					bankCode === "AGRI")
			)
				return true;
			if (
				providerName === "BIDV" &&
				(bankName.includes("BIDV") || bankCode === "BIDV")
			)
				return true;
			if (
				providerName === "SACOMBANK" &&
				(bankName.includes("SACOMBANK") ||
					bankShortName.includes("SCB") ||
					bankCode === "SCB")
			)
				return true;
			if (
				providerName === "MBBANK" &&
				(bankName.includes("MBBANK") ||
					bankShortName.includes("MBB") ||
					bankCode === "MBB")
			)
				return true;
			if (
				providerName === "VPBANK" &&
				(bankName.includes("VPBANK") || bankCode === "VPB")
			)
				return true;

			return false;
		});

		console.log("getBankLogo result:", {
			providerName: providerName,
			foundBank: bank
				? {
						id: bank.id,
						name: bank.name,
						shortName: bank.short_name,
						code: bank.code,
						hasLogo: !!bank.logo,
				  }
				: null,
			logoUrl: bank?.logo || null,
		});

		return bank?.logo || null;
	};

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

	// Debug banks data
	console.log("WithdrawList - Banks data:", {
		banksCount: banks.length,
		banks: banks.slice(0, 3), // Log first 3 banks
	});

	// Debug bank matching
	if (bankAccounts.length > 0) {
		console.log("WithdrawList - Bank matching debug:", {
			firstAccount: bankAccounts[0],
			providerName: bankAccounts[0]?.providerName,
			allAccountFields: Object.keys(bankAccounts[0] || {}),
			matchedByName: banks.find(
				(b) =>
					b.name
						?.toUpperCase()
						.includes(
							bankAccounts[0]?.providerName?.toUpperCase()
						) ||
					b.short_name
						?.toUpperCase()
						.includes(bankAccounts[0]?.providerName?.toUpperCase())
			),
			vietinbankMatch: banks.find(
				(b) =>
					b.name?.toUpperCase().includes("VIETINBANK") ||
					b.short_name?.toUpperCase().includes("VTB")
			),
			allBankNames: banks
				.map((b) => ({
					name: b.name,
					shortName: b.short_name,
					code: b.code,
				}))
				.slice(0, 10), // First 10 banks with details
		});
	}

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
						// Just refetch data - let the UI update speak for itself
						refetch();
						console.log("Bank account deleted successfully");
					} catch (error) {
						console.error("Delete error:", error);
						// Only show dialog for errors, not success
						setTimeout(() => {
							showDialog({
								title: "Lỗi",
								content:
									error.message ||
									"Có lỗi xảy ra khi xóa tài khoản",
								primaryButton: {
									text: "OK",
									onPress: () => {
										console.log("Error dialog closed");
									},
								},
							});
						}, 200);
					}
				},
			},
			secondaryButton: {
				text: "Hủy",
				onPress: () => {
					console.log("Delete cancelled");
				},
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

	const renderBankAccountItem = ({ item }) => {
		console.log("renderBankAccountItem - Processing:", {
			providerName: item.providerName,
			accountNumber: item.bankAccountNumber?.slice(-4),
		});

		const bankLogo = getBankLogo(item);

		return (
			<View style={styles.accountCard}>
				<View style={styles.accountHeader}>
					<View style={styles.bankInfo}>
						<View style={styles.bankIconContainer}>
							{bankLogo ? (
								<Image
									source={{ uri: bankLogo }}
									style={styles.bankLogo}
									resizeMode="contain"
								/>
							) : (
								<Ionicons
									name="card"
									size={24}
									color="#42A5F5"
								/>
							)}
						</View>
						<View style={styles.bankDetails}>
							<Text style={styles.bankName}>
								{item.providerName}
							</Text>
							<Text style={styles.accountNumber}>
								**** **** ****{" "}
								{item.bankAccountNumber?.slice(-4)}
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
							style={[
								styles.actionButton,
								styles.setDefaultButton,
							]}
							onPress={() => handleSetDefault(item.id)}
							disabled={isUpdating}
						>
							{isUpdating ? (
								<ActivityIndicator
									size="small"
									color="#FFFFFF"
								/>
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
						<Ionicons name="pencil" size={16} color="#FFFFFF" />
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
								<Ionicons
									name="trash"
									size={16}
									color="#FFFFFF"
								/>
								<Text style={styles.actionButtonText}>Xóa</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			</View>
		);
	};

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
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />

			{/* Header */}
			<Header
				title="Tài khoản rút tiền"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				showNotificationIcon={false}
				showChatIcon={false}
				rightButton={
					<TouchableOpacity
						style={styles.addButton}
						onPress={handleAddAccount}
					>
						<Ionicons name="add" size={24} color="#007AFF" />
					</TouchableOpacity>
				}
			/>

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
		borderRadius: 20,
		padding: 24,
		marginBottom: 16,
		shadowColor: "#1E293B",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 5,
		borderWidth: 1,
		borderColor: "#F1F5F9",
	},
	accountHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 20,
	},
	bankInfo: {
		flexDirection: "row",
		flex: 1,
	},
	bankIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: "#F8FAFC",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	bankLogo: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	bankDetails: {
		flex: 1,
	},
	bankName: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1E293B",
		marginBottom: 4,
	},
	accountNumber: {
		fontSize: 15,
		color: "#475569",
		fontWeight: "600",
		letterSpacing: 1,
		marginBottom: 4,
	},
	accountHolder: {
		fontSize: 14,
		color: "#64748B",
		marginBottom: 2,
	},
	expirationDate: {
		fontSize: 12,
		color: "#94A3B8",
		fontStyle: "italic",
	},
	defaultBadge: {
		backgroundColor: "#059669",
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		shadowColor: "#059669",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	defaultText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#FFFFFF",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	accountActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 8,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		gap: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		minWidth: 80,
		justifyContent: "center",
	},
	setDefaultButton: {
		backgroundColor: "#059669",
	},
	editButton: {
		backgroundColor: "#0EA5E9",
	},
	deleteButton: {
		backgroundColor: "#DC2626",
	},
	actionButtonText: {
		fontSize: 13,
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
