import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useCancelOrderMutation } from "../../services/gshopApi";

export default function CancelOrder({ navigation, route }) {
	// Get order data from route params
	const { orderData } = route?.params || {};
	const orderId = orderData?.id;

	// State
	const [selectedReason, setSelectedReason] = useState("");
	const [customReason, setCustomReason] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Cancel order mutation
	const [cancelOrder] = useCancelOrderMutation();

	// Predefined reasons
	const cancelReasons = [
		"Tôi không còn muốn mua sản phẩm này",
		"Tôi tìm được sản phẩm tương tự với giá tốt hơn",
		"Thay đổi ý định mua hàng",
		"Lý do khác",
	];

	// Handle back button
	const handleBackPress = () => {
		navigation.goBack();
	};

	// Handle reason selection
	const handleReasonSelect = (reason) => {
		setSelectedReason(reason);
		if (reason !== "Lý do khác") {
			setCustomReason(""); // Clear custom reason if predefined reason is selected
		}
	};

	// Validate form
	const isFormValid = () => {
		if (!selectedReason) return false;
		if (selectedReason === "Lý do khác" && !customReason.trim())
			return false;
		return true;
	};

	// Get final reason
	const getFinalReason = () => {
		return selectedReason === "Lý do khác"
			? customReason.trim()
			: selectedReason;
	};

	// Handle cancel order
	const handleCancelOrder = async () => {
		if (!isFormValid()) {
			return;
		}

		if (!orderId) {
			return;
		}

		// Cancel order directly without confirmation
		performCancelOrder();
	};

	// Perform the actual cancel operation
	const performCancelOrder = async () => {
		setIsLoading(true);
		try {
			console.log("Canceling order:", orderId);
			console.log("Cancel reason:", getFinalReason());

			// Call cancel API with reason
			const result = await cancelOrder({
				orderId,
				reason: getFinalReason(),
			}).unwrap();

			console.log("Cancel order result:", result);

			// Show success message
			Alert.alert("Thành công", "Đơn hàng đã được hủy thành công", [
				{
					text: "OK",
					onPress: () => {
						// Navigate back to OrderScreen and refresh
						navigation.navigate("OrderScreen");
					},
				},
			]);
		} catch (error) {
			console.error("Failed to cancel order:", error);

			// Show detailed error message
			let errorMessage = "Không thể hủy đơn hàng";
			if (error?.data?.message) {
				errorMessage = error.data.message;
			} else if (error?.message) {
				errorMessage = error.message;
			} else if (error?.status) {
				errorMessage = `Lỗi ${error.status}: ${
					error.statusText || "Không thể kết nối với server"
				}`;
			}

			Alert.alert("Lỗi", errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Format order info for display
	const getOrderDisplayInfo = () => {
		if (!orderData) return "Đơn hàng không xác định";

		const productName =
			orderData.orderItems?.[0]?.productName || "Sản phẩm không xác định";
		const shortId = orderData.id?.split("-")[0] || orderData.id;

		return `${productName} (#${shortId})`;
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			{/* Header */}
			<Header
				title="Hủy đơn hàng"
				showBackButton
				onBackPress={handleBackPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Order Info Card */}
				<View style={styles.orderCard}>
					<Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
					<Text style={styles.orderInfo}>
						{getOrderDisplayInfo()}
					</Text>
				</View>

				{/* Reason Selection Card */}
				<View style={styles.reasonCard}>
					<Text style={styles.cardTitle}>Lý do hủy đơn hàng</Text>
					<Text style={styles.subtitle}>
						Vui lòng chọn lý do để chúng tôi cải thiện dịch vụ
					</Text>

					{/* Reason Options */}
					<View style={styles.reasonList}>
						{cancelReasons.map((reason, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.reasonItem,
									selectedReason === reason &&
										styles.selectedReasonItem,
								]}
								onPress={() => handleReasonSelect(reason)}
							>
								<View style={styles.reasonContent}>
									<Text
										style={[
											styles.reasonText,
											selectedReason === reason &&
												styles.selectedReasonText,
										]}
									>
										{reason}
									</Text>
									<View
										style={[
											styles.radioButton,
											selectedReason === reason &&
												styles.selectedRadioButton,
										]}
									>
										{selectedReason === reason && (
											<View
												style={styles.radioButtonInner}
											/>
										)}
									</View>
								</View>
							</TouchableOpacity>
						))}
					</View>

					{/* Custom Reason Input */}
					{selectedReason === "Lý do khác" && (
						<View style={styles.customReasonContainer}>
							<Text style={styles.customReasonLabel}>
								Nhập lý do của bạn:
							</Text>
							<TextInput
								style={styles.customReasonInput}
								placeholder="Vui lòng nhập lý do hủy đơn hàng..."
								value={customReason}
								onChangeText={setCustomReason}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
								maxLength={500}
							/>
							<Text style={styles.characterCount}>
								{customReason.length}/500 ký tự
							</Text>
						</View>
					)}
				</View>

				{/* Warning Card */}
				<View style={styles.warningCard}>
					<View style={styles.warningHeader}>
						<Ionicons
							name="warning-outline"
							size={20}
							color="#f59e0b"
						/>
						<Text style={styles.warningTitle}>Lưu ý</Text>
					</View>
					<Text style={styles.warningText}>
						• Đơn hàng đã hủy không thể khôi phục{"\n"}• Tiền sẽ
						được hoàn trả trong 3-5 ngày làm việc{"\n"}• Bạn có thể
						đặt lại đơn hàng mới nếu muốn
					</Text>
				</View>
			</ScrollView>

			{/* Bottom Actions */}
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.cancelButton,
						(!isFormValid() || isLoading) && styles.disabledButton,
					]}
					onPress={handleCancelOrder}
					disabled={!isFormValid() || isLoading}
				>
					<Text style={styles.cancelButtonText}>
						{isLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	scrollContent: {
		paddingBottom: 20,
	},
	orderCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 12,
	},
	orderInfo: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
	},
	reasonCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	subtitle: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 16,
		lineHeight: 20,
	},
	reasonList: {
		marginBottom: 16,
	},
	reasonItem: {
		borderWidth: 1,
		borderColor: "#e9ecef",
		borderRadius: 8,
		marginBottom: 8,
		backgroundColor: "#fff",
	},
	selectedReasonItem: {
		borderColor: "#007bff",
		backgroundColor: "#f8f9ff",
	},
	reasonContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	reasonText: {
		fontSize: 14,
		color: "#495057",
		flex: 1,
		marginRight: 12,
		lineHeight: 20,
	},
	selectedReasonText: {
		color: "#007bff",
		fontWeight: "500",
	},
	radioButton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#ced4da",
		justifyContent: "center",
		alignItems: "center",
	},
	selectedRadioButton: {
		borderColor: "#007bff",
	},
	radioButtonInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#007bff",
	},
	customReasonContainer: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	customReasonLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#495057",
		marginBottom: 8,
	},
	customReasonInput: {
		borderWidth: 1,
		borderColor: "#ced4da",
		borderRadius: 8,
		padding: 12,
		fontSize: 14,
		color: "#495057",
		backgroundColor: "#fff",
		minHeight: 100,
	},
	characterCount: {
		fontSize: 12,
		color: "#6c757d",
		textAlign: "right",
		marginTop: 4,
	},
	warningCard: {
		backgroundColor: "#fff8e6",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#fde68a",
	},
	warningHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	warningTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#f59e0b",
		marginLeft: 8,
	},
	warningText: {
		fontSize: 13,
		color: "#92400e",
		lineHeight: 18,
	},
	bottomContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	cancelButton: {
		backgroundColor: "#dc3545",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
	},
	disabledButton: {
		backgroundColor: "#6c757d",
	},
	cancelButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
});
