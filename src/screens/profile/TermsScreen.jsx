import React from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TermsScreen({ navigation }) {
	const termsData = [
		{
			id: 1,
			title: "1. Chấp nhận điều khoản",
			content: "Khi sử dụng ứng dụng GShop hoặc bất kỳ dịch vụ nào của chúng tôi, bạn đồng ý với các điều khoản sử dụng này. Nếu bạn không đồng ý, vui lòng không tiếp tục sử dụng dịch vụ."
		},
		{
			id: 2,
			title: "2. Dịch vụ GShop cung cấp",
			content: "GShop là nền tảng hỗ trợ người dùng tại Việt Nam mua hàng từ các sàn thương mại điện tử quốc tế như Amazon, eBay, Taobao, v.v. GShop đóng vai trò trung gian mua hộ, xử lý thanh toán, vận chuyển và hỗ trợ người dùng trong quá trình đặt hàng."
		},
		{
			id: 3,
			title: "3. Tài khoản người dùng",
			content: "• Người dùng phải cung cấp thông tin cá nhân chính xác, hợp pháp và cập nhật.\n\n• Bạn có trách nhiệm bảo mật thông tin tài khoản (mật khẩu, OTP, v.v.).\n\n• GShop có quyền tạm khóa hoặc huỷ tài khoản nếu phát hiện hành vi vi phạm, gian lận hoặc lạm dụng dịch vụ."
		},
		{
			id: 4,
			title: "4. Thanh toán & ví điện tử",
			content: "• Người dùng cần nạp tiền vào ví GShop để thực hiện giao dịch.\n\n• Số dư ví không được quy đổi thành tiền mặt trừ khi yêu cầu rút tiền hợp lệ.\n\n• GShop không chịu trách nhiệm với các khoản thanh toán sai thông tin do người dùng nhập sai."
		},
		{
			id: 5,
			title: "5. Phí dịch vụ và báo giá",
			content: "• GShop sẽ thông báo rõ mức phí dịch vụ trước khi người dùng xác nhận mua hàng.\n\n• Giá báo đã bao gồm phí mua hộ, thuế (nếu có) và phí vận chuyển quốc tế dự kiến.\n\n• Giá có thể thay đổi nếu có chênh lệch tỷ giá hoặc phí phát sinh từ nhà cung cấp."
		},
		{
			id: 6,
			title: "6. Giao hàng & vận chuyển",
			content: "• Thời gian giao hàng phụ thuộc vào quốc gia mua hàng, nhà cung cấp, hải quan và đơn vị vận chuyển.\n\n• GShop không cam kết tuyệt đối về thời gian cụ thể.\n\n• GShop không chịu trách nhiệm với các trường hợp chậm trễ do bất khả kháng (thiên tai, cấm vận, dịch bệnh,...)."
		},
		{
			id: 7,
			title: "7. Chính sách hoàn tiền",
			content: "GShop hoàn tiền trong các trường hợp sau:\n\n• Không thể mua hàng\n• Người dùng huỷ yêu cầu trước khi xử lý\n• Sự cố từ phía GShop\n\nThời gian hoàn tiền: trong vòng 3–5 ngày làm việc."
		},
		{
			id: 8,
			title: "8. Giới hạn trách nhiệm",
			content: "• GShop là đơn vị trung gian, không sản xuất hay bảo hành sản phẩm.\n\n• Mọi khiếu nại về chất lượng sản phẩm sẽ được chuyển đến nhà bán và xử lý theo từng trường hợp cụ thể.\n\n• GShop không chịu trách nhiệm với sản phẩm bị lỗi kỹ thuật từ phía nhà cung cấp."
		},
		{
			id: 9,
			title: "9. Quyền sở hữu trí tuệ",
			content: "• Toàn bộ nội dung, giao diện và mã nguồn của ứng dụng GShop thuộc sở hữu của GShop.\n\n• Người dùng không được sao chép, sửa đổi, phân phối nội dung GShop nếu không có sự cho phép bằng văn bản."
		},
		{
			id: 10,
			title: "10. Thay đổi điều khoản",
			content: "GShop có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Những thay đổi sẽ được thông báo trong ứng dụng hoặc qua email. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản thay đổi đồng nghĩa với việc bạn đồng ý với điều khoản mới."
		}
	];

	const renderTermsSection = (section) => (
		<View key={section.id} style={styles.termSection}>
			<Text style={styles.termTitle}>{section.title}</Text>
			<Text style={styles.termContent}>{section.content}</Text>
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
					<Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Header info */}
				<View style={styles.headerInfo}>
					<Text style={styles.titleMain}>ĐIỀU KHOẢN SỬ DỤNG – GSHOP</Text>
					<View style={styles.lastUpdated}>
						<Ionicons name="time" size={16} color="#666" />
						<Text style={styles.lastUpdatedText}>Cập nhật lần cuối: 27/06/2025</Text>
					</View>
				</View>

				{/* Terms content */}
				<View style={styles.termsContainer}>
					{termsData.map(renderTermsSection)}

					{/* Contact section */}
					<View style={styles.contactSection}>
						<Text style={styles.contactTitle}>11. Liên hệ</Text>
						<Text style={styles.contactText}>
							Nếu bạn có câu hỏi liên quan đến điều khoản sử dụng, vui lòng liên hệ:
						</Text>
						
						<View style={styles.contactInfo}>
							<View style={styles.contactItem}>
								<LinearGradient
									colors={["#4CAF50", "#45A049"]}
									style={styles.contactIcon}
								>
									<Ionicons name="mail" size={16} color="#FFFFFF" />
								</LinearGradient>
								<View style={styles.contactDetail}>
									<Text style={styles.contactLabel}>Email</Text>
									<Text style={styles.contactValue}>support@gshop.vn</Text>
								</View>
							</View>

							<View style={styles.contactItem}>
								<LinearGradient
									colors={["#2196F3", "#1976D2"]}
									style={styles.contactIcon}
								>
									<Ionicons name="call" size={16} color="#FFFFFF" />
								</LinearGradient>
								<View style={styles.contactDetail}>
									<Text style={styles.contactLabel}>Hotline</Text>
									<Text style={styles.contactValue}>1900 1234</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View style={styles.footerContent}>
						<Ionicons name="shield-checkmark" size={20} color="#2196F3" />
						<Text style={styles.footerText}>
							Điều khoản này có hiệu lực kể từ ngày bạn bắt đầu sử dụng dịch vụ GShop
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
	titleMain: {
		fontSize: 22,
		fontWeight: "700",
		color: "#1976D2",
		textAlign: "center",
		marginBottom: 12,
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
	termsContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	termSection: {
		marginBottom: 24,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	termTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 12,
	},
	termContent: {
		fontSize: 14,
		color: "#455A64",
		lineHeight: 22,
		textAlign: "justify",
	},
	contactSection: {
		marginTop: 8,
		paddingTop: 20,
		borderTopWidth: 2,
		borderTopColor: "#E3F2FD",
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
	footer: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		marginBottom: 30,
		borderLeftWidth: 4,
		borderLeftColor: "#2196F3",
	},
	footerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	footerText: {
		fontSize: 14,
		color: "#1976D2",
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
		fontWeight: "500",
	},
});
