import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function WithLink({ navigation }) {
	const [productLinks, setProductLinks] = useState([""]);
	const MAX_LINKS = 5;

	const isValidUrl = (string) => {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	};

	const handleAddLink = () => {
		if (productLinks.length >= MAX_LINKS) {
			Alert.alert(
				"Giới hạn số lượng",
				`Bạn chỉ có thể thêm tối đa ${MAX_LINKS} link sản phẩm.`
			);
			return;
		}
		setProductLinks([...productLinks, ""]);
	};

	const handleRemoveLink = (index) => {
		if (productLinks.length > 1) {
			const newLinks = productLinks.filter((_, i) => i !== index);
			setProductLinks(newLinks);
		}
	};

	const handleLinkChange = (index, link) => {
		const newLinks = [...productLinks];
		newLinks[index] = link;
		setProductLinks(newLinks);
	};

	const handleCheckProducts = () => {
		const validLinks = productLinks.filter((link) => link.trim() !== "");

		if (validLinks.length === 0) {
			Alert.alert("Lỗi", "Vui lòng nhập ít nhất một link sản phẩm");
			return;
		}

		// Check for invalid URLs
		const invalidLinks = validLinks.filter((link) => !isValidUrl(link));
		if (invalidLinks.length > 0) {
			Alert.alert(
				"Lỗi",
				"Vui lòng kiểm tra lại các link sản phẩm không hợp lệ"
			);
			return;
		}

		Alert.alert(
			"Xác nhận kiểm tra",
			`Bạn có muốn kiểm tra ${validLinks.length} sản phẩm này?`,
			[
				{ text: "Hủy", style: "cancel" },
				{
					text: "Kiểm tra",
					onPress: () => {
						// Handle check logic here
						console.log("Check products:", validLinks);
						Alert.alert(
							"Thành công",
							"Yêu cầu kiểm tra đã được gửi thành công",
							[
								{
									text: "OK",
									onPress: () => navigation.goBack(),
								},
							]
						);
					},
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Dán link sản phẩm"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onNotificationPress={() => console.log("Notification pressed")}
				onChatPress={() => console.log("Chat pressed")}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Instructions */}
				<View style={styles.instructionCard}>
					<Ionicons
						name="information-circle"
						size={24}
						color="#42A5F5"
					/>
					<View style={styles.instructionText}>
						<Text style={styles.instructionTitle}>
							Hướng dẫn sử dụng
						</Text>
						<Text style={styles.instructionDesc}>
							Dán link sản phẩm từ bất kỳ trang thương mại điện tử
							nào để chúng tôi hỗ trợ kiểm tra và mua hàng giúp
							bạn. Bạn có thể thêm tối đa {MAX_LINKS} sản phẩm.
						</Text>
					</View>
				</View>

				{/* Product Links */}
				{productLinks.map((link, index) => (
					<View key={index} style={styles.linkCard}>
						<View style={styles.cardHeader}>
							<View style={styles.cardTitleContainer}>
								<View style={styles.numberBadge}>
									<Text style={styles.numberText}>
										{index + 1}
									</Text>
								</View>
								<Text style={styles.cardTitle}>
									Sản phẩm {index + 1}
								</Text>
							</View>
							{productLinks.length > 1 && (
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => handleRemoveLink(index)}
								>
									<Ionicons
										name="close-circle"
										size={24}
										color="#dc3545"
									/>
								</TouchableOpacity>
							)}
						</View>

						<View style={styles.inputSection}>
							<View
								style={[
									styles.inputContainer,
									link &&
										!isValidUrl(link) &&
										styles.errorInput,
								]}
							>
								<Ionicons
									name="link-outline"
									size={20}
									color={
										link && !isValidUrl(link)
											? "#dc3545"
											: "#42A5F5"
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.textInput}
									placeholder="Dán link sản phẩm tại đây..."
									placeholderTextColor="#9E9E9E"
									value={link}
									onChangeText={(text) =>
										handleLinkChange(index, text)
									}
									multiline
									numberOfLines={2}
									autoCapitalize="none"
									keyboardType="url"
								/>
								{link && isValidUrl(link) && (
									<View style={styles.validIcon}>
										<Ionicons
											name="checkmark-circle"
											size={20}
											color="#4CAF50"
										/>
									</View>
								)}
							</View>
							{link && !isValidUrl(link) && (
								<View style={styles.errorContainer}>
									<Ionicons
										name="warning"
										size={14}
										color="#dc3545"
									/>
									<Text style={styles.errorText}>
										Link không hợp lệ. Vui lòng kiểm tra
										lại.
									</Text>
								</View>
							)}
						</View>
					</View>
				))}

				{/* Add Link Button */}
				{productLinks.length < MAX_LINKS && (
					<TouchableOpacity
						style={styles.addButton}
						onPress={handleAddLink}
					>
						<Ionicons name="add" size={20} color="#42A5F5" />
						<Text style={styles.addButtonText}>
							Thêm link sản phẩm ({productLinks.length}/
							{MAX_LINKS})
						</Text>
					</TouchableOpacity>
				)}

				{productLinks.length >= MAX_LINKS && (
					<View style={styles.warningCard}>
						<Ionicons name="warning" size={20} color="#FF9800" />
						<Text style={styles.warningText}>
							Bạn đã đạt giới hạn tối đa {MAX_LINKS} sản phẩm
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Check Button */}
			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.submitButton,
						productLinks.filter((link) => link.trim() !== "")
							.length === 0 && styles.disabledButton,
					]}
					onPress={handleCheckProducts}
					disabled={
						productLinks.filter((link) => link.trim() !== "")
							.length === 0
					}
				>
					<LinearGradient
						colors={
							productLinks.filter((link) => link.trim() !== "")
								.length === 0
								? ["#CCC", "#999"]
								: ["#42A5F5", "#1976D2"]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.buttonGradient}
					>
						<Ionicons
							name="search-outline"
							size={20}
							color="#FFFFFF"
						/>
						<Text style={styles.buttonText}>Kiểm tra sản phẩm</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {
		paddingTop: 20,
		paddingBottom: 100,
	},
	instructionCard: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#BBDEFB",
	},
	instructionText: {
		flex: 1,
		marginLeft: 12,
	},
	instructionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 4,
	},
	instructionDesc: {
		fontSize: 14,
		color: "#1565C0",
		lineHeight: 20,
	},
	linkCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 18,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E8F2FF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 14,
	},
	cardTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	numberBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#42A5F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	numberText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	removeButton: {
		padding: 4,
	},
	inputSection: {
		marginBottom: 0,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFE",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E7FF",
		paddingVertical: 12,
		paddingHorizontal: 14,
		minHeight: 48,
	},
	inputIcon: {
		marginRight: 10,
	},
	textInput: {
		flex: 1,
		fontSize: 15,
		color: "#333",
		textAlignVertical: "top",
		minHeight: 24,
		paddingVertical: 0,
	},
	validIcon: {
		marginLeft: 8,
	},
	errorInput: {
		borderColor: "#dc3545",
		backgroundColor: "#FFF5F5",
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6,
		marginLeft: 2,
	},
	errorText: {
		fontSize: 12,
		color: "#dc3545",
		marginLeft: 6,
		flex: 1,
	},
	addButton: {
		backgroundColor: "#F0F8FF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#42A5F5",
		borderStyle: "dashed",
		paddingVertical: 14,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 1,
	},
	addButtonText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#42A5F5",
		marginLeft: 8,
	},
	warningCard: {
		backgroundColor: "#FFF3CD",
		borderRadius: 12,
		padding: 14,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#FFD93D",
	},
	warningText: {
		fontSize: 14,
		color: "#856404",
		marginLeft: 10,
		flex: 1,
		fontWeight: "500",
	},
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#E8F2FF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 10,
	},
	submitButton: {
		borderRadius: 14,
		overflow: "hidden",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonGradient: {
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: 8,
	},
});
