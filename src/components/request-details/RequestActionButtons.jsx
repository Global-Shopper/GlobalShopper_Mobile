import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../ui/text";

const RequestActionButtons = ({ status, onCancel, onUpdate }) => {
	const normalizedStatus = status?.toLowerCase();

	// Show cancel button for "sent" and "checking" status
	if (normalizedStatus === "sent" || normalizedStatus === "checking") {
		return (
			<View style={styles.actionButtonContainer}>
				<TouchableOpacity
					style={[styles.actionButton, styles.cancelButton]}
					onPress={onCancel}
				>
					<Ionicons name="close-outline" size={18} color="#dc3545" />
					<Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Show both cancel and update buttons for "insufficient" status
	if (normalizedStatus === "insufficient") {
		return (
			<View style={styles.actionButtonContainer}>
				<TouchableOpacity
					style={[styles.actionButton, styles.cancelButton]}
					onPress={onCancel}
				>
					<Ionicons name="close-outline" size={18} color="#dc3545" />
					<Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, styles.updateButton]}
					onPress={onUpdate}
				>
					<Ionicons name="create-outline" size={18} color="#1976D2" />
					<Text style={styles.updateButtonText}>Cập nhật</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// No buttons for other statuses
	return null;
};

const styles = StyleSheet.create({
	actionButtonContainer: {
		flexDirection: "row",
		paddingHorizontal: 18,
		paddingVertical: 16,
		paddingBottom: 30,
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		gap: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	cancelButton: {
		backgroundColor: "#ffebee",
		borderWidth: 1.5,
		borderColor: "#dc3545",
	},
	cancelButtonText: {
		color: "#dc3545",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
	updateButton: {
		backgroundColor: "#e3f2fd",
		borderWidth: 1.5,
		borderColor: "#1976D2",
	},
	updateButtonText: {
		color: "#1976D2",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
});

export default RequestActionButtons;
