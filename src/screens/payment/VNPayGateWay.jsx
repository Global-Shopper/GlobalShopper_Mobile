import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { useLazyCheckPaymentQuery } from "../../services/gshopApi";

const VNPayGateWay = ({ route, navigation }) => {
	const { url, amount, requestId, subRequestId, paymentMethod } =
		route?.params || {};
	const [loading, setLoading] = useState(true);

	const [checkPayment] = useLazyCheckPaymentQuery();

	const userEmail = useSelector(
		(state) => state.rootReducer?.user?.email || ""
	);

	console.log("VNPayGateWay route params:", route.params);
	console.log("VNPayGateWay user email:", userEmail);
	console.log(
		"VNPayGateWay user state:",
		useSelector((state) => state.rootReducer?.user)
	);

	// Handle URL navigation changes to detect success redirect
	const handleNavigationStateChange = (navState) => {
		console.log("VNPay navigation state change:", navState.url);

		// Check if this is the success redirect URL
		if (navState.url && navState.url.includes("success-payment-screen")) {
			console.log(
				"VNPay payment success detected, parsing URL:",
				navState.url
			);

			try {
				// Parse URL parameters
				const urlObj = new URL(navState.url);
				const params = new URLSearchParams(urlObj.search);

				// Extract common VNPay response parameters
				const vnpayParams = {
					vnp_Amount: params.get("vnp_Amount"),
					vnp_BankCode: params.get("vnp_BankCode"),
					vnp_BankTranNo: params.get("vnp_BankTranNo"),
					vnp_CardType: params.get("vnp_CardType"),
					vnp_OrderInfo: params.get("vnp_OrderInfo"),
					vnp_PayDate: params.get("vnp_PayDate"),
					vnp_ResponseCode: params.get("vnp_ResponseCode"),
					vnp_TmnCode: params.get("vnp_TmnCode"),
					vnp_TransactionNo: params.get("vnp_TransactionNo"),
					vnp_TransactionStatus: params.get("vnp_TransactionStatus"),
					vnp_TxnRef: params.get("vnp_TxnRef"),
					vnp_SecureHashType: params.get("vnp_SecureHashType"),
					vnp_SecureHash: params.get("vnp_SecureHash"),
				};

				console.log("Parsed VNPay parameters:", vnpayParams);

				// Check if payment was successful
				const isSuccess =
					vnpayParams.vnp_ResponseCode === "00" &&
					vnpayParams.vnp_TransactionStatus === "00";

				if (isSuccess) {
					console.log(
						"VNPay payment successful! Confirming with server..."
					);

					let finalAmount = amount || "Chưa xác định";
					if (!amount && vnpayParams.vnp_Amount) {
						const amountInVND =
							parseInt(vnpayParams.vnp_Amount) / 100;
						finalAmount = `${Math.round(amountInVND).toLocaleString(
							"vi-VN"
						)} VNĐ`;
					}

					const confirmPaymentWithServer = async () => {
						if (!userEmail) {
							console.warn(
								"User email not available for VNPay confirmation, skipping server API call"
							);
							// Still navigate to success screen since VNPay payment was successful
							navigation.replace("SuccessPaymentScreen", {
								paymentMethod: paymentMethod || "vnpay",
								amount: finalAmount,
								requestId: requestId || vnpayParams.vnp_TxnRef,
								subRequestId: subRequestId,
								transactionId: vnpayParams.vnp_TransactionNo,
								bankCode: vnpayParams.vnp_BankCode,
								cardType: vnpayParams.vnp_CardType,
								payDate: vnpayParams.vnp_PayDate,
								vnpayData: vnpayParams,
								serverConfirmed: false,
								confirmError:
									"Không thể xác nhận với server - thiếu thông tin email",
							});
							return;
						}

						try {
							console.log(
								"Calling checkPayment API with VNPay params..."
							);
							const checkPaymentParams = {
								email: userEmail,
								vnp_Amount: vnpayParams.vnp_Amount,
								vnp_BankCode: vnpayParams.vnp_BankCode,
								vnp_BankTranNo: vnpayParams.vnp_BankTranNo,
								vnp_CardType: vnpayParams.vnp_CardType,
								vnp_OrderInfo: vnpayParams.vnp_OrderInfo,
								vnp_PayDate: vnpayParams.vnp_PayDate,
								vnp_ResponseCode: vnpayParams.vnp_ResponseCode,
								vnp_TmnCode: vnpayParams.vnp_TmnCode,
								vnp_TransactionNo:
									vnpayParams.vnp_TransactionNo,
								vnp_TransactionStatus:
									vnpayParams.vnp_TransactionStatus,
								vnp_TxnRef: vnpayParams.vnp_TxnRef,
								vnp_SecureHashType:
									vnpayParams.vnp_SecureHashType,
								vnp_SecureHash: vnpayParams.vnp_SecureHash,
							};

							console.log(
								"Sending checkPayment params:",
								checkPaymentParams
							);
							const checkResult = await checkPayment(
								checkPaymentParams
							).unwrap();
							console.log(
								"CheckPayment API response:",
								checkResult
							);

							// If server confirms payment, navigate to success
							navigation.replace("SuccessPaymentScreen", {
								paymentMethod: paymentMethod || "vnpay",
								amount: finalAmount,
								requestId: requestId || vnpayParams.vnp_TxnRef,
								subRequestId: subRequestId,
								transactionId: vnpayParams.vnp_TransactionNo,
								bankCode: vnpayParams.vnp_BankCode,
								cardType: vnpayParams.vnp_CardType,
								payDate: vnpayParams.vnp_PayDate,
								vnpayData: vnpayParams,
								serverConfirmed: true, // Add flag to indicate server confirmation
							});
						} catch (confirmError) {
							console.error(
								"Error confirming VNPay payment with server:",
								confirmError
							);

							navigation.replace("SuccessPaymentScreen", {
								paymentMethod: paymentMethod || "vnpay",
								amount: finalAmount,
								requestId: requestId || vnpayParams.vnp_TxnRef,
								subRequestId: subRequestId,
								transactionId: vnpayParams.vnp_TransactionNo,
								bankCode: vnpayParams.vnp_BankCode,
								cardType: vnpayParams.vnp_CardType,
								payDate: vnpayParams.vnp_PayDate,
								vnpayData: vnpayParams,
								serverConfirmed: false,
								confirmError:
									confirmError?.data?.message ||
									"Lỗi xác nhận với server",
							});
						}
					};

					confirmPaymentWithServer();
				} else {
					console.error("VNPay payment failed:", {
						responseCode: vnpayParams.vnp_ResponseCode,
						transactionStatus: vnpayParams.vnp_TransactionStatus,
					});

					navigation.replace("SuccessPaymentScreen", {
						paymentMethod: paymentMethod || "vnpay",
						amount: amount || "Thanh toán thất bại",
						requestId: requestId || vnpayParams.vnp_TxnRef,
						subRequestId: subRequestId,
						error: true,
						errorCode: vnpayParams.vnp_ResponseCode,
						vnpayData: vnpayParams,
					});
				}
			} catch (error) {
				console.error("Error parsing VNPay success URL:", error);

				navigation.replace("SuccessPaymentScreen", {
					paymentMethod: paymentMethod || "vnpay",
					amount: amount || "Chưa xác định",
					requestId: requestId || "Chưa có",
					subRequestId: subRequestId,
				});
			}
		}
	};

	console.log("VNPayGateWay initialized with URL:", url);
	return (
		<View style={{ flex: 1 }}>
			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="#42A5F5" />
				</View>
			)}
			<WebView
				source={{ uri: url }}
				onLoadEnd={() => setLoading(false)}
				onNavigationStateChange={handleNavigationStateChange}
				startInLoadingState={true}
				style={{ flex: 1 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(255,255,255,0.7)",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},
});

export default VNPayGateWay;
