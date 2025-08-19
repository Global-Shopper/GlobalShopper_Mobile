import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useDialog } from "../../components/dialogHelpers";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useDepositWalletMutation } from "../../services/gshopApi";

export default function TopUpScreen({ navigation }) {
	console.log(Linking.createURL("/"));
	const [deposit] = useDepositWalletMutation();
	const { showDialog, Dialog } = useDialog();
	const [selectedAmount, setSelectedAmount] = useState(null);
	const [customAmount, setCustomAmount] = useState("");
	const [selectedMethod, setSelectedMethod] = useState(null);

	const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

	const paymentMethods = [
		{
			id: "vnpay",
			name: "VNPay",
			icon: require("../../assets/images/payment/vnpay-logo.png"),
			description: "Xử lý ngay lập tức",
		},
	];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleAmountSelect = (amount) => {
		setSelectedAmount(amount);
		setCustomAmount("");
	};

	const handleCustomAmountChange = (text) => {
		// Remove non-numeric characters except for digits
		const numericText = text.replace(/[^0-9]/g, "");
		setCustomAmount(numericText);
		setSelectedAmount(null);
	};

	const handleMethodSelect = (methodId) => {
		setSelectedMethod(methodId);
	};

	const handleTopUp = () => {
		const amount = selectedAmount || parseInt(customAmount);
		if (!amount || amount < 10000) {
			showDialog({
				title: "Lỗi",
				message: "Số tiền nạp tối thiểu là 10.000 VND",
			});
			return;
		}

		if (amount > 50000000) {
			showDialog({
				title: "Lỗi",
				message: "Số tiền nạp tối đa là 50.000.000 VND trong 1 lần",
			});
			return;
		}

		if (!selectedMethod) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng chọn phương thức thanh toán",
			});
			return;
		}

		showDialog({
			title: "Xác nhận nạp tiền",
			message: `Bạn có muốn nạp ${formatCurrency(amount)} vào ví?`,
			primaryButton: {
				text: "Xác nhận",
				style: "primary",
				onPress: () => {
					deposit({
						balance: selectedAmount || customAmount,
						redirectUri: `${Linking.createURL("/")}wallet`,
					})
						.unwrap()
						.then((res) => {
							console.log(res);
							navigation.navigate("VNPayGateWay", {
								url: res.url,
							});
						})
						.catch((error) => {
							console.log(error);
						});
				},
			},
			secondaryButton: {
				text: "Hủy",
				style: "outline",
				onPress: () => {},
			},
		});
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Nạp tiền"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Amount Selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Chọn số tiền</Text>
					<View style={styles.amountGrid}>
						{quickAmounts.map((amount) => (
							<TouchableOpacity
								key={amount}
								style={[
									styles.amountButton,
									selectedAmount === amount &&
										styles.selectedAmount,
								]}
								onPress={() => handleAmountSelect(amount)}
							>
								<Text
									style={[
										styles.amountText,
										selectedAmount === amount &&
											styles.selectedAmountText,
									]}
								>
									{formatCurrency(amount)}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Custom Amount Input */}
					<View style={styles.customAmountContainer}>
						<Text style={styles.customAmountLabel}>
							Hoặc nhập số tiền khác:
						</Text>
						<TextInput
							style={[
								styles.customAmountInput,
								customAmount && styles.activeInput,
							]}
							placeholder="Nhập số tiền (VND)"
							value={customAmount}
							onChangeText={handleCustomAmountChange}
							keyboardType="numeric"
							maxLength={10}
						/>
						{customAmount && (
							<Text style={styles.formattedAmount}>
								{formatCurrency(parseInt(customAmount) || 0)}
							</Text>
						)}
					</View>

					{/* Limit Note */}
					<View style={styles.limitNoteContainer}>
						<Ionicons
							name="information-circle-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.limitNoteText}>
							Tối thiểu 10.000 VND - Tối đa 50.000.000 VND/lần
						</Text>
					</View>
				</View>

				{/* Payment Methods */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Phương thức thanh toán
					</Text>
					{paymentMethods.map((method) => (
						<TouchableOpacity
							key={method.id}
							style={[
								styles.methodCard,
								selectedMethod === method.id &&
									styles.selectedMethod,
							]}
							onPress={() => handleMethodSelect(method.id)}
						>
							<View style={styles.methodLeft}>
								<View
									style={[
										styles.methodIcon,
										selectedMethod === method.id &&
											styles.selectedMethodIcon,
									]}
								>
									<Image
										source={method.icon}
										style={styles.paymentLogo}
										resizeMode="contain"
									/>
								</View>
								<View style={styles.methodInfo}>
									<Text style={styles.methodName}>
										{method.name}
									</Text>
									<Text style={styles.methodDescription}>
										{method.description}
									</Text>
								</View>
							</View>
							<View style={styles.methodRight}>
								<Ionicons
									name={
										selectedMethod === method.id
											? "radio-button-on"
											: "radio-button-off"
									}
									size={24}
									color={
										selectedMethod === method.id
											? "#42A5F5"
											: "#CCC"
									}
								/>
							</View>
						</TouchableOpacity>
					))}
				</View>

				{/* Summary */}
				<View style={styles.section}>
					<View style={styles.summaryCard}>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>
								Số tiền nạp:
							</Text>
							<Text style={styles.summaryValue}>
								{selectedAmount
									? formatCurrency(selectedAmount)
									: customAmount
									? formatCurrency(
											parseInt(customAmount) || 0
									  )
									: "0 VND"}
							</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>
								Phí giao dịch:
							</Text>
							<Text style={styles.summaryValue}>Miễn phí</Text>
						</View>
						<View style={[styles.summaryRow, styles.totalRow]}>
							<Text style={styles.totalLabel}>Tổng cộng:</Text>
							<Text style={styles.totalValue}>
								{selectedAmount
									? formatCurrency(selectedAmount)
									: customAmount
									? formatCurrency(
											parseInt(customAmount) || 0
									  )
									: "0 VND"}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* Bottom Button */}
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.topUpButton,
						(!selectedAmount && !customAmount) || !selectedMethod
							? styles.disabledButton
							: null,
					]}
					onPress={handleTopUp}
					disabled={
						(!selectedAmount && !customAmount) || !selectedMethod
					}
				>
					<LinearGradient
						colors={
							(!selectedAmount && !customAmount) ||
							!selectedMethod
								? ["#CCC", "#999"]
								: ["#42A5F5", "#1976D2"]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.buttonGradient}
					>
						<Text style={styles.buttonText}>Nạp tiền</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
			<Dialog />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {
		paddingTop: 20,
		paddingBottom: 100,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 16,
	},
	amountGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	amountButton: {
		width: "31%",
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 12,
		alignItems: "center",
	},
	selectedAmount: {
		borderColor: "#42A5F5",
		backgroundColor: "#E3F2FD",
	},
	amountText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
	},
	selectedAmountText: {
		color: "#42A5F5",
		fontWeight: "600",
	},
	customAmountContainer: {
		marginTop: 16,
	},
	customAmountLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: "#333",
		marginBottom: 8,
	},
	customAmountInput: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		paddingVertical: 16,
		paddingHorizontal: 16,
		fontSize: 16,
		color: "#333",
	},
	activeInput: {
		borderColor: "#42A5F5",
		backgroundColor: "#E3F2FD",
	},
	formattedAmount: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: "600",
		color: "#42A5F5",
		textAlign: "center",
	},
	methodCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	selectedMethod: {
		borderColor: "#42A5F5",
		backgroundColor: "#E3F2FD",
	},
	methodLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	methodIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	selectedMethodIcon: {
		backgroundColor: "#E3F2FD",
		borderColor: "#42A5F5",
	},
	paymentLogo: {
		width: 32,
		height: 32,
	},
	methodInfo: {
		flex: 1,
	},
	methodName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	methodDescription: {
		fontSize: 14,
		color: "#666",
	},
	methodRight: {
		marginLeft: 12,
	},
	summaryCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
		marginTop: 8,
		paddingTop: 16,
	},
	summaryLabel: {
		fontSize: 16,
		color: "#666",
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "500",
		color: "#333",
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#42A5F5",
	},
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
	},
	topUpButton: {
		borderRadius: 12,
		overflow: "hidden",
	},
	disabledButton: {
		opacity: 0.6,
	},
	buttonGradient: {
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	limitNoteContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
		borderLeftWidth: 3,
		borderLeftColor: "#42A5F5",
	},
	limitNoteText: {
		fontSize: 14,
		color: "#6c757d",
		marginLeft: 8,
		flex: 1,
	},
});
