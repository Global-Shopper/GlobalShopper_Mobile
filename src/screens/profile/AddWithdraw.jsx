import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import {
	useCreateBankAccountMutation,
	useUpdateBankAccountMutation,
} from "../../services/gshopApi";
import { getBanks, searchBanks } from "../../services/vietqrAPI";

const AddWithdraw = ({ navigation, route }) => {
	const { showDialog, Dialog } = useDialog();
	const { account, isEdit } = route.params || {};

	// Form state - thêm selectedBankInfo để lưu thông tin ngân hàng đã chọn
	const [formData, setFormData] = useState({
		bankAccountNumber: "",
		providerName: "",
		accountHolderName: "",
		expirationDate: "",
		default: false,
	});

	// Bank selection state
	const [selectedBankInfo, setSelectedBankInfo] = useState(null);
	const [showBankSelection, setShowBankSelection] = useState(true);

	// Validation state
	const [errors, setErrors] = useState({});

	// Dropdown state for bank selection
	const [showBankDropdown, setShowBankDropdown] = useState(false);

	// Banks from VietQR Service
	const [banks, setBanks] = useState([]);
	const [filteredBanks, setFilteredBanks] = useState([]);
	const [banksLoading, setBanksLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Mutations
	const [createBankAccount, { isLoading: isCreating }] =
		useCreateBankAccountMutation();
	const [updateBankAccount, { isLoading: isUpdating }] =
		useUpdateBankAccountMutation();

	// Fetch banks from VietQR Service
	useEffect(() => {
		const loadBanks = async () => {
			console.log("AddWithdraw: Starting to load banks...");
			setBanksLoading(true);
			try {
				const banksData = await getBanks();
				setBanks(banksData);
				setFilteredBanks(banksData);
				console.log(
					`AddWithdraw: Loaded ${banksData.length} banks from VietQR service`
				);
				console.log("AddWithdraw: First bank:", banksData[0]);
			} catch (error) {
				console.error("AddWithdraw: Error loading banks:", error);
			} finally {
				setBanksLoading(false);
			}
		};

		loadBanks();
	}, []);

	// Handle search banks
	const handleSearchBanks = async (query) => {
		setSearchQuery(query);
		if (!query.trim()) {
			setFilteredBanks(banks);
			setShowBankDropdown(false);
			return;
		}

		try {
			const filtered = await searchBanks(query);
			setFilteredBanks(filtered);
			setShowBankDropdown(filtered.length > 0);
		} catch (error) {
			console.error("Search error:", error);
			setFilteredBanks([]);
			setShowBankDropdown(false);
		}
	};

	// Populate form if editing
	useEffect(() => {
		if (isEdit && account) {
			setFormData({
				bankAccountNumber: account.bankAccountNumber || "",
				providerName: account.providerName || "",
				accountHolderName: account.accountHolderName || "",
				expirationDate: account.expirationDate || "",
				default: account.default || false,
			});

			// Find bank info if editing
			if (account.providerName && banks.length > 0) {
				const bankInfo = banks.find(
					(bank) =>
						bank.shortName === account.providerName ||
						bank.name === account.providerName
				);
				if (bankInfo) {
					setSelectedBankInfo(bankInfo);
					setShowBankSelection(false);
				}
			}
		}
	}, [isEdit, account, banks]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.bankAccountNumber.trim()) {
			newErrors.bankAccountNumber = "Số tài khoản không được để trống";
		} else if (!/^\d{8,20}$/.test(formData.bankAccountNumber.trim())) {
			newErrors.bankAccountNumber = "Số tài khoản phải từ 8-20 chữ số";
		}

		// Check if bank is selected (either through selectedBankInfo or providerName)
		if (!selectedBankInfo && !formData.providerName.trim()) {
			newErrors.providerName = "Vui lòng chọn ngân hàng";
		}

		if (!formData.accountHolderName.trim()) {
			newErrors.accountHolderName =
				"Tên chủ tài khoản không được để trống";
		} else if (formData.accountHolderName.trim().length < 2) {
			newErrors.accountHolderName =
				"Tên chủ tài khoản phải có ít nhất 2 ký tự";
		}

		// Expiration date validation (optional)
		if (formData.expirationDate.trim()) {
			const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
			if (!dateRegex.test(formData.expirationDate.trim())) {
				newErrors.expirationDate = "Định dạng ngày hết hạn: MM/YY";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error for this field
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleBankSelect = (bank) => {
		console.log("Selected bank:", bank);
		setSelectedBankInfo(bank);
		handleInputChange("providerName", bank.shortName);
		setShowBankDropdown(false);
		setShowBankSelection(false);
		setSearchQuery(""); // Clear search
	};

	const handleChangeBankSelection = () => {
		setShowBankSelection(true);
		setSelectedBankInfo(null);
		handleInputChange("providerName", "");
		setSearchQuery(""); // Clear search
		setFilteredBanks(banks); // Show all banks
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			// Ensure we have providerName from selected bank or form data
			const providerName = selectedBankInfo
				? selectedBankInfo.shortName
				: formData.providerName.trim();

			const payload = {
				bankAccountNumber: formData.bankAccountNumber.trim(),
				providerName: providerName,
				accountHolderName: formData.accountHolderName.trim(),
				expirationDate: formData.expirationDate.trim() || null,
				default: formData.default,
			};

			console.log("Submit payload:", payload);
			console.log("Form data check:", {
				accountNumber: formData.accountNumber,
				accountHolderName: formData.accountHolderName,
				bankId: formData.bankId,
				bankName: formData.bankName,
				isEdit,
				accountId: account?.id,
			});

			if (isEdit && account) {
				console.log("Updating bank account with ID:", account.id);
				await updateBankAccount({
					id: account.id,
					...payload,
				}).unwrap();

				showDialog({
					title: "Thành công",
					content: "Bạn đã cập nhật tài khoản rút tiền thành công!",
					primaryButton: {
						text: "OK",
						onPress: () => {
							console.log("Dialog onPress triggered");
							if (navigation && navigation.goBack) {
								navigation.goBack();
							}
						},
					},
				});
			} else {
				await createBankAccount(payload).unwrap();

				showDialog({
					title: "Thành công",
					content: "Bạn đã thêm tài khoản rút tiền thành công!",
					primaryButton: {
						text: "OK",
						onPress: () => {
							console.log("Dialog onPress triggered");
							if (navigation && navigation.goBack) {
								navigation.goBack();
							}
						},
					},
				});
			}
		} catch (error) {
			console.error("Submit error:", error);
			console.error("Error details:", JSON.stringify(error, null, 2));

			let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

			if (error.status === 400) {
				errorMessage = "Thông tin tài khoản không hợp lệ";
				console.error("400 Error - Request data:", {
					accountNumber: formData.accountNumber,
					accountHolderName: formData.accountHolderName,
					bankId: formData.bankId,
					bankName: formData.bankName,
				});
			} else if (error.status === 409) {
				errorMessage = "Tài khoản ngân hàng này đã tồn tại";
			} else if (error.message) {
				errorMessage = error.message;
			}

			showDialog({
				title: "Lỗi",
				content: errorMessage,
				primaryButton: {
					text: "OK",
					onPress: () => {
						console.log("Error dialog closed");
					},
				},
			});
		}
	};

	const renderFormField = (label, field, placeholder, options = {}) => (
		<View style={styles.formGroup}>
			<Text style={styles.label}>
				{label}{" "}
				{options.required && <Text style={styles.required}>*</Text>}
			</Text>

			{field === "providerName" ? (
				<TouchableOpacity
					style={[
						styles.input,
						styles.dropdownButton,
						errors[field] && styles.inputError,
					]}
					onPress={() => setShowBankDropdown(!showBankDropdown)}
				>
					<Text
						style={[
							styles.dropdownText,
							!formData[field] && styles.placeholderText,
						]}
					>
						{formData[field] || placeholder}
					</Text>
					<Ionicons
						name={showBankDropdown ? "chevron-up" : "chevron-down"}
						size={20}
						color="#6B7280"
					/>
				</TouchableOpacity>
			) : field === "default" ? (
				<TouchableOpacity
					style={styles.checkboxContainer}
					onPress={() => handleInputChange(field, !formData[field])}
				>
					<View
						style={[
							styles.checkbox,
							formData[field] && styles.checkboxChecked,
						]}
					>
						{formData[field] && (
							<Ionicons
								name="checkmark"
								size={16}
								color="#FFFFFF"
							/>
						)}
					</View>
					<Text style={styles.checkboxLabel}>
						Đặt làm tài khoản mặc định
					</Text>
				</TouchableOpacity>
			) : (
				<TextInput
					style={[styles.input, errors[field] && styles.inputError]}
					placeholder={placeholder}
					placeholderTextColor="#9CA3AF"
					value={formData[field]}
					onChangeText={(text) => {
						// Auto uppercase for accountHolderName
						const value =
							field === "accountHolderName"
								? text.toUpperCase()
								: text;
						handleInputChange(field, value);
					}}
					keyboardType={options.keyboardType || "default"}
					autoCapitalize={
						field === "accountHolderName" ? "characters" : "none"
					}
					autoCorrect={false}
				/>
			)}

			{errors[field] && (
				<Text style={styles.errorText}>{errors[field]}</Text>
			)}
		</View>
	);

	const renderBankSelection = () => {
		if (!showBankSelection && selectedBankInfo) {
			// Hiển thị ngân hàng đã chọn
			return (
				<View style={styles.formGroup}>
					<Text style={styles.label}>
						Ngân hàng <Text style={styles.required}>*</Text>
					</Text>
					<View style={styles.selectedBankContainer}>
						<View style={styles.selectedBankInfo}>
							<View style={styles.selectedBankLogoContainer}>
								<Image
									source={{ uri: selectedBankInfo.logo }}
									style={styles.selectedBankLogo}
									resizeMode="contain"
									onError={(e) => {
										console.log(
											"Failed to load logo:",
											selectedBankInfo.logo
										);
									}}
								/>
							</View>
							<View style={styles.selectedBankText}>
								<Text style={styles.selectedBankShortName}>
									{selectedBankInfo.shortName}
								</Text>
								<Text style={styles.selectedBankFullName}>
									{selectedBankInfo.name}
								</Text>
							</View>
						</View>
						<TouchableOpacity
							style={styles.changeBankButton}
							onPress={handleChangeBankSelection}
						>
							<Ionicons
								name="create-outline"
								size={16}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
					</View>
				</View>
			);
		}

		// Hiển thị dropdown chọn ngân hàng
		return (
			<View style={styles.formGroup}>
				<Text style={styles.label}>
					Ngân hàng <Text style={styles.required}>*</Text>
				</Text>
				<View style={styles.searchInputContainer}>
					<TextInput
						style={[
							styles.searchTextInput,
							errors.providerName && styles.inputError,
						]}
						placeholder="Nhập tên ngân hàng (vcb, bidv, acb...)"
						placeholderTextColor="#9CA3AF"
						value={searchQuery}
						onChangeText={handleSearchBanks}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<Ionicons
						name="search"
						size={20}
						color="#6B7280"
						style={styles.searchIcon}
					/>
				</View>
				{renderBankDropdown()}
				{errors.providerName && (
					<Text style={styles.errorText}>{errors.providerName}</Text>
				)}
			</View>
		);
	};

	const renderBankDropdown = () => {
		if (!showBankDropdown) return null;

		return (
			<View style={styles.dropdown}>
				{banksLoading ? (
					<View style={styles.dropdownLoading}>
						<ActivityIndicator size="small" color="#42A5F5" />
						<Text style={styles.dropdownLoadingText}>
							Đang tải danh sách ngân hàng...
						</Text>
					</View>
				) : filteredBanks.length === 0 ? (
					<View style={styles.dropdownEmpty}>
						<Text style={styles.dropdownEmptyText}>
							{searchQuery
								? `Không tìm thấy "${searchQuery}"`
								: "Không có dữ liệu ngân hàng"}
						</Text>
					</View>
				) : (
					<ScrollView
						style={styles.dropdownScroll}
						showsVerticalScrollIndicator={false}
					>
						{filteredBanks.map((bank) => (
							<TouchableOpacity
								key={bank.id || bank.bin}
								style={styles.dropdownItem}
								onPress={() => handleBankSelect(bank)}
							>
								<View style={styles.bankItemContainer}>
									<View style={styles.bankLogoContainer}>
										<Image
											source={{ uri: bank.logo }}
											style={styles.bankLogo}
											resizeMode="contain"
											onError={(e) => {
												console.log(
													"Failed to load bank logo:",
													bank.logo
												);
											}}
										/>
									</View>
									<View style={styles.bankItemText}>
										<Text style={styles.bankShortName}>
											{bank.shortName}
										</Text>
										<Text style={styles.bankFullName}>
											{bank.name}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />

			{/* Header */}
			<Header
				title={isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				showNotificationIcon={false}
				showChatIcon={false}
			/>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.form}>
					{/* Bank Selection - FIRST */}
					{renderBankSelection()}

					{/* Show other fields always after bank selection is shown */}
					{renderFormField(
						"Số tài khoản",
						"bankAccountNumber",
						"Nhập số tài khoản ngân hàng",
						{ required: true, keyboardType: "numeric" }
					)}

					{renderFormField(
						"Tên chủ tài khoản",
						"accountHolderName",
						"Nhập tên chủ tài khoản",
						{ required: true }
					)}

					{renderFormField(
						"Ngày hết hạn",
						"expirationDate",
						"MM/YY (Tùy chọn)",
						{ required: false }
					)}

					{/* Checkbox without label */}
					<View style={styles.formGroup}>
						<TouchableOpacity
							style={styles.checkboxContainer}
							onPress={() =>
								handleInputChange("default", !formData.default)
							}
						>
							<View
								style={[
									styles.checkbox,
									formData.default && styles.checkboxChecked,
								]}
							>
								{formData.default && (
									<Ionicons
										name="checkmark"
										size={16}
										color="#FFFFFF"
									/>
								)}
							</View>
							<Text style={styles.checkboxLabel}>
								Đặt làm tài khoản mặc định
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Submit Button */}
				<TouchableOpacity
					style={[
						styles.submitButton,
						(isCreating || isUpdating) &&
							styles.submitButtonDisabled,
					]}
					onPress={handleSubmit}
					disabled={isCreating || isUpdating}
				>
					{isCreating || isUpdating ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : (
						<Text style={styles.submitButtonText}>
							{isEdit ? "Cập nhật" : "Thêm tài khoản"}
						</Text>
					)}
				</TouchableOpacity>

				{/* Dialog */}
				<Dialog />
			</ScrollView>
		</KeyboardAvoidingView>
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
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	form: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	formGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 8,
	},
	required: {
		color: "#EF4444",
	},
	input: {
		borderWidth: 1,
		borderColor: "#D1D5DB",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#111827",
		backgroundColor: "#FFFFFF",
	},
	inputError: {
		borderColor: "#EF4444",
	},
	inputText: {
		fontSize: 16,
		color: "#111827",
	},
	placeholderText: {
		color: "#9CA3AF",
	},
	dropdownButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	dropdownText: {
		fontSize: 16,
		color: "#111827",
		flex: 1,
	},
	dropdown: {
		position: "absolute",
		top: 85,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#D1D5DB",
		maxHeight: 200,
		zIndex: 1000,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	dropdownScroll: {
		maxHeight: 180,
	},
	dropdownItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	bankItemContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	bankItemText: {
		flex: 1,
		marginLeft: 12,
	},
	bankShortName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 2,
	},
	bankFullName: {
		fontSize: 12,
		color: "#6B7280",
		lineHeight: 16,
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#374151",
	},
	dropdownLoading: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	dropdownLoadingText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#6B7280",
	},
	dropdownEmpty: {
		alignItems: "center",
		paddingVertical: 20,
	},
	dropdownEmptyText: {
		fontSize: 14,
		color: "#9CA3AF",
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#D1D5DB",
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	checkboxChecked: {
		backgroundColor: "#42A5F5",
		borderColor: "#42A5F5",
	},
	checkboxLabel: {
		fontSize: 14,
		color: "#374151",
	},
	errorText: {
		fontSize: 12,
		color: "#EF4444",
		marginTop: 4,
	},
	submitButton: {
		backgroundColor: "#42A5F5",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 30,
	},
	submitButtonDisabled: {
		backgroundColor: "#9CA3AF",
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	// Selected bank styles
	selectedBankContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#F0F7FF",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#42A5F5",
	},
	selectedBankInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	bankLogoSmall: {
		width: 32,
		height: 32,
		borderRadius: 8,
		backgroundColor: "#F3F4F6",
	},
	selectedBankText: {
		flex: 1,
	},
	selectedBankShortName: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1976D2",
		marginBottom: 4,
	},
	selectedBankFullName: {
		fontSize: 13,
		color: "#6B7280",
		lineHeight: 18,
	},
	changeBankButton: {
		backgroundColor: "#42A5F5",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 32,
		minHeight: 32,
	},
	changeBankText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	// Search input styles
	searchInputContainer: {
		position: "relative",
	},
	searchTextInput: {
		borderWidth: 1,
		borderColor: "#D1D5DB",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		paddingRight: 50,
		fontSize: 16,
		color: "#111827",
		backgroundColor: "#FFFFFF",
	},
	searchIcon: {
		position: "absolute",
		right: 16,
		top: "50%",
		marginTop: -10,
	},
	// Logo styles
	bankLogoContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: "#F9FAFB",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	bankLogo: {
		width: 32,
		height: 32,
	},
	selectedBankLogoContainer: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: "#F9FAFB",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
		overflow: "hidden",
	},
	selectedBankLogo: {
		width: 48,
		height: 48,
	},
});

export default AddWithdraw;
