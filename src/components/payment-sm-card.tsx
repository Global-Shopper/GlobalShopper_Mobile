import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface PaymentSmCardProps {
	paymentMethod: "wallet" | "payos" | "vnpay";
	isSelected?: boolean;
	onPress?: () => void;
	balance?: string;
}

const PaymentSmCard: React.FC<PaymentSmCardProps> = ({
	paymentMethod,
	isSelected = false,
	onPress,
	balance,
}) => {
	const getPaymentInfo = () => {
		switch (paymentMethod) {
			case "wallet":
				return {
					name: "Ví GShop",
					type: "image",
					logo: require("../assets/images/logo/logo-gshop-removebg.png"),
				};
			case "vnpay":
				return {
					name: "VNPay",
					type: "image",
					logo: require("../assets/images/payment/vnpay-logo.png"),
				};
			default:
				return {
					name: "Ví GShop",
					type: "icon",
					icon: "wallet-outline",
					iconColor: "#4CAF50",
				};
		}
	};

	const paymentInfo = getPaymentInfo();

	return (
		<TouchableOpacity
			style={[styles.container, isSelected && styles.selectedContainer]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View style={styles.content}>
				{paymentInfo.type === "icon" ? (
					<View style={styles.iconContainer}>
						<Ionicons
							name={paymentInfo.icon as any}
							size={20}
							color={paymentInfo.iconColor}
						/>
					</View>
				) : (
					<Image
						source={paymentInfo.logo}
						style={styles.logo}
						resizeMode="contain"
					/>
				)}
				<View style={styles.textContainer}>
					<Text
						style={[
							styles.paymentName,
							isSelected && styles.selectedText,
						]}
					>
						{paymentInfo.name}
					</Text>
					{paymentMethod === "wallet" && balance && (
						<Text style={styles.balanceText}>{balance}</Text>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 12,
		marginHorizontal: 6,
		marginVertical: 4,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: 65,
		width: 160, // Smaller width for compact design
	},
	selectedContainer: {
		borderColor: "#1976D2",
		borderWidth: 2,
		backgroundColor: "#F3F8FF",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	logo: {
		width: 32,
		height: 32,
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	paymentName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	balanceText: {
		fontSize: 11,
		color: "#4CAF50",
		fontWeight: "500",
		marginTop: 1,
	},
	selectedText: {
		color: "#1976D2",
	},
	radioButton: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: "#D0D5DD",
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
	},
	radioButtonSelected: {
		borderColor: "#1976D2",
		backgroundColor: "#1976D2",
	},
	radioButtonInner: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#ffffff",
	},
});

export default PaymentSmCard;
