import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import { Text } from "../../components/ui/text";
import {
	useCreateBankAccountMutation,
	useGetBanksQuery,
	useUpdateBankAccountMutation,
} from "../../services/gshopApi";

const AddWithdraw = ({ navigation, route }) => {
	const { showDialog, Dialog } = useDialog();
	const { account, isEdit } = route.params || {};

	// Form state
	const [formData, setFormData] = useState({
		bankAccountNumber: "",
		providerName: "",
		accountHolderName: "",
		expirationDate: "",
		default: false,
	});

	// Validation state
	const [errors, setErrors] = useState({});

	// Dropdown state for bank selection
	const [showBankDropdown, setShowBankDropdown] = useState(false);

	// Get banks from API
	const { data: banks = [], isLoading: banksLoading } = useGetBanksQuery();

	// Mutations
	const [createBankAccount, { isLoading: isCreating }] =
		useCreateBankAccountMutation();
	const [updateBankAccount, { isLoading: isUpdating }] =
		useUpdateBankAccountMutation();

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
		}
	}, [isEdit, account]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.bankAccountNumber.trim()) {
			newErrors.bankAccountNumber = "Số tài khoản không được để trống";
		} else if (!/^\d{8,20}$/.test(formData.bankAccountNumber.trim())) {
			newErrors.bankAccountNumber = "Số tài khoản phải từ 8-20 chữ số";
		}

		if (!formData.providerName.trim()) {
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

	const handleBankSelect = (bankName) => {
		handleInputChange("providerName", bankName);
		setShowBankDropdown(false);
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			const payload = {
				bankAccountNumber: formData.bankAccountNumber.trim(),
				providerName: formData.providerName.trim(),
				accountHolderName: formData.accountHolderName.trim(),
				expirationDate: formData.expirationDate.trim() || null,
				default: formData.default,
			};

			if (isEdit && account) {
				await updateBankAccount({
					id: account.id,
					...payload,
				}).unwrap();

				showDialog({
					title: "Thành công",
					content: "Đã cập nhật tài khoản ngân hàng thành công",
					primaryButton: {
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				});
			} else {
				await createBankAccount(payload).unwrap();

				showDialog({
					title: "Thành công",
					content: "Đã thêm tài khoản ngân hàng thành công",
					primaryButton: {
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				});
			}
		} catch (error) {
			console.error("Submit error:", error);

			let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

			if (error.status === 400) {
				errorMessage = "Thông tin tài khoản không hợp lệ";
			} else if (error.status === 409) {
				errorMessage = "Tài khoản ngân hàng này đã tồn tại";
			} else if (error.message) {
				errorMessage = error.message;
			}

			showDialog({
				title: "Lỗi",
				content: errorMessage,
				primaryButton: { text: "OK" },
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
				<TouchableOpacity
					style={[styles.input, errors[field] && styles.inputError]}
					onPress={() => {
						Alert.prompt(
							label,
							placeholder,
							(text) => handleInputChange(field, text),
							"plain-text",
							formData[field],
							options.keyboardType || "default"
						);
					}}
				>
					<Text
						style={[
							styles.inputText,
							!formData[field] && styles.placeholderText,
						]}
					>
						{formData[field] || placeholder}
					</Text>
				</TouchableOpacity>
			)}

			{errors[field] && (
				<Text style={styles.errorText}>{errors[field]}</Text>
			)}
		</View>
	);

	const renderBankDropdown = () => {
		if (!showBankDropdown) return null;

		return (
			<View style={styles.dropdown}>
				{banksLoading ? (
					<View style={styles.dropdownLoading}>
						<ActivityIndicator size="small" color="#42A5F5" />
						<Text style={styles.dropdownLoadingText}>
							Đang tải...
						</Text>
					</View>
				) : banks.length === 0 ? (
					<View style={styles.dropdownEmpty}>
						<Text style={styles.dropdownEmptyText}>
							Không có dữ liệu ngân hàng
						</Text>
					</View>
				) : (
					<ScrollView
						style={styles.dropdownScroll}
						showsVerticalScrollIndicator={false}
					>
						{banks.map((bank) => (
							<TouchableOpacity
								key={bank.id || bank.name}
								style={styles.dropdownItem}
								onPress={() => handleBankSelect(bank.name)}
							>
								<Text style={styles.dropdownItemText}>
									{bank.name}
								</Text>
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
					<Text style={styles.headerTitle}>
						{isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
					</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.form}>
					{renderFormField(
						"Số tài khoản",
						"bankAccountNumber",
						"Nhập số tài khoản ngân hàng",
						{ required: true, keyboardType: "numeric" }
					)}

					{renderFormField(
						"Ngân hàng",
						"providerName",
						"Chọn ngân hàng",
						{ required: true }
					)}

					{renderBankDropdown()}

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

					{renderFormField("Tùy chọn", "default", "", {
						required: false,
					})}
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
});

export default AddWithdraw;
