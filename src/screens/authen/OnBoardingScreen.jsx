import { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");

const Button = ({ label, ...props }) => (
	<TouchableOpacity style={styles.button} {...props}>
		<Text style={styles.buttonText}>{label}</Text>
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
				backgroundColor: selected ? "#007bff" : "#ccc",
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
	}, []);

	return (
		<Animated.Image
			source={source}
			style={[styles.image, { transform: [{ translateY: animation }] }]}
			resizeMode="contain"
		/>
	);
};

const OnboardingScreen = ({ navigation }) => {
	return (
		<View style={styles.wrapper}>
			<Onboarding
				onSkip={() => navigation.replace("Login")}
				onDone={() => navigation.replace("Login")}
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
		backgroundColor: "#007bff",
		paddingVertical: 13,
		paddingHorizontal: 20,
		borderRadius: 25,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
