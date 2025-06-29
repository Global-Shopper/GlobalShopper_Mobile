import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/text";

const QuickAccess = ({ navigation }) => {
	const quickAccessItems = [
		{
			id: 1,
			title: "Báo giá chờ xử lý",
			icon: "time-outline",
			count: 3,
			onPress: () => console.log("Navigate to pending quotes"),
		},
		{
			id: 2,
			title: "Hoàn tiền",
			icon: "return-up-back-outline",
			onPress: () => console.log("Navigate to refunds"),
		},
		{
			id: 3,
			title: "Ước tính chi phí",
			icon: "calculator-outline",
			onPress: () => console.log("Navigate to cost estimate"),
		},
		{
			id: 4,
			title: "Địa chỉ nhận hàng",
			icon: "location-outline",
			onPress: () => navigation?.navigate("MyAddress"),
		},
		{
			id: 5,
			title: "Lịch sử giao dịch",
			icon: "receipt-outline",
			onPress: () => navigation?.navigate("TransactionHistory"),
		},
	];

	const renderQuickAccessItem = (item, index) => {
		const isLastInRow = (index + 1) % 3 === 0;
		return (
			<TouchableOpacity
				key={item.id}
				style={[
					styles.quickAccessItem,
					isLastInRow && styles.lastInRow,
				]}
				onPress={item.onPress}
				activeOpacity={0.7}
			>
				<View style={styles.itemContent}>
					<View style={styles.iconContainer}>
						<Ionicons name={item.icon} size={20} color="#42A5F5" />
						{item.count && (
							<View style={styles.countBadge}>
								<Text style={styles.countText}>
									{item.count}
								</Text>
							</View>
						)}
					</View>

					<Text style={styles.itemTitle} numberOfLines={2}>
						{item.title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.sectionTitle}>Truy cập nhanh</Text>
			<View style={styles.quickAccessGrid}>
				{quickAccessItems.map((item, index) =>
					renderQuickAccessItem(item, index)
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 16,
	},
	quickAccessGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	quickAccessItem: {
		width: "31%",
		marginBottom: 16,
		marginRight: "3.5%",
	},
	lastInRow: {
		marginRight: 0,
	},
	itemContent: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 12,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 85,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	iconContainer: {
		position: "relative",
		marginBottom: 8,
		width: 36,
		height: 36,
		backgroundColor: "#E3F2FD",
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
	},
	countBadge: {
		position: "absolute",
		top: -3,
		right: -3,
		backgroundColor: "#dc3545",
		borderRadius: 7,
		width: 14,
		height: 14,
		justifyContent: "center",
		alignItems: "center",
	},
	countText: {
		color: "#FFFFFF",
		fontSize: 9,
		fontWeight: "bold",
	},
	itemTitle: {
		fontSize: 11,
		fontWeight: "500",
		color: "#333",
		textAlign: "center",
		lineHeight: 14,
	},
});

export default QuickAccess;
