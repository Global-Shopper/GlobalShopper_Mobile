import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function OTPVerificationScreen({ navigation, route }) {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);

	// Get email and type from navigation params
	const email = route?.params?.email || "your-email@example.com";
	const type = route?.params?.type || "signup";

	// Content based on flow type
	const getContent = () => {
		if (type === "forgot-password") {
			return {
				title: "Nhập mã xác minh",
				subtitle: "Mã xác minh đã được gửi đến",
				successMessage:
					"Xác minh mã thành công! Bạn có thể đặt lại mật khẩu.",
				resendMessage: "Mã xác minh mới đã được gửi đến email của bạn",
				changeEmailText: "Sai email? Thay đổi email",
			};
		} else {
			return {
				title: "Xác thực Email",
				subtitle: "Mã OTP đã được gửi đến",
				successMessage:
					"Xác thực email thành công! Email của bạn đã được xác thực.",
				resendMessage: "Mã OTP mới đã được gửi đến email của bạn",
				changeEmailText: "Đổi email",
			};
		}
	};

	const content = getContent();

	// Refs for OTP inputs
	const otpRefs = useRef([]);

	// Animation for logo
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const shakeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Logo breathing animation
		const breathingAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 1.05,
					duration: 2000,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 2000,
					useNativeDriver: true,
				}),
			])
		);

		breathingAnimation.start();

		return () => {
			breathingAnimation.stop();
		};
	}, [scaleAnim]);

	useEffect(() => {
		// Timer countdown
		let interval = null;
		if (timer > 0 && !canResend) {
			interval = setInterval(() => {
				setTimer((timer) => timer - 1);
			}, 1000);
		} else if (timer === 0) {
			setCanResend(true);
		}
		return () => clearInterval(interval);
	}, [timer, canResend]);

	const handleOtpChange = (index, value) => {
		// Only allow numbers
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto focus to next input
		if (value && index < 5) {
			otpRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyPress = (index, key) => {
		if (key === "Backspace" && !otp[index] && index > 0) {
			// Focus previous input on backspace
			otpRefs.current[index - 1]?.focus();
		}
	};

	const shakeAnimation = () => {
		Animated.sequence([
			Animated.timing(shakeAnim, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnim, {
				toValue: -10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnim, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnim, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handleVerifyOTP = async () => {
		const otpCode = otp.join("");

		if (otpCode.length !== 6) {
			shakeAnimation();
			Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số OTP");
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call - replace with real API call
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					// "123456" as valid OTP, others as invalid
					if (otpCode === "123456") {
						resolve();
					} else {
						reject({
							data: {
								errorCode: "INVALID_OTP",
								message: "OTP không hợp lệ hoặc đã hết hạn",
							},
						});
					}
				}, 2000);
			});

			// Success case
			if (type === "forgot-password") {
				// For forgot password, navigate directly to reset password screen
				navigation.navigate("ResetPassword", { email });
			} else {
				// For signup verification, show success message then go to login
				Alert.alert("Thành công", content.successMessage, [
					{
						text: "OK",
						onPress: () => navigation.navigate("Login"),
					},
				]);
			}
		} catch (error) {
			// Handle different error cases
			if (error?.data?.errorCode === "ALREADY_VERIFIED") {
				Alert.alert(
					"Email đã được xác thực",
					error?.data?.message ||
						"Email của bạn đã được xác thực trước đó.",
					[
						{
							text: "OK",
							onPress: () => navigation.navigate("Login"),
						},
					]
				);
			} else {
				shakeAnimation();
				Alert.alert(
					"Lỗi xác thực",
					error?.data?.message ||
						"OTP không hợp lệ hoặc hết hạn. Vui lòng thử lại."
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOTP = async () => {
		if (!canResend) return;

		setTimer(60);
		setCanResend(false);
		setOtp(["", "", "", "", "", ""]);

		// Focus first input
		otpRefs.current[0]?.focus();

		try {
			// Simulate API call - replace with real API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			Alert.alert("Đã gửi lại mã OTP", content.resendMessage);
		} catch (_error) {
			Alert.alert("Gửi lại OTP thất bại", "Vui lòng thử lại sau.");
			// Reset timer on failure
			setCanResend(true);
			setTimer(0);
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="chevron-back" size={24} color="#333" />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{/* Logo & Title Section - Compact */}
				<View style={styles.logoContainer}>
					<Animated.Image
						source={require("../../assets/images/logo/logo-gshop-removebg.png")}
						style={[
							styles.logo,
							{
								transform: [{ scale: scaleAnim }],
							},
						]}
						resizeMode="contain"
					/>
					<Text style={styles.title}>{content.title}</Text>
				</View>

				{/* Email Info */}
				<View style={styles.emailContainer}>
					<Text style={styles.subtitle}>{content.subtitle}</Text>
					<Text style={styles.emailText}>{email}</Text>
					<TouchableOpacity
						style={styles.changeEmailButton}
						onPress={() => navigation.goBack()}
					>
						<Text style={styles.changeEmailText}>
							{content.changeEmailText}
						</Text>
					</TouchableOpacity>
				</View>

				{/* OTP Input Section - Priority Position */}
				<Animated.View
					style={[
						styles.otpContainer,
						{ transform: [{ translateX: shakeAnim }] },
					]}
				>
					{otp.map((digit, index) => (
						<TextInput
							key={index}
							ref={(ref) => (otpRefs.current[index] = ref)}
							style={[
								styles.otpInput,
								digit && styles.otpInputFilled,
							]}
							value={digit}
							onChangeText={(value) =>
								handleOtpChange(index, value)
							}
							onKeyPress={({ nativeEvent }) =>
								handleKeyPress(index, nativeEvent.key)
							}
							keyboardType="numeric"
							maxLength={1}
							textAlign="center"
							selectTextOnFocus
							autoFocus={index === 0}
							autoCorrect={false}
						/>
					))}
				</Animated.View>

				{/* Timer and Resend */}
				<View style={styles.timerContainer}>
					{!canResend ? (
						<Text style={styles.timerText}>
							Gửi lại mã sau {formatTime(timer)}
						</Text>
					) : (
						<TouchableOpacity onPress={handleResendOTP}>
							<Text style={styles.resendText}>
								Gửi lại mã OTP
							</Text>
						</TouchableOpacity>
					)}
				</View>

				{/* Verify Button */}
				<TouchableOpacity
					style={[
						styles.verifyButton,
						isLoading && styles.verifyButtonDisabled,
					]}
					onPress={handleVerifyOTP}
					disabled={isLoading}
				>
					<LinearGradient
						colors={
							isLoading
								? ["#6c757d", "#6c757d"]
								: ["#42A5F5", "#1976D2"]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.verifyButtonGradient}
					>
						<Text style={styles.verifyButtonText}>
							{isLoading ? "Đang xác thực..." : "Xác thực"}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 50 : 30,
		paddingBottom: 10,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f8f9fa",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	content: {
		flex: 1,
		paddingHorizontal: 30,
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 10,
	},
	title: {
		fontSize: 25,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
	},
	emailContainer: {
		alignItems: "center",
		marginBottom: 20,
		paddingHorizontal: 20,
	},
	subtitle: {
		fontSize: 15,
		color: "#666",
		textAlign: "center",
		marginBottom: 8,
	},
	emailText: {
		fontSize: 16,
		color: "#1976D2",
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 12,
	},
	changeEmailButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	changeEmailText: {
		fontSize: 14,
		color: "#1976D2",
		textDecorationLine: "underline",
	},
	otpContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 25,
		paddingHorizontal: 5,
	},
	otpInput: {
		width: 45,
		height: 55,
		borderWidth: 2,
		borderColor: "#e9ecef",
		borderRadius: 12,
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		backgroundColor: "#f8f9fa",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	otpInputFilled: {
		borderColor: "#1976D2",
		backgroundColor: "#e7f3ff",
	},
	timerContainer: {
		alignItems: "center",
		marginBottom: 10,
	},
	timerText: {
		fontSize: 14,
		color: "#666",
	},
	resendText: {
		fontSize: 14,
		color: "#1976D2",
		fontWeight: "600",
	},
	verifyButton: {
		borderRadius: 15,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		shadowColor: "#1976D2",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	verifyButtonGradient: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	verifyButtonDisabled: {
		backgroundColor: "#6c757d",
		shadowOpacity: 0,
		elevation: 0,
	},
	verifyButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
