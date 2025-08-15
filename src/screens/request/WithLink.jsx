import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/header";
import LinkCard from "../../components/link-card";
import { Text } from "../../components/ui/text";
import {
	useConvertToVndMutation,
	useGetRawDataFromUrlMutation,
} from "../../services/gshopApi";

export default function WithLink({ navigation }) {
	const insets = useSafeAreaInsets();
	const [productLinks, setProductLinks] = useState([
		{ link: "", status: "idle", data: null, error: null },
	]);
	const [showInstructions, setShowInstructions] = useState(false);
	const MAX_LINKS = 5;

	// RTK Query hooks
	const [getRawDataFromUrl] = useGetRawDataFromUrlMutation();
	const [convertToVnd] = useConvertToVndMutation();

	// Simple validation functions
	const isValidUrl = (string) => {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	};

	// Helper function to extract platform from URL
	const extractPlatform = (url) => {
		const urlLower = url.toLowerCase();
		if (urlLower.includes("amazon")) return "Amazon";
		if (urlLower.includes("aliexpress")) return "AliExpress";
		if (urlLower.includes("ebay")) return "eBay";
		if (urlLower.includes("shopee")) return "Shopee";
		if (urlLower.includes("lazada")) return "Lazada";
		if (urlLower.includes("tiki")) return "Tiki";
		if (urlLower.includes("sendo")) return "Sendo";
		return "Unknown";
	};

	// Helper function to extract currency from price string
	const extractCurrency = (priceString) => {
		if (!priceString) return "USD";
		const price = priceString.toString().toLowerCase();
		if (price.includes("$") || price.includes("usd")) return "USD";
		if (price.includes("€") || price.includes("eur")) return "EUR";
		if (price.includes("£") || price.includes("gbp")) return "GBP";
		if (price.includes("¥") || price.includes("jpy")) return "JPY";
		if (price.includes("₫") || price.includes("vnd")) return "VND";
		return "USD"; // Default to USD
	};

	// Helper function to extract numeric value from price string
	const extractPrice = (priceString) => {
		if (!priceString) return 0;
		// Remove all non-numeric characters except dots and commas
		const cleaned = priceString.toString().replace(/[^\d.,]/g, "");
		// Replace commas with dots for consistent decimal parsing
		const normalized = cleaned.replace(/,/g, ".");
		return parseFloat(normalized) || 0;
	};

	const parseProductLink = async (link) => {
		try {
			console.log("=== PARSING PRODUCT LINK ===");
			console.log("URL:", link);

			// Update status to show AI is working
			const newLinks = [...productLinks];
			const linkIndex = newLinks.findIndex((item) => item.link === link);
			if (linkIndex !== -1) {
				newLinks[linkIndex] = {
					...newLinks[linkIndex],
					status: "ai-processing",
				};
				setProductLinks(newLinks);
			}

			// Call real API to get raw data
			console.log("Calling getRawDataFromUrl with:", link);
			const rawDataResponse = await getRawDataFromUrl(link);
			console.log("Raw data response:", rawDataResponse);
			console.log("Raw data response error:", rawDataResponse.error);
			console.log("Raw data response data:", rawDataResponse.data);

			if (rawDataResponse.error) {
				console.error("API Error details:", rawDataResponse.error);
				console.error("Error status:", rawDataResponse.error.status);
				console.error("Error data:", rawDataResponse.error.data);
				console.error(
					"Error message:",
					rawDataResponse.error.data?.message
				);
				throw new Error(
					"API_ERROR: " +
						(rawDataResponse.error.data?.message ||
							rawDataResponse.error.message ||
							"Failed to fetch product data")
				);
			}

			const rawData = rawDataResponse.data;
			if (!rawData || !rawData.name) {
				throw new Error("NO_DATA");
			}

			// Extract platform from URL
			const platform = extractPlatform(link);

			// Extract price and currency
			const priceValue = extractPrice(rawData.price);
			const currency = extractCurrency(rawData.price);

			console.log("Extracted price:", priceValue, currency);

			// Convert to VND if not already VND
			let convertedPrice = priceValue;
			let exchangeRate = 1;

			if (currency !== "VND" && priceValue > 0) {
				try {
					console.log(
						"Converting currency:",
						priceValue,
						currency,
						"to VND"
					);
					const conversionResponse = await convertToVnd({
						amount: priceValue,
						fromCurrency: currency,
					});
					console.log("Conversion response:", conversionResponse);

					if (conversionResponse.error) {
						console.error(
							"Currency conversion failed:",
							conversionResponse.error
						);
					} else if (
						conversionResponse.data &&
						conversionResponse.data.convertedAmount
					) {
						convertedPrice =
							conversionResponse.data.convertedAmount;
						exchangeRate =
							conversionResponse.data.exchangeRate ||
							convertedPrice / priceValue;
					}
				} catch (conversionError) {
					console.error(
						"Currency conversion failed:",
						conversionError
					);
					// Continue without conversion
				}
			}

			// Format the response data
			const formattedData = {
				name: rawData.name || "Sản phẩm",
				description: rawData.description || "",
				price: rawData.price || "0",
				convertedPrice: convertedPrice,
				currency: currency,
				exchangeRate: exchangeRate,
				images: rawData.images || [],
				platform: platform,
				brand: rawData.brand || "",
				category: rawData.category || "",
				material: rawData.material || "",
				// Remove origin field as requested
				productLink: link,
				// Fields for user to fill: size, color, quantity
				size: "",
				color: "",
				quantity: 1,
			};

			console.log("Formatted product data:", formattedData);
			return formattedData;
		} catch (error) {
			console.error("Product parsing error:", error);

			// Handle different error types
			if (error.message === "NO_DATA") {
				throw new Error("NO_DATA");
			} else if (error.message.includes("API Error")) {
				throw new Error("API_ERROR");
			} else {
				throw new Error("UNKNOWN_ERROR");
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

			// Try to parse the product data using real API
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
						"Không thể lấy thông tin sản phẩm từ link này";
					break;
				case "API_ERROR":
					errorMessage = "Lỗi kết nối API. Vui lòng thử lại";
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
		const products = validLinks.map((item, index) => ({
			id: `withlink_${index}`,
			name: item.data.name,
			description: item.data.description,
			price: item.data.price,
			convertedPrice: item.data.convertedPrice,
			currency: item.data.currency,
			exchangeRate: item.data.exchangeRate,
			images: item.data.images,
			platform: item.data.platform,
			productLink: item.link,
			brand: item.data.brand,
			category: item.data.category,
			material: item.data.material,
			// User fillable fields
			size: item.data.size || "",
			color: item.data.color || "",
			quantity: item.data.quantity || 1,
			mode: "fromLink", // Identify this as fromLink mode
		}));

		console.log("Navigating to ProductDetails with products:", products);

		// Navigate to ProductDetails with all valid products
		navigation.navigate("ProductDetails", {
			mode: "fromLink",
			products: products,
		});
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			{/* Header */}
			<Header
				title="Dán link sản phẩm"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
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
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingBottom: 2 + Math.max(insets.bottom, 0) },
				]}
				bounces={true}
				alwaysBounceVertical={false}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="interactive"
				nestedScrollEnabled={true}
				automaticallyAdjustKeyboardInsets={true}
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
			<View
				style={[
					styles.bottomContainer,
					{ paddingBottom: Math.max(insets.bottom, 16) },
				]}
			>
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
		</KeyboardAvoidingView>
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
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 5,
		// paddingBottom is set dynamically with safe area insets
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
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 18,
		paddingVertical: 12,
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
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: 4,
	},
});
