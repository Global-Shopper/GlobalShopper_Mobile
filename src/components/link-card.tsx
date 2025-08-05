import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface LinkCardProps {
	index: number;
	onRemove: () => void;
	onLinkChange: (link: string) => void;
	canRemove: boolean;
	link: string;
	status: "idle" | "validating" | "ai-processing" | "success" | "error";
	data?: any;
	error?: string | null;
}

export default function LinkCard({
	index,
	onRemove,
	onLinkChange,
	canRemove,
	link,
	status,
	data,
	error,
}: LinkCardProps) {
	const getInputIcon = () => {
		switch (status) {
			case "validating":
				return {
					name: "hourglass-outline" as const,
					color: "#FF9800",
				};
			case "ai-processing":
				return {
					name: "flash-outline" as const,
					color: "#9C27B0",
				};
			case "success":
				return {
					name: "checkmark-circle" as const,
					color: "#4CAF50",
				};
			case "error":
				return {
					name: "close-circle" as const,
					color: "#dc3545",
				};
			default:
				return {
					name: "link-outline" as const,
					color: "#42A5F5",
				};
		}
	};

	const getInputStyle = () => {
		switch (status) {
			case "success":
				return [styles.inputContainer, styles.successInput];
			case "error":
				return [styles.inputContainer, styles.errorInput];
			case "validating":
				return [styles.inputContainer, styles.validatingInput];
			default:
				return styles.inputContainer;
		}
	};

	const inputIcon = getInputIcon();

	return (
		<View style={styles.linkCard}>
			<View style={styles.cardHeader}>
				<View style={styles.cardTitleContainer}>
					<View style={styles.numberBadge}>
						<Text style={styles.numberText}>{index + 1}</Text>
					</View>
					<Text style={styles.cardTitle}>Sản phẩm {index + 1}</Text>
				</View>
				{canRemove && (
					<TouchableOpacity
						style={styles.removeButton}
						onPress={onRemove}
					>
						<Ionicons
							name="trash-outline"
							size={22}
							color="#dc3545"
						/>
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.inputSection}>
				<View style={getInputStyle()}>
					<Ionicons
						name={inputIcon.name}
						size={20}
						color={inputIcon.color}
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.textInput}
						placeholder="Dán link sản phẩm tại đây..."
						placeholderTextColor="#9E9E9E"
						value={link}
						onChangeText={onLinkChange}
						multiline
						numberOfLines={2}
						autoCapitalize="none"
						keyboardType="url"
						editable={status !== "validating"}
					/>
					{status === "validating" && (
						<View style={styles.validatingIcon}>
							<Ionicons
								name="refresh"
								size={16}
								color="#FF9800"
							/>
						</View>
					)}
				</View>

				{/* Status Messages */}
				{status === "success" && data && (
					<View style={styles.successContainer}>
						<Ionicons
							name="checkmark-circle"
							size={16}
							color="#4CAF50"
						/>
						<Text style={styles.successText}>
							Đã lấy được dữ liệu sản phẩm:{" "}
							{data.name || data.title || "Sản phẩm hợp lệ"}
						</Text>
					</View>
				)}

				{status === "error" && error && (
					<View style={styles.errorContainer}>
						<Ionicons name="warning" size={14} color="#dc3545" />
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}

				{status === "validating" && (
					<View style={styles.validatingContainer}>
						<Ionicons
							name="hourglass-outline"
							size={14}
							color="#FF9800"
						/>
						<Text style={styles.validatingText}>
							Đang kiểm tra link...
						</Text>
					</View>
				)}

				{status === "ai-processing" && (
					<View style={styles.aiProcessingContainer}>
						<Ionicons
							name="flash-outline"
							size={14}
							color="#9C27B0"
						/>
						<Text style={styles.aiProcessingText}>
							AI đang lấy thông tin sản phẩm...
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	linkCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 18,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E8F2FF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 14,
	},
	cardTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	numberBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#42A5F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	numberText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	removeButton: {
		padding: 4,
	},
	inputSection: {
		marginBottom: 0,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFE",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E7FF",
		paddingVertical: 12,
		paddingHorizontal: 14,
		minHeight: 48,
	},
	inputIcon: {
		marginRight: 10,
	},
	textInput: {
		flex: 1,
		fontSize: 15,
		color: "#333",
		textAlignVertical: "top",
		minHeight: 24,
		paddingVertical: 0,
	},
	validIcon: {
		marginLeft: 8,
	},
	validatingIcon: {
		marginLeft: 8,
	},
	successInput: {
		borderColor: "#4CAF50",
		backgroundColor: "#F1F8E9",
	},
	validatingInput: {
		borderColor: "#FF9800",
		backgroundColor: "#FFF8E1",
	},
	errorInput: {
		borderColor: "#dc3545",
		backgroundColor: "#FFF5F5",
	},
	successContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6,
		marginLeft: 2,
		backgroundColor: "#E8F5E8",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	successText: {
		fontSize: 12,
		color: "#2E7D32",
		marginLeft: 6,
		flex: 1,
		fontWeight: "500",
	},
	validatingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6,
		marginLeft: 2,
		backgroundColor: "#FFF3E0",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	validatingText: {
		fontSize: 12,
		color: "#F57C00",
		marginLeft: 6,
		flex: 1,
		fontWeight: "500",
	},
	aiProcessingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6,
		marginLeft: 2,
		backgroundColor: "#F3E5F5",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	aiProcessingText: {
		fontSize: 12,
		color: "#7B1FA2",
		marginLeft: 6,
		flex: 1,
		fontWeight: "500",
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6,
		marginLeft: 2,
		backgroundColor: "#FFEBEE",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	errorText: {
		fontSize: 12,
		color: "#dc3545",
		marginLeft: 6,
		flex: 1,
		fontWeight: "500",
	},
});
