import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Text } from "./ui/text";

const { width: screenWidth } = Dimensions.get("window");

interface DialogProps {
	visible: boolean;
	onClose: () => void;
	title: string;
	message: string;
	primaryButton?: {
		text: string;
		onPress: () => void;
		style?: "primary" | "danger" | "success";
	};
	secondaryButton?: {
		text: string;
		onPress: () => void;
		style?: "outline" | "text";
	};
	showCloseButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
	visible,
	onClose,
	title,
	message,
	primaryButton,
	secondaryButton,
	showCloseButton = true,
}) => {
	const getPrimaryButtonStyle = () => {
		const style = primaryButton?.style || "primary";
		switch (style) {
			case "primary":
				return styles.primaryButton;
			case "danger":
				return styles.dangerButton;
			case "success":
				return styles.successButton;
			default:
				return styles.primaryButton;
		}
	};

	const getPrimaryButtonTextStyle = () => {
		return styles.primaryButtonText;
	};

	const getSecondaryButtonStyle = () => {
		const style = secondaryButton?.style || "outline";
		switch (style) {
			case "outline":
				return styles.secondaryButton;
			case "text":
				return styles.textButton;
			default:
				return styles.secondaryButton;
		}
	};

	const getSecondaryButtonTextStyle = () => {
		const style = secondaryButton?.style || "outline";
		switch (style) {
			case "outline":
				return styles.secondaryButtonText;
			case "text":
				return styles.textButtonText;
			default:
				return styles.secondaryButtonText;
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			statusBarTranslucent
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.overlayBackground} />
				</TouchableWithoutFeedback>

				<View style={styles.dialogContainer}>
					{/* Close Button */}
					{showCloseButton && (
						<TouchableOpacity
							style={styles.closeButton}
							onPress={onClose}
							hitSlop={{
								top: 10,
								bottom: 10,
								left: 10,
								right: 10,
							}}
						>
							<Ionicons name="close" size={20} color="#64748b" />
						</TouchableOpacity>
					)}

					{/* Title */}
					<Text style={styles.title}>{title}</Text>

					{/* Message */}
					<Text style={styles.message}>{message}</Text>

					{/* Buttons */}
					<View style={styles.buttonContainer}>
						{secondaryButton && (
							<TouchableOpacity
								style={[
									styles.button,
									getSecondaryButtonStyle(),
								]}
								onPress={() => {
									secondaryButton.onPress();
									onClose(); // Tự động đóng dialog
								}}
								activeOpacity={0.8}
							>
								<Text style={getSecondaryButtonTextStyle()}>
									{secondaryButton.text}
								</Text>
							</TouchableOpacity>
						)}

						{primaryButton && (
							<TouchableOpacity
								style={[styles.button, getPrimaryButtonStyle()]}
								onPress={() => {
									primaryButton.onPress();
									onClose(); // Tự động đóng dialog
								}}
								activeOpacity={0.8}
							>
								<Text style={getPrimaryButtonTextStyle()}>
									{primaryButton.text}
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	overlayBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	dialogContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		width: "100%",
		maxWidth: screenWidth - 64,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 10,
		position: "relative",
	},
	closeButton: {
		position: "absolute",
		top: 12,
		right: 12,
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#f1f5f9",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		textAlign: "center",
		marginBottom: 10,
		marginTop: 6,
		lineHeight: 24,
	},
	message: {
		fontSize: 14,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 20,
		fontWeight: "500",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 18,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 48,
	},
	primaryButton: {
		backgroundColor: "#42A5F5",
		shadowColor: "#42A5F5",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	dangerButton: {
		backgroundColor: "#EF4444",
		shadowColor: "#EF4444",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	successButton: {
		backgroundColor: "#10B981",
		shadowColor: "#10B981",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	secondaryButton: {
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "#e2e8f0",
	},
	textButton: {
		backgroundColor: "transparent",
	},
	primaryButtonText: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
	secondaryButtonText: {
		color: "#64748b",
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 0.3,
	},
	textButtonText: {
		color: "#42A5F5",
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 0.3,
	},
});

export default Dialog;
