import { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const SliceBanner = ({ navigation }) => {
	const scrollViewRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	// Banner data với images - thứ tự 3-2-1
	const banners = [
		{
			id: 3,
			image: require("../../assets/images/banner/banner3.png"),
			title: "Banner 3",
			onPress: () => console.log("Banner 3 pressed"),
		},
		{
			id: 2,
			image: require("../../assets/images/banner/banner2.png"),
			title: "Banner 2",
			onPress: () => console.log("Banner 2 pressed"),
		},
		{
			id: 1,
			image: require("../../assets/images/banner/banner1.png"),
			title: "Banner 1",
			onPress: () => console.log("Banner 1 pressed"),
		},
	];

	// Auto scroll effect
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => {
				const nextIndex = (prevIndex + 1) % banners.length;
				scrollViewRef.current?.scrollTo({
					x: nextIndex * (screenWidth - 20), // Adjusted for new layout
					animated: true,
				});
				return nextIndex;
			});
		}, 3000); // Change banner every 3 seconds

		return () => clearInterval(interval);
	}, [banners.length]);

	const handleScroll = (event) => {
		const slideSize = screenWidth - 20; // Adjusted for new layout
		const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
		setCurrentIndex(index);
	};

	const handleBannerPress = (banner) => {
		banner.onPress();
	};

	return (
		<View style={styles.container}>
			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={handleScroll}
				scrollEventThrottle={16}
				contentContainerStyle={styles.scrollContainer}
				snapToInterval={screenWidth - 20}
				snapToAlignment="start"
				decelerationRate="fast"
			>
				{banners.map((banner) => (
					<TouchableOpacity
						key={banner.id}
						style={styles.bannerContainer}
						onPress={() => handleBannerPress(banner)}
						activeOpacity={0.9}
					>
						<Image
							source={banner.image}
							style={styles.bannerImage}
							resizeMode="cover"
						/>
					</TouchableOpacity>
				))}
			</ScrollView>

			{/* Pagination dots */}
			<View style={styles.pagination}>
				{banners.map((_, index) => (
					<View
						key={index}
						style={[
							styles.dot,
							index === currentIndex && styles.activeDot,
						]}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 1,
	},
	scrollContainer: {
		paddingLeft: 0,
	},
	bannerContainer: {
		width: screenWidth - 40,
		marginRight: 20,
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
	},
	bannerImage: {
		width: "100%",
		height: (screenWidth - 40) / 2, // Tỷ lệ 2:1 (1080x540)
		borderRadius: 16,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 12,
		gap: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#D1D5DB",
		transition: "all 0.3s ease",
	},
	activeDot: {
		backgroundColor: "#42A5F5",
		width: 20,
		borderRadius: 10,
	},
});

export default SliceBanner;
