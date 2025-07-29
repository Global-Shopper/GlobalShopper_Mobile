import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import { useChangePasswordMutation } from "../../services/gshopApi";

export default function ChangePassword({ navigation }) {
	const { showDialog, Dialog } = useDialog();

	// API hooks
	const [changePassword, { isLoading: isChangingPassword }] =
		useChangePasswordMutation();
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const [errors, setErrors] = useState({});

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: null,
			}));
		}
	};

	const togglePasswordVisibility = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const validateForm = () => {
		const newErrors = {};

		// Validate current password
		if (!formData.currentPassword.trim()) {
			newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
		}

		// Validate new password
		if (!formData.newPassword.trim()) {
			newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
		} else if (formData.newPassword.length < 6) {
			newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
		} else if (formData.newPassword === formData.currentPassword) {
			newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
		}

		// Validate confirm password
		if (!formData.confirmPassword.trim()) {
			newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
		} else if (formData.confirmPassword !== formData.newPassword) {
			newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChangePassword = async () => {
		if (validateForm()) {
			try {
				// Prepare data for API
				const changePasswordData = {
					oldPassword: formData.currentPassword,
					newPassword: formData.newPassword,
				};

				console.log("=== CHANGE PASSWORD DEBUG ===");
				console.log("Change password data:", changePasswordData);
				console.log("API endpoint: PUT /auth/change-password");

				const response = await changePassword(
					changePasswordData
				).unwrap();

				console.log("Change password response:", response);

				showDialog({
					title: "Thành công",
					message: "Mật khẩu đã được thay đổi thành công!",
					primaryButton: {
						text: "OK",
						onPress: () => {
							// Clear form data
							setFormData({
								currentPassword: "",
								newPassword: "",
								confirmPassword: "",
							});
							navigation.goBack();
						},
						style: "success",
					},
					showCloseButton: false,
				});
			} catch (error) {
				console.error("Change password error:", error);
				console.error("Error status:", error?.status);
				console.error("Error data:", error?.data);
				console.error("Error message:", error?.message);

				const errorMessage =
					error?.data?.message ||
					error?.message ||
					"Có lỗi xảy ra khi thay đổi mật khẩu";
				showDialog({
					title: "Lỗi",
					message: errorMessage,
					primaryButton: {
						text: "OK",
						onPress: () => {},
						style: "primary",
					},
					showCloseButton: false,
				});
			}
		}
	};

	const renderPasswordInput = (
		label,
		field,
		placeholder,
		required = false
	) => (
		<View style={styles.inputGroup} key={field}>
			<Text style={styles.inputLabel}>
				{label}
				{required && <Text style={styles.required}> *</Text>}
			</Text>
			<View
				style={[
					styles.inputContainer,
					errors[field] && styles.inputError,
				]}
			>
				<TextInput
					style={styles.textInput}
					placeholder={placeholder}
					placeholderTextColor="#B0BEC5"
					value={formData[field]}
					onChangeText={(value) => handleInputChange(field, value)}
					secureTextEntry={
						!showPassword[
							field === "currentPassword"
								? "current"
								: field === "newPassword"
								? "new"
								: "confirm"
						]
					}
					autoCapitalize="none"
				/>
				<TouchableOpacity
					style={styles.eyeButton}
					onPress={() =>
						togglePasswordVisibility(
							field === "currentPassword"
								? "current"
								: field === "newPassword"
								? "new"
								: "confirm"
						)
					}
				>
					<Ionicons
						name={
							showPassword[
								field === "currentPassword"
									? "current"
									: field === "newPassword"
									? "new"
									: "confirm"
							]
								? "eye-off"
								: "eye"
						}
						size={20}
						color="#78909C"
					/>
				</TouchableOpacity>
			</View>
			{errors[field] && (
				<Text style={styles.errorText}>{errors[field]}</Text>
			)}
		</View>
	);

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
					<Text style={styles.headerTitle}>Thay đổi mật khẩu</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Form Section */}
				<View style={styles.section}>
					<View style={styles.formContainer}>
						{renderPasswordInput(
							"Mật khẩu hiện tại",
							"currentPassword",
							"Nhập mật khẩu hiện tại",
							true
						)}

						{renderPasswordInput(
							"Mật khẩu mới",
							"newPassword",
							"Nhập mật khẩu mới",
							true
						)}

						{renderPasswordInput(
							"Xác nhận mật khẩu mới",
							"confirmPassword",
							"Nhập lại mật khẩu mới",
							true
						)}
					</View>
				</View>

				{/* Password Requirements */}
				<View style={styles.requirementsContainer}>
					<View style={styles.requirementsHeader}>
						<Ionicons
							name="shield-checkmark"
							size={20}
							color="#4CAF50"
						/>
						<Text style={styles.requirementsTitle}>
							Yêu cầu mật khẩu
						</Text>
					</View>
					<View style={styles.requirementsList}>
						<View style={styles.requirementItem}>
							<Ionicons
								name="checkmark-circle"
								size={16}
								color="#4CAF50"
							/>
							<Text style={styles.requirementText}>
								Ít nhất 6 ký tự
							</Text>
						</View>
						<View style={styles.requirementItem}>
							<Ionicons
								name="checkmark-circle"
								size={16}
								color="#4CAF50"
							/>
							<Text style={styles.requirementText}>
								Khác với mật khẩu hiện tại
							</Text>
						</View>
						<View style={styles.requirementItem}>
							<Ionicons
								name="checkmark-circle"
								size={16}
								color="#4CAF50"
							/>
							<Text style={styles.requirementText}>
								Nên chứa chữ hoa, chữ thường và số
							</Text>
						</View>
					</View>
				</View>

				{/* Change Password Button */}
				<TouchableOpacity
					style={[
						styles.changeButton,
						isChangingPassword && styles.changeButtonDisabled,
					]}
					onPress={handleChangePassword}
					activeOpacity={0.8}
					disabled={isChangingPassword}
				>
					<LinearGradient
						colors={
							isChangingPassword
								? ["#CCCCCC", "#AAAAAA"]
								: ["#4CAF50", "#45A049"]
						}
						style={styles.changeButtonGradient}
					>
						{isChangingPassword ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<Ionicons name="key" size={20} color="#FFFFFF" />
						)}
						<Text style={styles.changeButtonText}>
							{isChangingPassword
								? "Đang thay đổi..."
								: "Thay đổi mật khẩu"}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</ScrollView>
			<Dialog />
		</View>
	);
}

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
	section: {
		marginTop: 25,
	},
	formContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: "#263238",
		marginBottom: 8,
	},
	required: {
		color: "#F44336",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingHorizontal: 15,
		backgroundColor: "#FAFAFA",
	},
	inputError: {
		borderColor: "#F44336",
	},
	textInput: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: "#263238",
	},
	eyeButton: {
		padding: 5,
	},
	errorText: {
		fontSize: 12,
		color: "#F44336",
		marginTop: 5,
	},
	requirementsContainer: {
		backgroundColor: "#E8F5E8",
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		borderLeftWidth: 4,
		borderLeftColor: "#4CAF50",
	},
	requirementsHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	requirementsTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2E7D32",
		marginLeft: 8,
	},
	requirementsList: {
		gap: 8,
	},
	requirementItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	requirementText: {
		fontSize: 14,
		color: "#2E7D32",
		marginLeft: 8,
	},
	changeButton: {
		marginTop: 30,
		marginBottom: 30,
		borderRadius: 12,
		overflow: "hidden",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	changeButtonDisabled: {
		elevation: 1,
		shadowOpacity: 0.1,
	},
	changeButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
	},
	changeButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: 8,
	},
});
