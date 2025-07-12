import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface AddressSmCardProps {
	recipientName: string;
	phone: string;
	address: string;
	isDefault?: boolean;
	onEdit?: () => void;
}

export default function AddressSmCard({
	recipientName,
	phone,
	address,
	isDefault = false,
	onEdit,
}: AddressSmCardProps) {
	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					{isDefault && (
						<View style={styles.defaultBadge}>
							<Text style={styles.defaultText}>Mặc định</Text>
						</View>
					)}
				</View>
				{onEdit && (
					<TouchableOpacity
						onPress={onEdit}
						style={styles.editButton}
					>
						<Ionicons
							name="chevron-forward"
							size={16}
							color="#666"
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Content */}
			<View style={styles.content}>
				{/* Name and Phone on same row */}
				<View style={styles.namePhoneRow}>
					<Ionicons name="location" size={16} color="#1976D2" />
					<Text style={styles.recipientName}>{recipientName}</Text>
					<Text style={styles.separator}>|</Text>
					<Text style={styles.phone}>{phone}</Text>
				</View>

				{/* Address */}
				<Text style={styles.address}>{address}</Text>
			</View>
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
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
		minHeight: 20,
	},
	headerLeft: {
		flex: 1,
	},
	defaultBadge: {
		backgroundColor: "#E3F2FD",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
		alignSelf: "flex-start",
	},
	defaultText: {
		fontSize: 10,
		color: "#1976D2",
		fontWeight: "500",
	},
	editButton: {
		padding: 4,
	},
	content: {
		gap: 8,
	},
	namePhoneRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	recipientName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	separator: {
		fontSize: 14,
		color: "#999",
		fontWeight: "300",
	},
	phone: {
		fontSize: 14,
		color: "#666",
	},
	address: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		marginLeft: 24,
	},
});
