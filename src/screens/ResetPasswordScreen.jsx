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

export default function ResetPasswordScreen({ navigation, route }) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [passwordValidation, setPasswordValidation] = useState({
		minLength: false,
		hasLetterAndNumber: false,
		hasSpecialChar: false,
	});

	// Get email from navigation params
	const email = route?.params?.email || "your-email@example.com";

	// Animation for logo
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;

	// ScrollView ref for auto-scroll
	const scrollViewRef = useRef(null);

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

	// Password validation
	useEffect(() => {
		setPasswordValidation({
			minLength: password.length >= 8,
			hasLetterAndNumber: /(?=.*[a-zA-Z])(?=.*\d)/.test(password),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		});
	}, [password]);

	const isPasswordValid =
		passwordValidation.minLength && passwordValidation.hasLetterAndNumber;

	// Auto scroll function
	const scrollToInput = (inputY) => {
		if (scrollViewRef.current) {
			setTimeout(() => {
				scrollViewRef.current.scrollTo({
					y: inputY - 50,
					animated: true,
				});
			}, 100);
		}
	};

	const handleResetPassword = async () => {
		// Validation
		if (!password) {
			Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới");
			return;
		}

		if (!isPasswordValid) {
			Alert.alert("Lỗi", "Mật khẩu không đáp ứng yêu cầu");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call to reset password
			await new Promise((resolve) => setTimeout(resolve, 2000));

			Alert.alert(
				"Thành công",
				"Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới.",
				[
					{
						text: "OK",
						onPress: () => navigation.navigate("Login"),
					},
				]
			);
		} catch (_error) {
			Alert.alert(
				"Lỗi",
				"Không thể đặt lại mật khẩu. Vui lòng thử lại sau."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToLogin = () => {
		Alert.alert(
			"Xác nhận",
			"Bạn có chắc chắn muốn quay lại? Mật khẩu sẽ không được đặt lại.",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Quay lại",
					onPress: () => navigation.navigate("Login"),
				},
			]
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
				ref={scrollViewRef}
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				enableOnAndroid={true}
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
					<Text style={styles.titleText}>Đặt lại mật khẩu</Text>
					<Text style={styles.subtitleText}>
						Tạo mật khẩu mới cho tài khoản của bạn
					</Text>
				</View>

				{/* Account Info - Compact Design */}
				<View style={styles.accountContainer}>
					<View style={styles.accountRow}>
						<Ionicons
							name="person-circle-outline"
							size={20}
							color="#007bff"
							style={styles.accountIcon}
						/>
						<Text style={styles.accountEmail}>{email}</Text>
						<Ionicons
							name="checkmark-circle"
							size={16}
							color="#28a745"
							style={styles.verifiedIcon}
						/>
					</View>
				</View>

				{/* Form Section */}
				<View style={styles.formContainer}>
					{/* New Password Input */}
					<View style={styles.inputContainer}>
						<Ionicons
							name="lock-closed-outline"
							size={20}
							color="#666"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Mật khẩu mới"
							placeholderTextColor="#999"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
							autoCorrect={false}
							autoComplete="off"
							textContentType="none"
							onFocus={() => scrollToInput(280)}
						/>
						<TouchableOpacity
							onPress={() => setShowPassword(!showPassword)}
							style={styles.eyeIcon}
						>
							<Ionicons
								name={
									showPassword
										? "eye-outline"
										: "eye-off-outline"
								}
								size={20}
								color="#666"
							/>
						</TouchableOpacity>
					</View>

					{/* Password Validation */}
					{password.length > 0 && (
						<View style={styles.passwordValidationContainer}>
							<View style={styles.validationItem}>
								<Ionicons
									name={
										passwordValidation.minLength
											? "checkmark-circle"
											: "close-circle"
									}
									size={16}
									color={
										passwordValidation.minLength
											? "#28a745"
											: "#dc3545"
									}
								/>
								<Text
									style={[
										styles.validationText,
										{
											color: passwordValidation.minLength
												? "#28a745"
												: "#dc3545",
										},
									]}
								>
									Ít nhất 8 ký tự
								</Text>
							</View>
							<View style={styles.validationItem}>
								<Ionicons
									name={
										passwordValidation.hasLetterAndNumber
											? "checkmark-circle"
											: "close-circle"
									}
									size={16}
									color={
										passwordValidation.hasLetterAndNumber
											? "#28a745"
											: "#dc3545"
									}
								/>
								<Text
									style={[
										styles.validationText,
										{
											color: passwordValidation.hasLetterAndNumber
												? "#28a745"
												: "#dc3545",
										},
									]}
								>
									Gồm chữ cái & số
								</Text>
							</View>
							<View style={styles.validationItem}>
								<Ionicons
									name={
										passwordValidation.hasSpecialChar
											? "checkmark-circle"
											: "close-circle"
									}
									size={16}
									color={
										passwordValidation.hasSpecialChar
											? "#28a745"
											: "#ffc107"
									}
								/>
								<Text
									style={[
										styles.validationText,
										{
											color: passwordValidation.hasSpecialChar
												? "#28a745"
												: "#ffc107",
										},
									]}
								>
									Có ký tự đặc biệt (tùy chọn)
								</Text>
							</View>
						</View>
					)}

					{/* Confirm Password Input */}
					<View style={styles.inputContainer}>
						<Ionicons
							name="lock-closed-outline"
							size={20}
							color="#666"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Xác nhận mật khẩu mới"
							placeholderTextColor="#999"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!showConfirmPassword}
							autoCapitalize="none"
							autoCorrect={false}
							autoComplete="off"
							textContentType="none"
							onFocus={() => scrollToInput(450)}
						/>
						<TouchableOpacity
							onPress={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
							style={styles.eyeIcon}
						>
							<Ionicons
								name={
									showConfirmPassword
										? "eye-outline"
										: "eye-off-outline"
								}
								size={20}
								color="#666"
							/>
						</TouchableOpacity>
					</View>

					{/* Password Match Validation */}
					{confirmPassword.length > 0 && (
						<View style={styles.passwordMatchContainer}>
							<Ionicons
								name={
									password === confirmPassword
										? "checkmark-circle"
										: "close-circle"
								}
								size={16}
								color={
									password === confirmPassword
										? "#28a745"
										: "#dc3545"
								}
							/>
							<Text
								style={[
									styles.validationText,
									{
										color:
											password === confirmPassword
												? "#28a745"
												: "#dc3545",
									},
								]}
							>
								{password === confirmPassword
									? "Mật khẩu khớp"
									: "Mật khẩu không khớp"}
							</Text>
						</View>
					)}

					{/* Reset Password Button */}
					<TouchableOpacity
						style={[
							styles.resetButton,
							isLoading && styles.resetButtonDisabled,
						]}
						onPress={handleResetPassword}
						disabled={isLoading}
					>
						{isLoading ? (
							<Text style={styles.resetButtonText}>
								Đang đặt lại...
							</Text>
						) : (
							<Text style={styles.resetButtonText}>
								Đặt lại mật khẩu
							</Text>
						)}
					</TouchableOpacity>

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
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 30,
		paddingBottom: 50,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: height * 0.01,
		marginBottom: 15,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 12,
	},
	titleText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		marginBottom: 10,
	},
	subtitleText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
	},
	accountContainer: {
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		padding: 14,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 6,
		elevation: 2,
	},
	accountRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	accountIcon: {
		marginRight: 10,
	},
	accountEmail: {
		flex: 1,
		fontSize: 15,
		color: "#1a202c",
		fontWeight: "500",
	},
	verifiedIcon: {
		marginLeft: 8,
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
		marginBottom: 16,
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
	eyeIcon: {
		padding: 5,
	},
	passwordValidationContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	validationItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	validationText: {
		fontSize: 13,
		marginLeft: 8,
		fontWeight: "500",
	},
	passwordMatchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
		paddingHorizontal: 4,
	},
	securityInfoContainer: {
		flexDirection: "row",
		backgroundColor: "#e8f5e8",
		borderRadius: 12,
		padding: 16,
		marginBottom: 25,
		borderWidth: 1,
		borderColor: "#c3e6c3",
	},
	securityIcon: {
		marginRight: 12,
		marginTop: 1,
	},
	securityText: {
		flex: 1,
		fontSize: 14,
		color: "#155724",
		lineHeight: 20,
	},
	resetButton: {
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
	resetButtonDisabled: {
		backgroundColor: "#6c757d",
		shadowOpacity: 0,
		elevation: 0,
	},
	resetButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	backToLoginContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
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
