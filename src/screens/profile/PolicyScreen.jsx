import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../../components/header";

export default function PolicyScreen({ navigation }) {
	const policyData = [
		{
			id: 1,
			title: "1. Mục đích của chính sách",
			content:
				"Chính sách bảo mật này giải thích cách GShop thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng ứng dụng và dịch vụ của chúng tôi.",
		},
		{
			id: 2,
			title: "2. Thông tin chúng tôi thu thập",
			content:
				"Khi sử dụng GShop, bạn đồng ý cung cấp các loại dữ liệu sau:\n\n• Thông tin cá nhân: Họ tên, số điện thoại, email, địa chỉ giao hàng\n\n• Thông tin tài khoản: Tên đăng nhập, mật khẩu (được mã hóa)\n\n• Giao dịch: Lịch sử nạp/rút ví, đơn hàng, trạng thái xử lý\n\n• Thông tin thiết bị: Loại điện thoại, hệ điều hành, địa chỉ IP, ID thiết bị\n\n• Tương tác trong app: Lượt bấm, hành vi truy cập, phản hồi",
		},
		{
			id: 3,
			title: "3. Mục đích sử dụng dữ liệu",
			content:
				"Chúng tôi sử dụng thông tin thu thập để:\n\n• Xử lý yêu cầu mua hàng và đơn hàng của bạn\n\n• Gửi thông báo về đơn hàng, hỗ trợ hoặc khuyến mãi\n\n• Cải thiện chất lượng dịch vụ và trải nghiệm người dùng\n\n• Đảm bảo an toàn tài khoản, phát hiện gian lận\n\n• Tuân thủ các quy định của pháp luật Việt Nam",
		},
		{
			id: 4,
			title: "4. Lưu trữ & bảo mật thông tin",
			content:
				"• Dữ liệu người dùng được lưu trữ an toàn trên hệ thống máy chủ của GShop hoặc bên thứ ba đạt chuẩn bảo mật.\n\n• GShop áp dụng các biện pháp mã hóa, tường lửa và kiểm soát truy cập để bảo vệ thông tin cá nhân.\n\n• Chúng tôi KHÔNG chia sẻ thông tin cá nhân với bất kỳ bên thứ ba nào nếu không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.",
		},
		{
			id: 5,
			title: "5. Quyền của người dùng",
			content:
				"Bạn có quyền:\n\n• Truy cập và chỉnh sửa thông tin cá nhân bất kỳ lúc nào\n\n• Yêu cầu xóa tài khoản hoặc dữ liệu (theo quy trình xác thực)\n\n• Rút lại sự đồng ý với việc nhận thông báo marketing\n\n• Khiếu nại nếu thấy thông tin của mình bị xử lý sai mục đích",
		},
		{
			id: 6,
			title: "6. Chia sẻ dữ liệu với bên thứ ba",
			content:
				"GShop chỉ chia sẻ dữ liệu trong các trường hợp sau:\n\n• Với đơn vị vận chuyển để giao hàng\n\n• Với bên xử lý thanh toán (ngân hàng, ví điện tử)\n\n• Với nhà cung cấp sản phẩm nếu có vấn đề cần xác minh\n\n• Khi có yêu cầu từ cơ quan chức năng có thẩm quyền",
		},
		{
			id: 7,
			title: "7. Cookie và dữ liệu theo dõi",
			content:
				"Chúng tôi có thể sử dụng cookie hoặc công nghệ tương tự để:\n\n• Ghi nhớ tuỳ chọn của bạn trong ứng dụng\n\n• Phân tích hành vi người dùng nhằm cải thiện giao diện và hiệu suất\n\nBạn có thể tắt cookie trong cài đặt trình duyệt hoặc thiết bị nếu muốn.",
		},
		{
			id: 8,
			title: "8. Thời gian lưu trữ dữ liệu",
			content:
				"Thông tin của bạn sẽ được lưu trữ:\n\n• Trong suốt thời gian bạn sử dụng ứng dụng\n\n• Và tối đa 12 tháng sau khi bạn xoá tài khoản (trừ khi có quy định pháp luật khác)",
		},
		{
			id: 9,
			title: "9. Cập nhật chính sách bảo mật",
			content:
				"GShop có thể cập nhật chính sách bảo mật này theo thời gian. Những thay đổi sẽ được thông báo qua ứng dụng hoặc email. Việc tiếp tục sử dụng dịch vụ được xem là bạn đã đồng ý với chính sách mới.",
		},
	];

	const renderPolicySection = (section) => (
		<View key={section.id} style={styles.policySection}>
			<Text style={styles.policyTitle}>{section.title}</Text>
			<Text style={styles.policyContent}>{section.content}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />

			{/* Header */}
			<Header
				title="Chính sách bảo mật"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				showNotificationIcon={false}
				showChatIcon={false}
			/>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Header info */}
				<View style={styles.headerInfo}>
					<View style={styles.titleContainer}>
						<View style={styles.titleIconBackground}>
							<Ionicons
								name="shield-checkmark"
								size={24}
								color="#FFFFFF"
							/>
						</View>
						<Text style={styles.titleMain}>
							CHÍNH SÁCH BẢO MẬT – GSHOP
						</Text>
					</View>
					<View style={styles.lastUpdated}>
						<Ionicons name="time" size={16} color="#666" />
						<Text style={styles.lastUpdatedText}>
							Cập nhật lần cuối: 27/06/2025
						</Text>
					</View>
				</View>

				{/* Policy content */}
				<View style={styles.policyContainer}>
					{policyData.map(renderPolicySection)}

					{/* Contact section */}
					<View style={styles.contactSection}>
						<Text style={styles.contactTitle}>10. Liên hệ</Text>
						<Text style={styles.contactText}>
							Nếu bạn có bất kỳ câu hỏi nào liên quan đến việc bảo
							mật dữ liệu, vui lòng liên hệ:
						</Text>

						<View style={styles.contactInfo}>
							<View style={styles.contactItem}>
								<View style={styles.contactIconEmail}>
									<Ionicons
										name="mail"
										size={16}
										color="#FFFFFF"
									/>
								</View>
								<View style={styles.contactDetail}>
									<Text style={styles.contactLabel}>
										Email
									</Text>
									<Text style={styles.contactValue}>
										sep490gshop@gmail.com
									</Text>
								</View>
							</View>

							<View style={styles.contactItem}>
								<View style={styles.contactIconPhone}>
									<Ionicons
										name="call"
										size={16}
										color="#FFFFFF"
									/>
								</View>
								<View style={styles.contactDetail}>
									<Text style={styles.contactLabel}>
										Hotline
									</Text>
									<Text style={styles.contactValue}>
										1900 1234
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* Security Features */}
				<View style={styles.securitySection}>
					<Text style={styles.securityTitle}>
						Các biện pháp bảo mật của GShop
					</Text>
					<View style={styles.securityFeatures}>
						<View style={styles.securityItem}>
							<View style={styles.securityIconOrange}>
								<Ionicons
									name="eye-off"
									size={16}
									color="#FFFFFF"
								/>
							</View>
							<Text style={styles.securityText}>
								Không chia sẻ thông tin
							</Text>
						</View>

						<View style={styles.securityItem}>
							<View style={styles.securityIconBlue}>
								<Ionicons
									name="server"
									size={16}
									color="#FFFFFF"
								/>
							</View>
							<Text style={styles.securityText}>
								Máy chủ an toàn đạt chuẩn
							</Text>
						</View>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View style={styles.footerContent}>
						<Ionicons
							name="information-circle"
							size={20}
							color="#4CAF50"
						/>
						<Text style={styles.footerText}>
							Chính sách này áp dụng cho tất cả người dùng GShop
							tại Việt Nam và tuân thủ Luật An toàn thông tin mạng
							2015
						</Text>
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
	headerInfo: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginTop: 20,
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	titleIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	titleMain: {
		fontSize: 18,
		fontWeight: "700",
		color: "#4CAF50",
		textAlign: "center",
		flex: 1,
	},
	lastUpdated: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F8F9FA",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
	},
	lastUpdatedText: {
		fontSize: 14,
		color: "#666",
		marginLeft: 6,
		fontWeight: "500",
	},
	policyContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	policySection: {
		marginBottom: 24,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	policyTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 12,
	},
	policyContent: {
		fontSize: 14,
		color: "#455A64",
		lineHeight: 22,
		textAlign: "justify",
	},
	contactSection: {
		marginTop: 8,
		paddingTop: 20,
		borderTopWidth: 2,
		borderTopColor: "#E8F5E8",
	},
	contactTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 12,
	},
	contactText: {
		fontSize: 14,
		color: "#455A64",
		lineHeight: 20,
		marginBottom: 16,
	},
	contactInfo: {
		gap: 12,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		padding: 12,
		borderRadius: 8,
	},
	contactIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	contactDetail: {
		flex: 1,
	},
	contactLabel: {
		fontSize: 12,
		color: "#78909C",
		marginBottom: 2,
	},
	contactValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#263238",
	},
	securitySection: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	securityTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4CAF50",
		marginBottom: 16,
		textAlign: "center",
	},
	securityFeatures: {
		gap: 12,
	},
	securityItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		padding: 12,
		borderRadius: 8,
	},
	securityIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	securityText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#263238",
		flex: 1,
	},
	footer: {
		backgroundColor: "#E8F5E8",
		borderRadius: 12,
		padding: 16,
		marginBottom: 30,
		borderLeftWidth: 4,
		borderLeftColor: "#4CAF50",
	},
	footerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	titleIconBackground: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#4CAF50",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	contactIconEmail: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#4CAF50",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	contactIconPhone: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#2196F3",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	securityIconOrange: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#FF9800",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	securityIconBlue: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#2196F3",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	footerText: {
		fontSize: 14,
		color: "#2E7D32",
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
		fontWeight: "500",
	},
});
