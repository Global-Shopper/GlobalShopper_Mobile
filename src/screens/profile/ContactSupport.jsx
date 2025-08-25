import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import Dialog from "../../components/dialog";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function ContactSupport({ navigation }) {
	const reduxUser = useSelector((state) => state?.rootReducer?.user);

	const [formData, setFormData] = useState({
		email: reduxUser?.email || "",
		requestType: "",
		subject: "",
		message: "",
		priority: "medium",
	});
	const [isLoading, setIsLoading] = useState(false);

	// Dialog states
	const [dialogConfig, setDialogConfig] = useState({
		visible: false,
		title: "",
		message: "",
		primaryButton: null,
		secondaryButton: null,
	});

	const priorityOptions = [
		{ value: "low", label: "Thấp", color: "#28a745", icon: "flag-outline" },
		{
			value: "medium",
			label: "Trung bình",
			color: "#ffc107",
			icon: "flag",
		},
		{ value: "high", label: "Cao", color: "#dc3545", icon: "flag" },
	];

	const requestTypeOptions = [
		{
			value: "request",
			label: "Yêu cầu mua hàng",
			icon: "bag-outline",
			color: "#007AFF",
		},
		{
			value: "order",
			label: "Đơn hàng",
			icon: "receipt-outline",
			color: "#28a745",
		},
		{
			value: "refund",
			label: "Hoàn tiền",
			icon: "arrow-undo-outline",
			color: "#dc3545",
		},
		{
			value: "withdraw",
			label: "Rút tiền",
			icon: "card-outline",
			color: "#6f42c1",
		},
		{
			value: "payment",
			label: "Thanh toán",
			icon: "wallet-outline",
			color: "#fd7e14",
		},
		{
			value: "shipping",
			label: "Vận chuyển",
			icon: "car-outline",
			color: "#20c997",
		},
		{
			value: "account",
			label: "Tài khoản",
			icon: "person-outline",
			color: "#6c757d",
		},
		{
			value: "other",
			label: "Khác",
			icon: "help-circle-outline",
			color: "#17a2b8",
		},
	];

	// Dialog helper functions
	const showDialog = (
		title,
		message,
		primaryButton = null,
		secondaryButton = null
	) => {
		setDialogConfig({
			visible: true,
			title,
			message,
			primaryButton,
			secondaryButton,
		});
	};

	const closeDialog = () => {
		setDialogConfig((prev) => ({ ...prev, visible: false }));
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.email.trim()) {
			showDialog("Lỗi", "Vui lòng nhập email", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		if (!formData.email.includes("@")) {
			showDialog("Lỗi", "Email không hợp lệ", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		if (!formData.requestType) {
			showDialog("Lỗi", "Vui lòng chọn loại yêu cầu", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		if (!formData.subject.trim()) {
			showDialog("Lỗi", "Vui lòng nhập tiêu đề", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		if (!formData.message.trim()) {
			showDialog("Lỗi", "Vui lòng nhập nội dung yêu cầu", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		if (formData.message.trim().length < 10) {
			showDialog("Lỗi", "Nội dung yêu cầu phải có ít nhất 10 ký tự", {
				text: "OK",
				onPress: () => {},
				style: "danger",
			});
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Here you would normally call your API
			console.log("Support request submitted:", formData);

			showDialog(
				"Thành công",
				"Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
				{
					text: "OK",
					onPress: () => navigation.goBack(),
					style: "success",
				}
			);
		} catch (_error) {
			showDialog(
				"Lỗi",
				"Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.",
				{
					text: "OK",
					onPress: () => {},
					style: "danger",
				}
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Gửi yêu cầu hỗ trợ"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<KeyboardAvoidingView
				style={styles.content}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						style={styles.scrollContainer}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{/* Info Banner */}
						<View style={styles.infoBanner}>
							<View style={styles.infoIconContainer}>
								<Ionicons
									name="information-circle"
									size={24}
									color="#007AFF"
								/>
							</View>
							<View style={styles.infoTextContainer}>
								<Text style={styles.infoTitle}>
									Hỗ trợ 24/7
								</Text>
								<Text style={styles.infoSubtitle}>
									Chúng tôi sẽ phản hồi yêu cầu của bạn trong
									vòng 24 giờ
								</Text>
							</View>
						</View>

						{/* Email Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.fieldLabel}>
								Email liên hệ{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="mail-outline"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.textInput}
									value={formData.email}
									onChangeText={(value) =>
										handleInputChange("email", value)
									}
									placeholder="Nhập email của bạn"
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete="email"
								/>
							</View>
						</View>

						{/* Request Type Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.fieldLabel}>
								Loại yêu cầu{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View style={styles.requestTypeGrid}>
								{requestTypeOptions.map((option) => (
									<TouchableOpacity
										key={option.value}
										style={[
											styles.requestTypeOption,
											formData.requestType ===
												option.value &&
												styles.requestTypeOptionSelected,
										]}
										onPress={() =>
											handleInputChange(
												"requestType",
												option.value
											)
										}
									>
										<View
											style={[
												styles.requestTypeIcon,
												{
													backgroundColor:
														formData.requestType ===
														option.value
															? option.color
															: option.color +
															  "20",
												},
											]}
										>
											<Ionicons
												name={option.icon}
												size={18}
												color={
													formData.requestType ===
													option.value
														? "#fff"
														: option.color
												}
											/>
										</View>
										<Text
											style={[
												styles.requestTypeLabel,
												formData.requestType ===
													option.value && {
													color: option.color,
													fontWeight: "600",
												},
											]}
										>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Priority Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.fieldLabel}>
								Mức độ ưu tiên{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View style={styles.priorityContainer}>
								{priorityOptions.map((option) => (
									<TouchableOpacity
										key={option.value}
										style={[
											styles.priorityOption,
											formData.priority ===
												option.value &&
												styles.priorityOptionSelected,
										]}
										onPress={() =>
											handleInputChange(
												"priority",
												option.value
											)
										}
									>
										<Ionicons
											name={option.icon}
											size={16}
											color={
												formData.priority ===
												option.value
													? "#fff"
													: option.color
											}
										/>
										<Text
											style={[
												styles.priorityLabel,
												formData.priority ===
													option.value &&
													styles.priorityLabelSelected,
											]}
										>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Subject Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.fieldLabel}>
								Tiêu đề <Text style={styles.required}>*</Text>
							</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="text-outline"
									size={20}
									color="#666"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.textInput}
									value={formData.subject}
									onChangeText={(value) =>
										handleInputChange("subject", value)
									}
									placeholder="Nhập tiêu đề yêu cầu"
									maxLength={100}
								/>
							</View>
							<Text style={styles.characterCount}>
								{formData.subject.length}/100
							</Text>
						</View>

						{/* Message Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.fieldLabel}>
								Nội dung yêu cầu{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View
								style={[
									styles.inputContainer,
									styles.messageContainer,
								]}
							>
								<TextInput
									style={[
										styles.textInput,
										styles.messageInput,
									]}
									value={formData.message}
									onChangeText={(value) =>
										handleInputChange("message", value)
									}
									placeholder="Mô tả chi tiết vấn đề bạn gặp phải hoặc yêu cầu hỗ trợ..."
									multiline
									numberOfLines={6}
									textAlignVertical="top"
									maxLength={1000}
								/>
							</View>
							<Text style={styles.characterCount}>
								{formData.message.length}/1000
							</Text>
						</View>

						{/* Contact Info */}
						<View style={styles.contactInfo}>
							<Text style={styles.contactTitle}>
								Thông tin liên hệ khác
							</Text>
							<View style={styles.contactItem}>
								<Ionicons
									name="call-outline"
									size={16}
									color="#666"
								/>
								<Text style={styles.contactText}>
									Hotline: 1900 1234
								</Text>
							</View>
							<View style={styles.contactItem}>
								<Ionicons
									name="mail-outline"
									size={16}
									color="#666"
								/>
								<Text style={styles.contactText}>
									Email: sep490gshop@gmail.com
								</Text>
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>

				{/* Submit Button - Fixed at bottom */}
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[
							styles.submitButton,
							isLoading && styles.submitButtonDisabled,
						]}
						onPress={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? (
							<Text style={styles.submitButtonText}>
								Đang gửi...
							</Text>
						) : (
							<>
								<Ionicons name="send" size={20} color="#fff" />
								<Text style={styles.submitButtonText}>
									Gửi yêu cầu
								</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>

			{/* Dialog */}
			<Dialog
				visible={dialogConfig.visible}
				onClose={closeDialog}
				title={dialogConfig.title}
				message={dialogConfig.message}
				primaryButton={dialogConfig.primaryButton}
				secondaryButton={dialogConfig.secondaryButton}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	infoBanner: {
		flexDirection: "row",
		backgroundColor: "#f0f8ff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
		borderLeftWidth: 4,
		borderLeftColor: "#007AFF",
	},
	infoIconContainer: {
		marginRight: 12,
	},
	infoTextContainer: {
		flex: 1,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#007AFF",
		marginBottom: 4,
	},
	infoSubtitle: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	fieldContainer: {
		marginBottom: 20,
	},
	fieldLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
		fontWeight: "600",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		paddingHorizontal: 12,
		minHeight: 48,
	},
	inputIcon: {
		marginRight: 8,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
		paddingVertical: 12,
	},
	messageContainer: {
		alignItems: "flex-start",
		minHeight: 120,
	},
	messageInput: {
		paddingTop: 12,
		paddingBottom: 12,
		minHeight: 96,
	},
	characterCount: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
		marginTop: 4,
	},
	// Request Type Styles
	requestTypeGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	requestTypeOption: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		padding: 12,
		minWidth: "47%",
		flex: 1,
	},
	requestTypeOptionSelected: {
		borderColor: "#007AFF",
		backgroundColor: "#f0f8ff",
	},
	requestTypeIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	requestTypeLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
		flex: 1,
	},
	// Priority Styles
	priorityContainer: {
		flexDirection: "row",
		gap: 8,
	},
	priorityOption: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		gap: 6,
	},
	priorityOptionSelected: {
		backgroundColor: "#007AFF",
		borderColor: "#007AFF",
	},
	priorityLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
	},
	priorityLabelSelected: {
		color: "#fff",
	},
	contactInfo: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginTop: 8,
	},
	contactTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		gap: 8,
	},
	contactText: {
		fontSize: 14,
		color: "#666",
	},
	buttonContainer: {
		padding: 20,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	submitButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#007AFF",
		borderRadius: 8,
		paddingVertical: 16,
		gap: 8,
	},
	submitButtonDisabled: {
		backgroundColor: "#ccc",
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
	},
});
