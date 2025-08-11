import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { uploadToCloudinary } from "../../utils/uploadToCloundinary";

export default function FeedbackDetails({ navigation, route }) {
	const { orderData } = route?.params || {};

	// Debug logs
	console.log("FeedbackDetails - Route params:", route?.params);
	console.log("FeedbackDetails - Order data:", orderData);

	// States for ratings
	const [productRating, setProductRating] = useState(0);
	const [serviceRating, setServiceRating] = useState(0);
	const [shippingRating, setShippingRating] = useState(0);

	// States for feedback content
	const [productReview, setProductReview] = useState("");
	const [serviceReview, setServiceReview] = useState("");

	// States for media
	const [selectedImages, setSelectedImages] = useState([]);
	const [selectedVideos, setSelectedVideos] = useState([]);

	// States for shipping tags
	const [selectedShippingTags, setSelectedShippingTags] = useState([]);

	// Predefined shipping review tags
	const shippingTags = [
		{ id: 1, label: "Chuyên nghiệp", color: "#007bff" },
		{ id: 2, label: "Chu đáo", color: "#28a745" },
		{ id: 3, label: "Thân thiện", color: "#17a2b8" },
		{ id: 4, label: "Linh hoạt", color: "#6610f2" },
		{ id: 5, label: "Đáng tin cậy", color: "#fd7e14" },
		{ id: 6, label: "Bảo quản hàng tốt", color: "#e83e8c" },
		{ id: 7, label: "Giao hàng nhanh", color: "#20c997" },
		{ id: 8, label: "Đóng gói cẩn thận", color: "#6f42c1" },
	];

	// Mock order data if not provided
	const order = orderData || {
		id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		productName: "iPhone 15 Pro Max 256GB - Natural Titanium",
		productImage: "https://example.com/iphone.jpg",
		seller: "Apple Store",
		platform: "Amazon",
		shippingUnit: "Giao Hàng Nhanh",
		totalPrice: 35000000,
		quantity: 1,
	};

	// Helper functions
	const formatCurrency = (amount, currency = "VND") => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const handleBackPress = () => {
		navigation.goBack();
	};

	// Star rating component
	const StarRating = ({ rating, setRating, title, disabled = false }) => {
		return (
			<View style={styles.ratingContainer}>
				<Text style={styles.ratingTitle}>{title}</Text>
				<View style={styles.starsContainer}>
					{[1, 2, 3, 4, 5].map((star) => (
						<TouchableOpacity
							key={star}
							onPress={() => !disabled && setRating(star)}
							style={styles.starButton}
							disabled={disabled}
						>
							<Ionicons
								name={star <= rating ? "star" : "star-outline"}
								size={28}
								color={star <= rating ? "#FFD700" : "#ddd"}
							/>
						</TouchableOpacity>
					))}
				</View>
				<Text style={styles.ratingText}>
					{rating > 0 ? `${rating}/5 sao` : "Chưa đánh giá"}
				</Text>
			</View>
		);
	};

	// Media picker functions
	const requestPermission = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Cần quyền truy cập",
				"Ứng dụng cần quyền truy cập thư viện ảnh để upload media.",
				[{ text: "OK" }]
			);
			return false;
		}
		return true;
	};

	const pickImages = async () => {
		const hasPermission = await requestPermission();
		if (!hasPermission) return;

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
				quality: 0.8,
				aspect: [1, 1],
			});

			if (!result.canceled && result.assets) {
				// Upload each image to Cloudinary
				const uploadPromises = result.assets.map(async (asset) => {
					const file = {
						uri: asset.uri,
						type: "image/jpeg",
						name: `feedback_${Date.now()}_${Math.random()}.jpg`,
					};

					const cloudinaryUrl = await uploadToCloudinary(file);
					return cloudinaryUrl
						? {
								id: Date.now() + Math.random(),
								uri: cloudinaryUrl,
								type: "image",
						  }
						: null;
				});

				const uploadedImages = await Promise.all(uploadPromises);
				const validImages = uploadedImages.filter(
					(img) => img !== null
				);

				if (validImages.length > 0) {
					setSelectedImages([...selectedImages, ...validImages]);
				} else {
					Alert.alert("Lỗi", "Không thể upload ảnh");
				}
			}
		} catch (error) {
			console.error("Error uploading images:", error);
			Alert.alert("Lỗi", "Không thể chọn và upload ảnh");
		}
	};

	const pickVideos = async () => {
		const hasPermission = await requestPermission();
		if (!hasPermission) return;

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Videos,
				allowsEditing: true,
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				const newVideo = {
					id: Date.now() + Math.random(),
					uri: result.assets[0].uri,
					type: "video",
				};
				setSelectedVideos([...selectedVideos, newVideo]);
			}
		} catch (_error) {
			Alert.alert("Lỗi", "Không thể chọn video");
		}
	};

	const removeMedia = (id, type) => {
		if (type === "image") {
			setSelectedImages(selectedImages.filter((img) => img.id !== id));
		} else {
			setSelectedVideos(
				selectedVideos.filter((video) => video.id !== id)
			);
		}
	};

	const toggleShippingTag = (tagId) => {
		if (selectedShippingTags.includes(tagId)) {
			setSelectedShippingTags(
				selectedShippingTags.filter((id) => id !== tagId)
			);
		} else {
			setSelectedShippingTags([...selectedShippingTags, tagId]);
		}
	};

	const handleSubmitReview = () => {
		if (
			productRating === 0 &&
			serviceRating === 0 &&
			shippingRating === 0
		) {
			Alert.alert("Thông báo", "Vui lòng đánh giá ít nhất một hạng mục");
			return;
		}

		Alert.alert("Xác nhận", "Bạn có chắc chắn muốn gửi đánh giá này?", [
			{
				text: "Hủy",
				style: "cancel",
			},
			{
				text: "Gửi",
				onPress: () => {
					// TODO: Implement submit review API
					Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
					navigation.goBack();
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Đánh giá đơn hàng"
				showBackButton
				onBackPress={handleBackPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Order Info */}
				<View style={styles.orderInfoCard}>
					<Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
					<View style={styles.productSection}>
						<View style={styles.productImageContainer}>
							{order.productImage ? (
								<Image
									source={{ uri: order.productImage }}
									style={styles.productImage}
									resizeMode="cover"
								/>
							) : (
								<View style={styles.placeholderImage}>
									<Ionicons
										name="image-outline"
										size={32}
										color="#ccc"
									/>
								</View>
							)}
						</View>
						<View style={styles.productInfo}>
							<Text style={styles.productName} numberOfLines={2}>
								{order.productName}
							</Text>
							<Text style={styles.sellerName}>
								Người bán: {order.seller}
							</Text>
							<Text style={styles.productPrice}>
								{formatCurrency(order.totalPrice)} x{" "}
								{order.quantity}
							</Text>
						</View>
					</View>
				</View>

				{/* Product Rating */}
				<View style={styles.reviewCard}>
					<Text style={styles.cardTitle}>Đánh giá sản phẩm</Text>
					<StarRating
						rating={productRating}
						setRating={setProductRating}
						title="Chất lượng sản phẩm"
					/>
					<View style={styles.textInputContainer}>
						<Text style={styles.inputLabel}>
							Nhận xét về sản phẩm (tùy chọn)
						</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
							value={productReview}
							onChangeText={setProductReview}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>
				</View>

				{/* Service Rating */}
				<View style={styles.reviewCard}>
					<Text style={styles.cardTitle}>Đánh giá dịch vụ</Text>
					<StarRating
						rating={serviceRating}
						setRating={setServiceRating}
						title="Chất lượng dịch vụ GShop"
					/>
					<View style={styles.textInputContainer}>
						<Text style={styles.inputLabel}>
							Nhận xét về dịch vụ (tùy chọn)
						</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Đánh giá về thái độ phục vụ, tốc độ xử lý..."
							value={serviceReview}
							onChangeText={setServiceReview}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>
				</View>

				{/* Shipping Rating */}
				<View style={styles.reviewCard}>
					<Text style={styles.cardTitle}>Đánh giá vận chuyển</Text>
					<Text style={styles.shippingUnit}>
						Đơn vị vận chuyển: {order.shippingUnit}
					</Text>
					<StarRating
						rating={shippingRating}
						setRating={setShippingRating}
						title="Chất lượng vận chuyển"
					/>

					{/* Shipping Tags */}
					<View style={styles.tagsContainer}>
						<Text style={styles.tagsLabel}>
							Chọn từ khóa mô tả dịch vụ vận chuyển:
						</Text>
						<View style={styles.tagsGrid}>
							{shippingTags.map((tag) => (
								<TouchableOpacity
									key={tag.id}
									style={[
										styles.tagButton,
										selectedShippingTags.includes(
											tag.id
										) && {
											backgroundColor: tag.color,
											borderColor: tag.color,
										},
									]}
									onPress={() => toggleShippingTag(tag.id)}
								>
									<Text
										style={[
											styles.tagText,
											selectedShippingTags.includes(
												tag.id
											) && styles.tagTextSelected,
										]}
									>
										{tag.label}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>

				{/* Media Upload */}
				<View style={styles.mediaCard}>
					<Text style={styles.cardTitle}>Ảnh & Video đánh giá</Text>
					<Text style={styles.mediaSubtitle}>
						Thêm ảnh hoặc video để đánh giá chân thực hơn
					</Text>

					{/* Media Selection Buttons */}
					<View style={styles.mediaButtonsContainer}>
						<TouchableOpacity
							style={styles.mediaButton}
							onPress={pickImages}
						>
							<Ionicons
								name="camera-outline"
								size={24}
								color="#007bff"
							/>
							<Text style={styles.mediaButtonText}>Thêm ảnh</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.mediaButton}
							onPress={pickVideos}
						>
							<Ionicons
								name="videocam-outline"
								size={24}
								color="#007bff"
							/>
							<Text style={styles.mediaButtonText}>
								Thêm video
							</Text>
						</TouchableOpacity>
					</View>

					{/* Selected Images */}
					{selectedImages.length > 0 && (
						<View style={styles.selectedMediaContainer}>
							<Text style={styles.selectedMediaTitle}>
								Ảnh đã chọn:
							</Text>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
							>
								<View style={styles.mediaPreviewContainer}>
									{selectedImages.map((image) => (
										<View
											key={image.id}
											style={styles.mediaPreviewItem}
										>
											<Image
												source={{ uri: image.uri }}
												style={styles.mediaPreview}
											/>
											<TouchableOpacity
												style={styles.removeMediaButton}
												onPress={() =>
													removeMedia(
														image.id,
														"image"
													)
												}
											>
												<Ionicons
													name="close"
													size={16}
													color="#fff"
												/>
											</TouchableOpacity>
										</View>
									))}
								</View>
							</ScrollView>
						</View>
					)}

					{/* Selected Videos */}
					{selectedVideos.length > 0 && (
						<View style={styles.selectedMediaContainer}>
							<Text style={styles.selectedMediaTitle}>
								Video đã chọn:
							</Text>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
							>
								<View style={styles.mediaPreviewContainer}>
									{selectedVideos.map((video) => (
										<View
											key={video.id}
											style={styles.mediaPreviewItem}
										>
											<View style={styles.videoPreview}>
												<Ionicons
													name="play-circle"
													size={32}
													color="#fff"
												/>
											</View>
											<TouchableOpacity
												style={styles.removeMediaButton}
												onPress={() =>
													removeMedia(
														video.id,
														"video"
													)
												}
											>
												<Ionicons
													name="close"
													size={16}
													color="#fff"
												/>
											</TouchableOpacity>
										</View>
									))}
								</View>
							</ScrollView>
						</View>
					)}
				</View>

				{/* Submit Button */}
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmitReview}
				>
					<Text style={styles.submitButtonText}>Gửi đánh giá</Text>
				</TouchableOpacity>
			</ScrollView>
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
		paddingHorizontal: 12,
		paddingTop: 12,
	},
	scrollContent: {
		paddingBottom: 80,
	},
	orderInfoCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	reviewCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	mediaCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#212529",
		marginBottom: 12,
	},
	productSection: {
		flexDirection: "row",
	},
	productImageContainer: {
		width: 80,
		height: 80,
		borderRadius: 8,
		overflow: "hidden",
		marginRight: 16,
	},
	productImage: {
		width: "100%",
		height: "100%",
	},
	placeholderImage: {
		width: "100%",
		height: "100%",
		backgroundColor: "#f8f9fa",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	productInfo: {
		flex: 1,
		justifyContent: "space-between",
	},
	productName: {
		fontSize: 16,
		color: "#212529",
		fontWeight: "600",
		lineHeight: 22,
		marginBottom: 8,
	},
	sellerName: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
	},
	productPrice: {
		fontSize: 16,
		color: "#dc3545",
		fontWeight: "700",
	},
	ratingContainer: {
		marginBottom: 16,
	},
	ratingTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 8,
	},
	starsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	starButton: {
		marginRight: 8,
		padding: 4,
	},
	ratingText: {
		fontSize: 14,
		color: "#6c757d",
		fontStyle: "italic",
	},
	shippingUnit: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
		fontStyle: "italic",
	},
	textInputContainer: {
		marginTop: 12,
	},
	inputLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
		marginBottom: 8,
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#e9ecef",
		borderRadius: 8,
		padding: 10,
		fontSize: 16,
		color: "#212529",
		backgroundColor: "#ffffff",
		minHeight: 80,
	},
	mediaSubtitle: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 12,
		lineHeight: 20,
	},
	mediaButtonsContainer: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	mediaButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#007bff",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: "#f8f9ff",
	},
	mediaButtonText: {
		fontSize: 16,
		color: "#007bff",
		fontWeight: "500",
		marginLeft: 8,
	},
	selectedMediaContainer: {
		marginTop: 12,
	},
	selectedMediaTitle: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
		marginBottom: 8,
	},
	mediaPreviewContainer: {
		flexDirection: "row",
		gap: 12,
	},
	mediaPreviewItem: {
		position: "relative",
	},
	mediaPreview: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	videoPreview: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
	removeMediaButton: {
		position: "absolute",
		top: -6,
		right: -6,
		backgroundColor: "#dc3545",
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	submitButton: {
		backgroundColor: "#28a745",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginBottom: 16,
	},
	submitButtonText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "700",
	},
	// Shipping Tags Styles
	tagsContainer: {
		marginTop: 12,
	},
	tagsLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
		marginBottom: 8,
	},
	tagsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	tagButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#dee2e6",
		backgroundColor: "#f8f9fa",
		marginBottom: 4,
	},
	tagText: {
		fontSize: 13,
		color: "#6c757d",
		fontWeight: "500",
	},
	tagTextSelected: {
		color: "#ffffff",
		fontWeight: "600",
	},
});
