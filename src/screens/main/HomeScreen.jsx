import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function HomeScreen() {
	const handleNotificationPress = () => {
		console.log("Notification pressed");
	};

	const handleChatPress = () => {
		console.log("Chat pressed");
	};

	const handleAvatarPress = () => {
		console.log("Avatar pressed");
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				userName="Hoài Phương"
				subtitle="Hôm nay bạn muốn mua gì?"
				avatar="https://github.com/shadcn.png"
				notificationCount={3}
				chatCount={3}
				onNotificationPress={handleNotificationPress}
				onChatPress={handleChatPress}
				onAvatarPress={handleAvatarPress}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>
						Bạn muốn làm gì hôm nay?
					</Text>

					<View style={styles.mainActionGrid}>
						<View style={styles.mainActionCard}>
							<Ionicons
								name="link-outline"
								size={40}
								color="#007bff"
							/>
							<Text style={styles.mainActionTitle}>
								Mua hàng có link
							</Text>
							<Text style={styles.mainActionSubtitle}>
								Gửi link sản phẩm bạn muốn mua
							</Text>
						</View>

						<View style={styles.mainActionCard}>
							<Ionicons
								name="create-outline"
								size={40}
								color="#28a745"
							/>
							<Text style={styles.mainActionTitle}>
								{" "}
								Mua hàng không có link
							</Text>
							<Text style={styles.mainActionSubtitle}>
								Mô tả sản phẩm bạn cần tìm
							</Text>
						</View>
					</View>
				</View>

				{/* Quy trình mua hộ */}
				<View style={styles.processContainer}>
					<Text style={styles.sectionTitle}>Quy trình mua hộ</Text>

					<View style={styles.modernProcessFlow}>
						{/* Step 1 */}
						<View style={styles.modernProcessStep}>
							<View style={styles.stepLeft}>
								<View
									style={[
										styles.modernStepIcon,
										{ backgroundColor: "#E3F2FD" },
									]}
								>
									<Ionicons
										name="send"
										size={28}
										color="#1976D2"
									/>
								</View>
							</View>
							<View style={styles.stepContent}>
								<View style={styles.stepHeader}>
									<Text style={styles.stepNumber}>01</Text>
									<Text style={styles.modernStepTitle}>
										Gửi yêu cầu
									</Text>
								</View>
								<Text style={styles.modernStepDescription}>
									Gửi link sản phẩm hoặc mô tả chi tiết sản
									phẩm bạn muốn mua
								</Text>
							</View>
						</View>

						{/* Connector */}
						<View style={styles.stepConnector}>
							<View style={styles.connectorLine} />
							<Ionicons
								name="chevron-down"
								size={16}
								color="#42A5F5"
							/>
						</View>

						{/* Step 2 */}
						<View style={styles.modernProcessStep}>
							<View style={styles.stepLeft}>
								<View
									style={[
										styles.modernStepIcon,
										{ backgroundColor: "#FFF3CD" },
									]}
								>
									<Ionicons
										name="calculator"
										size={28}
										color="#F57C00"
									/>
								</View>
							</View>
							<View style={styles.stepContent}>
								<View style={styles.stepHeader}>
									<Text style={styles.stepNumber}>02</Text>
									<Text style={styles.modernStepTitle}>
										GShop báo giá
									</Text>
								</View>
								<Text style={styles.modernStepDescription}>
									Nhận báo giá chi tiết bao gồm giá sản phẩm,
									phí dịch vụ và vận chuyển
								</Text>
							</View>
						</View>

						{/* Connector */}
						<View style={styles.stepConnector}>
							<View style={styles.connectorLine} />
							<Ionicons
								name="chevron-down"
								size={16}
								color="#42A5F5"
							/>
						</View>

						{/* Step 3 */}
						<View style={styles.modernProcessStep}>
							<View style={styles.stepLeft}>
								<View
									style={[
										styles.modernStepIcon,
										{ backgroundColor: "#E8F5E8" },
									]}
								>
									<Ionicons
										name="card"
										size={28}
										color="#2E7D32"
									/>
								</View>
							</View>
							<View style={styles.stepContent}>
								<View style={styles.stepHeader}>
									<Text style={styles.stepNumber}>03</Text>
									<Text style={styles.modernStepTitle}>
										Thanh toán
									</Text>
								</View>
								<Text style={styles.modernStepDescription}>
									Thanh toán qua ví điện tử, chuyển khoản ngân
									hàng hoặc thẻ tín dụng
								</Text>
							</View>
						</View>

						{/* Connector */}
						<View style={styles.stepConnector}>
							<View style={styles.connectorLine} />
							<Ionicons
								name="chevron-down"
								size={16}
								color="#42A5F5"
							/>
						</View>

						{/* Step 4 */}
						<View style={styles.modernProcessStep}>
							<View style={styles.stepLeft}>
								<View
									style={[
										styles.modernStepIcon,
										{ backgroundColor: "#F3E5F5" },
									]}
								>
									<Ionicons
										name="airplane"
										size={28}
										color="#7B1FA2"
									/>
								</View>
							</View>
							<View style={styles.stepContent}>
								<View style={styles.stepHeader}>
									<Text style={styles.stepNumber}>04</Text>
									<Text style={styles.modernStepTitle}>
										Giao hàng
									</Text>
								</View>
								<Text style={styles.modernStepDescription}>
									Theo dõi đơn hàng và nhận hàng tại địa chỉ
									được chỉ định
								</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 25,
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 10,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	avatar: {
		marginRight: 12,
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	greetingContainer: {
		flex: 1,
	},
	greetingText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 2,
	},
	subGreeting: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.8)",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	notificationContainer: {
		position: "relative",
		marginRight: 16,
	},
	chatIcon: {
		marginLeft: 0,
	},
	notificationBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#dc3545",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	notificationText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		marginTop: 10,
	},
	quickActions: {
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 16,
	},
	mainActionGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	mainActionCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	mainActionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginTop: 12,
		textAlign: "center",
	},
	mainActionSubtitle: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
		textAlign: "center",
		lineHeight: 16,
	},
	processContainer: {
		marginTop: 32,
		marginBottom: 32,
		backgroundColor: "#ffffff",
		borderRadius: 20,
		padding: 24,
		borderWidth: 1,
		borderColor: "#e3f2fd",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.12,
		shadowRadius: 16,
		elevation: 8,
	},
	modernProcessFlow: {
		paddingVertical: 8,
	},
	modernProcessStep: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 12,
	},
	stepLeft: {
		marginRight: 20,
		alignItems: "center",
	},
	modernStepIcon: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	stepContent: {
		flex: 1,
		paddingTop: 8,
	},
	stepHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	stepNumber: {
		fontSize: 14,
		fontWeight: "700",
		color: "#42A5F5",
		backgroundColor: "#E3F2FD",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 12,
		minWidth: 32,
		textAlign: "center",
	},
	modernStepTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
	},
	modernStepDescription: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		paddingRight: 8,
	},
	stepConnector: {
		alignItems: "center",
		paddingVertical: 8,
		marginLeft: 32,
	},
	connectorLine: {
		width: 2,
		height: 20,
		backgroundColor: "#E3F2FD",
		marginBottom: 4,
	},
});
