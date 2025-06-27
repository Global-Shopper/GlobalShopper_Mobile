import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function AccountSettingList({ navigation }) {
	// Nhóm "Tài khoản của tôi"
	const myAccountItems = [
		{
			id: 1,
			title: "Chỉnh sửa tài khoản",
			subtitle: "Thông tin cá nhân",
			icon: "person-outline",
			action: () => navigation.navigate("ChangeProfile"),
		},
		{
			id: 2,
			title: "Địa chỉ",
			subtitle: "Quản lý địa chỉ giao hàng",
			icon: "location-outline",
			action: () => navigation.navigate("MyAddress"),
		},
		{
			id: 3,
			title: "Phương thức thanh toán",
			subtitle: "Thẻ & ví điện tử",
			icon: "card-outline",
			action: () => console.log("Navigate to payment methods"),
		},
	];

	// Nhóm "Cài đặt"
	const settingsItems = [
		{
			id: 1,
			title: "Cài đặt chat",
			subtitle: "Thông báo tin nhắn",
			icon: "chatbubble-outline",
			action: () => console.log("Navigate to chat settings"),
		},
		{
			id: 2,
			title: "Cài đặt thông báo",
			subtitle: "Quản lý thông báo",
			icon: "notifications-outline",
			action: () => console.log("Navigate to notification settings"),
		},
	];

	const renderMenuItem = (item) => (
		<TouchableOpacity
			key={item.id}
			style={styles.menuItem}
			onPress={item.action}
			activeOpacity={0.7}
		>
			<View style={styles.menuItemLeft}>
				<View style={styles.iconContainer}>
					<LinearGradient
						colors={["#4FC3F7", "#29B6F6"]}
						style={styles.iconGradient}
					>
						<Ionicons name={item.icon} size={24} color="#FFFFFF" />
					</LinearGradient>
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.menuTitle}>{item.title}</Text>
					<Text style={styles.menuSubtitle}>{item.subtitle}</Text>
				</View>
			</View>
			<Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1976D2" barStyle="light-content" />

			{/* Header */}
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Cài đặt tài khoản</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Tài khoản của tôi */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
					<View style={styles.menuContainer}>
						{myAccountItems.map(renderMenuItem)}
					</View>
				</View>

				{/* Cài đặt */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Cài đặt</Text>
					<View style={styles.menuContainer}>
						{settingsItems.map(renderMenuItem)}
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	header: {
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	section: {
		marginTop: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#263238",
		marginBottom: 15,
		paddingHorizontal: 5,
	},
	menuContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		marginRight: 15,
	},
	iconGradient: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	textContainer: {
		flex: 1,
	},
	menuTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	menuSubtitle: {
		fontSize: 13,
		color: "#78909C",
	},
});
