import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import { Text } from "../../components/ui/text";
import {
	useCreateBankAccountMutation,
	useGetBankAccountsQuery,
	useGetBanksQuery,
	useGetWalletQuery,
	useWithdrawWalletMutation,
} from "../../services/gshopApi";

const WithdrawScreen = ({ navigation }) => {
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [selectedBank, setSelectedBank] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [note, setNote] = useState("");
	const [saveAccount, setSaveAccount] = useState(false);
	const [selectedSavedAccount, setSelectedSavedAccount] = useState("");
	const [showNewAccountForm, setShowNewAccountForm] = useState(true); // Sẽ được cập nhật trong useEffect
	const [showBankDropdown, setShowBankDropdown] = useState(false);
	const [showAccountDropdown, setShowAccountDropdown] = useState(false);

	const { showDialog } = useDialog();

	// Get wallet data from API
	const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery();

	// Withdraw wallet mutation
	const [withdrawWallet, { isLoading: isWithdrawing }] =
		useWithdrawWalletMutation();

	// Get saved bank accounts from API
	const { data: savedBankAccounts = [], isLoading: isLoadingSavedAccounts } =
		useGetBankAccountsQuery();

	// Get banks list from API
	const { data: banksData = [], isLoading: isLoadingBanks } =
		useGetBanksQuery();

	// Create bank account mutation
	const [createBankAccount] = useCreateBankAccountMutation();

	// Use real balance or fallback to mock data
	const currentBalance = wallet?.balance || 2000000;

	// Use real saved accounts from API
	const savedAccounts =
		savedBankAccounts?.length > 0
			? [
					...savedBankAccounts,
					{
						id: "new",
						bankName: "Nhập mới",
						accountNumber: "",
						accountName: "",
					},
			  ]
			: [];

	// Use real banks from API with better error handling
	const banks = useMemo(() => {
		if (!banksData) return [];

		// Handle if banksData is array
		if (Array.isArray(banksData)) {
			return banksData
				.map(
					(bank) =>
						bank.name || bank.bankName || bank.shortName || bank
				)
				.filter(Boolean);
		}

		// Handle if banksData has a data property
		if (banksData.data && Array.isArray(banksData.data)) {
			return banksData.data
				.map(
					(bank) =>
						bank.name || bank.bankName || bank.shortName || bank
				)
				.filter(Boolean);
		}

		// Handle if banksData is object with banks property
		if (banksData.banks && Array.isArray(banksData.banks)) {
			return banksData.banks
				.map(
					(bank) =>
						bank.name || bank.bankName || bank.shortName || bank
				)
				.filter(Boolean);
		}

		return [];
	}, [banksData]);

	// Fallback banks if API fails or returns empty
	const fallbackBanks = [
		"Vietcombank",
		"Techcombank",
		"VietinBank",
		"BIDV",
		"Agribank",
		"MB Bank",
		"ACB",
		"Sacombank",
		"VPBank",
		"TPBank",
	];

	// Use fallback if no banks from API
	const finalBanks = banks.length > 0 ? banks : fallbackBanks;

	// Debug logging
	console.log("Banks data from API:", banksData);
	console.log("Mapped banks:", banks);
	console.log("Final banks to show:", finalBanks);

	// Update form visibility when saved accounts change
	useEffect(() => {
		// Nếu đang loading, không thay đổi gì
		if (isLoadingSavedAccounts) return;

		// Hiển thị form nhập mới nếu không có saved accounts
		setShowNewAccountForm(savedBankAccounts?.length === 0);
	}, [savedBankAccounts?.length, isLoadingSavedAccounts]);

	// Fetch banks from external API

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const formatNumberWithCommas = (value) => {
		// Remove all non-digit characters
		const numericValue = value.replace(/[^0-9]/g, "");
		// Add thousand separators
		return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	const parseFormattedNumber = (formattedValue) => {
		// Remove all dots to get the raw number
		return formattedValue.replace(/\./g, "");
	};

	const handleWithdrawAll = () => {
		setWithdrawAmount(formatNumberWithCommas(currentBalance.toString()));
	};

	const handleAccountSelect = (account) => {
		setSelectedSavedAccount(account.id);
		if (account.id === "new") {
			setShowNewAccountForm(true);
		} else {
			setShowNewAccountForm(false);
			setSelectedBank(account.bankName || account.bank);
			setAccountNumber(account.accountNumber);
			setAccountName(account.accountName);
		}
		setShowAccountDropdown(false);
	};

	const handleBankSelect = (bank) => {
		setSelectedBank(bank);
		setShowBankDropdown(false);
	};

	const validateWithdraw = () => {
		console.log("Starting validation...");
		const numericAmount = parseFloat(parseFormattedNumber(withdrawAmount));
		console.log(
			"Withdraw amount:",
			withdrawAmount,
			"Numeric:",
			numericAmount
		);
		console.log("Current balance:", currentBalance);
		console.log("Bank info:", {
			selectedBank,
			accountNumber,
			accountName,
		});

		if (!withdrawAmount || numericAmount <= 0) {
			console.log("Amount validation failed");
			showDialog({
				title: "Lỗi",
				content: "Vui lòng nhập số tiền hợp lệ",
				primaryButton: { text: "OK" },
			});
			return false;
		}

		if (numericAmount > currentBalance) {
			console.log("Balance validation failed");
			showDialog({
				title: "Lỗi",
				content: "Số tiền rút không được vượt quá số dư hiện tại",
				primaryButton: { text: "OK" },
			});
			return false;
		}

		if (!selectedBank || !accountNumber || !accountName) {
			console.log("Bank info validation failed");
			showDialog({
				title: "Lỗi",
				content: "Vui lòng điền đầy đủ thông tin tài khoản",
				primaryButton: { text: "OK" },
			});
			return false;
		}

		console.log("All validation passed!");
		return true;
	};

	const handleSubmitWithdraw = async () => {
		console.log("handleSubmitWithdraw called");

		// Validate form
		if (!validateWithdraw()) {
			return;
		}

		try {
			const numericAmount = parseFloat(
				parseFormattedNumber(withdrawAmount)
			);

			// Save bank account if user checked the option
			if (saveAccount) {
				try {
					const bankAccountData = {
						bankName: selectedBank,
						accountNumber: accountNumber,
						accountName: accountName,
					};
					await createBankAccount(bankAccountData).unwrap();
					console.log("Bank account saved successfully");
				} catch (error) {
					console.error("Failed to save bank account:", error);
					// Continue with withdrawal even if saving bank account fails
				}
			}

			const withdrawData = {
				amount: numericAmount,
				bankName: selectedBank,
				accountNumber: accountNumber,
				accountName: accountName,
				note: note || "",
			};

			console.log("Calling withdraw API with:", withdrawData);

			const result = await withdrawWallet(withdrawData).unwrap();

			console.log("Withdraw successful:", result);

			// Navigate to success screen
			navigation.navigate("SuccessWithdrawScreen", {
				withdrawId: result.id || "WD" + Date.now(),
				amount: numericAmount,
				bankName: selectedBank,
				accountNumber: accountNumber,
				accountName: accountName,
			});
		} catch (error) {
			console.error("Withdraw error:", error);

			showDialog({
				title: "Lỗi",
				content:
					error.message ||
					"Có lỗi xảy ra khi rút tiền. Vui lòng thử lại.",
				primaryButton: { text: "OK" },
			});
		}
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
					<Text style={styles.headerTitle}>Rút tiền</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Số dư ví */}
				<View style={styles.balanceCard}>
					<View style={styles.balanceRow}>
						<View style={styles.balanceHeader}>
							<Ionicons
								name="wallet-outline"
								size={24}
								color="#42A5F5"
							/>
							<Text style={styles.balanceLabel}>Số dư ví</Text>
						</View>
						{isWalletLoading ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator
									size="small"
									color="#42A5F5"
								/>
								<Text style={styles.loadingText}>
									Đang tải...
								</Text>
							</View>
						) : (
							<Text style={styles.balanceAmount}>
								{formatCurrency(currentBalance)}
							</Text>
						)}
					</View>
				</View>

				{/* Số tiền muốn rút */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Số tiền muốn rút</Text>
					<View style={styles.amountContainer}>
						<TextInput
							style={styles.amountInput}
							value={withdrawAmount}
							onChangeText={(text) => {
								// Format the input text with thousand separators
								const formattedText =
									formatNumberWithCommas(text);
								setWithdrawAmount(formattedText);
							}}
							placeholder="Nhập số tiền"
							keyboardType="numeric"
						/>
						<Text style={styles.currencySymbol}>₫</Text>
					</View>
					<TouchableOpacity
						style={styles.withdrawAllButton}
						onPress={handleWithdrawAll}
					>
						<Text style={styles.withdrawAllText}>Rút toàn bộ</Text>
						<Ionicons
							name="arrow-forward"
							size={16}
							color="#42A5F5"
						/>
					</TouchableOpacity>
				</View>

				{/* Chọn tài khoản */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Thông tin tài khoản nhận tiền
					</Text>

					{/* Chỉ hiển thị dropdown nếu có saved accounts */}
					{savedAccounts.length > 0 && (
						<>
							<TouchableOpacity
								style={styles.dropdown}
								onPress={() =>
									setShowAccountDropdown(!showAccountDropdown)
								}
							>
								<Text style={styles.dropdownText}>
									{selectedSavedAccount
										? savedAccounts.find(
												(acc) =>
													acc.id ===
													selectedSavedAccount
										  )?.bankName +
										  " - " +
										  savedAccounts.find(
												(acc) =>
													acc.id ===
													selectedSavedAccount
										  )?.accountNumber
										: "Chọn tài khoản đã lưu"}
								</Text>
								<Ionicons
									name={
										showAccountDropdown
											? "chevron-up"
											: "chevron-down"
									}
									size={20}
									color="#666"
								/>
							</TouchableOpacity>

							{showAccountDropdown && (
								<View style={styles.dropdownList}>
									{savedAccounts.map((account) => (
										<TouchableOpacity
											key={account.id}
											style={styles.dropdownItem}
											onPress={() =>
												handleAccountSelect(account)
											}
										>
											<Text
												style={styles.dropdownItemText}
											>
												{account.id === "new"
													? "Nhập mới"
													: `${
															account.bankName ||
															account.bank
													  } - ${
															account.accountNumber
													  }`}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</>
					)}

					{/* Form nhập thông tin (luôn hiển thị khi không có saved accounts) */}
					{(showNewAccountForm || savedAccounts.length === 0) && (
						<View
							style={
								savedAccounts.length === 0
									? styles.directAccountForm
									: styles.newAccountForm
							}
						>
							{/* Dropdown ngân hàng */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Ngân hàng</Text>
								<TouchableOpacity
									style={styles.dropdown}
									onPress={() =>
										setShowBankDropdown(!showBankDropdown)
									}
									disabled={isLoadingBanks}
								>
									<Text style={styles.dropdownText}>
										{isLoadingBanks
											? "Đang tải danh sách ngân hàng..."
											: selectedBank || "Chọn ngân hàng"}
									</Text>
									{isLoadingBanks ? (
										<ActivityIndicator
											size="small"
											color="#42A5F5"
										/>
									) : (
										<Ionicons
											name={
												showBankDropdown
													? "chevron-up"
													: "chevron-down"
											}
											size={20}
											color="#666"
										/>
									)}
								</TouchableOpacity>

								{showBankDropdown &&
									!isLoadingBanks &&
									finalBanks.length > 0 && (
										<View style={styles.dropdownList}>
											{finalBanks.map((bank, index) => (
												<TouchableOpacity
													key={`${bank}-${index}`}
													style={styles.dropdownItem}
													onPress={() =>
														handleBankSelect(bank)
													}
												>
													<Text
														style={
															styles.dropdownItemText
														}
													>
														{bank}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									)}
							</View>

							{/* Số tài khoản */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Số tài khoản
								</Text>
								<TextInput
									style={styles.textInput}
									value={accountNumber}
									onChangeText={setAccountNumber}
									placeholder="Nhập số tài khoản"
									keyboardType="numeric"
								/>
							</View>

							{/* Tên chủ tài khoản */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Tên chủ tài khoản
								</Text>
								<TextInput
									style={styles.textInput}
									value={accountName}
									onChangeText={setAccountName}
									placeholder="Nhập tên chủ tài khoản"
								/>
							</View>

							{/* Checkbox lưu tài khoản */}
							<TouchableOpacity
								style={styles.checkboxContainer}
								onPress={() => setSaveAccount(!saveAccount)}
							>
								<View
									style={[
										styles.checkbox,
										saveAccount && styles.checkedBox,
									]}
								>
									{saveAccount && (
										<Ionicons
											name="checkmark"
											size={16}
											color="#FFFFFF"
										/>
									)}
								</View>
								<Text style={styles.checkboxText}>
									Lưu thông tin tài khoản này cho lần rút tiền
									sau
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Ghi chú */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Ghi chú</Text>
					<TextInput
						style={styles.noteInput}
						value={note}
						onChangeText={setNote}
						placeholder="Nhập ghi chú (tùy chọn)"
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Nút gửi yêu cầu */}
				<TouchableOpacity
					style={[
						styles.submitButton,
						isWithdrawing && styles.submitButtonDisabled,
					]}
					onPress={handleSubmitWithdraw}
					disabled={isWithdrawing}
				>
					{isWithdrawing ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" color="#FFFFFF" />
							<Text
								style={[
									styles.submitButtonText,
									{ marginLeft: 8 },
								]}
							>
								Đang xử lý...
							</Text>
						</View>
					) : (
						<Text style={styles.submitButtonText}>
							Yêu cầu rút tiền
						</Text>
					)}
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
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
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	balanceCard: {
		backgroundColor: "#f8fafc",
		borderRadius: 16,
		padding: 20,
		marginTop: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	balanceRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	balanceHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	balanceLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginLeft: 8,
	},
	balanceAmount: {
		fontSize: 20,
		fontWeight: "700",
		color: "#42A5F5",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	amountContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	amountInput: {
		flex: 1,
		paddingVertical: 16,
		fontSize: 16,
		color: "#333",
	},
	currencySymbol: {
		fontSize: 16,
		fontWeight: "600",
		color: "#666",
		marginLeft: 8,
	},
	withdrawAllButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		paddingVertical: 8,
	},
	withdrawAllText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#42A5F5",
		marginRight: 4,
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
		paddingVertical: 16,
		marginBottom: 8,
	},
	dropdownText: {
		fontSize: 16,
		color: "#333",
		flex: 1,
	},
	dropdownList: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		marginBottom: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	dropdownItem: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#333",
	},
	newAccountForm: {
		marginTop: 16,
		padding: 16,
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	directAccountForm: {
		// Style cho form khi không có saved accounts (không cần background)
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	textInput: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
		paddingVertical: 16,
		fontSize: 16,
		color: "#333",
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#42A5F5",
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	checkedBox: {
		backgroundColor: "#42A5F5",
	},
	checkboxText: {
		fontSize: 14,
		color: "#333",
		flex: 1,
	},
	noteInput: {
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
		paddingVertical: 16,
		fontSize: 16,
		color: "#333",
		textAlignVertical: "top",
		minHeight: 80,
	},
	submitButton: {
		backgroundColor: "#42A5F5",
		borderRadius: 16,
		paddingVertical: 18,
		marginTop: 8,
		marginBottom: 40,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	submitButtonDisabled: {
		backgroundColor: "#94a3b8",
		shadowColor: "#94a3b8",
		shadowOpacity: 0.2,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#42A5F5",
		fontWeight: "600",
	},
});

export default WithdrawScreen;
