import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	TextInput,
	Alert,
	Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function EditAddress({ navigation, route }) {
	// Get address data from route params
	const { addressData } = route.params || {};
	
	const [formData, setFormData] = useState({
		fullName: "",
		phoneNumber: "",
		houseNumber: "",
		ward: "",
		district: "",
		city: "",
		isDefault: false,
		addressType: "Nhà riêng",
	});

	const [isEdited, setIsEdited] = useState(false);

	const addressTypeOptions = ["Nhà riêng", "Văn phòng"];

	useEffect(() => {
		if (addressData) {
			// Parse address string to extract components
			const addressParts = addressData.address.split(", ");
			const initial = {
				fullName: addressData.name || "",
				phoneNumber: addressData.phone?.replace("+84 ", "0") || "",
				houseNumber: addressParts[0] || "",
				ward: addressParts[1] || "",
				district: addressParts[2] || "",
				city: addressParts[3] || "",
				isDefault: addressData.isDefault || false,
				addressType: addressData.addressType || "Nhà riêng",
			};
			setFormData(initial);
		}
	}, [addressData]);

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
		// Check if data has been modified
		setIsEdited(true);
	};

	const handleSave = () => {
		// Validate required fields
		if (!formData.fullName.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
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
		if (!formData.houseNumber.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập số nhà");
			return;
		}
		if (!formData.ward.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập phường/xã");
			return;
		}
		if (!formData.district.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập quận/huyện");
			return;
		}
		if (!formData.city.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập tỉnh/thành phố");
			return;
		}

		// Here you would typically call an API to update the address
		const fullAddress = `${formData.houseNumber}, ${formData.ward}, ${formData.district}, ${formData.city}`;
		console.log("Updating address data:", {
			...formData,
			fullAddress,
			id: addressData.id
		});
		
		Alert.alert(
			"Thành công",
			"Địa chỉ đã được cập nhật thành công",
			[
				{
					text: "OK",
					onPress: () => {
						setIsEdited(false);
						navigation.goBack();
					}
				}
			]
		);
	};

	const showAddressTypePicker = () => {
		Alert.alert(
			"Chọn loại địa chỉ",
			"",
			addressTypeOptions.map(option => ({
				text: option,
				onPress: () => handleInputChange("addressType", option)
			})).concat([
				{
					text: "Hủy",
					style: "cancel"
				}
			])
		);
	};

	const handleDelete = () => {
		Alert.alert(
			"Xác nhận xóa",
			"Bạn có chắc chắn muốn xóa địa chỉ này?",
			[
				{
					text: "Hủy",
					style: "cancel"
				},
				{
					text: "Xóa",
					style: "destructive",
					onPress: () => {
						console.log("Deleting address:", addressData.id);
						Alert.alert(
							"Thành công",
							"Địa chỉ đã được xóa",
							[
								{
									text: "OK",
									onPress: () => navigation.goBack()
								}
							]
						);
					}
				}
			]
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1976D2" barStyle="light-content" />
			
			{/* Header */}
			<LinearGradient colors={["#42A5F5", "#1976D2"]} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Chỉnh sửa địa chỉ</Text>
					<TouchableOpacity
						onPress={handleSave}
						style={[styles.saveButton, isEdited && styles.saveButtonActive]}
						disabled={!isEdited}
					>
						<Text style={[styles.saveButtonText, isEdited && styles.saveButtonTextActive]}>
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
					{/* Thông tin liên hệ Section */}
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
					</View>

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
								onChangeText={(value) => handleInputChange("fullName", value)}
								placeholder="Nhập họ và tên"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Số điện thoại */}
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
								onChangeText={(value) => handleInputChange("phoneNumber", value)}
								placeholder="Nhập số điện thoại"
								placeholderTextColor="#B0BEC5"
								keyboardType="phone-pad"
								maxLength={11}
							/>
						</View>
					</View>

					{/* Địa chỉ Section */}
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Thông tin địa chỉ</Text>
					</View>

					{/* Số nhà */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Số nhà, tên đường <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="home-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.houseNumber}
								onChangeText={(value) => handleInputChange("houseNumber", value)}
								placeholder="Ví dụ: 123 Đường ABC"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Phường/Xã */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Phường/Xã <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="location-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.ward}
								onChangeText={(value) => handleInputChange("ward", value)}
								placeholder="Nhập phường/xã"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Quận/Huyện */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Quận/Huyện <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="business-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.district}
								onChangeText={(value) => handleInputChange("district", value)}
								placeholder="Nhập quận/huyện"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Tỉnh/Thành phố */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Tỉnh/Thành phố <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="map-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.city}
								onChangeText={(value) => handleInputChange("city", value)}
								placeholder="Nhập tỉnh/thành phố"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>

					{/* Loại địa chỉ */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Loại địa chỉ</Text>
						<TouchableOpacity 
							style={styles.inputContainer}
							onPress={showAddressTypePicker}
						>
							<Ionicons
								name="briefcase-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<Text style={[styles.textInput, { color: formData.addressType ? "#263238" : "#B0BEC5" }]}>
								{formData.addressType || "Chọn loại địa chỉ"}
							</Text>
							<Ionicons name="chevron-down" size={20} color="#78909C" />
						</TouchableOpacity>
					</View>

					{/* Đặt làm mặc định */}
					<View style={styles.switchGroup}>
						<View style={styles.switchContent}>
							<Ionicons
								name="star-outline"
								size={20}
								color="#78909C"
								style={styles.switchIcon}
							/>
							<View style={styles.switchTextContainer}>
								<Text style={styles.switchLabel}>Đặt làm địa chỉ mặc định</Text>
								<Text style={styles.switchSubtitle}>
									Địa chỉ này sẽ được sử dụng làm mặc định
								</Text>
							</View>
						</View>
						<Switch
							value={formData.isDefault}
							onValueChange={(value) => handleInputChange("isDefault", value)}
							trackColor={{ false: "#E0E0E0", true: "#4FC3F7" }}
							thumbColor={formData.isDefault ? "#1976D2" : "#FFFFFF"}
						/>
					</View>

					{/* Delete Button */}
					{!formData.isDefault && (
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={handleDelete}
						>
							<Ionicons name="trash-outline" size={20} color="#dc3545" />
							<Text style={styles.deleteButtonText}>Xóa địa chỉ</Text>
						</TouchableOpacity>
					)}
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
	switchGroup: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		marginTop: 8,
		marginBottom: 20,
	},
	switchContent: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	switchIcon: {
		marginRight: 12,
	},
	switchTextContainer: {
		flex: 1,
	},
	switchLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	switchSubtitle: {
		fontSize: 13,
		color: "#78909C",
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 12,
		backgroundColor: "#FFF5F5",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#FFEBEE",
	},
	deleteButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#dc3545",
		marginLeft: 8,
	},
});
