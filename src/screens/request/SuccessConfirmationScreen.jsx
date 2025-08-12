import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "../../components/ui/text";
import { getStatusText, getStatusColor, REQUEST_STATUS } from "../../utils/statusHandler";

export default function SuccessConfirmationScreen({ navigation, route }) {
	const { requestId = "REQ" + Date.now() } = route.params || {};
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.3)).current;
	const slideAnim = useRef(new Animated.Value(50)).current;

	const [currentTime] = useState(new Date().toLocaleString("vi-VN"));

	useEffect(() => {
		// Animation sequence
		Animated.sequence([
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					tension: 50,
					friction: 3,
					useNativeDriver: true,
				}),
			]),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, scaleAnim, slideAnim]);

	const handleBackToHome = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: "Tabs" }],
		});
	};

	const handleViewOrders = () => {
		// Navigate to Request tab using jumpTo
		navigation.reset({
			index: 0,
			routes: [{ name: "Tabs" }],
		});

		// After a short delay, navigate to the specific tab
		setTimeout(() => {
			navigation.navigate("Tabs", {
				screen: "Request",
			});
		}, 100);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#1976D2" />

			{/* Success Background */}
			<LinearGradient
				colors={["#1976D2", "#42A5F5", "#64B5F6"]}
				style={styles.backgroundGradient}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* Success Icon */}
					<Animated.View
						style={[
							styles.successIconContainer,
							{
								opacity: fadeAnim,
								transform: [{ scale: scaleAnim }],
							},
						]}
					>
						<View style={styles.successIconCircle}>
							<Ionicons
								name="checkmark"
								size={60}
								color="#1976D2"
							/>
						</View>
					</Animated.View>

					{/* Success Message */}
					<Animated.View
						style={[
							styles.messageContainer,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						<Text style={styles.successTitle}>
							Yêu cầu đã được gửi!
						</Text>
						<Text style={styles.successSubtitle}>
							Cảm ơn bạn đã sử dụng dịch vụ GShop. Chúng tôi sẽ xử
							lý yêu cầu của bạn trong thời gian sớm nhất.
						</Text>
					</Animated.View>

					{/* Request Info Card */}
					<Animated.View
						style={[
							styles.infoCard,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						<View style={styles.infoHeader}>
							<Ionicons
								name="document-text"
								size={24}
								color="#1976D2"
							/>
							<Text style={styles.infoTitle}>
								Thông tin yêu cầu
							</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Mã yêu cầu:</Text>
							<Text style={styles.infoValue}>{requestId}</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Thời gian gửi:</Text>
							<Text style={styles.infoValue}>{currentTime}</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Trạng thái:</Text>
							<View style={[
								styles.statusBadge,
								{ backgroundColor: getStatusColor(REQUEST_STATUS.CHECKING) + '20' }
							]}>
								<Ionicons
									name="hourglass-outline"
									size={14}
									color={getStatusColor(REQUEST_STATUS.CHECKING)}
								/>
								<Text style={[
									styles.statusText,
									{ color: getStatusColor(REQUEST_STATUS.CHECKING) }
								]}>
									{getStatusText(REQUEST_STATUS.CHECKING)}
								</Text>
							</View>
						</View>
					</Animated.View>

					{/* What's Next Card */}
					<Animated.View
						style={[
							styles.nextStepsCard,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						<View style={styles.nextStepsHeader}>
							<Ionicons
								name="bulb-outline"
								size={24}
								color="#1976D2"
							/>
							<Text style={styles.nextStepsTitle}>
								Tiếp theo sẽ như thế nào?
							</Text>
						</View>

						<View style={styles.stepItem}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>1</Text>
							</View>
							<View style={styles.stepContent}>
								<Text style={styles.stepTitle}>
									Xem xét yêu cầu
								</Text>
								<Text style={styles.stepDescription}>
									Đội ngũ của chúng tôi sẽ xem xét và xác nhận
									yêu cầu trong vòng 24 giờ
								</Text>
							</View>
						</View>

						<View style={styles.stepItem}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>2</Text>
							</View>
							<View style={styles.stepContent}>
								<Text style={styles.stepTitle}>
									Liên hệ báo giá
								</Text>
								<Text style={styles.stepDescription}>
									Chúng tôi sẽ liên hệ với bạn để cung cấp báo
									giá chi tiết và thời gian giao hàng
								</Text>
							</View>
						</View>

						<View style={styles.stepItem}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>3</Text>
							</View>
							<View style={styles.stepContent}>
								<Text style={styles.stepTitle}>
									Thanh toán & giao hàng
								</Text>
								<Text style={styles.stepDescription}>
									Sau khi xác nhận, chúng tôi sẽ tiến hành đặt
									hàng và giao đến địa chỉ của bạn
								</Text>
							</View>
						</View>
					</Animated.View>

					{/* Contact Support */}
					<Animated.View
						style={[
							styles.supportCard,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						<Ionicons
							name="headset-outline"
							size={24}
							color="#1976D2"
						/>
						<Text style={styles.supportText}>
							Cần hỗ trợ? Liên hệ với chúng tôi qua hotline{" "}
							<Text style={styles.supportPhone}>1900 1234</Text>{" "}
							hoặc chat trực tuyến 24/7
						</Text>
					</Animated.View>
				</ScrollView>
			</LinearGradient>

			{/* Action Buttons */}
			<View style={styles.actionContainer}>
				<TouchableOpacity
					style={styles.secondaryButton}
					onPress={handleViewOrders}
				>
					<Ionicons name="list-outline" size={20} color="#1976D2" />
					<Text style={styles.secondaryButtonText}>Xem yêu cầu</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.primaryButton}
					onPress={handleBackToHome}
				>
					<LinearGradient
						colors={["#1976D2", "#42A5F5"]}
						style={styles.primaryButtonGradient}
					>
						<Ionicons name="home-outline" size={20} color="#fff" />
						<Text style={styles.primaryButtonText}>
							Về trang chủ
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1976D2",
	},
	backgroundGradient: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 120,
	},
	successIconContainer: {
		alignItems: "center",
		marginBottom: 30,
	},
	successIconCircle: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	messageContainer: {
		alignItems: "center",
		marginBottom: 30,
	},
	successTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
		marginBottom: 12,
	},
	successSubtitle: {
		fontSize: 16,
		color: "#E8F5E8",
		textAlign: "center",
		lineHeight: 24,
		paddingHorizontal: 10,
	},
	infoCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	infoHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginLeft: 12,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	infoLabel: {
		fontSize: 14,
		color: "#666",
		flex: 1,
	},
	infoValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		flex: 1,
		textAlign: "right",
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF3E0",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		gap: 6,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FF9800",
	},
	nextStepsCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	nextStepsHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	nextStepsTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginLeft: 12,
	},
	stepItem: {
		flexDirection: "row",
		marginBottom: 16,
		alignItems: "flex-start",
	},
	stepNumber: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#E3F2FD",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
		marginTop: 2,
	},
	stepNumberText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1976D2",
	},
	stepContent: {
		flex: 1,
	},
	stepTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	stepDescription: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	supportCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	supportText: {
		fontSize: 14,
		color: "#666",
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
	supportPhone: {
		fontWeight: "600",
		color: "#1976D2",
	},
	actionContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		paddingHorizontal: 20,
		paddingVertical: 16,
		paddingBottom: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		flexDirection: "row",
		gap: 12,
	},
	secondaryButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#1976D2",
		backgroundColor: "#fff",
		gap: 8,
	},
	secondaryButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
	},
	primaryButton: {
		flex: 1,
		borderRadius: 12,
		overflow: "hidden",
	},
	primaryButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		gap: 8,
	},
	primaryButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
	},
});
