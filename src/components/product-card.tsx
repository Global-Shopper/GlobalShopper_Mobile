import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface ProductCardProps {
	id: string;
	name: string;
	description?: string;
	images?: string[];
	price: string;
	convertedPrice?: string;
	exchangeRate?: number;
	category?: string;
	brand?: string;
	material?: string;
	size?: string;
	color?: string;
	unit?: string; // Unit of product (chiếc, quyển, cái, chai, etc.)
	platform?: string;
	productLink?: string;
	quantity?: number;
	mode?: "manual" | "withLink"; // Add mode to determine display style
	sellerInfo?: {
		name: string;
		phone: string;
		email: string;
		address: string;
		storeLink: string;
	};
}

export default function ProductCard({
	id,
	name,
	description,
	images,
	price,
	convertedPrice,
	exchangeRate,
	category,
	brand,
	material,
	size,
	color,
	unit,
	platform,
	productLink,
	quantity = 1,
	mode = "withLink",
	sellerInfo,
}: ProductCardProps) {
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				{images && images.length > 0 ? (
					<Image
						source={{ uri: images[0] }}
						style={styles.productImage}
					/>
				) : (
					<View style={styles.placeholderImage}>
						<Ionicons name="image-outline" size={24} color="#999" />
					</View>
				)}
			</View>

			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.productName} numberOfLines={2}>
						{name}
					</Text>
				</View>

				{/* Product Description */}
				{description && (
					<Text style={styles.productDescription} numberOfLines={3}>
						{description}
					</Text>
				)}

				{/* Product Details */}
				<View style={styles.details}>
					{mode === "withLink" && platform && (
						<View style={styles.tag}>
							<Ionicons
								name="storefront-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>{platform}</Text>
						</View>
					)}
					{category && (
						<View style={styles.tag}>
							<Ionicons
								name="pricetag-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>{category}</Text>
						</View>
					)}
					{brand && (
						<View style={styles.tag}>
							<Ionicons
								name="diamond-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>{brand}</Text>
						</View>
					)}
					<View style={styles.tag}>
						<Ionicons
							name="layers-outline"
							size={12}
							color="#666"
						/>
						<Text style={styles.tagText}>Số lượng: {quantity}</Text>
					</View>
					{size && (
						<View style={styles.tag}>
							<Ionicons
								name="resize-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>Size: {size}</Text>
						</View>
					)}
					{color && (
						<View style={styles.tag}>
							<Ionicons
								name="color-palette-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>{color}</Text>
						</View>
					)}
					{material && (
						<View style={styles.tag}>
							<Ionicons
								name="library-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>{material}</Text>
						</View>
					)}
					{unit && (
						<View style={styles.tag}>
							<Ionicons
								name="cube-outline"
								size={12}
								color="#666"
							/>
							<Text style={styles.tagText}>Đơn vị: {unit}</Text>
						</View>
					)}
				</View>

				{/* Product Link - Show for both modes */}
				{productLink && (
					<View style={styles.linkSection}>
						<Ionicons
							name="link-outline"
							size={14}
							color="#1976D2"
						/>
						<Text style={styles.linkText} numberOfLines={1}>
							{productLink}
						</Text>
					</View>
				)}

				{/* Price Section - Only show for withLink mode with valid price */}
				{mode === "withLink" &&
					price &&
					price !== "0" &&
					price !== "" &&
					price.trim() !== "" && (
						<View style={styles.priceSection}>
							<View style={styles.priceRow}>
								<Text style={styles.originalPrice}>
									{price}
								</Text>
								{convertedPrice &&
									convertedPrice !== "0" &&
									convertedPrice !== "" &&
									convertedPrice.trim() !== "" && (
										<Text style={styles.convertedPrice}>
											≈ {convertedPrice}
										</Text>
									)}
							</View>
							{exchangeRate && exchangeRate > 0 && (
								<Text style={styles.exchangeRate}>
									Tỷ giá:{" "}
									{exchangeRate.toLocaleString("vi-VN", {
										minimumFractionDigits: 0,
										maximumFractionDigits: 2,
									})}{" "}
									VNĐ
								</Text>
							)}
						</View>
					)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 12,
		marginVertical: 6,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
		flexDirection: "row",
	},
	imageContainer: {
		position: "relative",
		marginRight: 12,
	},
	productImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
	},
	placeholderImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ddd",
		borderStyle: "dashed",
	},
	quantityBadge: {
		position: "absolute",
		top: -6,
		right: -6,
		backgroundColor: "#FF5722",
		borderRadius: 10,
		paddingHorizontal: 6,
		paddingVertical: 2,
		minWidth: 20,
		alignItems: "center",
	},
	quantityText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		justifyContent: "space-between",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	productName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		flex: 1,
		lineHeight: 20,
	},
	productDescription: {
		fontSize: 13,
		color: "#666",
		lineHeight: 18,
		marginBottom: 8,
	},
	details: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		marginBottom: 8,
	},
	tag: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
		gap: 3,
	},
	tagText: {
		fontSize: 11,
		color: "#666",
	},
	priceSection: {
		alignSelf: "flex-start",
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	originalPrice: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1976D2",
	},
	convertedPrice: {
		fontSize: 13,
		fontWeight: "600",
		color: "#D32F2F",
	},
	exchangeRate: {
		fontSize: 11,
		color: "#999",
		fontStyle: "italic",
		marginTop: 2,
	},
	sellerSection: {
		backgroundColor: "#F8F9FA",
		padding: 8,
		borderRadius: 8,
		marginBottom: 8,
		gap: 4,
	},
	sellerRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	sellerText: {
		fontSize: 12,
		color: "#333",
		flex: 1,
	},
	linkSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E3F2FD",
		padding: 6,
		borderRadius: 6,
		marginBottom: 8,
		gap: 6,
	},
	linkText: {
		fontSize: 11,
		color: "#1976D2",
		flex: 1,
		fontStyle: "italic",
	},
});
