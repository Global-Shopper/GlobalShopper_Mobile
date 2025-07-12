import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import ProductCard from "../../components/product-card";
import { Text } from "../../components/ui/text";

export default function ConfirmRequest({ navigation, route }) {
	const { products = [] } = route.params || {};

	const [note, setNote] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// State cho địa chỉ giao hàng - ban đầu sẽ null, user phải chọn từ MyAddress
	const [deliveryAddress, setDeliveryAddress] = useState(null);

	const handleEditAddress = () => {
		// Navigate to MyAddress with custom title for address selection
		navigation.navigate("MyAddress", {
			mode: "selection", // Add mode to indicate this is for address selection
			onSelectAddress: (address) => {
				setDeliveryAddress(address);
			},
		});
	};

	const handleViewTerms = () => {
		navigation.navigate("TermsScreen");
	};

	const handleViewPolicy = () => {
		navigation.navigate("PolicyScreen");
	};

	const handleSubmitRequest = async () => {
		if (isSubmitting) return;

		// Kiểm tra địa chỉ giao hàng
		if (!deliveryAddress) {
			Alert.alert(
				"Thiếu thông tin",
				"Vui lòng chọn địa chỉ giao hàng trước khi gửi yêu cầu.",
				[
					{
						text: "Chọn địa chỉ",
						onPress: handleEditAddress,
					},
					{
						text: "Hủy",
						style: "cancel",
					},
				]
			);
			return;
		}

		Alert.alert(
			"Xác nhận gửi yêu cầu",
			"Bạn có chắc chắn muốn gửi yêu cầu này?",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Gửi",
					onPress: async () => {
						setIsSubmitting(true);
						try {
							// TODO: Implement API call to submit request
							await new Promise((resolve) =>
								setTimeout(resolve, 2000)
							); // Simulate API call

							Alert.alert(
								"Thành công",
								"Yêu cầu đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
								[
									{
										text: "OK",
										onPress: () => {
											navigation.reset({
												index: 0,
												routes: [{ name: "Tabs" }],
											});
										},
									},
								]
							);
						} catch (_error) {
							Alert.alert(
								"Lỗi",
								"Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại."
							);
						} finally {
							setIsSubmitting(false);
						}
					},
				},
			]
		);
	};

	const totalProducts = products.length;
	const totalValue = products.reduce((sum, product) => {
		const price = parseFloat(
			product.convertedPrice?.replace(/[^0-9]/g, "") || "0"
		);
		return sum + price;
	}, 0);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			<Header
				title="Xác nhận yêu cầu"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
				showNotificationIcon={false}
			/>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Địa chỉ giao hàng */}
				<View style={styles.section}>
					{deliveryAddress ? (
						<AddressSmCard
							recipientName={deliveryAddress.recipientName}
							phone={deliveryAddress.phone}
							address={deliveryAddress.address}
							isDefault={deliveryAddress.isDefault}
							onEdit={handleEditAddress}
						/>
					) : (
						<TouchableOpacity
							style={styles.addressPlaceholder}
							onPress={handleEditAddress}
						>
							<View style={styles.placeholderContent}>
								<Ionicons
									name="location-outline"
									size={24}
									color="#1976D2"
								/>
								<View style={styles.placeholderText}>
									<Text style={styles.placeholderTitle}>
										Chọn địa chỉ giao hàng
									</Text>
									<Text style={styles.placeholderSubtitle}>
										Nhấn để chọn địa chỉ nhận hàng
									</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color="#666"
								/>
							</View>
						</TouchableOpacity>
					)}
				</View>

				{/* Danh sách sản phẩm */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons
							name="bag-outline"
							size={20}
							color="#1976D2"
						/>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm ({totalProducts} sản phẩm)
						</Text>
					</View>

					{products.map((product, index) => (
						<ProductCard
							key={product.id || index}
							id={product.id || index.toString()}
							name={product.name || "Sản phẩm không tên"}
							price={product.price || "0"}
							convertedPrice={product.convertedPrice}
							image={product.images?.[0]}
							platform={product.platform}
							category={product.category}
							status="pending"
						/>
					))}

					{/* Tổng giá trị ước tính */}
					<View style={styles.totalSection}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>
								Tổng giá trị ước tính:
							</Text>
							<Text style={styles.totalValue}>
								{totalValue.toLocaleString("vi-VN")} VNĐ
							</Text>
						</View>
						<Text style={styles.totalNote}>
							*Giá cuối cùng có thể thay đổi tùy thuộc vào tỷ giá
							và phí dịch vụ
						</Text>
					</View>
				</View>

				{/* Ghi chú */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons
							name="chatbox-outline"
							size={20}
							color="#1976D2"
						/>
						<Text style={styles.sectionTitle}>
							Ghi chú (tùy chọn)
						</Text>
					</View>

					<View style={styles.noteContainer}>
						<TextInput
							style={styles.noteInput}
							placeholder="Nhập ghi chú cho yêu cầu của bạn..."
							placeholderTextColor="#999"
							value={note}
							onChangeText={setNote}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							maxLength={500}
						/>
						<Text style={styles.charCount}>{note.length}/500</Text>
					</View>
				</View>

				{/* Điều khoản */}
				<View style={styles.section}>
					<View style={styles.termsContainer}>
						<Ionicons
							name="information-circle-outline"
							size={18}
							color="#666"
						/>
						<Text style={styles.termsText}>
							Nhấn &ldquo;Gửi yêu cầu&rdquo; đồng nghĩa với việc
							bạn đồng ý tuân theo{" "}
							<Text
								style={styles.termsLink}
								onPress={handleViewTerms}
							>
								Điều khoản
							</Text>{" "}
							và{" "}
							<Text
								style={styles.termsLink}
								onPress={handleViewPolicy}
							>
								Chính sách
							</Text>{" "}
							của GShop
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* Nút gửi */}
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.submitButton,
						isSubmitting && styles.submitButtonDisabled,
					]}
					onPress={handleSubmitRequest}
					disabled={isSubmitting}
				>
					<LinearGradient
						colors={
							isSubmitting
								? ["#ccc", "#999"]
								: ["#42A5F5", "#1976D2"]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.submitButtonGradient}
					>
						{isSubmitting ? (
							<>
								<Ionicons
									name="hourglass-outline"
									size={20}
									color="#fff"
								/>
								<Text style={styles.submitButtonText}>
									Đang gửi...
								</Text>
							</>
						) : (
							<>
								<Ionicons
									name="send-outline"
									size={20}
									color="#fff"
								/>
								<Text style={styles.submitButtonText}>
									Gửi yêu cầu
								</Text>
							</>
						)}
					</LinearGradient>
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
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingBottom: 100,
	},
	section: {
		marginBottom: 20,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		gap: 8,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	totalSection: {
		backgroundColor: "#F3F4F6",
		padding: 16,
		borderRadius: 12,
		marginTop: 12,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	totalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#D32F2F",
	},
	totalNote: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
	},
	noteContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		padding: 12,
	},
	noteInput: {
		fontSize: 14,
		color: "#333",
		minHeight: 80,
		textAlignVertical: "top",
	},
	charCount: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
		marginTop: 8,
	},
	termsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: "#F8F9FA",
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		gap: 8,
	},
	termsText: {
		fontSize: 13,
		color: "#666",
		lineHeight: 18,
		flex: 1,
	},
	termsLink: {
		color: "#1976D2",
		fontWeight: "600",
		textDecorationLine: "underline",
	},
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	submitButton: {
		borderRadius: 12,
		overflow: "hidden",
	},
	submitButtonDisabled: {
		opacity: 0.7,
	},
	submitButtonGradient: {
		paddingVertical: 16,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	addressPlaceholder: {
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#E5E5E5",
		borderStyle: "dashed",
		padding: 16,
	},
	placeholderContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	placeholderText: {
		flex: 1,
	},
	placeholderTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 4,
	},
	placeholderSubtitle: {
		fontSize: 14,
		color: "#666",
	},
});
