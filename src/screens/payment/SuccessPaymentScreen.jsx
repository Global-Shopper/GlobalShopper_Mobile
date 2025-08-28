import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { useLazyCheckPaymentQuery } from "../../services/gshopApi";
import { getShortId } from "../../utils/statusHandler";

const SuccessPaymentScreen = ({ navigation, route }) => {
	const params = useMemo(() => route.params || {}, [route.params]);
	const [checkPayment] = useLazyCheckPaymentQuery();
	const [isConfirming, setIsConfirming] = useState(false);
	const [apiServerConfirmed, setApiServerConfirmed] = useState(null);
	const [apiConfirmError, setApiConfirmError] = useState(null);

	// Get user email from Redux store
	const userEmail = useSelector(
		(state) => state.rootReducer?.user?.email || ""
	);

	// Check if this is from VNPay URL redirect (contains vnp_* parameters)
	const isVNPayUrlRedirect = params.vnp_ResponseCode !== undefined;

	let paymentMethod,
		amount,
		requestId,
		subRequestId,
		transactionId,
		bankCode,
		cardType,
		payDate,
		error,
		vnpayData,
		serverConfirmed,
		confirmError;

	if (isVNPayUrlRedirect) {
		console.log(
			"SuccessPaymentScreen - Detected VNPay URL redirect with params:",
			Object.keys(params)
		);

		// Extract data from VNPay URL parameters
		paymentMethod = "vnpay";

		// Format amount from VNPay (comes in cents)
		if (params.vnp_Amount) {
			const amountInVND = parseInt(params.vnp_Amount) / 100;
			amount = `${Math.round(amountInVND).toLocaleString("vi-VN")} VNĐ`;
		} else {
			amount = "Chưa xác định";
		}

		requestId = params.vnp_TxnRef;
		transactionId = params.vnp_TransactionNo;
		bankCode = params.vnp_BankCode;
		cardType = params.vnp_CardType;
		payDate = params.vnp_PayDate;
		vnpayData = params;
		serverConfirmed = apiServerConfirmed;
		confirmError = apiConfirmError;
		error = params.vnp_ResponseCode !== "00";
	} else {
		console.log(
			"SuccessPaymentScreen - Normal navigation with params:",
			Object.keys(params)
		);
		({
			paymentMethod,
			amount,
			requestId,
			subRequestId,
			transactionId,
			bankCode,
			cardType,
			payDate,
			error,
			vnpayData,
			serverConfirmed,
			confirmError,
		} = params);
	}

	// Effect to call API for VNPay URL redirects
	useEffect(() => {
		if (
			isVNPayUrlRedirect &&
			!error &&
			!isConfirming &&
			apiServerConfirmed === null
		) {
			if (!userEmail) {
				console.warn("User email not available for VNPay confirmation");
				setApiServerConfirmed(false);
				setApiConfirmError(
					"Không thể xác nhận thanh toán - thiếu thông tin email"
				);
				return;
			}

			const confirmPaymentWithServer = async () => {
				setIsConfirming(true);
				try {
					const checkPaymentParams = {
						email: userEmail,
						vnp_ResponseCode: params.vnp_ResponseCode,
						vnp_Amount: params.vnp_Amount,
						vnp_TxnRef: params.vnp_TxnRef,
					};

					const checkResult = await checkPayment(
						checkPaymentParams
					).unwrap();

					setApiServerConfirmed(true);
				} catch (confirmError) {
					console.error("❌ Error details:", {
						message: confirmError?.message,
						data: confirmError?.data,
						status: confirmError?.status,
						stack: confirmError?.stack,
					});
					setApiServerConfirmed(false);
					setApiConfirmError(
						confirmError?.data?.message || "Lỗi xác nhận với server"
					);
				}
				setIsConfirming(false);
			};

			confirmPaymentWithServer();
		}
	}, [
		isVNPayUrlRedirect,
		error,
		isConfirming,
		apiServerConfirmed,
		params,
		checkPayment,
		userEmail,
	]);

	// Debug logging to check what values are being passed
	console.log("SuccessPaymentScreen - Route params debug:", {
		paymentMethod: paymentMethod || "undefined",
		amount: amount || "undefined",
		requestId: requestId || "undefined",
		transactionId: transactionId || "undefined",
		bankCode: bankCode || "undefined",
		error: error || false,
		allParams: route.params ? Object.keys(route.params) : "no params",
	});

	const getPaymentMethodDisplay = (method) => {
		console.log("Getting payment method display for:", method);
		switch (method) {
			case "wallet":
				return "Ví GShop";
			case "vnpay":
			case "VNPay":
			case "VNPAY":
				return "VNPay";
			default:
				return method || "VNPay";
		}
	};

	const handleBackToHome = () => {
		navigation.navigate("Tabs", { screen: "Home" });
	};

	const handleViewOrders = () => {
		navigation.navigate("Tabs", { screen: "Order" });
	};

	return (
		<View style={styles.container}>
			{/* Header Section */}
			<View style={styles.header}>
				<LinearGradient
					colors={["#007BFF", "#0056b3"]}
					style={styles.headerGradient}
				>
					{/* Decorative Elements */}
					<View style={styles.decorativeCircle1} />
					<View style={styles.decorativeCircle2} />

					{/* Success Icon */}
					<View style={styles.successContainer}>
						<View style={styles.successIconWrapper}>
							<Ionicons
								name="checkmark-circle"
								size={80}
								color="#FFFFFF"
							/>
						</View>
					</View>

					{/* Success Message */}
					<Text style={styles.successTitle}>
						Thanh toán thành công!
					</Text>
					<Text style={styles.successSubtitle}>
						{isVNPayUrlRedirect
							? "Giao dịch VNPay đã hoàn tất"
							: "Đơn hàng đã được tạo và tiền đã được trừ khỏi ví"}
					</Text>

					{/* Show confirmation status for VNPay URL redirects */}
					{isVNPayUrlRedirect && (
						<View style={styles.confirmationStatus}>
							{isConfirming ? (
								<View style={styles.loadingContainer}>
									<ActivityIndicator
										size="small"
										color="#FFFFFF"
									/>
									<Text style={styles.loadingText}>
										Đang xác nhận với server...
									</Text>
								</View>
							) : apiServerConfirmed === true ? (
								<View style={styles.statusContainer}>
									<Ionicons
										name="checkmark-circle"
										size={20}
										color="#28a745"
									/>
									<Text style={styles.confirmSuccess}>
										Đã xác nhận với server
									</Text>
								</View>
							) : apiServerConfirmed === false ? (
								<View style={styles.statusContainer}>
									<Ionicons
										name="alert-circle"
										size={20}
										color="#dc3545"
									/>
									<Text style={styles.confirmError}>
										Chưa xác nhận với server
									</Text>
								</View>
							) : null}
						</View>
					)}
				</LinearGradient>
			</View>

			{/* Content Section */}
			<View style={styles.content}>
				{/* Payment Amount */}
				<View style={styles.amountCard}>
					<Text style={styles.amountLabel}>
						Số tiền đã thanh toán
					</Text>
					<Text style={styles.amountText}>
						{(() => {
							console.log("Formatting amount:", amount);
							if (!amount) return "Chưa xác định";

							// For VNPay, amount might already be formatted by VNPayGateWay
							if (
								paymentMethod === "vnpay" &&
								typeof amount === "string"
							) {
								if (
									amount.includes("VNĐ") ||
									amount.includes("thất bại")
								) {
									return amount;
								}
							}

							// If amount already contains VNĐ, just return it
							if (amount.toString().includes("VNĐ")) {
								return amount.toString();
							}

							// Otherwise, parse and format with VNĐ
							const numericAmount = parseFloat(
								amount.toString().replace(/[^\d.-]/g, "")
							);
							return `${Math.round(numericAmount).toLocaleString(
								"vi-VN"
							)} VNĐ`;
						})()}
					</Text>
				</View>

				{/* Payment Details */}
				<View style={styles.detailsCard}>
					<Text style={styles.cardTitle}>Chi tiết giao dịch</Text>

					<View style={styles.detailRow}>
						<View style={styles.detailLeft}>
							<Ionicons
								name="card-outline"
								size={16}
								color="#007BFF"
							/>
							<Text style={styles.detailLabel}>
								Phương thức thanh toán
							</Text>
						</View>
						<Text style={styles.detailValue}>
							{getPaymentMethodDisplay(paymentMethod)}
						</Text>
					</View>

					<View style={styles.detailRow}>
						<View style={styles.detailLeft}>
							<Ionicons
								name="receipt-outline"
								size={16}
								color="#007BFF"
							/>
							<Text style={styles.detailLabel}>Mã yêu cầu</Text>
						</View>
						<Text style={styles.detailValue}>
							{requestId ? getShortId(requestId) : "Chưa có"}
						</Text>
					</View>

					{/* VNPay specific information */}
					{paymentMethod === "vnpay" && transactionId && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name="card-outline"
									size={16}
									color="#007BFF"
								/>
								<Text style={styles.detailLabel}>
									Mã giao dịch VNPay
								</Text>
							</View>
							<Text style={styles.detailValue}>
								{transactionId}
							</Text>
						</View>
					)}

					{paymentMethod === "vnpay" && bankCode && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name="business-outline"
									size={16}
									color="#007BFF"
								/>
								<Text style={styles.detailLabel}>
									Ngân hàng
								</Text>
							</View>
							<Text style={styles.detailValue}>{bankCode}</Text>
						</View>
					)}

					{paymentMethod === "vnpay" && cardType && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name="card-outline"
									size={16}
									color="#007BFF"
								/>
								<Text style={styles.detailLabel}>Loại thẻ</Text>
							</View>
							<Text style={styles.detailValue}>{cardType}</Text>
						</View>
					)}

					{paymentMethod === "vnpay" && payDate && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name="calendar-outline"
									size={16}
									color="#007BFF"
								/>
								<Text style={styles.detailLabel}>
									Ngày thanh toán
								</Text>
							</View>
							<Text style={styles.detailValue}>
								{(() => {
									try {
										// VNPay payDate format: yyyyMMddHHmmss
										const dateStr = payDate.toString();
										if (dateStr.length === 14) {
											const year = dateStr.substring(
												0,
												4
											);
											const month = dateStr.substring(
												4,
												6
											);
											const day = dateStr.substring(6, 8);
											const hour = dateStr.substring(
												8,
												10
											);
											const minute = dateStr.substring(
												10,
												12
											);
											const second = dateStr.substring(
												12,
												14
											);
											return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
										}
										return payDate;
									} catch (_e) {
										return payDate;
									}
								})()}
							</Text>
						</View>
					)}

					{/* Server confirmation status for VNPay */}
					{paymentMethod === "vnpay" && (
						<View style={styles.detailRow}>
							<View style={styles.detailLeft}>
								<Ionicons
									name={
										serverConfirmed
											? "checkmark-circle-outline"
											: "alert-circle-outline"
									}
									size={16}
									color={
										serverConfirmed ? "#28a745" : "#dc3545"
									}
								/>
								<Text style={styles.detailLabel}>
									Trạng thái xác nhận
								</Text>
							</View>
							<Text
								style={[
									styles.detailValue,
									{
										color: serverConfirmed
											? "#28a745"
											: "#dc3545",
									},
								]}
							>
								{serverConfirmed
									? "Đã xác nhận"
									: "Chưa xác nhận"}
							</Text>
						</View>
					)}

					{/* Show error message if server confirmation failed */}
					{paymentMethod === "vnpay" &&
						!serverConfirmed &&
						confirmError && (
							<View style={styles.errorContainer}>
								<Ionicons
									name="warning-outline"
									size={16}
									color="#dc3545"
								/>
								<Text style={styles.errorText}>
									{confirmError}
								</Text>
							</View>
						)}

					<View style={styles.detailRow}>
						<View style={styles.detailLeft}>
							<Ionicons
								name="time-outline"
								size={16}
								color="#007BFF"
							/>
							<Text style={styles.detailLabel}>Thời gian</Text>
						</View>
						<Text style={styles.detailValue}>
							{new Date().toLocaleString("vi-VN", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				</View>

				{/* Success Status */}
				<View style={styles.statusContainer}>
					<Ionicons
						name="shield-checkmark-outline"
						size={16}
						color="#007BFF"
					/>
					<Text style={styles.statusText}>
						Giao dịch được bảo mật và an toàn
					</Text>
				</View>
			</View>

			{/* Bottom Actions */}
			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.primaryButton}
					onPress={handleViewOrders}
				>
					<LinearGradient
						colors={["#007BFF", "#0056b3"]}
						style={styles.buttonGradient}
					>
						<Text style={styles.primaryButtonText}>
							Xem đơn hàng
						</Text>
					</LinearGradient>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.secondaryButton}
					onPress={handleBackToHome}
				>
					<Text style={styles.secondaryButtonText}>Về trang chủ</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	header: {
		overflow: "hidden",
		position: "relative",
	},
	headerGradient: {
		paddingTop: 50,
		paddingBottom: 35,
		paddingHorizontal: 20,
		alignItems: "center",
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		position: "relative",
	},
	decorativeCircle1: {
		position: "absolute",
		top: -40,
		right: -40,
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(255,255,255,0.08)",
	},
	decorativeCircle2: {
		position: "absolute",
		bottom: -25,
		left: -25,
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(255,255,255,0.06)",
	},
	successContainer: {
		marginBottom: 20,
		zIndex: 10,
	},
	successIconWrapper: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 7,
		elevation: 7,
	},
	successTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 7,
		textAlign: "center",
		zIndex: 10,
	},
	successSubtitle: {
		fontSize: 15,
		color: "rgba(255,255,255,0.9)",
		textAlign: "center",
		lineHeight: 21,
		zIndex: 10,
		paddingHorizontal: 10,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 22,
	},
	amountCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 22,
		marginBottom: 18,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.09,
		shadowRadius: 5,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#E8F4FD",
	},
	amountLabel: {
		fontSize: 14,
		color: "#64748B",
		marginBottom: 7,
		fontWeight: "500",
	},
	amountText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#007BFF",
	},
	detailsCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 18,
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		elevation: 3,
	},
	cardTitle: {
		fontSize: 17,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 14,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 11,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	detailLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	detailLabel: {
		fontSize: 14,
		color: "#64748B",
		marginLeft: 9,
		fontWeight: "500",
	},
	detailValue: {
		fontSize: 14,
		color: "#1F2937",
		fontWeight: "600",
		textAlign: "right",
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FEF2F2",
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginTop: 8,
		borderLeftWidth: 3,
		borderLeftColor: "#dc3545",
	},
	errorText: {
		fontSize: 13,
		color: "#dc3545",
		marginLeft: 8,
		flex: 1,
		fontWeight: "500",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 5,
		marginBottom: 18,
	},
	statusText: {
		fontSize: 14,
		color: "#64748B",
		marginLeft: 7,
		fontWeight: "500",
	},
	actions: {
		flexDirection: "row",
		paddingHorizontal: 22,
		paddingBottom: 30,
		gap: 14,
	},
	primaryButton: {
		flex: 1,
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#007BFF",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
		elevation: 4,
	},
	buttonGradient: {
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingVertical: 15,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#007BFF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	secondaryButtonText: {
		color: "#007BFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	confirmationStatus: {
		marginTop: 10,
		alignItems: "center",
	},
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	loadingText: {
		color: "#FFFFFF",
		fontSize: 12,
		marginLeft: 8,
		fontWeight: "500",
	},
	confirmSuccess: {
		color: "#28a745",
		fontSize: 12,
		marginLeft: 6,
		fontWeight: "600",
	},
	confirmError: {
		color: "#dc3545",
		fontSize: 12,
		marginLeft: 6,
		fontWeight: "600",
	},
});

export default SuccessPaymentScreen;
