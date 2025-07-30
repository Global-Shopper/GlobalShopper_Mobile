import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { useDialog } from "../../components/dialogHelpers";
import {
	useGetCustomerInfoQuery,
	useUpdateCustomerProfileMutation,
} from "../../services/gshopApi";

export default function ChangeProfile({ navigation }) {
	// Get user data from Redux
	const reduxUser = useSelector((state) => state?.rootReducer?.user);

	// API hooks
	const {
		data: profileData,
		isLoading: isLoadingProfile,
		error: profileError,
	} = useGetCustomerInfoQuery();
	const [updateProfile, { isLoading: isUpdating }] =
		useUpdateCustomerProfileMutation();

	const [formData, setFormData] = useState({
		fullName: "",
		gender: "",
		birthDate: "",
		phone: "",
	});

	const [isEdited, setIsEdited] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [initialData, setInitialData] = useState({});
	const [showGenderDropdown, setShowGenderDropdown] = useState(false);
	const { showDialog, hideDialog, Dialog } = useDialog();

	// Load user data when component mounts or data changes
	useEffect(() => {
		if (profileData) {
			// Convert timestamp to DD/MM/YYYY format for display
			let displayBirthDate = "";
			if (profileData.dateOfBirth) {
				try {
					const dateObj = new Date(profileData.dateOfBirth);
					if (!isNaN(dateObj.getTime())) {
						const day = dateObj
							.getDate()
							.toString()
							.padStart(2, "0");
						const month = (dateObj.getMonth() + 1)
							.toString()
							.padStart(2, "0");
						const year = dateObj.getFullYear();
						displayBirthDate = `${day}/${month}/${year}`;
					}
				} catch (_error) {
					// Silent error handling for date conversion
				}
			}

			// Convert gender from backend to display format
			let displayGender = "";
			if (profileData.gender === "MALE") displayGender = "Nam";
			else if (profileData.gender === "FEMALE") displayGender = "Nữ";
			else if (profileData.gender === "OTHER") displayGender = "Khác";
			else displayGender = profileData.gender || "";

			const userData = {
				fullName:
					profileData.name ||
					profileData.fullName ||
					reduxUser?.name ||
					"",
				gender: displayGender,
				birthDate: displayBirthDate,
				phone:
					profileData.phone ||
					profileData.phoneNumber ||
					reduxUser?.phone ||
					"",
			};
			setFormData(userData);
			setInitialData(userData);
		} else if (reduxUser) {
			// Fallback to Redux data if API data not available
			const userData = {
				fullName: reduxUser.name || "",
				gender: "",
				birthDate: "",
				phone: reduxUser.phone || "",
			};
			setFormData(userData);
			setInitialData(userData);
		}
	}, [profileData, reduxUser]);

	const genderOptions = ["Nam", "Nữ", "Khác"];

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Check if any field has been changed from initial data
		const newFormData = { ...formData, [field]: value };
		const hasChanges = Object.keys(newFormData).some(
			(key) => newFormData[key] !== initialData[key]
		);
		setIsEdited(hasChanges);
	};

	const handleEditToggle = () => {
		if (isEditMode) {
			// If currently in edit mode and user wants to cancel
			if (isEdited) {
				showDialog({
					title: "Huỷ thay đổi",
					message:
						"Những thông tin bạn vừa nhập sẽ không được lưu nếu bạn thoát ra.",
					showCloseButton: false,
					primaryButton: {
						text: "Tiếp tục ",
						onPress: () => {
							// Just close dialog, stay in edit mode
						},
						style: "primary",
					},
					secondaryButton: {
						text: "Huỷ ",
						onPress: () => {
							setFormData(initialData);
							setIsEdited(false);
							setIsEditMode(false);
						},
						style: "outline",
					},
				});
			} else {
				setIsEditMode(false);
			}
		} else {
			setIsEditMode(true);
		}
	};

	const handleBackPress = () => {
		if (isEditMode && isEdited) {
			showDialog({
				title: "Huỷ thay đổi",
				message:
					"Những thông tin bạn vừa nhập sẽ không được lưu nếu bạn thoát ra.",
				showCloseButton: false,
				primaryButton: {
					text: "Tiếp tục chỉnh sửa",
					onPress: () => {
						// Just close dialog, stay in edit mode
					},
					style: "primary",
				},
				secondaryButton: {
					text: "Huỷ thay đổi",
					onPress: () => {
						navigation.goBack();
					},
					style: "outline",
				},
			});
		} else {
			navigation.goBack();
		}
	};

	const handleSave = async () => {
		// Validate required fields
		if (!formData.fullName.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập họ và tên",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
			});
			return;
		}
		if (!formData.phone.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập số điện thoại",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
			});
			return;
		}

		// Phone validation (basic)
		const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
		if (!phoneRegex.test(formData.phone)) {
			showDialog({
				title: "Lỗi",
				message: "Số điện thoại không hợp lệ",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
			});
			return;
		}

		try {
			// Convert date format to Unix timestamp (long)
			let convertedBirthDate = null;
			if (formData.birthDate && formData.birthDate.trim()) {
				if (formData.birthDate.includes("/")) {
					// Convert DD/MM/YYYY to Date object
					const [day, month, year] = formData.birthDate.split("/");
					if (day && month && year && year.length === 4) {
						const dateObj = new Date(
							parseInt(year),
							parseInt(month) - 1,
							parseInt(day)
						);
						if (!isNaN(dateObj.getTime())) {
							convertedBirthDate = dateObj.getTime(); // Unix timestamp in milliseconds
						}
					}
				} else if (formData.birthDate.includes("-")) {
					// Handle YYYY-MM-DD format
					const dateObj = new Date(formData.birthDate);
					if (!isNaN(dateObj.getTime())) {
						convertedBirthDate = dateObj.getTime(); // Unix timestamp in milliseconds
					}
				}
			}

			// Convert gender to English if needed
			let convertedGender = formData.gender;
			if (formData.gender === "Nam") convertedGender = "MALE";
			else if (formData.gender === "Nữ") convertedGender = "FEMALE";
			else if (formData.gender === "Khác") convertedGender = "OTHER";

			// Prepare data for API (adjust field names based on backend expectations)
			const updateData = {
				name: formData.fullName.trim(),
				phone: formData.phone.replace(/[\s\-()]/g, ""), // Remove spaces, dashes, parentheses
			};

			// Only add optional fields if they have values
			if (convertedGender && convertedGender !== "") {
				updateData.gender = convertedGender;
			}
			if (convertedBirthDate !== null) {
				updateData.dateOfBirth = convertedBirthDate;
			}

			const response = await updateProfile(updateData).unwrap();

			// Ensure any existing dialog is closed first
			hideDialog();

			// Small delay to ensure dialog is closed, then show success
			setTimeout(() => {
				showDialog({
					title: "Thành công",
					message: "Cập nhật thông tin thành công",
					showCloseButton: false,
				});

				// Auto close success dialog after 3 seconds
				setTimeout(() => {
					hideDialog();
					setIsEdited(false);
					setIsEditMode(false);
					setInitialData(formData); // Update initial data to current data
				}, 3000);
			}, 500);
		} catch (error) {
			const errorMessage =
				error?.data?.message ||
				error?.message ||
				"Có lỗi xảy ra khi cập nhật thông tin";
			showDialog({
				title: "Lỗi",
				message: `${errorMessage}\n\nStatus: ${
					error?.status || "Unknown"
				}`,
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
			});
		}
	};

	const showGenderPicker = () => {
		if (!isEditMode) {
			return; // Only allow in edit mode
		}

		setShowGenderDropdown(!showGenderDropdown);
	};

	const selectGender = (gender) => {
		handleInputChange("gender", gender);
		setShowGenderDropdown(false);
	};

	// Helper function to close dropdown when other inputs are focused
	const closeGenderDropdown = () => {
		if (showGenderDropdown) {
			setShowGenderDropdown(false);
		}
	};

	// Show loading screen while fetching profile data
	if (isLoadingProfile) {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor="#1976D2" barStyle="light-content" />
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					style={styles.header}
				>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={handleBackPress}
							style={styles.backButton}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>
							Thông tin cá nhân
						</Text>
						<View style={styles.placeholder} />
					</View>
				</LinearGradient>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1976D2" />
					<Text style={styles.loadingText}>
						Đang tải thông tin...
					</Text>
				</View>
			</View>
		);
	}

	// Show error state if profile loading failed
	if (profileError) {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor="#1976D2" barStyle="light-content" />
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					style={styles.header}
				>
					<View style={styles.headerContent}>
						<TouchableOpacity
							onPress={handleBackPress}
							style={styles.backButton}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>
							Thông tin cá nhân
						</Text>
						<View style={styles.placeholder} />
					</View>
				</LinearGradient>
				<View style={styles.errorContainer}>
					<Ionicons name="alert-circle" size={48} color="#dc3545" />
					<Text style={styles.errorText}>
						Không thể tải thông tin tài khoản
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => {
							// RTK Query will automatically refetch
						}}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

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
						onPress={handleBackPress}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Thông tin cá nhân</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.formContainer}>
					{/* Họ và tên */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Họ và tên <Text style={styles.required}>*</Text>
						</Text>
						<View
							style={[
								styles.inputContainer,
								!isEditMode && styles.inputContainerView,
							]}
						>
							<Ionicons
								name="person-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							{isEditMode ? (
								<TextInput
									style={styles.textInput}
									value={formData.fullName}
									onChangeText={(value) =>
										handleInputChange("fullName", value)
									}
									onFocus={closeGenderDropdown}
									placeholder="Nhập họ và tên"
									placeholderTextColor="#B0BEC5"
								/>
							) : (
								<Text
									style={[styles.textInput, styles.textView]}
								>
									{formData.fullName || "Chưa cập nhật"}
								</Text>
							)}
						</View>
					</View>

					{/* Giới tính */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Giới tính</Text>
						{isEditMode ? (
							<View style={styles.dropdownContainer}>
								<TouchableOpacity
									style={styles.inputContainer}
									onPress={() => {
										showGenderPicker();
									}}
									activeOpacity={0.7}
								>
									<Ionicons
										name="transgender-outline"
										size={20}
										color="#78909C"
										style={styles.inputIcon}
									/>
									<Text
										style={[
											styles.textInput,
											{
												color: formData.gender
													? "#263238"
													: "#B0BEC5",
											},
										]}
									>
										{formData.gender || "Chọn giới tính"}
									</Text>
									<Ionicons
										name={
											showGenderDropdown
												? "chevron-up"
												: "chevron-down"
										}
										size={20}
										color="#78909C"
									/>
								</TouchableOpacity>

								{/* Dropdown options */}
								{showGenderDropdown && (
									<View style={styles.dropdownOptions}>
										{genderOptions.map((option, index) => (
											<TouchableOpacity
												key={index}
												style={[
													styles.dropdownOption,
													formData.gender ===
														option &&
														styles.selectedOption,
													index ===
														genderOptions.length -
															1 &&
														styles.lastDropdownOption,
												]}
												onPress={() =>
													selectGender(option)
												}
												activeOpacity={0.7}
											>
												<Text
													style={[
														styles.dropdownOptionText,
														formData.gender ===
															option &&
															styles.selectedOptionText,
													]}
												>
													{option}
												</Text>
												{formData.gender === option && (
													<Ionicons
														name="checkmark"
														size={20}
														color="#1976D2"
													/>
												)}
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>
						) : (
							<View
								style={[
									styles.inputContainer,
									styles.inputContainerView,
								]}
							>
								<Ionicons
									name="transgender-outline"
									size={20}
									color="#78909C"
									style={styles.inputIcon}
								/>
								<Text
									style={[styles.textInput, styles.textView]}
								>
									{formData.gender || "Chưa cập nhật"}
								</Text>
							</View>
						)}
					</View>

					{/* Ngày sinh */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Ngày sinh <Text style={styles.required}>*</Text>
						</Text>
						<View
							style={[
								styles.inputContainer,
								!isEditMode && styles.inputContainerView,
							]}
						>
							<Ionicons
								name="calendar-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							{isEditMode ? (
								<TextInput
									style={styles.textInput}
									value={formData.birthDate}
									onChangeText={(value) =>
										handleInputChange("birthDate", value)
									}
									onFocus={closeGenderDropdown}
									placeholder="DD/MM/YYYY"
									placeholderTextColor="#B0BEC5"
									maxLength={10}
								/>
							) : (
								<Text
									style={[styles.textInput, styles.textView]}
								>
									{formData.birthDate || "Chưa cập nhật"}
								</Text>
							)}
						</View>
					</View>

					{/* Điện thoại */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Số điện thoại <Text style={styles.required}>*</Text>
						</Text>
						<View
							style={[
								styles.inputContainer,
								!isEditMode && styles.inputContainerView,
							]}
						>
							<Ionicons
								name="call-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							{isEditMode ? (
								<TextInput
									style={styles.textInput}
									value={formData.phone}
									onChangeText={(value) =>
										handleInputChange("phone", value)
									}
									onFocus={closeGenderDropdown}
									placeholder="Nhập số điện thoại"
									placeholderTextColor="#B0BEC5"
									keyboardType="phone-pad"
								/>
							) : (
								<Text
									style={[styles.textInput, styles.textView]}
								>
									{formData.phone || "Chưa cập nhật"}
								</Text>
							)}
						</View>
					</View>

					{/* Nút chỉnh sửa khi ở view mode */}
					{!isEditMode && (
						<TouchableOpacity
							style={styles.editButton}
							onPress={handleEditToggle}
						>
							<Ionicons
								name="create-outline"
								size={20}
								color="#1976D2"
							/>
							<Text style={styles.editButtonText}>
								Chỉnh sửa thông tin
							</Text>
						</TouchableOpacity>
					)}

					{/* Cancel and Save buttons when in edit mode */}
					{isEditMode && (
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => {
									closeGenderDropdown();
									handleEditToggle();
								}}
							>
								<Text style={styles.cancelButtonText}>Huỷ</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.updateButton,
									isEdited && styles.updateButtonActive,
								]}
								onPress={() => {
									closeGenderDropdown();
									handleSave();
								}}
								disabled={!isEdited || isUpdating}
							>
								{isUpdating ? (
									<ActivityIndicator
										size="small"
										color="#FFFFFF"
									/>
								) : (
									<Text style={styles.updateButtonText}>
										Cập nhật
									</Text>
								)}
							</TouchableOpacity>
						</View>
					)}
				</View>
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
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		minWidth: 60,
		alignItems: "center",
	},
	placeholder: {
		width: 40,
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#E3F2FD",
		borderRadius: 8,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: "#1976D2",
	},
	editButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginLeft: 8,
	},
	saveButtonActive: {
		backgroundColor: "#FFFFFF",
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "rgba(255, 255, 255, 0.6)",
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	saveButtonTextActive: {
		color: "#1976D2",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	formContainer: {
		marginTop: 25,
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
		marginBottom: 24,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
		fontSize: 16,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: "#FAFAFA",
	},
	inputContainerView: {
		backgroundColor: "#F8F9FA",
		borderColor: "#E9ECEF",
	},
	inputIcon: {
		marginRight: 12,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: "#263238",
		paddingVertical: 4,
	},
	textView: {
		color: "#495057",
		fontWeight: "500",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		gap: 12,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#DC3545",
		backgroundColor: "#FFFFFF",
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#DC3545",
	},
	updateButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		backgroundColor: "#B0BEC5",
		alignItems: "center",
	},
	updateButtonActive: {
		backgroundColor: "#1976D2",
	},
	updateButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 20,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 20,
	},
	errorText: {
		marginTop: 16,
		fontSize: 16,
		color: "#dc3545",
		textAlign: "center",
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: "#1976D2",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 16,
	},
	dropdownContainer: {
		position: "relative",
		zIndex: 1000,
	},
	dropdownOptions: {
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		marginTop: 4,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		zIndex: 1002,
	},
	dropdownOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	selectedOption: {
		backgroundColor: "#E3F2FD",
	},
	dropdownOptionText: {
		fontSize: 16,
		color: "#263238",
	},
	selectedOptionText: {
		color: "#1976D2",
		fontWeight: "600",
	},
	lastDropdownOption: {
		borderBottomWidth: 0,
	},
});
