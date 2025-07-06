import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../features/user";
import { useLoginMutation } from "../../services/gshopApi";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [login] = useLoginMutation();
	const dispatch = useDispatch();

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

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
			return;
		}
		setIsLoading(true);

		const values = {
			email: email,
			password: password,
		};
		login(values)
			.unwrap()
			.then((res) => {
				dispatch(
					setUserInfo({ ...res?.user, accessToken: res?.token })
				);
				navigation.reset({
					index: 0,
					routes: [{ name: "Tabs" }],
				});
			})
			.catch((e) => {
				if (e.data?.errorCode === 1001) {
					Alert.alert("Bạn cần phải xác nhận email");
					navigation.navigate("OTPVerification", {
						email: email,
					});
				} else {
					Alert.alert(
						e.data.message ||
							"Đã có lỗi xảy ra. Vui lòng thử lại sau"
					);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleForgotPassword = () => {
		navigation.navigate("ForgotPassword");
	};

	const handleSignUp = () => {
		navigation.navigate("Signup");
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Logo Section */}
				<View style={styles.logoContainer}>
					<Animated.Image
						source={require("../../assets/images/logo/logo-gshop-removebg.png")}
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
					<Text style={styles.welcomeText}>
						Chào mừng bạn đã quay trở lại!
					</Text>
					<Text style={styles.subtitleText}>
						Nhập email và mật khẩu để đăng nhập
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
							placeholder="Email"
							placeholderTextColor="#999"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
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

					{/* Forgot Password */}
					<TouchableOpacity
						onPress={handleForgotPassword}
						style={styles.forgotPasswordContainer}
					>
						<Text style={styles.forgotPasswordText}>
							Quên mật khẩu?
						</Text>
					</TouchableOpacity>

					{/* Login Button */}
					<TouchableOpacity
						style={[
							styles.loginButton,
							isLoading && styles.loginButtonDisabled,
						]}
						onPress={handleLogin}
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
							style={styles.loginButtonGradient}
						>
							{isLoading ? (
								<Text style={styles.loginButtonText}>
									Đang đăng nhập...
								</Text>
							) : (
								<Text style={styles.loginButtonText}>
									Đăng nhập
								</Text>
							)}
						</LinearGradient>
					</TouchableOpacity>

					{/* Divider */}
					<View style={styles.dividerContainer}>
						<View style={styles.divider} />
						<Text style={styles.dividerText}>Hoặc</Text>
						<View style={styles.divider} />
					</View>

					{/* Social Login Buttons */}
					<View style={styles.socialContainer}>
						<TouchableOpacity style={styles.socialButtonFull}>
							<Ionicons
								name="logo-google"
								size={20}
								color="#4285F4"
								style={styles.googleIcon}
							/>
							<Text style={styles.socialButtonText}>
								Đăng nhập với Google
							</Text>
						</TouchableOpacity>
					</View>

					{/* Sign Up Link */}
					<View style={styles.signUpContainer}>
						<Text style={styles.signUpText}>
							Chưa có tài khoản?{" "}
						</Text>
						<TouchableOpacity onPress={handleSignUp}>
							<Text style={styles.signUpLink}>Đăng ký ngay</Text>
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
		marginTop: height * 0.1,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: height * 0.06,
		marginBottom: 30,
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 16,
	},
	welcomeText: {
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
		marginBottom: 14,
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
	forgotPasswordContainer: {
		alignItems: "flex-end",
		marginBottom: 20,
	},
	forgotPasswordText: {
		color: "#1976D2",
		fontSize: 13,
		fontWeight: "500",
	},
	loginButton: {
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
	loginButtonGradient: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	loginButtonDisabled: {
		backgroundColor: "#6c757d",
		shadowOpacity: 0,
		elevation: 0,
	},
	loginButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 20,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: "#e9ecef",
	},
	dividerText: {
		marginHorizontal: 16,
		color: "#6c757d",
		fontSize: 13,
	},
	socialContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 28,
	},
	socialButton: {
		flex: 0.48,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		height: 50,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	socialButtonFull: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f8f9fa",
		borderRadius: 15,
		height: 45,
		borderWidth: 1,
		borderColor: "#e9ecef",
		width: "100%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	googleIcon: {
		marginRight: 8,
	},
	socialButtonText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#333",
	},
	signUpContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 25,
	},
	signUpText: {
		fontSize: 15,
		color: "#666",
	},
	signUpLink: {
		fontSize: 15,
		color: "#1976D2",
		fontWeight: "bold",
	},
});
