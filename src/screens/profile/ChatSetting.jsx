import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function ChatSetting({ navigation }) {
	const [settings, setSettings] = useState({
		newMessageNotification: true,
		vibration: false,
		sound: true,
		adminOnlyNotification: false,
	});

	const handleToggleSetting = (settingKey) => {
		setSettings((prev) => ({
			...prev,
			[settingKey]: !prev[settingKey],
		}));
	};

	const renderSettingItem = (title, settingKey, icon) => (
		<View style={styles.settingItem} key={settingKey}>
			<View style={styles.settingLeft}>
				<View style={styles.iconContainer}>
					<LinearGradient
						colors={["#64B5F6", "#42A5F5"]}
						style={styles.iconGradient}
					>
						<Ionicons name={icon} size={20} color="#FFFFFF" />
					</LinearGradient>
				</View>
				<Text style={styles.settingTitle}>{title}</Text>
			</View>
			<Switch
				value={settings[settingKey]}
				onValueChange={() => handleToggleSetting(settingKey)}
				trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
				thumbColor={settings[settingKey] ? "#FFFFFF" : "#F4F3F4"}
				ios_backgroundColor="#E0E0E0"
			/>
		</View>
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
					<Text style={styles.headerTitle}>Cài đặt chat</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Chat Notifications Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thông báo chat</Text>
					<View style={styles.settingsContainer}>
						{renderSettingItem(
							"Bật thông báo khi có tin nhắn mới",
							"newMessageNotification",
							"notifications-outline"
						)}

						{renderSettingItem(
							"Rung khi có tin nhắn",
							"vibration",
							"phone-portrait-outline"
						)}

						{renderSettingItem(
							"Phát âm thanh",
							"sound",
							"volume-high-outline"
						)}

						{renderSettingItem(
							"Chỉ thông báo khi có tin nhắn từ Admin",
							"adminOnlyNotification",
							"shield-checkmark-outline"
						)}
					</View>
				</View>

				{/* Info Note */}
				<View style={styles.infoContainer}>
					<View style={styles.infoHeader}>
						<Ionicons
							name="information-circle"
							size={20}
							color="#2196F3"
						/>
						<Text style={styles.infoTitle}>Lưu ý</Text>
					</View>
					<Text style={styles.infoText}>
						• Tùy chọn thông báo sẽ được áp dụng cho tất cả cuộc trò
						chuyện{"\n"}• Bạn có thể thay đổi cài đặt bất kỳ lúc nào
						{"\n"}• Thông báo từ Admin sẽ luôn được ưu tiên hiển thị
					</Text>
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
	settingsContainer: {
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
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
	},
	settingLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		marginRight: 15,
	},
	iconGradient: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: "#263238",
		flex: 1,
	},
	infoContainer: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		marginBottom: 30,
		borderLeftWidth: 4,
		borderLeftColor: "#2196F3",
	},
	infoHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2196F3",
		marginLeft: 8,
	},
	infoText: {
		fontSize: 14,
		color: "#1976D2",
		lineHeight: 20,
	},
});
