import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

const QuickAccess = ({ navigation }) => {
	const quickAccessItems = [
		{
			id: 1,
			title: "Hỗ trợ",
			icon: "headset-outline",
			color: "#42A5F5",
			onPress: () => navigation?.navigate("FAQScreen"),
		},
		{
			id: 2,
			title: "Hướng dẫn",
			icon: "book-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to guide"),
		},
		{
			id: 3,
			title: "Thông tin thuế",
			icon: "receipt-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to tax info"),
		},
		{
			id: 4,
			title: "Tỉ giá",
			icon: "trending-up-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to exchange rate"),
		},
		{
			id: 5,
			title: "Hoàn tiền",
			icon: "return-up-back-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to refunds"),
		},
		{
			id: 6,
			title: "Phí dịch vụ",
			icon: "calculator-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to service fees"),
		},
		{
			id: 7,
			title: "Thống kê",
			icon: "stats-chart-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to statistics"),
		},
		{
			id: 8,
			title: "Blog",
			icon: "library-outline",
			color: "#42A5F5",
			onPress: () => console.log("Navigate to blog"),
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.quickAccessContainer}>
				<Text style={styles.sectionTitle}>Truy cập nhanh</Text>
				<View style={styles.quickAccessGrid}>
					{quickAccessItems.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.quickAccessItem}
							onPress={item.onPress}
							activeOpacity={0.7}
						>
							<View
								style={[
									styles.quickAccessIcon,
									{
										backgroundColor: `${item.color}20`,
									},
								]}
							>
								<Ionicons
									name={item.icon}
									size={24}
									color={item.color}
								/>
							</View>
							<Text style={styles.quickAccessText}>
								{item.title}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 0,
		marginBottom: 12,
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 12,
		textAlign: "left",
		letterSpacing: 0.2,
	},
	quickAccessContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 4,
		marginVertical: 4,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	quickAccessGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 6,
	},
	quickAccessItem: {
		backgroundColor: "transparent",
		borderRadius: 12,
		padding: 12,
		alignItems: "center",
		width: "23%",
	},
	quickAccessIcon: {
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	quickAccessText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#334155",
		textAlign: "center",
		lineHeight: 14,
	},
});

export default QuickAccess;
