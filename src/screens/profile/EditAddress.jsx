import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import BottomPicker from "../../components/BottomPicker";
import { useDialog } from "../../components/dialogHelpers";
import {
	useDeleteShippingAddressMutation,
	useUpdateShippingAddressMutation,
} from "../../services/gshopApi";
import {
	getDistricts,
	getProvinces,
	getWards,
	resolveName,
} from "../../services/vnGeoAPI";

export default function EditAddress({ navigation, route }) {
	// Get address data from route params
	const { addressData } = route.params || {};
	const [updateShippingAddress] = useUpdateShippingAddressMutation();
	const [deleteShippingAddress] = useDeleteShippingAddressMutation();
	const { showDialog, Dialog } = useDialog();

	const [formData, setFormData] = useState({
		name: "",
		phoneNumber: "",
		houseNumber: "",
		ward: "",
		district: "",
		province: "",
		isDefault: false,
		tag: "Nhà riêng",
	});

	const [isEdited, setIsEdited] = useState(false);

	const [picker, setPicker] = useState(null);
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);
	const [provinceId, setProvinceId] = useState("");
	const [districtId, setDistrictId] = useState("");
	const [wardId, setWardId] = useState("");
	const openProvincePicker = () => setPicker("province");
	const openDistrictPicker = () => districts.length && setPicker("district");
	const openWardPicker = () => wards.length && setPicker("ward");
	const [isInit, setIsInit] = useState(true);
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		getProvinces().then(setProvinces).catch(console.error);
	}, []);

	useEffect(() => {
		if (provinceId && !dataLoaded) {
			getDistricts(provinceId)
				.then((res) => {
					setDistricts(res);
					// Chỉ reset khi user thay đổi province, không reset khi init
					if (!isInit) {
						handleInputChange("district", "");
						handleInputChange("ward", "");
						setDistrictId("");
						setWardId("");
						setWards([]);
					}
				})
				.catch(console.error);
		} else if (provinceId && dataLoaded) {
			getDistricts(provinceId)
				.then((res) => {
					setDistricts(res);
					// Reset khi user chọn province mới
					handleInputChange("district", "");
					handleInputChange("ward", "");
					setDistrictId("");
					setWardId("");
					setWards([]);
				})
				.catch(console.error);
		} else {
			if (!isInit) {
				setDistricts([]);
				setWards([]);
			}
		}
	}, [provinceId, isInit, dataLoaded]);

	useEffect(() => {
		if (districtId && !dataLoaded) {
			getWards(districtId)
				.then((res) => {
					setWards(res);
					// Chỉ reset khi user thay đổi district, không reset khi init
					if (!isInit) {
						handleInputChange("ward", "");
						setWardId("");
					}
				})
				.catch(console.error);
		} else if (districtId && dataLoaded) {
			getWards(districtId)
				.then((res) => {
					setWards(res);
					// Reset khi user chọn district mới
					handleInputChange("ward", "");
					setWardId("");
				})
				.catch(console.error);
		} else {
			if (!isInit) {
				setWards([]);
			}
		}
	}, [districtId, isInit, dataLoaded]);

	const chooseProvince = (item) => {
		setProvinceId(item.id);
		setDistrictId("");
		handleInputChange("province", item.full_name);
	};

	const chooseDistrict = (item) => {
		setDistrictId(item.id);
		setWardId("");
		handleInputChange("district", item.full_name);
	};

	const chooseWard = (item) => {
		setWardId(item.id);
		handleInputChange("ward", item.full_name);
	};
	useEffect(() => {
		if (!addressData) return;

		// IIFE async trong useEffect
		(async () => {
			try {
				// Lấy tên đầy đủ “Phường…, Quận…, Tỉnh…”
				const { full_name } = await resolveName(addressData.wardCode);
				const [ward = "", district = "", province = ""] = full_name
					.split(", ")
					.map((s) => s.trim());

				// Set các ID từ addressData để giữ nguyên thông tin
				setProvinceId(addressData.provinceCode || "");
				setDistrictId(addressData.districtCode || "");
				setWardId(addressData.wardCode || "");

				// Load districts và wards trước khi set form data
				if (addressData.provinceCode) {
					const districtsData = await getDistricts(
						addressData.provinceCode
					);
					setDistricts(districtsData);

					if (addressData.districtCode) {
						const wardsData = await getWards(
							addressData.districtCode
						);
						setWards(wardsData);
					}
				}

				setFormData({
					name: addressData.name ?? "",
					phoneNumber:
						addressData.phoneNumber?.replace("+84 ", "0") ?? "",
					houseNumber: addressData.addressLine ?? "",
					ward,
					district,
					province,
					isDefault: addressData.default ?? false,
					tag: addressData.tag ?? "Nhà riêng",
				});

				// Đánh dấu đã khởi tạo xong để các useEffect khác không reset fields
				setIsInit(false);
				setDataLoaded(true);
			} catch (err) {
				console.warn("resolveName failed:", err);
				// Vẫn cần set isInit = false ngay cả khi có lỗi
				setIsInit(false);
				setDataLoaded(true);
			}
		})();
	}, [addressData]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Check if data has been modified
		setIsEdited(true);
	};

	const handleSave = () => {
		// Validate required fields
		if (!formData.name.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập họ và tên",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		if (!formData.phoneNumber.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập số điện thoại",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		// Validate phone number format
		const phoneRegex = /^[0-9]{10,11}$/;
		if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
			showDialog({
				title: "Lỗi",
				message: "Số điện thoại không hợp lệ",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		if (!formData.houseNumber.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập số nhà",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		if (!wardId.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập phường/xã",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		if (!districtId.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập quận/huyện",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}
		if (!provinceId.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập tỉnh/thành phố",
				primaryButton: {
					text: "OK",
					onPress: () => {},
					style: "primary",
				},
				showCloseButton: false,
			});
			return;
		}

		// Here you would typically call an API to update the address
		const location = `${formData.houseNumber}, ${formData.ward}, ${formData.district}, ${formData.province}`;
		const data = {
			id: addressData.id,
			location,
			provinceCode: provinceId,
			districtCode: districtId,
			wardCode: wardId,
			addressLine: formData.houseNumber,
			name: formData.name,
			phoneNumber: formData.phoneNumber,
			tag: formData.tag,
			default: formData.isDefault, // When true, backend should unset other default addresses
		};
		updateShippingAddress(data)
			.unwrap()
			.then((res) => {
				console.log("Update address success:", res);
				showDialog({
					title: "Thành công",
					message: "Địa chỉ đã được cập nhật thành công",
					primaryButton: {
						text: "OK",
						style: "primary",
						onPress: () => {
							setIsEdited(false);
							navigation.goBack();
						},
					},
					showCloseButton: false,
				});
			})
			.catch((err) => {
				console.log("Update address error:", err);
				const errorMessage =
					err?.data?.message ||
					err?.message ||
					"Có lỗi xảy ra khi cập nhật địa chỉ";
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
			})
			.finally(() => {
				setIsEdited(false);
				navigation.goBack();
			});
	};

	const handleDelete = () => {
		showDialog({
			title: "Xác nhận xóa",
			message:
				"Bạn có chắc chắn muốn xóa địa chỉ này?\n\nLưu ý: Nếu địa chỉ đang được sử dụng trong đơn hàng, việc xóa sẽ không thành công.",
			primaryButton: {
				text: "Xóa",
				style: "danger",
				onPress: () => {
					deleteShippingAddress(addressData.id)
						.unwrap()
						.then((res) => {
							console.log("Delete address success:", res);
							if (res.success) {
								showDialog({
									title: "Thành công",
									message:
										res.message || "Địa chỉ đã được xóa",
									primaryButton: {
										text: "OK",
										style: "primary",
										onPress: () => navigation.goBack(),
									},
									showCloseButton: false,
								});
							} else {
								showDialog({
									title: "Lỗi",
									message: res.message,
									primaryButton: {
										text: "OK",
										onPress: () => {},
										style: "primary",
									},
									showCloseButton: false,
								});
							}
						})
						.catch((err) => {
							console.log("Delete address error:", err);

							// Check if error is due to foreign key constraint
							const errorMessage =
								err?.data?.message ||
								err?.message ||
								"Có lỗi xảy ra khi xóa địa chỉ";

							let userFriendlyMessage;
							if (
								errorMessage.includes(
									"foreign key constraint"
								) ||
								errorMessage.includes("violates foreign key") ||
								errorMessage.includes("still referenced")
							) {
								userFriendlyMessage =
									"Không thể xóa địa chỉ này vì đang được sử dụng trong các đơn hàng. Vui lòng liên hệ hỗ trợ nếu cần thiết.";
							} else {
								userFriendlyMessage = errorMessage;
							}

							showDialog({
								title: "Không thể xóa địa chỉ",
								message: userFriendlyMessage,
								primaryButton: {
									text: "Đã hiểu",
									onPress: () => {},
									style: "primary",
								},
								showCloseButton: false,
							});
						});
				},
			},
			secondaryButton: {
				text: "Hủy",
				style: "text",
				onPress: () => {},
			},
			showCloseButton: false,
		});
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
					<Text style={styles.headerTitle}>Chỉnh sửa địa chỉ</Text>
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
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
			>
				<ScrollView
					style={styles.content}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
				>
					<View style={styles.formContainer}>
						{/* Thông tin liên hệ Section */}
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>
								Thông tin liên hệ
							</Text>
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
									value={formData.name}
									onChangeText={(value) =>
										handleInputChange("name", value)
									}
									placeholder="Nhập họ và tên"
									placeholderTextColor="#B0BEC5"
								/>
							</View>
						</View>

						{/* Số điện thoại */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Số điện thoại{" "}
								<Text style={styles.required}>*</Text>
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

						{/* Địa chỉ Section */}
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>
								Thông tin địa chỉ
							</Text>
						</View>

						{/* Số nhà */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Số nhà, tên đường{" "}
								<Text style={styles.required}>*</Text>
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
									onChangeText={(value) =>
										handleInputChange("houseNumber", value)
									}
									placeholder="Ví dụ: 123 Đường ABC"
									placeholderTextColor="#B0BEC5"
								/>
							</View>
						</View>

						{/* Tỉnh / Thành phố */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Tỉnh/Thành phố{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<TouchableOpacity
								style={styles.inputContainer}
								onPress={openProvincePicker}
							>
								<Text style={styles.textInput}>
									{formData.province ||
										"Chọn tỉnh / thành phố"}
								</Text>
								<Ionicons
									name="chevron-down"
									size={20}
									color="#78909C"
								/>
							</TouchableOpacity>
						</View>

						{/* Quận / Huyện */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Quận/Huyện{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<TouchableOpacity
								style={styles.inputContainer}
								onPress={openDistrictPicker}
								disabled={!provinceId}
							>
								<Text style={styles.textInput}>
									{formData.district || "Chọn quận / huyện"}
								</Text>
								<Ionicons
									name="chevron-down"
									size={20}
									color="#78909C"
								/>
							</TouchableOpacity>
						</View>

						{/* Phường / Xã */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Phường/Xã <Text style={styles.required}>*</Text>
							</Text>
							<TouchableOpacity
								style={styles.inputContainer}
								onPress={openWardPicker}
								disabled={!districtId}
							>
								<Text style={styles.textInput}>
									{formData.ward || "Chọn phường / xã"}
								</Text>
								<Ionicons
									name="chevron-down"
									size={20}
									color="#78909C"
								/>
							</TouchableOpacity>
						</View>

						{/* Loại địa chỉ */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Loại địa chỉ{" "}
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
									style={styles.textInput}
									value={formData.tag}
									onChangeText={(value) =>
										handleInputChange("tag", value)
									}
									placeholder="Chọn loại địa chỉ"
									placeholderTextColor="#B0BEC5"
									keyboardType="default"
									maxLength={100}
								/>
							</View>
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
									<Text style={styles.switchLabel}>
										Đặt làm địa chỉ mặc định
									</Text>
									<Text style={styles.switchSubtitle}>
										Địa chỉ này sẽ được sử dụng làm mặc định
									</Text>
								</View>
							</View>
							<Switch
								value={formData.isDefault}
								onValueChange={(value) =>
									handleInputChange("isDefault", value)
								}
								trackColor={{
									false: "#E0E0E0",
									true: "#4FC3F7",
								}}
								thumbColor={
									formData.isDefault ? "#1976D2" : "#FFFFFF"
								}
							/>
						</View>

						{/* Delete Button */}
						{!formData.isDefault && (
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={handleDelete}
							>
								<Ionicons
									name="trash-outline"
									size={20}
									color="#dc3545"
								/>
								<Text style={styles.deleteButtonText}>
									Xóa địa chỉ
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<BottomPicker
				visible={!!picker}
				title={
					picker === "province"
						? "Chọn Tỉnh / Thành phố"
						: picker === "district"
						? "Chọn Quận / Huyện"
						: "Chọn Phường / Xã"
				}
				data={
					picker === "province"
						? provinces
						: picker === "district"
						? districts
						: wards
				}
				onSelect={
					picker === "province"
						? chooseProvince
						: picker === "district"
						? chooseDistrict
						: chooseWard
				}
				onClose={() => setPicker(null)}
			/>
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
