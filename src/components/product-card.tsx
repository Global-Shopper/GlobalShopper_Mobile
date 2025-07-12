import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface ProductCardProps {
	id: string;
	name: string;
	price: string;
	convertedPrice?: string;
	image?: string;
	quantity?: number;
	platform?: string;
	category?: string;
	status?: string;
}

export default function ProductCard({
	id,
	name,
	price,
	convertedPrice,
	image,
	quantity = 1,
	platform,
	category,
	status,
}: ProductCardProps) {
	const getStatusColor = (status?: string) => {
		switch (status) {
			case "confirmed":
				return "#4CAF50";
			case "pending":
				return "#FF9800";
			case "cancelled":
				return "#F44336";
			default:
				return "#666";
		}
	};

	const getStatusText = (status?: string) => {
		switch (status) {
			case "confirmed":
				return "Đã xác nhận";
			case "pending":
				return "Chờ xử lý";
			case "cancelled":
				return "Đã hủy";
			default:
				return "Mới";
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				{image ? (
					<Image
						source={{ uri: image }}
						style={styles.productImage}
					/>
				) : (
					<View style={styles.placeholderImage}>
						<Ionicons name="image-outline" size={24} color="#999" />
					</View>
				)}
				{quantity > 1 && (
					<View style={styles.quantityBadge}>
						<Text style={styles.quantityText}>x{quantity}</Text>
					</View>
				)}
			</View>

			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.productName} numberOfLines={2}>
						{name}
					</Text>
					{status && (
						<View
							style={[
								styles.statusBadge,
								{
									backgroundColor:
										getStatusColor(status) + "20",
								},
							]}
						>
							<Text
								style={[
									styles.statusText,
									{ color: getStatusColor(status) },
								]}
							>
								{getStatusText(status)}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.details}>
					{platform && (
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
				</View>

				<View style={styles.priceSection}>
					<View style={styles.priceRow}>
						<Text style={styles.originalPrice}>{price}</Text>
						{convertedPrice && (
							<Text style={styles.convertedPrice}>
								≈ {convertedPrice} VNĐ
							</Text>
						)}
					</View>
				</View>
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
		marginRight: 8,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: "flex-start",
	},
	statusText: {
		fontSize: 11,
		fontWeight: "600",
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
});
