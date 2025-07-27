import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const Button = ({ label, ...props }) => (
	<TouchableOpacity style={styles.button} {...props}>
		<LinearGradient
			colors={["#42A5F5", "#1976D2"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.buttonGradient}
		>
			<Text style={styles.buttonText}>{label}</Text>
		</LinearGradient>
	</TouchableOpacity>
);

const Dot = ({ selected }) => {
	return (
		<View
			style={{
				width: 8,
				height: 8,
				borderRadius: 4,
				marginHorizontal: 4,
				backgroundColor: selected ? "#1976D2" : "#ccc",
			}}
		/>
	);
};

const FloatingImage = ({ source }) => {
	const animation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animation, {
					toValue: -10,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(animation, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		).start();
	}, [animation]);

	return (
		<Animated.Image
			source={source}
			style={[styles.image, { transform: [{ translateY: animation }] }]}
			resizeMode="contain"
		/>
	);
};

const OnboardingScreen = ({ navigation }) => {
	// Hàm lưu trạng thái đã xem onboarding
	const handleOnboardingComplete = async () => {
		try {
			await AsyncStorage.setItem("@hasOnboarded", "true");
			// Chuyển đến app chính, user có thể dùng như guest hoặc đăng nhập
			navigation.replace("Tabs");
		} catch (error) {
			console.log("Error saving onboarding status:", error);
			navigation.replace("Tabs");
		}
	};

	return (
		<View style={styles.wrapper}>
			<Onboarding
				onSkip={handleOnboardingComplete}
				onDone={handleOnboardingComplete}
				SkipButtonComponent={(props) => (
					<Button label="Dừng" {...props} />
				)}
				NextButtonComponent={(props) => (
					<Button label="Sau" {...props} />
				)}
				DoneButtonComponent={(props) => (
					<Button label="Bắt đầu" {...props} />
				)}
				DotComponent={Dot}
				containerStyles={styles.container}
				titleStyles={styles.title}
				subTitleStyles={styles.subtitle}
				bottomBarHighlight={false}
				pages={[
					{
						backgroundColor: "transparent",
						image: (
							<FloatingImage
								source={require("../../assets/images/onboarding/ob1.png")}
							/>
						),
						title: "Mua hộ từ khắp nơi trên thế giới",
						subtitle: "Giúp bạn mua hàng quốc tế chỉ với vài bước",
					},
					{
						backgroundColor: "transparent",
						image: (
							<FloatingImage
								source={require("../../assets/images/onboarding/ob2.png")}
							/>
						),
						title: "Theo dõi đơn hàng minh bạch",
						subtitle:
							"Cập nhật trạng thái từ lúc đặt đến lúc giao hàng",
					},
					{
						backgroundColor: "transparent",
						image: (
							<FloatingImage
								source={require("../../assets/images/onboarding/ob3.png")}
							/>
						),
						title: "An toàn và hoàn tiền linh hoạt",
						subtitle:
							"Có thể yêu cầu hỗ trợ & hoàn tiền nếu có sự cố",
					},
				]}
			/>
		</View>
	);
};

export default OnboardingScreen;

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	container: {
		paddingHorizontal: 30,
		paddingBottom: 180,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: 360,
		height: 350,
	},
	title: {
		fontSize: 35,
		fontWeight: "bold",
		color: "#000",
		textAlign: "center",
		marginBottom: 5,
	},
	subtitle: {
		fontSize: 20,
		color: "#999",
		textAlign: "center",
		paddingHorizontal: 20,
	},
	button: {
		marginHorizontal: 25,
		borderRadius: 25,
	},
	buttonGradient: {
		paddingVertical: 13,
		paddingHorizontal: 20,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
