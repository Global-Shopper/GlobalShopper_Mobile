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

export default function NotiSetting({ navigation }) {
	const [settings, setSettings] = useState({
		orderNotification: true,
		walletPaymentNotification: true,
		requestNotification: true,
		supportMessage: true,
		systemNotification: true,
		emailNotification: true,
	});

	const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
	const [selectedSnooze, setSelectedSnooze] = useState(null);

	const snoozeOptions = [
		{ id: 1, label: "Tắt 15 phút", value: 15 },
		{ id: 2, label: "Tắt 30 phút", value: 30 },
		{ id: 3, label: "Tắt 1 giờ", value: 60 },
		{ id: 4, label: "Tắt 2 giờ", value: 120 },
		{ id: 5, label: "Tắt 4 giờ", value: 240 },
		{ id: 6, label: "Tắt đến 8:00 sáng mai", value: "morning" },
		{ id: 7, label: "Tắt 24 giờ", value: 1440 },
		{ id: 8, label: "Tắt vô thời hạn", value: "indefinite" },
	];

	const handleToggleSetting = (settingKey) => {
		setSettings((prev) => ({
			...prev,
			[settingKey]: !prev[settingKey],
		}));
	};

	const handleSnoozeSelect = (option) => {
		setSelectedSnooze(option);
		// Here you would implement the actual snooze logic
		console.log(`Snoozed for: ${option.label}`);
	};

	const renderSettingItem = (title, settingKey, icon, description = "") => (
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
				<View style={styles.textContainer}>
					<Text style={styles.settingTitle}>{title}</Text>
					{description ? (
						<Text style={styles.settingDescription}>
							{description}
						</Text>
					) : null}
				</View>
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

	const renderSnoozeOption = (option) => (
		<TouchableOpacity
			key={option.id}
			style={[
				styles.snoozeOption,
				selectedSnooze?.id === option.id && styles.selectedSnoozeOption,
			]}
			onPress={() => handleSnoozeSelect(option)}
		>
			<View style={styles.snoozeLeft}>
				<View style={styles.snoozeIconContainer}>
					<Ionicons
						name="time-outline"
						size={18}
						color={
							selectedSnooze?.id === option.id
								? "#4CAF50"
								: "#78909C"
						}
					/>
				</View>
				<Text
					style={[
						styles.snoozeText,
						selectedSnooze?.id === option.id &&
							styles.selectedSnoozeText,
					]}
				>
					{option.label}
				</Text>
			</View>
			{selectedSnooze?.id === option.id && (
				<Ionicons name="checkmark" size={20} color="#4CAF50" />
			)}
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
					<Text style={styles.headerTitle}>Cài đặt thông báo</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Notification Settings Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Loại thông báo</Text>
					<View style={styles.settingsContainer}>
						{renderSettingItem(
							"Thông báo đơn hàng",
							"orderNotification",
							"receipt-outline",
							"Cập nhật trạng thái đơn hàng"
						)}

						{renderSettingItem(
							"Thông báo ví & thanh toán",
							"walletPaymentNotification",
							"wallet-outline",
							"Giao dịch và số dư ví"
						)}

						{renderSettingItem(
							"Thông báo yêu cầu mua hộ",
							"requestNotification",
							"bag-handle-outline",
							"Yêu cầu mua hộ mới"
						)}

						{renderSettingItem(
							"Tin nhắn từ hỗ trợ",
							"supportMessage",
							"headset-outline",
							"Phản hồi từ đội ngũ hỗ trợ"
						)}

						{renderSettingItem(
							"Thông báo hệ thống",
							"systemNotification",
							"settings-outline",
							"Cập nhật ứng dụng và bảo trì"
						)}

						{renderSettingItem(
							"Gửi email",
							"emailNotification",
							"mail-outline",
							"Nhận thông báo qua email"
						)}
					</View>
				</View>

				{/* Snooze Notifications Section */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => setShowSnoozeOptions(!showSnoozeOptions)}
					>
						<Text style={styles.sectionTitle}>
							Tạm tắt thông báo
						</Text>
						<Ionicons
							name={
								showSnoozeOptions
									? "chevron-down"
									: "chevron-forward"
							}
							size={20}
							color="#263238"
						/>
					</TouchableOpacity>

					{showSnoozeOptions && (
						<View style={styles.snoozeContainer}>
							<Text style={styles.snoozeDescription}>
								Tạm thời tắt tất cả thông báo trong khoảng thời
								gian được chọn
							</Text>
							<View style={styles.snoozeOptionsContainer}>
								{snoozeOptions.map(renderSnoozeOption)}
							</View>

							{selectedSnooze && (
								<View style={styles.snoozeActiveContainer}>
									<View style={styles.snoozeActiveHeader}>
										<Ionicons
											name="moon"
											size={20}
											color="#FF9800"
										/>
										<Text style={styles.snoozeActiveTitle}>
											Thông báo đã được tắt
										</Text>
									</View>
									<Text style={styles.snoozeActiveText}>
										{selectedSnooze.label}
									</Text>
									<TouchableOpacity
										style={styles.cancelSnoozeButton}
										onPress={() => setSelectedSnooze(null)}
									>
										<Text style={styles.cancelSnoozeText}>
											Bật lại thông báo
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					)}
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
						• Thông báo quan trọng về bảo mật vẫn sẽ được gửi{"\n"}•
						Cài đặt này chỉ áp dụng cho thiết bị hiện tại{"\n"}• Bạn
						có thể thay đổi cài đặt bất kỳ lúc nào
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
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 5,
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#263238",
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
	textContainer: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: "#263238",
	},
	settingDescription: {
		fontSize: 13,
		color: "#78909C",
		marginTop: 2,
	},
	snoozeContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	snoozeDescription: {
		fontSize: 14,
		color: "#78909C",
		marginBottom: 16,
		textAlign: "center",
	},
	snoozeOptionsContainer: {
		gap: 8,
	},
	snoozeOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	selectedSnoozeOption: {
		borderColor: "#4CAF50",
		backgroundColor: "#F1F8E9",
	},
	snoozeLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	snoozeIconContainer: {
		marginRight: 12,
	},
	snoozeText: {
		fontSize: 15,
		color: "#263238",
	},
	selectedSnoozeText: {
		color: "#4CAF50",
		fontWeight: "500",
	},
	snoozeActiveContainer: {
		marginTop: 16,
		padding: 16,
		backgroundColor: "#FFF3E0",
		borderRadius: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#FF9800",
	},
	snoozeActiveHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	snoozeActiveTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#E65100",
		marginLeft: 8,
	},
	snoozeActiveText: {
		fontSize: 14,
		color: "#E65100",
		marginBottom: 12,
	},
	cancelSnoozeButton: {
		backgroundColor: "#FF9800",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		alignSelf: "flex-start",
	},
	cancelSnoozeText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#FFFFFF",
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
