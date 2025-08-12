import { Ionicons } from "@expo/vector-icons";
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
import { useCreateFeedbackMutation } from "../../services/gshopApi";

export default function FeedbackDetails({ navigation, route }) {
	const { orderData } = route?.params || {};

	// API mutation
	const [createFeedback, { isLoading: isSubmitting }] =
		useCreateFeedbackMutation();

	// Debug logs
	console.log("FeedbackDetails - Route params:", route?.params);
	console.log("FeedbackDetails - Order data:", orderData);

	// States for rating and comment
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [selectedReasonTags, setSelectedReasonTags] = useState([]);
	const [showCustomInput, setShowCustomInput] = useState(false);

	// Predefined reason tags
	const reasonTags = [
		{ id: 1, label: "Sản phẩm chất lượng tốt" },
		{ id: 2, label: "Giá cả hợp lý" },
		{ id: 3, label: "Giao hàng nhanh" },
		{ id: 4, label: "Đóng gói cẩn thận" },
		{ id: 5, label: "Dịch vụ tốt" },
		{ id: 6, label: "Đúng như mô tả" },
		{ id: 7, label: "Sản phẩm kém chất lượng" },
		{ id: 8, label: "Giao hàng chậm" },
		{ id: 9, label: "Khác" },
	];

	// Helper functions
	const formatCurrency = (amount, currency = "VND") => {
		return (
			new Intl.NumberFormat("vi-VN", {
				style: "decimal",
				minimumFractionDigits: 0,
			}).format(amount) + " VNĐ"
		);
	};

	const handleBackPress = () => {
		navigation.goBack();
	};

	// Star rating component
	const StarRating = ({ rating, setRating, title }) => {
		return (
			<View style={styles.ratingContainer}>
				<Text style={styles.ratingTitle}>{title}</Text>
				<View style={styles.starsContainer}>
					{[1, 2, 3, 4, 5].map((star) => (
						<TouchableOpacity
							key={star}
							onPress={() => setRating(star)}
							style={styles.starButton}
						>
							<Ionicons
								name={star <= rating ? "star" : "star-outline"}
								size={32}
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

	const toggleReasonTag = (tagId) => {
		const isSelected = selectedReasonTags.includes(tagId);

		if (tagId === 9) {
			// "Khác" option
			if (isSelected) {
				setSelectedReasonTags(
					selectedReasonTags.filter((id) => id !== tagId)
				);
				setShowCustomInput(false);
				setComment("");
			} else {
				setSelectedReasonTags([...selectedReasonTags, tagId]);
				setShowCustomInput(true);
				setComment("");
			}
		} else {
			if (isSelected) {
				setSelectedReasonTags(
					selectedReasonTags.filter((id) => id !== tagId)
				);
			} else {
				setSelectedReasonTags([...selectedReasonTags, tagId]);
			}

			// Update comment với tất cả lý do đã chọn
			const updatedTags = isSelected
				? selectedReasonTags.filter((id) => id !== tagId)
				: [...selectedReasonTags, tagId];

			const selectedLabels = reasonTags
				.filter((tag) => updatedTags.includes(tag.id) && tag.id !== 9)
				.map((tag) => tag.label);

			setComment(selectedLabels.join(", "));
		}
	};

	const handleSubmitReview = async () => {
		if (rating === 0) {
			Alert.alert("Thông báo", "Vui lòng đánh giá số sao");
			return;
		}

		if (!comment.trim()) {
			Alert.alert("Thông báo", "Vui lòng nhập nhận xét hoặc chọn lý do");
			return;
		}

		try {
			// Prepare feedback data according to API spec
			const feedbackData = {
				orderId: orderData?.id || "test-order-id",
				rating: rating,
				comment: comment.trim(),
			};

			console.log("Submitting feedback data:", feedbackData);

			// Call API
			const result = await createFeedback(feedbackData).unwrap();
			console.log("Feedback submitted successfully:", result);

			Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!", [
				{
					text: "OK",
					onPress: () => {
						// Navigate back to OrderScreen
						navigation.goBack();
					},
				},
			]);
		} catch (error) {
			console.error("Error submitting feedback:", error);

			// Check for duplicate feedback error
			if (
				error?.data?.message?.includes(
					"duplicate key value violates unique constraint"
				)
			) {
				Alert.alert(
					"Thông báo",
					"Đơn hàng này đã được đánh giá rồi. Mỗi đơn hàng chỉ có thể đánh giá một lần."
				);
			} else {
				Alert.alert(
					"Lỗi",
					error?.data?.message ||
						"Không thể gửi đánh giá. Vui lòng thử lại!"
				);
			}
		}
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
							{orderData?.orderItems?.[0]?.images?.[0] ? (
								<Image
									source={{
										uri: orderData.orderItems[0].images[0],
									}}
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
								{orderData?.orderItems?.[0]?.productName ||
									"Tên sản phẩm"}
							</Text>
							<Text style={styles.sellerName}>
								Người bán:{" "}
								{orderData?.ecommercePlatform || "N/A"}
							</Text>
							<Text style={styles.productPrice}>
								{formatCurrency(orderData?.totalPrice || 0)}
							</Text>
						</View>
					</View>
				</View>

				{/* Rating Section */}
				<View style={styles.reviewCard}>
					<Text style={styles.cardTitle}>Đánh giá đơn hàng</Text>
					<StarRating
						rating={rating}
						setRating={setRating}
						title="Đánh giá tổng thể"
					/>
				</View>

				{/* Reason Tags */}
				<View style={styles.reviewCard}>
					<Text style={styles.cardTitle}>Lý do đánh giá</Text>
					<Text style={styles.tagsSubtitle}>
						Chọn lý do phù hợp với trải nghiệm của bạn:
					</Text>

					<View style={styles.tagsGrid}>
						{reasonTags.map((tag) => (
							<TouchableOpacity
								key={tag.id}
								style={[
									styles.tagButton,
									selectedReasonTags.includes(tag.id) &&
										styles.tagButtonSelected,
								]}
								onPress={() => toggleReasonTag(tag.id)}
							>
								<Text
									style={[
										styles.tagText,
										selectedReasonTags.includes(tag.id) &&
											styles.tagTextSelected,
									]}
								>
									{tag.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Custom Comment Input - Only show when "Khác" is selected */}
				{showCustomInput && (
					<View style={styles.reviewCard}>
						<Text style={styles.cardTitle}>Nhận xét chi tiết</Text>
						<Text style={styles.inputSubtitle}>
							Hãy chia sẻ nhận xét chi tiết của bạn:
						</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Nhập nhận xét của bạn về đơn hàng..."
							value={comment}
							onChangeText={setComment}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>
				)}

				{/* Submit Button */}
				<TouchableOpacity
					style={[
						styles.submitButton,
						isSubmitting && styles.submitButtonDisabled,
					]}
					onPress={handleSubmitReview}
					disabled={isSubmitting}
				>
					<Text style={styles.submitButtonText}>
						{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
					</Text>
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
	tagsSubtitle: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 12,
		lineHeight: 20,
	},
	inputSubtitle: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#e9ecef",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: "#212529",
		backgroundColor: "#ffffff",
		minHeight: 80,
	},
	submitButton: {
		backgroundColor: "#007bff",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginBottom: 16,
	},
	submitButtonDisabled: {
		backgroundColor: "#6c757d",
	},
	submitButtonText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "700",
	},
	// Tags Styles
	tagsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	tagButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#dee2e6",
		backgroundColor: "#f8f9fa",
		marginBottom: 4,
	},
	tagButtonSelected: {
		backgroundColor: "#007bff",
		borderColor: "#007bff",
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
