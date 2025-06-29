import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import LinkCard from "../../components/link-card";
import { Text } from "../../components/ui/text";

export default function WithLink({ navigation }) {
	const [productLinks, setProductLinks] = useState([""]);
	const MAX_LINKS = 5;

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
						navigation.goBack();
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
							Chọn sàn thương mại và dán link sản phẩm để chúng
							tôi hỗ trợ kiểm tra và mua hàng giúp bạn. Bạn có thể
							thêm tối đa {MAX_LINKS} sản phẩm.
						</Text>
					</View>
				</View>

				{/* Product Links */}
				{productLinks.map((link, index) => (
					<LinkCard
						key={index}
						index={index}
						onRemove={() => handleRemoveLink(index)}
						onLinkChange={(newLink) =>
							handleLinkChange(index, newLink)
						}
						canRemove={productLinks.length > 1}
					/>
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
	addButton: {
		backgroundColor: "#F0F8FF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#42A5F5",
		borderStyle: "dashed",
		paddingVertical: 16,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	addButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#42A5F5",
		marginLeft: 8,
	},
	warningCard: {
		backgroundColor: "#FFF3CD",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#FFEAA7",
	},
	warningText: {
		fontSize: 14,
		color: "#856404",
		marginLeft: 12,
		flex: 1,
	},
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
	},
	submitButton: {
		borderRadius: 12,
		overflow: "hidden",
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
