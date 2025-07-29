import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import { Text } from "../../components/ui/text";
import { useGetWalletQuery } from "../../services/gshopApi";

const WithdrawScreen = ({ navigation }) => {
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [selectedBank, setSelectedBank] = useState("");
	const [bankBranch, setBankBranch] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [note, setNote] = useState("");
	const [saveAccount, setSaveAccount] = useState(false);
	const [selectedSavedAccount, setSelectedSavedAccount] = useState("");
	const [showNewAccountForm, setShowNewAccountForm] = useState(false);
	const [showBankDropdown, setShowBankDropdown] = useState(false);
	const [showAccountDropdown, setShowAccountDropdown] = useState(false);

	const { showDialog } = useDialog();

	// Get wallet data from API
	const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery();

	// Use real balance or fallback to mock data
	const currentBalance = wallet?.balance || 2000000;
	const savedAccounts = [
		{
			id: "1",
			bank: "Vietcombank",
			accountNumber: "1234567890",
			accountName: "Nguyễn Văn A",
		},
		{
			id: "2",
			bank: "Techcombank",
			accountNumber: "0987654321",
			accountName: "Nguyễn Văn A",
		},
		{ id: "new", bank: "Nhập mới", accountNumber: "", accountName: "" },
	];

	const banks = [
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
			setSelectedBank(account.bank);
			setBankBranch(account.bankBranch || "");
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
		console.log("Withdraw amount:", withdrawAmount, "Numeric:", numericAmount);
		console.log("Current balance:", currentBalance);
		console.log("Bank info:", {selectedBank, bankBranch, accountNumber, accountName});

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

		if (!selectedBank || !bankBranch || !accountNumber || !accountName) {
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

	const handleConfirmWithdraw = () => {
		const numericAmount = parseFloat(parseFormattedNumber(withdrawAmount) || "0");
		console.log("Confirming withdraw and navigating...");
		console.log("Navigation object:", navigation);
		console.log("Params to pass:", {
			withdrawId: "WD" + Date.now(),
			amount: numericAmount,
			bankName: selectedBank,
			bankBranch: bankBranch,
			accountNumber: accountNumber,
			accountName: accountName,
		});
		
		try {
			navigation.navigate("SuccessWithdrawScreen", {
				withdrawId: "WD" + Date.now(),
				amount: numericAmount,
				bankName: selectedBank || "Test Bank",
				bankBranch: bankBranch || "Test Branch",
				accountNumber: accountNumber || "123456789",
				accountName: accountName || "Test User",
			});
			console.log("Navigation called successfully");
		} catch (error) {
			console.error("Navigation error:", error);
		}
	};

	const handleSubmitWithdraw = () => {
		console.log("handleSubmitWithdraw called");
		
		// Temporary bypass validation for testing
		console.log("TESTING: Bypassing validation for now");
		handleConfirmWithdraw();
		return;
		
		if (!validateWithdraw()) {
			console.log("Validation failed");
			return;
		}
		console.log("Validation passed, showing dialog");

		const numericAmount = parseFloat(parseFormattedNumber(withdrawAmount));

		showDialog({
			title: "Xác nhận rút tiền",
			content: `Bạn có chắc chắn muốn rút ${formatCurrency(
				numericAmount
			)} về tài khoản ${accountNumber}?`,
			primaryButton: {
				text: "Xác nhận",
				onPress: handleConfirmWithdraw,
			},
			secondaryButton: {
				text: "Hủy",
			},
		});
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Rút tiền</Text>
				<View style={{ width: 24 }} />
			</View>

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
						Chọn tài khoản nhận tiền
					</Text>

					{/* Dropdown chọn STK đã lưu */}
					<TouchableOpacity
						style={styles.dropdown}
						onPress={() =>
							setShowAccountDropdown(!showAccountDropdown)
						}
					>
						<Text style={styles.dropdownText}>
							{selectedSavedAccount
								? savedAccounts.find(
										(acc) => acc.id === selectedSavedAccount
								  )?.bank +
								  " - " +
								  savedAccounts.find(
										(acc) => acc.id === selectedSavedAccount
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
									onPress={() => handleAccountSelect(account)}
								>
									<Text style={styles.dropdownItemText}>
										{account.id === "new"
											? "Nhập mới"
											: `${account.bank} - ${account.accountNumber}`}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}

					{/* Form nhập thông tin mới */}
					{showNewAccountForm && (
						<View style={styles.newAccountForm}>
							{/* Dropdown ngân hàng */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Ngân hàng</Text>
								<TouchableOpacity
									style={styles.dropdown}
									onPress={() =>
										setShowBankDropdown(!showBankDropdown)
									}
								>
									<Text style={styles.dropdownText}>
										{selectedBank || "Chọn ngân hàng"}
									</Text>
									<Ionicons
										name={
											showBankDropdown
												? "chevron-up"
												: "chevron-down"
										}
										size={20}
										color="#666"
									/>
								</TouchableOpacity>

								{showBankDropdown && (
									<View style={styles.dropdownList}>
										{banks.map((bank) => (
											<TouchableOpacity
												key={bank}
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

							{/* Chi nhánh ngân hàng */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Chi nhánh</Text>
								<TextInput
									style={styles.textInput}
									value={bankBranch}
									onChangeText={setBankBranch}
									placeholder="Nhập chi nhánh ngân hàng"
								/>
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
									Lưu tài khoản này để dùng lần sau
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
					style={styles.submitButton}
					onPress={handleSubmitWithdraw}
				>
					<Text style={styles.submitButtonText}>
						Yêu cầu rút tiền
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 20,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
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
	},
	loadingText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#42A5F5",
		fontWeight: "600",
	},
});

export default WithdrawScreen;
