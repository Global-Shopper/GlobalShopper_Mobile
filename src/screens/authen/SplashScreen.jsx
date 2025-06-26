import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const SplashScreen = ({ navigation }) => {
	const logoAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(logoAnim, {
			toValue: 1,
			duration: 1500,
			useNativeDriver: true,
		}).start();

		const timeout = setTimeout(() => {
			navigation.replace("OnBoarding");
		}, 5000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<View style={styles.container}>
			<Animated.Image
				source={require("../../assets/images/logo/logo-gshop-removebg.png")}
				style={[
					styles.logo,
					{
						opacity: logoAnim,
						transform: [
							{
								scale: logoAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [0.8, 1],
								}),
							},
						],
					},
				]}
				resizeMode="contain"
			/>
		</View>
	);
};

export default SplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		width: 250,
		height: 250,
	},
});
