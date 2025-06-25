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

export default function SignupScreen({ navigation }) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [gender, setGender] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [passwordValidation, setPasswordValidation] = useState({
		minLength: false,
		hasLetterAndNumber: false,
		hasSpecialChar: false,
	});

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

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isPasswordValid =
		passwordValidation.minLength && passwordValidation.hasLetterAndNumber;

	// Auto scroll function
	const scrollToInput = (inputY) => {
		if (scrollViewRef.current) {
			setTimeout(() => {
				scrollViewRef.current.scrollTo({
					y: inputY - 50, // Offset để field không bị che bởi keyboard
					animated: true,
				});
			}, 100); // Delay nhỏ để đảm bảo keyboard đã hiện
		}
	};

	const handleSignup = async () => {
		// Validation
		if (!fullName.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập họ tên");
			return;
		}

		if (!email.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập email");
			return;
		}

		if (!validateEmail(email)) {
			Alert.alert("Lỗi", "Email không hợp lệ");
			return;
		}

		if (!gender) {
			Alert.alert("Lỗi", "Vui lòng chọn giới tính");
			return;
		}

		if (!password) {
			Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
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

		if (!agreeToTerms) {
			Alert.alert("Lỗi", "Vui lòng đồng ý với điều khoản và chính sách");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			Alert.alert("Thành công", "Đăng ký thành công!", [
				{
					text: "OK",
					onPress: () => navigation.navigate("Login"),
				},
			]);
		}, 2000);
	};

	const handleLoginNavigation = () => {
		navigation.navigate("Login");
	};

	const handleTermsPress = () => {
		Alert.alert(
			"Điều khoản và Chính sách",
			"Chức năng đang được phát triển"
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
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
					<Text style={styles.welcomeText}>Tạo tài khoản mới</Text>
					<Text style={styles.subtitleText}>
						Điền thông tin để bắt đầu mua sắm
					</Text>
				</View>

				{/* Form Section */}
				<View style={styles.formContainer}>
					{/* Full Name Input */}
					<View style={styles.inputContainer}>
						<Ionicons
							name="person-outline"
							size={20}
							color="#666"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Họ tên"
							placeholderTextColor="#999"
							value={fullName}
							onChangeText={setFullName}
							autoCapitalize="words"
							autoCorrect={false}
							onFocus={() => scrollToInput(180)}
						/>
					</View>

					{/* Gender Selection */}
					<View style={styles.genderContainer}>
						<Text style={styles.genderLabel}>Giới tính</Text>
						<View style={styles.genderOptions}>
							{[
								{ value: "male", label: "Nam" },
								{ value: "female", label: "Nữ" },
								{ value: "other", label: "Khác" },
							].map((option) => (
								<TouchableOpacity
									key={option.value}
									style={styles.genderOption}
									onPress={() => setGender(option.value)}
									activeOpacity={0.7}
								>
									<View style={[
										styles.radioButton,
										gender === option.value && styles.radioButtonActive
									]}>
										<View
											style={[
												styles.radioButtonInner,
												gender === option.value &&
													styles.radioButtonSelected,
											]}
										/>
									</View>
									<Text
										style={[
											styles.genderOptionText,
											gender === option.value &&
												styles.genderOptionTextSelected,
										]}
									>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

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
							placeholder="Email"
							placeholderTextColor="#999"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							onFocus={() => scrollToInput(350)}
						/>
					</View>

					{/* Password Input */}
					<View style={styles.inputContainer}>
						<Ionicons
							name="lock-closed-outline"
							size={20}
							color="#666"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Mật khẩu"
							placeholderTextColor="#999"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
							autoCorrect={false}
							autoComplete="off"
							textContentType="none"
							onFocus={() => scrollToInput(420)}
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
							placeholder="Xác nhận mật khẩu"
							placeholderTextColor="#999"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!showConfirmPassword}
							autoCapitalize="none"
							autoCorrect={false}
							autoComplete="off"
							textContentType="none"
							onFocus={() => scrollToInput(600)}
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

					{/* Terms Agreement */}
					<TouchableOpacity
						style={styles.termsContainer}
						onPress={() => setAgreeToTerms(!agreeToTerms)}
					>
						<View style={styles.checkboxContainer}>
							<Ionicons
								name={
									agreeToTerms ? "checkbox" : "square-outline"
								}
								size={20}
								color={agreeToTerms ? "#007bff" : "#666"}
							/>
						</View>
						<Text style={styles.termsText}>
							<Text>Tôi đồng ý với </Text>
							<Text
								style={styles.termsLink}
								onPress={handleTermsPress}
							>
								Điều khoản
							</Text>
							<Text> và </Text>
							<Text
								style={styles.termsLink}
								onPress={handleTermsPress}
							>
								Chính sách
							</Text>
						</Text>
					</TouchableOpacity>

					{/* Signup Button */}
					<TouchableOpacity
						style={[
							styles.signupButton,
							isLoading && styles.signupButtonDisabled,
						]}
						onPress={handleSignup}
						disabled={isLoading}
					>
						{isLoading ? (
							<Text style={styles.signupButtonText}>
								Đang đăng ký...
							</Text>
						) : (
							<Text style={styles.signupButtonText}>Đăng ký</Text>
						)}
					</TouchableOpacity>

					{/* Login Link */}
					<View style={styles.loginContainer}>
						<Text style={styles.loginText}>Đã có tài khoản? </Text>
						<TouchableOpacity onPress={handleLoginNavigation}>
							<Text style={styles.loginLink}>Đăng nhập ngay</Text>
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
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 30,
		paddingBottom: 50,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: height * 0.04,
		marginBottom: 25,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 12,
	},
	welcomeText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		marginBottom: 5,
	},
	subtitleText: {
		fontSize: 13,
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
	genderContainer: {
		marginBottom: 20,
	},
	genderLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	genderOptions: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	genderOption: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 4,
	},
	radioButton: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: "#ccc",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 8,
	},
	radioButtonActive: {
		borderColor: "#007bff",
	},
	radioButtonInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "transparent",
	},
	radioButtonSelected: {
		backgroundColor: "#007bff",
	},
	genderOptionText: {
		fontSize: 14,
		color: "#666",
		fontWeight: "500",
		flex: 1,
	},
	genderOptionTextSelected: {
		color: "#007bff",
		fontWeight: "600",
	},
	termsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
		paddingHorizontal: 4,
	},
	checkboxContainer: {
		marginRight: 10,
	},
	termsText: {
		flex: 1,
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	termsLink: {
		color: "#007bff",
		fontWeight: "500",
	},
	signupButton: {
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
	signupButtonDisabled: {
		backgroundColor: "#6c757d",
		shadowOpacity: 0,
		elevation: 0,
	},
	signupButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 25,
	},
	loginText: {
		fontSize: 15,
		color: "#666",
	},
	loginLink: {
		fontSize: 15,
		color: "#007bff",
		fontWeight: "bold",
	},
});
