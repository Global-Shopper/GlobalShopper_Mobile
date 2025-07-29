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
	const [initialData, setInitialData] = useState({});
	const { showDialog, Dialog } = useDialog();

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
				} catch (error) {
					console.log("Error converting date:", error);
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

	const handleSave = async () => {
		// Validate required fields
		if (!formData.fullName.trim()) {
			showDialog({
				type: "error",
				title: "Lỗi",
				message: "Vui lòng nhập họ và tên",
			});
			return;
		}
		if (!formData.phone.trim()) {
			showDialog({
				type: "error",
				title: "Lỗi",
				message: "Vui lòng nhập số điện thoại",
			});
			return;
		}

		// Phone validation (basic)
		const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
		if (!phoneRegex.test(formData.phone)) {
			showDialog({
				type: "error",
				title: "Lỗi",
				message: "Số điện thoại không hợp lệ",
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

			console.log("=== API UPDATE DEBUG ===");
			console.log("Form data:", formData);
			console.log(
				"Converted birth date (timestamp):",
				convertedBirthDate
			);
			console.log(
				"Converted birth date (readable):",
				convertedBirthDate
					? new Date(convertedBirthDate).toISOString()
					: "null"
			);
			console.log("Converted gender:", convertedGender);
			console.log("Update data sending to API:", updateData);
			console.log("API endpoint: PUT /customer");

			const response = await updateProfile(updateData).unwrap();

			console.log("Profile update response:", response);

			showDialog({
				type: "success",
				title: "Thành công",
				message: "Thông tin tài khoản đã được cập nhật",
				buttons: [
					{
						text: "OK",
						style: "primary",
						onPress: () => {
							setIsEdited(false);
							setInitialData(formData); // Update initial data to current data
							navigation.goBack();
						},
					},
				],
			});
		} catch (error) {
			console.error("Profile update error:", error);
			console.error("Error status:", error?.status);
			console.error("Error data:", error?.data);
			console.error("Error message:", error?.message);

			const errorMessage =
				error?.data?.message ||
				error?.message ||
				"Có lỗi xảy ra khi cập nhật thông tin";
			showDialog({
				type: "error",
				title: "Lỗi",
				message: `${errorMessage}\n\nStatus: ${
					error?.status || "Unknown"
				}`,
			});
		}
	};

	const showGenderPicker = () => {
		showDialog({
			title: "Chọn giới tính",
			message: "",
			buttons: genderOptions
				.map((option) => ({
					text: option,
					style: "outline",
					onPress: () => handleInputChange("gender", option),
				}))
				.concat([
					{
						text: "Hủy",
						style: "text",
					},
				]),
		});
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
							onPress={() => navigation.goBack()}
							style={styles.backButton}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>
							Chỉnh sửa thông tin
						</Text>
						<View style={styles.saveButton}>
							<Text style={styles.saveButtonText}>Lưu</Text>
						</View>
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
							onPress={() => navigation.goBack()}
							style={styles.backButton}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#FFFFFF"
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>
							Chỉnh sửa thông tin
						</Text>
						<View style={styles.saveButton}>
							<Text style={styles.saveButtonText}>Lưu</Text>
						</View>
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
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
					<TouchableOpacity
						onPress={handleSave}
						style={[
							styles.saveButton,
							isEdited && styles.saveButtonActive,
						]}
						disabled={!isEdited || isUpdating}
					>
						{isUpdating ? (
							<ActivityIndicator size="small" color="#1976D2" />
						) : (
							<Text
								style={[
									styles.saveButtonText,
									isEdited && styles.saveButtonTextActive,
								]}
							>
								Lưu
							</Text>
						)}
					</TouchableOpacity>
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
						<View style={styles.inputContainer}>
							<Ionicons
								name="person-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.fullName}
								onChangeText={(value) =>
									handleInputChange("fullName", value)
								}
								placeholder="Nhập họ và tên"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Giới tính */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Giới tính</Text>
						<TouchableOpacity
							style={styles.inputContainer}
							onPress={showGenderPicker}
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
								name="chevron-down"
								size={20}
								color="#78909C"
							/>
						</TouchableOpacity>
					</View>

					{/* Ngày sinh */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Ngày sinh <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="calendar-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.birthDate}
								onChangeText={(value) =>
									handleInputChange("birthDate", value)
								}
								placeholder="DD/MM/YYYY"
								placeholderTextColor="#B0BEC5"
								maxLength={10}
							/>
						</View>
					</View>

					{/* Điện thoại */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Số điện thoại <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="call-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.phone}
								onChangeText={(value) =>
									handleInputChange("phone", value)
								}
								placeholder="Nhập số điện thoại"
								placeholderTextColor="#B0BEC5"
								keyboardType="phone-pad"
							/>
						</View>
					</View>
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
	saveButtonActive: {
		backgroundColor: "#FFFFFF",
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "rgba(255, 255, 255, 0.6)",
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
	inputIcon: {
		marginRight: 12,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: "#263238",
		paddingVertical: 4,
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
});
