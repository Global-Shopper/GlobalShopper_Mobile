import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface OrderProductCardProps {
	orderItem: {
		id: string;
		productName: string;
		images?: string[];
		quantity: number;
		basePrice: number;
		currency?: string;
		variants?: string[];
		description?: string;
	};
	totalPrice: number;
}

export default function OrderProductCard({
	orderItem,
	totalPrice,
}: OrderProductCardProps) {
	// Format currency without decimals
	const formatCurrency = (amount: number, currency = "VND") => {
		if (currency === "VND") {
			return `${Math.round(amount).toLocaleString("vi-VN")} VND`;
		}
		return `${Math.round(amount).toLocaleString("vi-VN")} ${currency}`;
	};

	return (
		<View style={styles.container}>
			<Text style={styles.cardTitle}>Thông tin sản phẩm</Text>

			<View style={styles.productSection}>
				{/* Product Image */}
				<View style={styles.productImageContainer}>
					{orderItem.images && orderItem.images.length > 0 ? (
						<Image
							source={{ uri: orderItem.images[0] }}
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

				{/* Product Info */}
				<View style={styles.productInfo}>
					{/* Product Name */}
					<Text style={styles.productName} numberOfLines={2}>
						{orderItem.productName || "Tên sản phẩm không có"}
					</Text>

					{/* Product Description */}
					{orderItem.description && (
						<Text
							style={styles.productDescription}
							numberOfLines={2}
						>
							{orderItem.description}
						</Text>
					)}

					{/* Product Variants */}
					{orderItem.variants && orderItem.variants.length > 0 && (
						<View style={styles.variantsContainer}>
							{orderItem.variants.map((variant, index) => (
								<View key={index} style={styles.variantBadge}>
									<Text style={styles.variantText}>
										{variant}
									</Text>
								</View>
							))}
						</View>
					)}

					{/* Product Details Row */}
					<View style={styles.productDetails}>
						<Text style={styles.quantityText}>
							Số lượng: x{orderItem.quantity || 1}
						</Text>

						{/* Price display - Only total price */}
						<View style={styles.priceContainer}>
							<Text style={styles.priceText}>
								{formatCurrency(totalPrice)}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
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
		marginBottom: 16,
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
	productDescription: {
		fontSize: 14,
		color: "#6c757d",
		lineHeight: 18,
		marginBottom: 8,
	},
	variantsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 8,
		gap: 6,
	},
	variantBadge: {
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#42A5F5",
	},
	variantText: {
		fontSize: 11,
		color: "#1976d2",
		fontWeight: "500",
	},
	productDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
	},
	quantityText: {
		fontSize: 14,
		color: "#6c757d",
		fontWeight: "500",
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	priceText: {
		fontSize: 18,
		color: "#dc3545",
		fontWeight: "700",
	},
});
