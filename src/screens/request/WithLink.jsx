import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import LinkCard from "../../components/link-card";
import { Text } from "../../components/ui/text";

export default function WithLink({ navigation }) {
	const [productLinks, setProductLinks] = useState([
		{ link: "", status: "idle", data: null, error: null },
	]);
	const [showInstructions, setShowInstructions] = useState(false);
	const MAX_LINKS = 5;

	// Simple validation functions
	const isValidUrl = (string) => {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	};

	const parseProductLink = async (link) => {
		try {
			// Call your actual backend API here
			const response = await fetch("/api/parse-product-link", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url: link }),
			});

			if (!response.ok) {
				throw new Error("Failed to parse product link");
			}

			const data = await response.json();
			return data;
		} catch (_error) {
			// For demo purposes, simulate different scenarios
			const url = link.toLowerCase();
			const shouldSucceed = Math.random() > 0.3;

			if (shouldSucceed) {
				// Mock data based on platform
				let mockData = {
					title: "Sample Product Title",
					price: "$99.99",
					image: "https://via.placeholder.com/150",
					platform: "Unknown",
					exchangeRate: 25000, // Tỉ giá hiện tại
				};

				if (url.includes("amazon")) {
					mockData = {
						title: "Apple iPhone 15 Pro Max",
						price: "$1,199.00",
						image: "https://via.placeholder.com/150",
						platform: "Amazon",
						exchangeRate: 25000,
					};
				} else if (url.includes("aliexpress")) {
					mockData = {
						title: "Wireless Bluetooth Headphones",
						price: "$29.99",
						image: "https://via.placeholder.com/150",
						platform: "AliExpress",
						exchangeRate: 25000,
					};
				} else if (url.includes("ebay")) {
					mockData = {
						title: "Vintage Nike Air Jordan 1",
						price: "$150.00",
						image: "https://via.placeholder.com/150",
						platform: "eBay",
						exchangeRate: 25000,
					};
				}

				return mockData;
			} else {
				throw new Error("NO_DATA");
			}
		}
	};

	const handleAddLink = () => {
		if (productLinks.length >= MAX_LINKS) {
			return;
		}
		setProductLinks([
			...productLinks,
			{ link: "", status: "idle", data: null, error: null },
		]);
	};

	const handleRemoveLink = (index) => {
		if (productLinks.length > 1) {
			const newLinks = productLinks.filter((_, i) => i !== index);
			setProductLinks(newLinks);
		}
	};

	const handleLinkChange = async (index, link) => {
		const newLinks = [...productLinks];
		newLinks[index] = {
			link,
			status: "validating",
			data: null,
			error: null,
		};
		setProductLinks(newLinks);

		if (link.trim() === "") {
			newLinks[index] = { link, status: "idle", data: null, error: null };
			setProductLinks(newLinks);
			return;
		}

		try {
			// Validate URL format first
			if (!isValidUrl(link)) {
				newLinks[index] = {
					link,
					status: "error",
					data: null,
					error: "Link không hợp lệ (sai định dạng URL)",
				};
				setProductLinks(newLinks);
				return;
			}

			// Try to parse the product data
			const data = await parseProductLink(link);
			newLinks[index] = {
				link,
				status: "success",
				data,
				error: null,
			};
			setProductLinks(newLinks);
		} catch (error) {
			let errorMessage;
			switch (error.message) {
				case "INVALID_URL":
					errorMessage = "Link không hợp lệ (sai định dạng URL)";
					break;
				case "NO_DATA":
					errorMessage =
						"Link hợp lệ nhưng không lấy được dữ liệu sản phẩm";
					break;
				default:
					errorMessage = "Có lỗi xảy ra khi xử lý link";
			}

			newLinks[index] = {
				link,
				status: "error",
				data: null,
				error: errorMessage,
			};
			setProductLinks(newLinks);
		}
	};

	const handleCheckProducts = () => {
		const validLinks = productLinks.filter(
			(item) => item.link.trim() !== "" && item.status === "success"
		);

		if (validLinks.length === 0) {
			return;
		}

		// Convert all valid products to format expected by ProductDetails
		const products = validLinks.map((item) => ({
			title: item.data.title,
			price: item.data.price,
			image: item.data.image,
			platform: item.data.platform,
			productLink: item.link, // Truyền link gốc
			exchangeRate: item.data.exchangeRate, // Truyền tỉ giá
			// Add more fields as needed
		}));

		// Navigate to ProductDetails with all valid products
		navigation.navigate("ProductDetails", {
			mode: "fromLink",
			products: products,
		});
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

			{/* Help Button */}
			<View style={styles.helpButtonContainer}>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() => setShowInstructions(!showInstructions)}
				>
					<Ionicons
						name="information-circle-outline"
						size={20}
						color="#42A5F5"
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Collapsible Instructions */}
				{showInstructions && (
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
								Dán link sản phẩm từ các trang thương mại điện
								tử để chúng tôi hỗ trợ kiểm tra và mua hàng giúp
								bạn. Bạn có thể thêm tối đa {MAX_LINKS} sản
								phẩm.
							</Text>
						</View>
					</View>
				)}

				{/* Product Links */}
				{productLinks.map((item, index) => (
					<LinkCard
						key={index}
						index={index}
						link={item.link}
						status={item.status}
						data={item.data}
						error={item.error}
						onRemove={() => handleRemoveLink(index)}
						onLinkChange={(text) => handleLinkChange(index, text)}
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
						productLinks.filter(
							(item) =>
								item.link.trim() !== "" &&
								item.status === "success"
						).length === 0 && styles.disabledButton,
					]}
					onPress={handleCheckProducts}
					disabled={
						productLinks.filter(
							(item) =>
								item.link.trim() !== "" &&
								item.status === "success"
						).length === 0
					}
				>
					<LinearGradient
						colors={
							productLinks.filter(
								(item) =>
									item.link.trim() !== "" &&
									item.status === "success"
							).length === 0
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
	helpButtonContainer: {
		alignItems: "flex-end",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 5,
	},
	helpButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		paddingVertical: 6,
		paddingHorizontal: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#E8F2FF",
	},
	helpButtonText: {
		fontSize: 12,
		color: "#42A5F5",
		fontWeight: "500",
		marginLeft: 4,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {
		paddingTop: 5,
		paddingBottom: 100,
	},
	instructionCard: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 20,
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#BBDEFB",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 2,
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
