import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function ForgotPasswordScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Animation for logo
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;

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

		// Subtle rotation animation
		const rotationAnimation = Animated.loop(
			Animated.timing(rotateAnim, {
				toValue: 1,
				duration: 8000,
				useNativeDriver: true,
			})
		);

		breathingAnimation.start();
		rotationAnimation.start();

		return () => {
			breathingAnimation.stop();
			rotationAnimation.stop();
		};
	}, [scaleAnim, rotateAnim]);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "5deg"],
	});

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSendOTP = async () => {
		if (!email.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập email");
			return;
		}

		if (!validateEmail(email)) {
			Alert.alert("Lỗi", "Email không hợp lệ");
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call to send OTP
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Chuyển thẳng sang màn hình OTP Verification
			navigation.navigate("OTPVerification", {
				email: email,
				type: "forgot-password", // Để phân biệt với OTP đăng ký
			});
		} catch (_error) {
			Alert.alert("Lỗi", "Không thể gửi mã OTP. Vui lòng thử lại sau.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToLogin = () => {
		navigation.goBack();
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
					onPress={handleBackToLogin}
				>
					<Ionicons name="chevron-back" size={24} color="#333" />
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{/* Logo Section */}
				<View style={styles.logoContainer}>
					<Animated.Image
						source={require("../assets/images/logo/logo-gshop-removebg.png")}
						style={[
							styles.logo,
							{
								transform: [
									{ scale: scaleAnim },
									{ rotate: rotate },
								],
							},
						]}
						resizeMode="contain"
					/>
					<Text style={styles.titleText}>Bạn quên mật khẩu?</Text>
					<Text style={styles.subtitleText}>
						Không sao, chúng tôi sẽ giúp bạn khôi phục tài khoản
					</Text>
				</View>

				{/* Form Section */}
				<View style={styles.formContainer}>
					{/* Email Input */}
					<View style={styles.inputContainer}>
						<Ionicons
							name="mail-outline"
							size={20}
							color="#666"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Nhập email của bạn"
							placeholderTextColor="#999"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							autoFocus={true}
						/>
					</View>

					{/* Send OTP Button */}
					<TouchableOpacity
						style={[
							styles.sendButton,
							isLoading && styles.sendButtonDisabled,
						]}
						onPress={handleSendOTP}
						disabled={isLoading}
					>
						{isLoading ? (
							<Text style={styles.sendButtonText}>
								Đang gửi mã OTP...
							</Text>
						) : (
							<Text style={styles.sendButtonText}>
								Gửi mã OTP
							</Text>
						)}
					</TouchableOpacity>

					{/* Information Box */}
					<View style={styles.infoContainer}>
						<Ionicons
							name="information-circle-outline"
							size={18}
							color="#007bff"
							style={styles.infoIcon}
						/>
						<Text style={styles.infoText}>
							Chúng tôi sẽ gửi mã OTP 6 số đến email của bạn để
							xác thực danh tính.
						</Text>
					</View>

					{/* Back to Login */}
					<View style={styles.backToLoginContainer}>
						<Text style={styles.backToLoginText}>
							Nhớ mật khẩu?{" "}
						</Text>
						<TouchableOpacity onPress={handleBackToLogin}>
							<Text style={styles.backToLoginLink}>
								Quay lại đăng nhập
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
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
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 30,
		paddingBottom: 20,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: height * 0.02,
		marginBottom: 20,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 8,
	},
	titleText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		marginBottom: 6,
	},
	subtitleText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
	},
	formContainer: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		borderRadius: 15,
		paddingHorizontal: 15,
		marginBottom: 20,
		height: 50,
		borderWidth: 1,
		borderColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: "#333",
	},
	sendButton: {
		backgroundColor: "#007bff",
		borderRadius: 15,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		shadowColor: "#007bff",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	sendButtonDisabled: {
		backgroundColor: "#6c757d",
		shadowOpacity: 0,
		elevation: 0,
	},
	sendButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	infoContainer: {
		flexDirection: "row",
		backgroundColor: "#e7f3ff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: "#cce7ff",
	},
	infoIcon: {
		marginRight: 12,
		marginTop: 1,
	},
	infoText: {
		flex: 1,
		fontSize: 14,
		color: "#0066cc",
		lineHeight: 20,
	},
	backToLoginContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	backToLoginText: {
		fontSize: 15,
		color: "#666",
	},
	backToLoginLink: {
		fontSize: 15,
		color: "#007bff",
		fontWeight: "bold",
	},
});
