import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import ProductForm from "../../components/product-form";

export default function ProductDetails({ navigation, route }) {
	const {
		mode = "manual",
		initialData = null,
		storeData = null,
		products = [],
	} = route.params || {};

	// State for managing multiple products
	const [currentProductIndex, setCurrentProductIndex] = useState(0);
	const [allProducts, setAllProducts] = useState(() => {
		// Initialize products array
		if (mode === "fromLink" && products.length > 0) {
			console.log("ProductDetails - fromLink mode, products:", products);
			return products; // From WithLink screen with parsed products
		} else if (mode === "manual" && initialData) {
			console.log(
				"ProductDetails - manual mode with initialData:",
				initialData
			);
			return [initialData]; // Single product from manual flow
		} else {
			console.log(
				"ProductDetails - default mode, creating empty product"
			);
			return [{}]; // Start with one empty product
		}
	});

	const handleProductDataChange = (productData) => {
		// Save data real-time when user types
		const updatedProducts = [...allProducts];
		updatedProducts[currentProductIndex] = productData;
		setAllProducts(updatedProducts);
	};

	const switchToProduct = (index) => {
		// No need to manually save since data is saved real-time via onChange
		setCurrentProductIndex(index);
	};

	const handleSubmit = (productData) => {
		console.log("Product data submitted:", productData);

		// Update the current product data
		const updatedProducts = [...allProducts];
		updatedProducts[currentProductIndex] = productData;
		setAllProducts(updatedProducts);

		// navigate về màn trước và truyền data
		navigation.navigate("OrderConfirmation", {
			products: updatedProducts,
			storeData,
			mode,
		});
	};

	const addNewProduct = () => {
		if (mode === "manual" && allProducts.length >= 5) {
			// Maximum 5 products allowed in manual mode
			return;
		}
		setAllProducts([...allProducts, {}]);
		setCurrentProductIndex(allProducts.length);
	};

	const removeProduct = (index) => {
		if (allProducts.length > 1) {
			const updatedProducts = allProducts.filter((_, i) => i !== index);
			setAllProducts(updatedProducts);
			if (currentProductIndex >= updatedProducts.length) {
				setCurrentProductIndex(updatedProducts.length - 1);
			}
		}
	};

	const getHeaderTitle = () => {
		switch (mode) {
			case "fromLink":
				return "Chi tiết sản phẩm";
			case "manual":
				return "Thông tin sản phẩm";
			default:
				return "Chi tiết sản phẩm";
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "padding"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
		>
			{/* Header */}
			<Header
				title={getHeaderTitle()}
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>

			{/* Product Tabs - Show when multiple products OR manual mode */}
			{console.log(
				"ProductDetails - allProducts.length:",
				allProducts.length,
				"mode:",
				mode
			)}
			{(allProducts.length > 1 || mode === "manual") && (
				<View style={styles.tabContainer}>
					{console.log("ProductDetails - Rendering tabs")}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.tabScrollView}
					>
						{allProducts.map((_, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.tab,
									currentProductIndex === index &&
										styles.activeTab,
								]}
								onPress={() => switchToProduct(index)}
							>
								<Text
									style={[
										styles.tabText,
										currentProductIndex === index &&
											styles.activeTabText,
									]}
								>
									Sản phẩm {index + 1}
								</Text>
								{allProducts.length > 1 &&
									mode === "manual" && (
										<TouchableOpacity
											style={styles.removeTabButton}
											onPress={() => removeProduct(index)}
										>
											<Ionicons
												name="close"
												size={16}
												color="#666"
											/>
										</TouchableOpacity>
									)}
							</TouchableOpacity>
						))}

						{/* Add new product button for manual mode */}
						{mode === "manual" && allProducts.length < 5 && (
							<TouchableOpacity
								style={styles.addTab}
								onPress={addNewProduct}
							>
								<Ionicons
									name="add"
									size={18}
									color="#6c757d"
								/>
							</TouchableOpacity>
						)}
					</ScrollView>
				</View>
			)}

			{/* Product Form */}
			<ProductForm
				initialData={allProducts[currentProductIndex]}
				mode={mode}
				storeData={storeData}
				onSubmit={handleSubmit}
				onChange={handleProductDataChange}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	tabContainer: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	tabScrollView: {
		flexGrow: 0,
	},
	tab: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 8,
		backgroundColor: "#f8f9fa",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#dee2e6",
	},
	activeTab: {
		backgroundColor: "#4A90E2",
		borderColor: "#4A90E2",
	},
	tabText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#6c757d",
	},
	activeTabText: {
		color: "#fff",
	},
	removeTabButton: {
		marginLeft: 8,
		padding: 2,
	},
	addTab: {
		alignItems: "center",
		justifyContent: "center",
		width: 36,
		height: 36,
		borderWidth: 1,
		borderColor: "#dee2e6",
		borderStyle: "dashed",
		borderRadius: 18,
		backgroundColor: "#f8f9fa",
	},
});
