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
	onSubmit?: (storeData: any) => void;
	onChange?: (storeData: any) => void;
	onDataChange?: (storeData: any) => void; // For parent component to get data
	mode?: "fromLink" | "manual";
	showSubmitButton?: boolean;
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
	onChange,
	onDataChange,
	mode = "manual",
	showSubmitButton = true,
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
		const newFormData = {
			...formData,
			[field]: value,
		};
		setFormData(newFormData);
		setIsEdited(true);

		// Call onChange if provided (for ProductForm integration)
		if (onChange) {
			onChange(newFormData);
		}

		// Call onDataChange if provided (for parent component to get data)
		if (onDataChange) {
			onDataChange(newFormData);
		}
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
		if (mode === "manual" && !formData.storeAddress.trim()) {
			return;
		}
		if (mode === "manual" && !formData.shopLink.trim()) {
			return;
		}

		// Validate phone number format if provided
		if (formData.phoneNumber.trim()) {
			const phoneRegex = /^[0-9]{10,11}$/;
			if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
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

		if (onSubmit) {
			onSubmit(formData);
		}
	};

	return (
		<View style={styles.section}>
			{/* Store Information Section */}
			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>
			</View>

			{/* Store Name */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>
					{mode === "manual" ? "Tên cửa hàng" : "Tên người bán"}{" "}
					<Text style={styles.required}>*</Text>
				</Text>
				<View style={styles.inputContainer}>
					<Ionicons
						name={
							mode === "manual"
								? "storefront-outline"
								: "person-outline"
						}
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
						placeholder={
							mode === "manual"
								? "Nhập tên cửa hàng"
								: "Nhập tên người bán"
						}
						placeholderTextColor="#B0BEC5"
					/>
				</View>
			</View>

			{/* Only show address, phone, email for manual mode */}
			{mode === "manual" && (
				<>
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
						<Text style={styles.label}>Số điện thoại</Text>
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
								placeholder="Nhập số điện thoại (tùy chọn)"
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
				</>
			)}

			{/* Shop Link - Always show */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>
					{mode === "manual" ? "Đường dẫn cửa hàng" : "Link cửa hàng"}{" "}
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
						style={[
							styles.textInput,
							mode === "manual" ? styles.multilineInput : null,
						]}
						value={formData.shopLink}
						onChangeText={(value) =>
							handleInputChange("shopLink", value)
						}
						placeholder={
							mode === "manual"
								? "Nhập link website/fanpage cửa hàng"
								: "Nhập link cửa hàng (tùy chọn)"
						}
						placeholderTextColor="#B0BEC5"
						autoCapitalize="none"
						keyboardType="url"
						multiline={mode === "manual"}
						numberOfLines={mode === "manual" ? 2 : 1}
						textAlignVertical={mode === "manual" ? "top" : "center"}
					/>
				</View>
				{formData.shopLink && !validateUrl(formData.shopLink) && (
					<Text style={styles.errorText}>Link không hợp lệ</Text>
				)}
			</View>

			{/* Submit Button */}
			{showSubmitButton && (
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
							Thêm cửa hàng
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionHeader: {
		marginBottom: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1976D2",
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
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
