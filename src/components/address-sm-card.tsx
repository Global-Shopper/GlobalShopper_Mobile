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
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<Ionicons name="location" size={18} color="#1976D2" />
					<Text style={styles.title}>Địa chỉ giao hàng</Text>
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
						<Ionicons name="pencil" size={16} color="#666" />
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.content}>
				<View style={styles.row}>
					<Ionicons name="person" size={14} color="#666" />
					<Text style={styles.recipientName}>{recipientName}</Text>
				</View>

				<View style={styles.row}>
					<Ionicons name="call" size={14} color="#666" />
					<Text style={styles.phone}>{phone}</Text>
				</View>

				<View style={styles.row}>
					<Ionicons name="home" size={14} color="#666" />
					<Text style={styles.address}>{address}</Text>
				</View>
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
		marginBottom: 12,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginLeft: 6,
	},
	defaultBadge: {
		backgroundColor: "#E3F2FD",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
		marginLeft: 8,
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
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	recipientName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		flex: 1,
	},
	phone: {
		fontSize: 14,
		color: "#666",
		flex: 1,
	},
	address: {
		fontSize: 14,
		color: "#666",
		flex: 1,
		lineHeight: 20,
	},
});
