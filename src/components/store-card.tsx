import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
	const [isExpanded, setIsExpanded] = useState(false);

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
			{/* Expandable Header */}
			<TouchableOpacity
				style={styles.header}
				onPress={() => setIsExpanded(!isExpanded)}
			>
				<View style={styles.headerLeft}>
					<Ionicons name="storefront" size={20} color="#1976D2" />
					<Text style={styles.headerTitle}>Thông tin cửa hàng</Text>
				</View>
				<View style={styles.headerRight}>
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
					<Ionicons
						name={
							isExpanded
								? "chevron-up-outline"
								: "chevron-down-outline"
						}
						size={22}
						color="#1976D2"
					/>
				</View>
			</TouchableOpacity>

			{/* Expandable Content */}
			{isExpanded && (
				<View style={styles.content}>
					{/* Store Name */}
					<View style={styles.infoRow}>
						<Ionicons
							name="storefront-outline"
							size={16}
							color="#666"
						/>
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Tên cửa hàng:</Text>
							<Text style={styles.infoValue}>{storeName}</Text>
						</View>
					</View>

					{/* Store Address */}
					<View style={styles.infoRow}>
						<Ionicons
							name="location-outline"
							size={16}
							color="#666"
						/>
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Địa chỉ:</Text>
							<Text style={styles.infoValue} numberOfLines={3}>
								{storeAddress}
							</Text>
						</View>
					</View>

					{/* Phone Number */}
					{phoneNumber && phoneNumber.trim() !== "" && (
						<View style={styles.infoRow}>
							<Ionicons
								name="call-outline"
								size={16}
								color="#666"
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>
									Điện thoại:
								</Text>
								<Text style={styles.infoValue}>
									{phoneNumber}
								</Text>
							</View>
						</View>
					)}

					{/* Email */}
					{email && email.trim() !== "" && (
						<View style={styles.infoRow}>
							<Ionicons
								name="mail-outline"
								size={16}
								color="#666"
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Email:</Text>
								<Text style={styles.infoValue}>{email}</Text>
							</View>
						</View>
					)}

					{/* Shop Link */}
					<View style={styles.infoRow}>
						<Ionicons name="link-outline" size={16} color="#666" />
						<View style={styles.infoContent}>
							<Text style={styles.infoLabel}>Link cửa hàng:</Text>
							<TouchableOpacity onPress={handleLinkPress}>
								<Text style={styles.linkText} numberOfLines={2}>
									{shopLink}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginVertical: 8,
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
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginBottom: 0,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
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
		gap: 12,
		paddingTop: 12,
		paddingHorizontal: 12,
		paddingBottom: 4,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
	},
	infoContent: {
		flex: 1,
		gap: 2,
	},
	infoLabel: {
		fontSize: 12,
		color: "#666",
		fontWeight: "500",
	},
	infoValue: {
		fontSize: 14,
		color: "#333",
		lineHeight: 18,
	},
	linkText: {
		fontSize: 14,
		color: "#1976D2",
		textDecorationLine: "underline",
		lineHeight: 18,
	},
});
