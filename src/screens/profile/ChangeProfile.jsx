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

export default function ChangeProfile({ navigation }) {
	const [formData, setFormData] = useState({
		fullName: "Hoài Phương",
		gender: "Nữ",
		birthDate: "13/01/2003",
		phone: "+84 123 456 789",
		email: "hoaiphuong1328@gmail.com",
	});

	const [isEdited, setIsEdited] = useState(false);

	const genderOptions = ["Nam", "Nữ", "Khác"];

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setIsEdited(true);
	};

	const handleSave = () => {
		// Validate required fields
		if (!formData.fullName.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
			return;
		}
		if (!formData.birthDate.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập ngày sinh");
			return;
		}
		if (!formData.email.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập email");
			return;
		}
		if (!formData.phone.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
			return;
		}

		// Here you would typically call an API to save the data
		console.log("Saving profile data:", formData);

		Alert.alert("Thành công", "Thông tin tài khoản đã được cập nhật", [
			{
				text: "OK",
				onPress: () => {
					setIsEdited(false);
					navigation.goBack();
				},
			},
		]);
	};

	const showGenderPicker = () => {
		Alert.alert(
			"Chọn giới tính",
			"",
			genderOptions
				.map((option) => ({
					text: option,
					onPress: () => handleInputChange("gender", option),
				}))
				.concat([
					{
						text: "Hủy",
						style: "cancel",
					},
				])
		);
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
					<Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
					<TouchableOpacity
						onPress={handleSave}
						style={[
							styles.saveButton,
							isEdited && styles.saveButtonActive,
						]}
						disabled={!isEdited}
					>
						<Text
							style={[
								styles.saveButtonText,
								isEdited && styles.saveButtonTextActive,
							]}
						>
							Lưu
						</Text>
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

					{/* Email */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Email <Text style={styles.required}>*</Text>
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
								placeholder="Nhập địa chỉ email"
								placeholderTextColor="#B0BEC5"
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>
					</View>
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
});
