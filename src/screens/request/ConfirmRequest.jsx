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
import StoreCard from "../../components/store-card";
import { Text } from "../../components/ui/text";

export default function ConfirmRequest({ navigation, route }) {
	const { products = [], storeData = null } = route.params || {};

	const [note, setNote] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isNoteExpanded, setIsNoteExpanded] = useState(false);

	const [deliveryAddress, setDeliveryAddress] = useState(null);

	const handleEditAddress = () => {
		// Navigate to MyAddress with custom title for address selection
		navigation.navigate("MyAddress", {
			mode: "selection",
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

	// Get unique store information for manual products
	const manualProducts = products.filter(
		(product) => product.mode === "manual"
	);

	// Use storeData from route params or fallback to product storeData
	const storeInfo =
		storeData ||
		(manualProducts.length > 0 ? manualProducts[0].storeData : null);

	// Debug: Log to check data structure
	console.log("Manual products:", manualProducts);
	console.log("Store info from route:", storeData);
	console.log("Final store info:", storeInfo);
	console.log("All products:", products);

	// Only calculate total value for withLink products
	const withLinkProducts = products.filter(
		(product) => product.mode === "withLink" || product.mode !== "manual"
	);
	const totalValue = withLinkProducts.reduce((sum, product) => {
		if (product.mode === "manual") return sum; // Skip manual products
		const price = parseFloat(
			product.convertedPrice?.replace(/[^0-9]/g, "") || "0"
		);
		return sum + price;
	}, 0);

	// Check if there are any withLink products to show total section
	const hasWithLinkProducts = withLinkProducts.length > 0 && totalValue > 0;

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
					<AddressSmCard
						recipientName={deliveryAddress?.recipientName}
						phone={deliveryAddress?.phone}
						address={deliveryAddress?.address}
						isDefault={deliveryAddress?.isDefault}
						onEdit={handleEditAddress}
						isEmpty={!deliveryAddress}
					/>
				</View>

				{/* Thông tin cửa hàng - Show when storeData exists OR has manual products */}
				{(storeData || manualProducts.length > 0) && (
					<View style={styles.section}>
						<StoreCard
							storeName={storeInfo?.storeName || "Test Store"}
							storeAddress={
								storeInfo?.storeAddress ||
								"123 Test Address, Test City"
							}
							phoneNumber={storeInfo?.phoneNumber || "0123456789"}
							email={storeInfo?.email || "test@store.com"}
							shopLink={
								storeInfo?.shopLink || "https://teststore.com"
							}
							mode="manual"
							showEditButton={false}
						/>
					</View>
				)}

				{/* Danh sách sản phẩm */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm ({totalProducts} sản phẩm)
						</Text>
					</View>

					{products.map((product, index) => (
						<ProductCard
							key={product.id || index}
							id={product.id || index.toString()}
							name={product.name || "Sản phẩm không tên"}
							description={product.description}
							images={product.images}
							price={
								product.mode === "manual"
									? ""
									: product.price || ""
							}
							convertedPrice={
								product.mode === "manual"
									? ""
									: product.convertedPrice
							}
							exchangeRate={
								product.mode === "manual"
									? undefined
									: product.exchangeRate
							}
							category={product.category}
							brand={product.brand}
							material={product.material}
							size={product.size}
							color={product.color}
							platform={product.platform}
							productLink={product.productLink}
							mode={
								product.mode === "manual"
									? "manual"
									: "withLink"
							}
							sellerInfo={product.sellerInfo}
							status="pending"
						/>
					))}

					{/* Đường kẻ ngang */}
					<View style={styles.divider} />

					{/* Tổng giá trị ước tính - Only show for withLink products */}
					{hasWithLinkProducts && (
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
								*Giá cuối cùng có thể thay đổi tùy thuộc vào tỷ
								giá, phí vận chuyển và phí dịch vụ
							</Text>
						</View>
					)}
				</View>

				{/* Ghi chú */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.noteHeader}
						onPress={() => setIsNoteExpanded(!isNoteExpanded)}
					>
						<View style={styles.noteHeaderLeft}>
							<Ionicons
								name="chatbox-outline"
								size={20}
								color="#1976D2"
							/>
							<Text style={styles.sectionTitle}>
								Lời nhắn (nếu có)
							</Text>
						</View>
						<View style={styles.noteHeaderRight}>
							<Ionicons
								name={
									isNoteExpanded
										? "remove-circle-outline"
										: "add-circle-outline"
								}
								size={22}
								color="#1976D2"
							/>
						</View>
					</TouchableOpacity>

					{isNoteExpanded && (
						<View style={styles.noteContainer}>
							<TextInput
								style={styles.noteInput}
								placeholder="Bạn có lưu ý gì đặc biệt không?"
								placeholderTextColor="#999"
								value={note}
								onChangeText={setNote}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
								maxLength={500}
							/>
							<Text style={styles.charCount}>
								{note.length}/500
							</Text>
						</View>
					)}
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
							<Text style={styles.submitButtonText}>
								Đang gửi...
							</Text>
						) : (
							<Text style={styles.submitButtonText}>
								Gửi yêu cầu
							</Text>
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
		paddingHorizontal: 18,
		paddingVertical: 8,
		paddingBottom: 100,
	},
	section: {
		marginBottom: 10,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
		gap: 4,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	totalSection: {
		backgroundColor: "#F3F4F6",
		padding: 10,
		borderRadius: 10,
		marginTop: 6,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
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
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		padding: 10,
		marginTop: 0,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	noteInput: {
		fontSize: 14,
		color: "#333",
		minHeight: 80,
		textAlignVertical: "top",
		borderWidth: 1,
		borderColor: "#F0F0F0",
		borderRadius: 8,
		padding: 8,
		backgroundColor: "#FAFAFA",
	},
	charCount: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
		marginTop: 6,
	},
	termsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: "#F8F9FA",
		padding: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		gap: 6,
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
		paddingHorizontal: 12,
		paddingVertical: 16,
		paddingBottom: 27,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	submitButton: {
		borderRadius: 10,
		overflow: "hidden",
	},
	submitButtonDisabled: {
		opacity: 0.7,
	},
	submitButtonGradient: {
		paddingVertical: 17,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 8,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		marginBottom: 4,
	},
	noteHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		flex: 1,
	},
	noteHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	addText: {
		fontSize: 14,
		color: "#1976D2",
		fontWeight: "500",
	},
});
