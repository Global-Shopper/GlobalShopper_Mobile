import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface StoreFormProps {
	initialData?: any;
	onSubmit: (storeData: any) => void;
	mode?: "fromLink" | "manual";
}

interface StoreData {
	storeName: string;
	storeAddress: string;
	phoneNumber: string;
	email: string;
	shopLink: string;
}

export default function StoreForm({
	initialData,
	onSubmit,
	mode = "manual",
}: StoreFormProps) {
	const [formData, setFormData] = useState<StoreData>({
		storeName: initialData?.storeName || "",
		storeAddress: initialData?.storeAddress || "",
		phoneNumber: initialData?.phoneNumber || "",
		email: initialData?.email || "",
		shopLink: initialData?.shopLink || "",
	});

	const [isEdited, setIsEdited] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setIsEdited(true);
	};

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateUrl = (url: string) => {
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
			return;
		}
		if (!formData.storeAddress.trim()) {
			return;
		}
		if (!formData.phoneNumber.trim()) {
			return;
		}

		// Validate phone number format
		const phoneRegex = /^[0-9]{10,11}$/;
		if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
			return;
		}

		// For manual mode, validate email and shop link as required
		if (mode === "manual") {
			if (!formData.email.trim()) {
				return;
			}
			if (!formData.shopLink.trim()) {
				return;
			}
		}

		// Validate email if provided
		if (formData.email.trim() && !validateEmail(formData.email)) {
			return;
		}

		// Validate shop link if provided
		if (formData.shopLink.trim() && !validateUrl(formData.shopLink)) {
			return;
		}

		onSubmit(formData);
	};

	return (
		<View style={styles.container}>
			<View style={styles.formContainer}>
				{/* Store Information Section */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>
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
						Địa chỉ cửa hàng <Text style={styles.required}>*</Text>
					</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="location-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={[styles.textInput, styles.multilineInput]}
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
					<Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
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
					<Text style={styles.label}>
						Email{" "}
						{mode === "manual" && (
							<Text style={styles.required}>*</Text>
						)}
					</Text>
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
							placeholder={
								mode === "manual"
									? "Nhập email"
									: "Nhập email (tùy chọn)"
							}
							placeholderTextColor="#B0BEC5"
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>
					{formData.email && !validateEmail(formData.email) && (
						<Text style={styles.errorText}>Email không hợp lệ</Text>
					)}
				</View>

				{/* Shop Link */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Đường dẫn cửa hàng{" "}
						{mode === "manual" && (
							<Text style={styles.required}>*</Text>
						)}
					</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="link-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={[styles.textInput, styles.multilineInput]}
							value={formData.shopLink}
							onChangeText={(value) =>
								handleInputChange("shopLink", value)
							}
							placeholder={
								mode === "manual"
									? "Nhập link website/fanpage cửa hàng"
									: "Nhập link website/fanpage cửa hàng (tùy chọn)"
							}
							placeholderTextColor="#B0BEC5"
							autoCapitalize="none"
							keyboardType="url"
							multiline
							numberOfLines={2}
							textAlignVertical="top"
						/>
					</View>
					{formData.shopLink && !validateUrl(formData.shopLink) && (
						<Text style={styles.errorText}>Link không hợp lệ</Text>
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 30,
		backgroundColor: "#f8f9fa",
	},
	formContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
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
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
	},
	submitButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	submitButtonActive: {
		shadowOpacity: 0.2,
		elevation: 4,
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
