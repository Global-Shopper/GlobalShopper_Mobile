import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Dialog from "../../components/dialog";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useCreateRefundTicketMutation } from "../../services/gshopApi";
import { uploadToCloudinary } from "../../utils/uploadToCloundinary";

export default function RequestRefund({ navigation, route }) {
	const { orderData } = route.params;

	// States
	const [reason, setReason] = useState("");
	const [evidence, setEvidence] = useState([]);
	const [isUploading, setIsUploading] = useState(false);

	// Dialog states
	const [showDialog, setShowDialog] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogMessage, setDialogMessage] = useState("");
	const [dialogOnConfirm, setDialogOnConfirm] = useState(null);

	// API mutation
	const [createRefundTicket, { isLoading }] = useCreateRefundTicketMutation();

	// Format order ID to show only first part before dash
	const getShortOrderId = (fullId) => {
		if (!fullId) return "";
		const parts = fullId.split("-");
		return parts[0];
	};

	// Helper function to show dialog
	const showInfoDialog = (title, message, onConfirm = null) => {
		setDialogTitle(title);
		setDialogMessage(message);
		setDialogOnConfirm(() => onConfirm);
		setShowDialog(true);
	};

	// Handle image picker
	const handleImagePicker = async () => {
		if (evidence.length >= 10) {
			showInfoDialog("Thông báo", "Bạn chỉ có thể tải lên tối đa 10 ảnh");
			return;
		}

		try {
			// Request permission
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (permissionResult.granted === false) {
				showInfoDialog(
					"Thông báo",
					"Cần quyền truy cập thư viện ảnh để tải ảnh lên"
				);
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.8,
				allowsMultipleSelection: false,
			});

			if (!result.canceled && result.assets[0]) {
				setIsUploading(true);
				try {
					// Create proper file object for Cloudinary
					const fileUri = result.assets[0].uri;
					const fileName =
						result.assets[0].fileName || `image_${Date.now()}.jpg`;
					const fileType = result.assets[0].mimeType || "image/jpeg";

					const fileObject = {
						uri: fileUri,
						name: fileName,
						type: fileType,
					};

					const uploadedUrl = await uploadToCloudinary(fileObject);
					if (uploadedUrl) {
						setEvidence([...evidence, uploadedUrl]);
					} else {
						showInfoDialog(
							"Lỗi",
							"Không thể tải ảnh lên. Vui lòng thử lại."
						);
					}
				} catch (error) {
					console.log("Upload error:", error);
					showInfoDialog(
						"Lỗi",
						"Không thể tải ảnh lên. Vui lòng thử lại."
					);
				} finally {
					setIsUploading(false);
				}
			}
		} catch (error) {
			console.log("ImagePicker error:", error);
			showInfoDialog("Lỗi", "Không thể mở thư viện ảnh");
		}
	};

	// Remove image
	const removeImage = (index) => {
		const newEvidence = evidence.filter((_, i) => i !== index);
		setEvidence(newEvidence);
	};

	// Handle submit
	const handleSubmit = async () => {
		if (!reason.trim()) {
			showInfoDialog("Thông báo", "Vui lòng nhập lý do hoàn tiền");
			return;
		}

		try {
			const refundData = {
				orderId: orderData.id,
				reason: reason.trim(),
				evidence: evidence,
			};

			await createRefundTicket(refundData).unwrap();

			showInfoDialog(
				"Thành công",
				"Yêu cầu hoàn tiền đã được gửi thành công",
				() => navigation.goBack()
			);
		} catch (error) {
			showInfoDialog(
				"Lỗi",
				error?.data?.message || "Không thể gửi yêu cầu hoàn tiền"
			);
		}
	};

	return (
		<View style={styles.container}>
			<Header
				title="Yêu cầu hoàn tiền"
				showBackButton
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Order Information */}
				<View style={styles.section}>
					<View style={styles.orderInfoCard}>
						<View style={styles.orderInfoRow}>
							<Text style={styles.orderInfoLabel}>
								Mã đơn hàng
							</Text>
							<Text style={styles.orderInfoValue}>
								#{getShortOrderId(orderData.id)}
							</Text>
						</View>
					</View>
				</View>

				{/* Reason Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Lý do hoàn tiền <Text style={styles.required}>*</Text>
					</Text>

					<TextInput
						style={styles.textArea}
						placeholder="Nhập lý do hoàn tiền..."
						value={reason}
						onChangeText={setReason}
						multiline={true}
						numberOfLines={4}
						textAlignVertical="top"
						maxLength={500}
					/>
					<Text style={styles.characterCount}>
						{reason.length}/500
					</Text>
				</View>

				{/* Evidence Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Minh chứng
						<Text style={styles.required}>*</Text>
					</Text>
					<Text style={styles.subtitle}>
						Tải lên hình ảnh minh chứng (tối đa 10 ảnh)
					</Text>

					{/* Image Grid */}
					<View style={styles.imageGrid}>
						{evidence.map((imageUri, index) => (
							<View key={index} style={styles.imageContainer}>
								<Image
									source={{ uri: imageUri }}
									style={styles.imagePreview}
								/>
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => removeImage(index)}
								>
									<Ionicons
										name="close"
										size={16}
										color="#fff"
									/>
								</TouchableOpacity>
							</View>
						))}

						{/* Add Image Button */}
						{evidence.length < 10 && (
							<TouchableOpacity
								style={styles.addImageButton}
								onPress={handleImagePicker}
								disabled={isUploading}
							>
								{isUploading ? (
									<ActivityIndicator
										size="small"
										color="#1d4ed8"
									/>
								) : (
									<>
										<Ionicons
											name="camera"
											size={24}
											color="#1d4ed8"
										/>
										<Text style={styles.addImageText}>
											Thêm ảnh
										</Text>
									</>
								)}
							</TouchableOpacity>
						)}
					</View>

					{evidence.length > 0 && (
						<Text style={styles.imageCount}>
							{evidence.length}/10 ảnh đã tải lên
						</Text>
					)}
				</View>
			</ScrollView>

			{/* Submit Button */}
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.submitButton,
						(!reason.trim() || isLoading) &&
							styles.submitButtonDisabled,
					]}
					onPress={handleSubmit}
					disabled={!reason.trim() || isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						<Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
					)}
				</TouchableOpacity>
			</View>

			{/* Dialog */}
			<Dialog
				visible={showDialog}
				title={dialogTitle}
				message={dialogMessage}
				onClose={() => setShowDialog(false)}
				primaryButton={{
					text: "OK",
					onPress: () => {
						setShowDialog(false);
						if (dialogOnConfirm) {
							dialogOnConfirm();
						}
					},
				}}
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
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 16,
	},
	required: {
		color: "#dc3545",
	},
	orderInfoCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: "#1d4ed8",
	},
	orderInfoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	orderInfoLabel: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	orderInfoValue: {
		fontSize: 16,
		color: "#212529",
		fontWeight: "600",
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#212529",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 16,
	},
	textArea: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		color: "#212529",
		borderWidth: 1,
		borderColor: "#e9ecef",
		minHeight: 120,
	},
	characterCount: {
		fontSize: 12,
		color: "#6c757d",
		textAlign: "right",
		marginTop: 4,
	},
	imageGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	imageContainer: {
		position: "relative",
		width: 80,
		height: 80,
	},
	imagePreview: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f8f9fa",
	},
	removeButton: {
		position: "absolute",
		top: -6,
		right: -6,
		backgroundColor: "#dc3545",
		borderRadius: 12,
		width: 24,
		height: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	addImageButton: {
		width: 80,
		height: 80,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#1d4ed8",
		borderStyle: "dashed",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9ff",
	},
	addImageText: {
		fontSize: 12,
		color: "#1d4ed8",
		marginTop: 4,
		textAlign: "center",
	},
	imageCount: {
		fontSize: 12,
		color: "#6c757d",
		marginTop: 8,
		textAlign: "center",
	},
	bottomContainer: {
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 20,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	submitButton: {
		backgroundColor: "#1d4ed8",
		paddingVertical: 16,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	submitButtonDisabled: {
		backgroundColor: "#6c757d",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
