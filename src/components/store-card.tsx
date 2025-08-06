import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface StoreCardProps {
	storeName: string;
	storeAddress: string;
	phoneNumber?: string;
	email?: string;
	shopLink: string;
	mode?: "manual" | "withLink";
	onEdit?: () => void;
	showEditButton?: boolean;
}

export default function StoreCard({
	storeName,
	storeAddress,
	phoneNumber,
	email,
	shopLink,
	mode = "manual",
	onEdit,
	showEditButton = false,
}: StoreCardProps) {
	// Only show for manual mode
	if (mode !== "manual") {
		return null;
	}

	const handleLinkPress = () => {
		// TODO: Open link in browser
		console.log("Opening link:", shopLink);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Ionicons name="storefront" size={18} color="#1976D2" />
					<Text style={styles.headerTitle}>Thông tin cửa hàng</Text>
				</View>
				{showEditButton && onEdit && (
					<TouchableOpacity
						style={styles.editButton}
						onPress={onEdit}
					>
						<Ionicons
							name="pencil-outline"
							size={16}
							color="#1976D2"
						/>
						<Text style={styles.editButtonText}>Sửa</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Content */}
			<View style={styles.content}>
				{/* Store Name */}
				<View style={styles.infoRow}>
					<Ionicons
						name="storefront-outline"
						size={16}
						color="#666"
					/>
					<Text style={styles.infoValue}>{storeName}</Text>
				</View>

				{/* Store Address */}
				<View style={styles.infoRow}>
					<Ionicons name="location-outline" size={16} color="#666" />
					<Text style={styles.infoValue} numberOfLines={2}>
						{storeAddress}
					</Text>
				</View>

				{/* Phone Number */}
				{phoneNumber && phoneNumber.trim() !== "" && (
					<View style={styles.infoRow}>
						<Ionicons name="call-outline" size={16} color="#666" />
						<Text style={styles.infoValue}>{phoneNumber}</Text>
					</View>
				)}

				{/* Email */}
				{email && email.trim() !== "" && (
					<View style={styles.infoRow}>
						<Ionicons name="mail-outline" size={16} color="#666" />
						<Text style={styles.infoValue}>{email}</Text>
					</View>
				)}

				{/* Shop Link */}
				<View style={styles.infoRow}>
					<Ionicons name="link-outline" size={16} color="#666" />
					<TouchableOpacity
						onPress={handleLinkPress}
						style={styles.linkContainer}
					>
						<Text style={styles.linkText} numberOfLines={2}>
							{shopLink}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 14,
		marginVertical: 4,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E3F2FD",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		gap: 4,
	},
	editButtonText: {
		fontSize: 12,
		color: "#1976D2",
		fontWeight: "500",
	},
	content: {
		gap: 10,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
	},
	infoValue: {
		fontSize: 14,
		color: "#333",
		lineHeight: 18,
		flex: 1,
	},
	linkContainer: {
		flex: 1,
	},
	linkText: {
		fontSize: 14,
		color: "#1976D2",
		textDecorationLine: "underline",
		lineHeight: 18,
		flex: 1,
	},
});
