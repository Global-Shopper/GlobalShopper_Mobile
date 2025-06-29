import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Text } from "../../components/ui/text";

export default function PurchaseProcess() {
	return (
		<View style={styles.processContainer}>
			<Text style={styles.sectionTitle}>Quy trình mua hàng</Text>

			<View style={styles.timelineContainer}>
				{/* Step 1 */}
				<View style={styles.timelineStep}>
					<View style={styles.timelineLeft}>
						<View
							style={[
								styles.stepNumber,
								{ backgroundColor: "#1976D2" },
							]}
						>
							<Text style={styles.stepNumberText}>1</Text>
						</View>
						<View style={styles.timelineLine} />
					</View>
					<View style={styles.timelineRight}>
						<LinearGradient
							colors={["#E3F2FD", "#BBDEFB"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.timelineCard}
						>
							<View style={styles.timelineIcon}>
								<Ionicons
									name="send"
									size={24}
									color="#1976D2"
								/>
							</View>
							<Text style={styles.timelineTitle}>
								Gửi yêu cầu
							</Text>
							<Text style={styles.timelineDescription}>
								Gửi link sản phẩm hoặc mô tả chi tiết sản phẩm bạn muốn mua
							</Text>
							<View style={styles.timelineFeatures}>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Hỗ trợ 24/7
									</Text>
								</View>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Tư vấn miễn phí
									</Text>
								</View>
							</View>
						</LinearGradient>
					</View>
				</View>

				{/* Step 2 */}
				<View style={styles.timelineStep}>
					<View style={styles.timelineLeft}>
						<View
							style={[
								styles.stepNumber,
								{ backgroundColor: "#F57C00" },
							]}
						>
							<Text style={styles.stepNumberText}>2</Text>
						</View>
						<View style={styles.timelineLine} />
					</View>
					<View style={styles.timelineRight}>
						<LinearGradient
							colors={["#FFF8E1", "#FFECB3"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.timelineCard}
						>
							<View style={styles.timelineIcon}>
								<Ionicons
									name="calculator"
									size={24}
									color="#F57C00"
								/>
							</View>
							<Text style={styles.timelineTitle}>
								Nhận báo giá
							</Text>
							<Text style={styles.timelineDescription}>
								GShop báo giá chi tiết bao gồm giá sản phẩm, phí dịch vụ và vận chuyển
							</Text>
							<View style={styles.timelineFeatures}>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Báo giá minh bạch
									</Text>
								</View>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Không phí ẩn
									</Text>
								</View>
							</View>
						</LinearGradient>
					</View>
				</View>

				{/* Step 3 */}
				<View style={styles.timelineStep}>
					<View style={styles.timelineLeft}>
						<View
							style={[
								styles.stepNumber,
								{ backgroundColor: "#2E7D32" },
							]}
						>
							<Text style={styles.stepNumberText}>3</Text>
						</View>
						<View style={styles.timelineLine} />
					</View>
					<View style={styles.timelineRight}>
						<LinearGradient
							colors={["#E8F5E8", "#C8E6C9"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.timelineCard}
						>
							<View style={styles.timelineIcon}>
								<Ionicons
									name="card"
									size={24}
									color="#2E7D32"
								/>
							</View>
							<Text style={styles.timelineTitle}>
								Thanh toán
							</Text>
							<Text style={styles.timelineDescription}>
								Thanh toán an toàn qua ví điện tử, chuyển khoản hoặc thẻ tín dụng
							</Text>
							<View style={styles.timelineFeatures}>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Bảo mật 100%
									</Text>
								</View>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Đa phương thức
									</Text>
								</View>
							</View>
						</LinearGradient>
					</View>
				</View>

				{/* Step 4 */}
				<View style={styles.timelineStep}>
					<View style={styles.timelineLeft}>
						<View
							style={[
								styles.stepNumber,
								{ backgroundColor: "#7B1FA2" },
							]}
						>
							<Text style={styles.stepNumberText}>4</Text>
						</View>
					</View>
					<View style={styles.timelineRight}>
						<LinearGradient
							colors={["#F3E5F5", "#E1BEE7"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.timelineCard}
						>
							<View style={styles.timelineIcon}>
								<Ionicons
									name="airplane"
									size={24}
									color="#7B1FA2"
								/>
							</View>
							<Text style={styles.timelineTitle}>
								Nhận hàng
							</Text>
							<Text style={styles.timelineDescription}>
								Theo dõi đơn hàng realtime và nhận hàng tại địa chỉ bạn chỉ định
							</Text>
							<View style={styles.timelineFeatures}>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Theo dõi realtime
									</Text>
								</View>
								<View style={styles.featureTag}>
									<Text style={styles.featureTagText}>
										Giao hàng tận nơi
									</Text>
								</View>
							</View>
						</LinearGradient>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	processContainer: {
		marginTop: 32,
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 16,
	},
	timelineContainer: {
		paddingLeft: 8,
	},
	timelineStep: {
		flexDirection: "row",
		marginBottom: 24,
	},
	timelineLeft: {
		alignItems: "center",
		marginRight: 16,
		width: 40,
	},
	stepNumber: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	stepNumberText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	timelineLine: {
		width: 2,
		flex: 1,
		backgroundColor: "#E0E0E0",
		marginTop: 4,
	},
	timelineRight: {
		flex: 1,
	},
	timelineCard: {
		padding: 20,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	timelineIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	timelineTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
		marginBottom: 8,
	},
	timelineDescription: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		marginBottom: 12,
	},
	timelineFeatures: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	featureTag: {
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.5)",
	},
	featureTagText: {
		fontSize: 12,
		color: "#333",
		fontWeight: "500",
	},
});
