import React, { useState } from "react";
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

export default function FAQScreen({ navigation }) {
	const [expandedSections, setExpandedSections] = useState({});
	const [expandedQuestions, setExpandedQuestions] = useState({});

	const toggleSection = (sectionId) => {
		setExpandedSections(prev => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

	const toggleQuestion = (questionId) => {
		setExpandedQuestions(prev => ({
			...prev,
			[questionId]: !prev[questionId]
		}));
	};

	const faqData = [
		{
			id: 1,
			title: "MUA HÀNG & YÊU CẦU",
			icon: "bag-handle",
			color: ["#FF9800", "#F57C00"],
			questions: [
				{
					id: "1-1",
					question: "Làm thế nào để tạo yêu cầu mua hàng?",
					answer: "Bạn chỉ cần dán link sản phẩm từ các sàn thương mại điện tử quốc tế vào ô yêu cầu. Nếu không có link, bạn có thể chọn \"Yêu cầu không có link\" và điền thông tin sản phẩm để GShop hỗ trợ tìm kiếm và báo giá."
				},
				{
					id: "1-2",
					question: "GShop hỗ trợ mua hàng từ những sàn nào?",
					answer: "Chúng tôi hỗ trợ mua hàng từ các sàn phổ biến như Amazon, eBay, Taobao, 1688, Shopee quốc tế, v.v. Bạn có thể nhập link từ bất kỳ sàn nào – hệ thống sẽ tự động nhận diện."
				},
				{
					id: "1-3",
					question: "Tôi có thể yêu cầu nhiều sản phẩm cùng lúc không?",
					answer: "Có. Bạn có thể tạo nhiều yêu cầu khác nhau cho từng sản phẩm, hoặc gộp nhiều sản phẩm vào một yêu cầu nếu đến từ cùng một người bán."
				},
				{
					id: "1-4",
					question: "Làm sao để huỷ yêu cầu đã gửi?",
					answer: "Bạn có thể huỷ yêu cầu nếu nó chưa được xử lý. Vào tab \"Yêu cầu\", chọn yêu cầu muốn huỷ và nhấn \"Huỷ yêu cầu\"."
				}
			]
		},
		{
			id: 2,
			title: "ĐƠN HÀNG & VẬN CHUYỂN",
			icon: "cube",
			color: ["#2196F3", "#1976D2"],
			questions: [
				{
					id: "2-1",
					question: "Tôi có thể theo dõi đơn hàng như thế nào?",
					answer: "Vào tab \"Đơn hàng\" để xem trạng thái từng đơn: Đã mua hàng, Đang vận chuyển quốc tế, Đã thông quan, Đang giao nội địa, Đã hoàn tất..."
				},
				{
					id: "2-2",
					question: "Bao lâu hàng sẽ về tới tay tôi?",
					answer: "Thông thường từ 7–15 ngày làm việc tuỳ quốc gia, thời điểm, phương thức vận chuyển và tình trạng hải quan."
				},
				{
					id: "2-3",
					question: "Nếu hàng bị kẹt hải quan thì sao?",
					answer: "GShop sẽ đại diện bạn làm việc với đơn vị vận chuyển và hải quan. Nếu cần cung cấp thêm giấy tờ, chúng tôi sẽ chủ động liên hệ bạn."
				},
				{
					id: "2-4",
					question: "Tôi có thể đổi/trả sản phẩm không?",
					answer: "Vì là dịch vụ mua hộ quốc tế, GShop không hỗ trợ đổi/trả hàng, trừ khi sản phẩm bị sai nghiêm trọng hoặc không đúng mô tả. Bạn có thể yêu cầu hỗ trợ nếu gặp vấn đề."
				}
			]
		},
		{
			id: 3,
			title: "VÍ TIỀN & THANH TOÁN",
			icon: "wallet",
			color: ["#4CAF50", "#45A049"],
			questions: [
				{
					id: "3-1",
					question: "Làm sao để nạp tiền vào ví?",
					answer: "Vào tab \"Ví tiền\" → chọn \"Nạp tiền\" → chọn phương thức chuyển khoản và làm theo hướng dẫn. Sau khi GShop xác nhận nhận được tiền, số dư sẽ được cập nhật."
				},
				{
					id: "3-2",
					question: "Tôi có thể rút tiền khỏi ví không?",
					answer: "Có. Bạn có thể yêu cầu rút tiền về tài khoản ngân hàng nếu không còn nhu cầu sử dụng số dư."
				},
				{
					id: "3-3",
					question: "GShop có hoàn tiền không?",
					answer: "Có. GShop hoàn tiền khi:\n\n• Sản phẩm không mua được\n• Người dùng huỷ yêu cầu đúng quy định\n• Đơn hàng bị lỗi do hệ thống"
				},
				{
					id: "3-4",
					question: "Tôi gặp lỗi khi thanh toán thì làm sao?",
					answer: "Vui lòng kiểm tra kết nối mạng và thử lại. Nếu vẫn không được, bạn có thể liên hệ đội hỗ trợ qua mục \"Gửi yêu cầu hỗ trợ\"."
				}
			]
		},
		{
			id: 4,
			title: "TÀI KHOẢN & BẢO MẬT",
			icon: "shield-checkmark",
			color: ["#9C27B0", "#7B1FA2"],
			questions: [
				{
					id: "4-1",
					question: "Tôi quên mật khẩu, phải làm sao?",
					answer: "Tại màn hình đăng nhập, chọn \"Quên mật khẩu\" và làm theo hướng dẫn để đặt lại mật khẩu qua email hoặc số điện thoại."
				},
				{
					id: "4-2",
					question: "Làm sao để thay đổi số điện thoại?",
					answer: "Vào \"Tài khoản\" → \"Cài đặt tài khoản\" → chỉnh sửa số điện thoại. Bạn sẽ được yêu cầu xác minh lại OTP mới."
				},
				{
					id: "4-3",
					question: "Tôi muốn xoá tài khoản thì làm gì?",
					answer: "Vào \"Tài khoản\" → \"Cài đặt tài khoản\" → chọn \"Yêu cầu xoá tài khoản\". Hệ thống sẽ xác nhận lần cuối trước khi xử lý yêu cầu."
				}
			]
		},
		{
			id: 5,
			title: "CHÍNH SÁCH & HỖ TRỢ",
			icon: "document-text",
			color: ["#FF5722", "#D84315"],
			questions: [
				{
					id: "5-1",
					question: "Phí dịch vụ của GShop được tính như thế nào?",
					answer: "GShop tính phí dịch vụ dựa trên phần trăm giá trị đơn hàng và tuỳ quốc gia. Mức phí sẽ hiển thị rõ ràng trong phần báo giá trước khi bạn xác nhận thanh toán."
				},
				{
					id: "5-2",
					question: "GShop hoạt động vào thời gian nào?",
					answer: "Chúng tôi xử lý yêu cầu và đơn hàng từ 08:00 – 22:00 hàng ngày. Bạn vẫn có thể gửi yêu cầu 24/7 và hệ thống sẽ tiếp nhận tự động."
				},
				{
					id: "5-3",
					question: "Làm sao để liên hệ với GShop?",
					answer: "Bạn có thể gửi yêu cầu qua mục \"Gửi yêu cầu hỗ trợ\", hoặc email đến support@gshop.vn. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc."
				}
			]
		}
	];

	const renderQuestion = (question, sectionColor) => (
		<View key={question.id} style={styles.questionContainer}>
			<TouchableOpacity
				style={styles.questionHeader}
				onPress={() => toggleQuestion(question.id)}
			>
				<Text style={styles.questionText}>{question.question}</Text>
				<Ionicons
					name={expandedQuestions[question.id] ? "chevron-up" : "chevron-down"}
					size={20}
					color="#78909C"
				/>
			</TouchableOpacity>
			
			{expandedQuestions[question.id] && (
				<View style={[styles.answerContainer, { borderLeftColor: sectionColor[0] }]}>
					<Text style={styles.answerText}>{question.answer}</Text>
				</View>
			)}
		</View>
	);

	const renderSection = (section) => (
		<View key={section.id} style={styles.sectionContainer}>
			<TouchableOpacity
				style={styles.sectionHeader}
				onPress={() => toggleSection(section.id)}
			>
				<View style={styles.sectionLeft}>
					<LinearGradient
						colors={section.color}
						style={styles.sectionIconContainer}
					>
						<Ionicons
							name={section.icon}
							size={24}
							color="#FFFFFF"
						/>
					</LinearGradient>
					<Text style={styles.sectionTitle}>{section.title}</Text>
				</View>
				<Ionicons
					name={expandedSections[section.id] ? "chevron-up" : "chevron-down"}
					size={24}
					color="#263238"
				/>
			</TouchableOpacity>

			{expandedSections[section.id] && (
				<View style={styles.questionsContainer}>
					{section.questions.map(question => renderQuestion(question, section.color))}
				</View>
			)}
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
					<Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* FAQ Sections */}
				<View style={styles.faqContainer}>
					{faqData.map(renderSection)}
				</View>

				{/* Contact Support */}
				<View style={styles.supportContainer}>
					<View style={styles.supportHeader}>
						<Ionicons name="headset" size={20} color="#2196F3" />
						<Text style={styles.supportTitle}>Vẫn cần hỗ trợ?</Text>
					</View>
					<Text style={styles.supportText}>
						Nếu không tìm thấy câu trả lời phù hợp, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi:
					</Text>
					<View style={styles.contactMethods}>
						<View style={styles.contactItem}>
							<Ionicons name="mail" size={16} color="#4CAF50" />
							<Text style={styles.contactText}>support@gshop.vn</Text>
						</View>
						<View style={styles.contactItem}>
							<Ionicons name="time" size={16} color="#4CAF50" />
							<Text style={styles.contactText}>Phản hồi trong 24h</Text>
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
	faqContainer: {
		marginTop: 20,
	},
	sectionContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 12,
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
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	sectionLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	sectionIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		flex: 1,
	},
	questionsContainer: {
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	questionContainer: {
		marginBottom: 8,
	},
	questionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 8,
	},
	questionText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#263238",
		flex: 1,
		marginRight: 8,
	},
	answerContainer: {
		backgroundColor: "#F8F9FA",
		padding: 12,
		borderRadius: 8,
		borderLeftWidth: 3,
		marginLeft: 8,
	},
	answerText: {
		fontSize: 14,
		color: "#455A64",
		lineHeight: 20,
	},
	supportContainer: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		marginTop: 20,
		marginBottom: 30,
		borderLeftWidth: 4,
		borderLeftColor: "#2196F3",
	},
	supportHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	supportTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2196F3",
		marginLeft: 8,
	},
	supportText: {
		fontSize: 14,
		color: "#1976D2",
		lineHeight: 20,
		marginBottom: 12,
	},
	contactMethods: {
		gap: 8,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	contactText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#4CAF50",
		marginLeft: 8,
	},
});
