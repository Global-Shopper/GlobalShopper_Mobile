import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function FeedbackOrder({ navigation, route }) {
	const { orderData } = route?.params || {};
	const [orderFeedback, setOrderFeedback] = useState(null);

	// Check if feedback exists in orderData directly
	useEffect(() => {
		console.log("FeedbackOrder - orderData:", orderData);

		if (orderData?.feedback) {
			console.log(
				"FeedbackOrder - Found feedback in orderData:",
				orderData.feedback
			);
			setOrderFeedback(orderData.feedback);
		} else {
			console.log("FeedbackOrder - No feedback found in orderData");
			setOrderFeedback(null);
		}
	}, [orderData]);

	const handleBackPress = () => {
		navigation.goBack();
	};

	// Star rating display component
	const StarDisplay = ({ rating, title }) => {
		return (
			<View style={styles.ratingContainer}>
				<Text style={styles.ratingTitle}>{title}</Text>
				<View style={styles.starsContainer}>
					{[1, 2, 3, 4, 5].map((star) => (
						<Ionicons
							key={star}
							name={star <= rating ? "star" : "star-outline"}
							size={20}
							color={star <= rating ? "#FFD700" : "#ddd"}
						/>
					))}
				</View>
				<Text style={styles.ratingText}>{rating}/5 sao</Text>
			</View>
		);
	};

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (!orderFeedback) {
		return (
			<View style={styles.container}>
				<Header
					title="Xem đánh giá"
					showBackButton
					onBackPress={handleBackPress}
					navigation={navigation}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color="#dc3545"
					/>
					<Text style={styles.errorText}>
						Chưa có đánh giá cho đơn hàng này
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header
				title="Xem đánh giá"
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
									"Sản phẩm"}
							</Text>
							<Text style={styles.sellerName}>
								Người bán:{" "}
								{orderData?.ecommercePlatform ||
									"Không xác định"}
							</Text>
							{orderFeedback?.createdAt && (
								<Text style={styles.feedbackDate}>
									Đánh giá ngày:{" "}
									{formatDate(orderFeedback.createdAt)}
								</Text>
							)}
						</View>
					</View>
				</View>

				{/* Feedback Rating */}
				{orderFeedback && (
					<View style={styles.reviewCard}>
						<Text style={styles.cardTitle}>Đánh giá đơn hàng</Text>
						<StarDisplay
							rating={orderFeedback.rating}
							title="Đánh giá tổng thể"
						/>
						{orderFeedback.comment && (
							<View style={styles.reviewTextContainer}>
								<Text style={styles.reviewLabel}>
									Nhận xét:
								</Text>
								<Text style={styles.reviewText}>
									{orderFeedback.comment}
								</Text>
							</View>
						)}
					</View>
				)}
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		marginTop: 16,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	errorText: {
		fontSize: 16,
		color: "#dc3545",
		marginTop: 16,
		textAlign: "center",
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
	feedbackDate: {
		fontSize: 12,
		color: "#28a745",
		fontWeight: "500",
		fontStyle: "italic",
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
		gap: 4,
	},
	ratingText: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	reviewTextContainer: {
		marginTop: 12,
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 12,
	},
	reviewLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "600",
		marginBottom: 8,
	},
	reviewText: {
		fontSize: 14,
		color: "#212529",
		lineHeight: 20,
	},
	tagsContainer: {
		marginTop: 12,
	},
	tagsLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "600",
		marginBottom: 8,
	},
	tagsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	tagChip: {
		backgroundColor: "#e3f2fd",
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "#1976D2",
	},
	tagText: {
		fontSize: 13,
		color: "#1976D2",
		fontWeight: "500",
	},
	mediaSection: {
		marginBottom: 16,
	},
	mediaSectionTitle: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "600",
		marginBottom: 8,
	},
	mediaContainer: {
		flexDirection: "row",
		gap: 12,
	},
	mediaItem: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	videoItem: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
});
