import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function AddStore({ navigation }) {
	const [formData, setFormData] = useState({
		storeName: "",
		storeAddress: "",
		phoneNumber: "",
		email: "",
		shopLink: "",
	});

	const [isEdited, setIsEdited] = useState(false);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setIsEdited(true);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateUrl = (url) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleSubmit = () => {
		// Validate required fields
		if (!formData.storeName.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập tên cửa hàng");
			return;
		}
		if (!formData.storeAddress.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập địa chỉ cửa hàng");
			return;
		}
		if (!formData.phoneNumber.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
			return;
		}

		// Validate phone number format
		const phoneRegex = /^[0-9]{10,11}$/;
		if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
			Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
			return;
		}

		// Validate email if provided
		if (formData.email.trim() && !validateEmail(formData.email)) {
			Alert.alert("Lỗi", "Email không hợp lệ");
			return;
		}

		// Validate shop link if provided
		if (formData.shopLink.trim() && !validateUrl(formData.shopLink)) {
			Alert.alert("Lỗi", "Link shop không hợp lệ");
			return;
		}

		// Here you would typically call an API to submit the store info
		console.log("Submitting store data:", formData);
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
					<Text style={styles.headerTitle}>Thêm cửa hàng</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Instructions */}
				<View style={styles.instructionCard}>
					<View style={styles.instructionHeader}>
						<Ionicons
							name="information-circle"
							size={24}
							color="#1976D2"
						/>
						<Text style={styles.instructionTitle}>Hướng dẫn</Text>
					</View>
					<Text style={styles.instructionText}>
						Nhập thông tin cửa hàng mà bạn muốn mua sản phẩm. Chúng
						tôi sẽ liên hệ với cửa hàng để hỗ trợ bạn đặt hàng.
					</Text>
				</View>

				<View style={styles.formContainer}>
					{/* Store Information Section */}
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Thông tin cửa hàng
						</Text>
					</View>

					{/* Store Name */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Tên cửa hàng <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="storefront-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.storeName}
								onChangeText={(value) =>
									handleInputChange("storeName", value)
								}
								placeholder="Nhập tên cửa hàng"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Store Address */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Địa chỉ cửa hàng{" "}
							<Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="location-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={[
									styles.textInput,
									styles.multilineInput,
								]}
								value={formData.storeAddress}
								onChangeText={(value) =>
									handleInputChange("storeAddress", value)
								}
								placeholder="Nhập địa chỉ cửa hàng"
								placeholderTextColor="#B0BEC5"
								multiline
								numberOfLines={3}
								textAlignVertical="top"
							/>
						</View>
					</View>

					{/* Contact Information Section */}
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Thông tin liên hệ
						</Text>
					</View>

					{/* Phone Number */}
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
								value={formData.phoneNumber}
								onChangeText={(value) =>
									handleInputChange("phoneNumber", value)
								}
								placeholder="Nhập số điện thoại"
								placeholderTextColor="#B0BEC5"
								keyboardType="phone-pad"
								maxLength={11}
							/>
						</View>
					</View>

					{/* Email */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Email</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="mail-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.email}
								onChangeText={(value) =>
									handleInputChange("email", value)
								}
								placeholder="Nhập email (tùy chọn)"
								placeholderTextColor="#B0BEC5"
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>
						{formData.email && !validateEmail(formData.email) && (
							<Text style={styles.errorText}>
								Email không hợp lệ
							</Text>
						)}
					</View>

					{/* Shop Link */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Link shop</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="link-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={[
									styles.textInput,
									styles.multilineInput,
								]}
								value={formData.shopLink}
								onChangeText={(value) =>
									handleInputChange("shopLink", value)
								}
								placeholder="Nhập link website/fanpage cửa hàng (tùy chọn)"
								placeholderTextColor="#B0BEC5"
								autoCapitalize="none"
								keyboardType="url"
								multiline
								numberOfLines={2}
								textAlignVertical="top"
							/>
						</View>
						{formData.shopLink &&
							!validateUrl(formData.shopLink) && (
								<Text style={styles.errorText}>
									Link không hợp lệ
								</Text>
							)}
					</View>

					{/* Submit Button */}
					<TouchableOpacity
						style={[
							styles.submitButton,
							isEdited && styles.submitButtonActive,
						]}
						onPress={handleSubmit}
						disabled={!isEdited}
					>
						<LinearGradient
							colors={
								isEdited
									? ["#4FC3F7", "#29B6F6"]
									: ["#E0E0E0", "#BDBDBD"]
							}
							style={styles.submitButtonGradient}
						>
							<Ionicons
								name="checkmark-circle-outline"
								size={20}
								color={isEdited ? "#FFFFFF" : "#9E9E9E"}
							/>
							<Text
								style={[
									styles.submitButtonText,
									isEdited && styles.submitButtonTextActive,
								]}
							>
								Thêm sản phẩm
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</ScrollView>
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
	instructionCard: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		marginBottom: 20,
		borderLeftWidth: 4,
		borderLeftColor: "#1976D2",
	},
	instructionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	instructionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginLeft: 8,
	},
	instructionText: {
		fontSize: 14,
		color: "#546E7A",
		lineHeight: 20,
	},
	formContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	sectionHeader: {
		marginTop: 10,
		marginBottom: 10,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1976D2",
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
		alignItems: "flex-start",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: "#FAFAFA",
	},
	inputIcon: {
		marginRight: 12,
		marginTop: 2,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: "#263238",
		paddingVertical: 4,
	},
	multilineInput: {
		minHeight: 60,
		textAlignVertical: "top",
	},
	errorText: {
		fontSize: 12,
		color: "#dc3545",
		marginTop: 4,
		marginLeft: 32,
	},
	submitButton: {
		marginTop: 20,
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	submitButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	submitButtonActive: {
		elevation: 4,
		shadowOpacity: 0.2,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#9E9E9E",
		marginLeft: 8,
	},
	submitButtonTextActive: {
		color: "#FFFFFF",
	},
});
