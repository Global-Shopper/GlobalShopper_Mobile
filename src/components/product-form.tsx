import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import StoreForm from "./store-form";
import { Text } from "./ui/text";

interface ProductFormProps {
	initialData?: any;
	mode: "fromLink" | "manual";
	storeData?: any; // Store data from AddStore screen
	onSubmit: (productData: any) => void;
	onChange?: (productData: any) => void; // For real-time data sync
}

interface ProductData {
	name: string;
	description: string;
	image: string | null;
	price: string;
	convertedPrice: string;
	exchangeRate: number;
	category: string;
	brand: string;
	material: string;
	size: string;
	color: string;
	platform: string;
	productLink: string;
	sellerInfo: {
		name: string;
		phone: string;
		email: string;
		address: string;
		storeLink: string;
	};
}

export default function ProductForm({
	initialData,
	mode,
	storeData,
	onSubmit,
	onChange,
}: ProductFormProps) {
	const [formData, setFormData] = useState<ProductData>(() => {
		const initialPrice = initialData?.price || "";
		const initialExchangeRate = initialData?.exchangeRate || 25000;

		// Calculate converted price if price is available
		let initialConvertedPrice = "";
		if (initialPrice && mode === "fromLink") {
			const numericPrice = parseFloat(
				initialPrice.replace(/[^0-9.]/g, "")
			);
			if (!isNaN(numericPrice) && numericPrice > 0) {
				const convertedAmount = Math.round(
					numericPrice * initialExchangeRate
				);
				initialConvertedPrice = convertedAmount.toLocaleString("vi-VN");
			}
		}

		return {
			name: initialData?.title || initialData?.name || "",
			description: initialData?.description || "",
			image: initialData?.image || null,
			price: initialPrice,
			convertedPrice: initialConvertedPrice,
			exchangeRate: initialExchangeRate,
			category: initialData?.category || "",
			brand: initialData?.brand || "",
			material: initialData?.material || "",
			size: initialData?.size || "",
			color: initialData?.color || "",
			platform: initialData?.platform || "",
			productLink: initialData?.productLink || "",
			sellerInfo: {
				name:
					storeData?.storeName || initialData?.sellerInfo?.name || "",
				phone:
					storeData?.phoneNumber ||
					initialData?.sellerInfo?.phone ||
					"",
				email: storeData?.email || initialData?.sellerInfo?.email || "",
				address:
					storeData?.storeAddress ||
					initialData?.sellerInfo?.address ||
					"",
				storeLink:
					storeData?.shopLink ||
					initialData?.sellerInfo?.storeLink ||
					"",
			},
		};
	});

	const handleInputChange = (field: string, value: string) => {
		// Skip convertedPrice as it's read-only and auto-calculated
		if (field === "convertedPrice") {
			return;
		}

		let newFormData = { ...formData };

		if (field.includes("sellerInfo.")) {
			const sellerField = field.split(".")[1];
			newFormData = {
				...formData,
				sellerInfo: {
					...formData.sellerInfo,
					[sellerField]: value,
				},
			};
		} else {
			newFormData = {
				...formData,
				[field]: value,
			};
		}

		setFormData(newFormData);

		// Call onChange if provided for real-time sync
		if (onChange) {
			onChange(newFormData);
		}

		// Auto convert price when price field changes
		if (field === "price") {
			if (value.trim() !== "") {
				convertPrice(value, newFormData);
			} else {
				// Clear converted price when price is empty
				const updatedData = { ...newFormData, convertedPrice: "" };
				setFormData(updatedData);
				if (onChange) {
					onChange(updatedData);
				}
			}
		}
	};

	// Mock API call to convert price
	const convertPrice = async (priceString: string, currentFormData?: any) => {
		try {
			// Extract number from price string (remove $, €, etc.)
			const numericPrice = parseFloat(
				priceString.replace(/[^0-9.]/g, "")
			);

			const formDataToUse = currentFormData || formData;

			if (isNaN(numericPrice) || numericPrice <= 0) {
				const updatedData = { ...formDataToUse, convertedPrice: "" };
				setFormData(updatedData);
				if (onChange) {
					onChange(updatedData);
				}
				return;
			}

			// Use exchange rate from state (from BE API or default)
			const convertedAmount = Math.round(
				numericPrice * formDataToUse.exchangeRate
			);

			// Format number with Vietnamese locale
			const formattedPrice = convertedAmount.toLocaleString("vi-VN");

			const updatedData = {
				...formDataToUse,
				convertedPrice: formattedPrice,
			};
			setFormData(updatedData);
			if (onChange) {
				onChange(updatedData);
			}
		} catch (error) {
			console.log("Error converting price:", error);
			const formDataToUse = currentFormData || formData;
			const updatedData = { ...formDataToUse, convertedPrice: "" };
			setFormData(updatedData);
			if (onChange) {
				onChange(updatedData);
			}
		}
	};

	const pickImage = async () => {
		// Tạm thời hiển thị alert
		Alert.alert(
			"Chọn hình ảnh",
			"Tính năng chọn hình ảnh sẽ được triển khai với expo-image-picker",
			[
				{
					text: "OK",
					onPress: () => {
						// Mock thêm một hình ảnh placeholder
						const updatedData = {
							...formData,
							image: "https://via.placeholder.com/150",
						};
						setFormData(updatedData);
						if (onChange) {
							onChange(updatedData);
						}
					},
				},
				{ text: "Hủy", style: "cancel" },
			]
		);
	};

	const handleStoreChange = (storeData: any) => {
		// Update seller info when store form changes
		const updatedData = {
			...formData,
			sellerInfo: {
				name: storeData.storeName,
				phone: storeData.phoneNumber,
				email: storeData.email,
				address: storeData.storeAddress,
				storeLink: storeData.shopLink,
			},
		};
		setFormData(updatedData);
		if (onChange) {
			onChange(updatedData);
		}
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
			return false;
		}
		// Only validate price for fromLink mode
		if (mode === "fromLink" && !formData.price.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập giá sản phẩm");
			return false;
		}
		// Converted price is auto-calculated, no need to validate manually

		// Only validate seller info for manual mode
		if (mode === "manual") {
			if (!formData.sellerInfo.name.trim()) {
				Alert.alert("Lỗi", "Vui lòng nhập tên người bán");
				return false;
			}
			if (!formData.sellerInfo.address.trim()) {
				Alert.alert("Lỗi", "Vui lòng nhập địa chỉ cửa hàng");
				return false;
			}
			if (!formData.sellerInfo.storeLink.trim()) {
				Alert.alert("Lỗi", "Vui lòng nhập link cửa hàng");
				return false;
			}
		}
		return true;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;
		onSubmit(formData);
	};

	return (
		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.scrollContent}
		>
			{/* Header Info */}
			<View style={styles.headerCard}>
				<Ionicons
					name={mode === "fromLink" ? "link" : "create"}
					size={24}
					color="#42A5F5"
				/>
				<View style={styles.headerText}>
					<Text style={styles.headerTitle}>
						{mode === "fromLink"
							? "Thông tin từ link sản phẩm"
							: "Nhập thông tin sản phẩm"}
					</Text>
					<Text style={styles.headerDesc}>
						{mode === "fromLink"
							? "Kiểm tra và bổ sung thông tin sản phẩm"
							: "Điền đầy đủ thông tin sản phẩm cần mua"}
					</Text>
				</View>
			</View>

			{/* Product Information */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>

				{/* Product Name */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Tên sản phẩm <Text style={styles.required}>*</Text>
					</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="pricetag-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.name}
							onChangeText={(value) =>
								handleInputChange("name", value)
							}
							placeholder="Nhập tên sản phẩm"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Product Link - Only show for fromLink mode */}
				{mode === "fromLink" && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Link sản phẩm</Text>
						<View
							style={[
								styles.inputContainer,
								styles.readOnlyContainer,
							]}
						>
							<Ionicons
								name="link-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={[
									styles.textInput,
									styles.multilineInput,
									styles.readOnlyInput,
								]}
								value={formData.productLink}
								placeholder="Link sản phẩm từ trang web"
								placeholderTextColor="#B0BEC5"
								multiline
								numberOfLines={2}
								textAlignVertical="top"
								editable={false}
								selectTextOnFocus={false}
							/>
							<Ionicons
								name="lock-closed-outline"
								size={16}
								color="#9E9E9E"
								style={styles.lockIcon}
							/>
						</View>
					</View>
				)}

				{/* Description */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Mô tả sản phẩm</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="document-text-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={[styles.textInput, styles.multilineInput]}
							value={formData.description}
							onChangeText={(value) =>
								handleInputChange("description", value)
							}
							placeholder="Nhập mô tả sản phẩm"
							placeholderTextColor="#B0BEC5"
							multiline
							numberOfLines={3}
							textAlignVertical="top"
						/>
					</View>
				</View>

				{/* Product Image */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Hình ảnh sản phẩm</Text>
					<TouchableOpacity
						style={styles.imageContainer}
						onPress={pickImage}
					>
						{formData.image ? (
							<Image
								source={{ uri: formData.image }}
								style={styles.productImage}
							/>
						) : (
							<View style={styles.imagePlaceholder}>
								<Ionicons
									name="camera-outline"
									size={32}
									color="#78909C"
								/>
								<Text style={styles.imagePlaceholderText}>
									Chọn hình ảnh
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>

				{/* Price - Only show for fromLink mode */}
				{mode === "fromLink" && (
					<>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Giá sản phẩm{" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="cash-outline"
									size={20}
									color="#78909C"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.textInput}
									value={formData.price}
									onChangeText={(value) =>
										handleInputChange("price", value)
									}
									placeholder="Nhập giá sản phẩm (VD: $99.99)"
									placeholderTextColor="#B0BEC5"
									keyboardType="default"
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Giá chuyển đổi (VNĐ){" "}
								<Text style={styles.required}>*</Text>
							</Text>
							<View
								style={[
									styles.inputContainer,
									styles.readOnlyContainer,
								]}
							>
								<Ionicons
									name="card-outline"
									size={20}
									color="#78909C"
									style={styles.inputIcon}
								/>
								<TextInput
									style={[
										styles.textInput,
										styles.convertedPriceInput,
									]}
									value={formData.convertedPrice}
									placeholder="Giá sẽ được tự động tính toán"
									placeholderTextColor="#B0BEC5"
									keyboardType="numeric"
									editable={false}
								/>
								<Ionicons
									name="lock-closed-outline"
									size={16}
									color="#999999"
									style={styles.lockIcon}
								/>
							</View>
							<Text style={styles.exchangeRateText}>
								Tỉ giá hiện tại: 1$ ={" "}
								{formData.exchangeRate.toLocaleString("vi-VN")}{" "}
								VNĐ
							</Text>
						</View>
					</>
				)}

				{/* Category */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Phân loại / Danh mục</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="list-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.category}
							onChangeText={(value) =>
								handleInputChange("category", value)
							}
							placeholder="Nhập danh mục sản phẩm"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Brand */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Thương hiệu</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="ribbon-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.brand}
							onChangeText={(value) =>
								handleInputChange("brand", value)
							}
							placeholder="Nhập thương hiệu"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Material */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Chất liệu</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="layers-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.material}
							onChangeText={(value) =>
								handleInputChange("material", value)
							}
							placeholder="Nhập chất liệu"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Size */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Kích thước</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="resize-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.size}
							onChangeText={(value) =>
								handleInputChange("size", value)
							}
							placeholder="Nhập kích thước"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Color */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Màu sắc</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="color-palette-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.color}
							onChangeText={(value) =>
								handleInputChange("color", value)
							}
							placeholder="Nhập màu sắc"
							placeholderTextColor="#B0BEC5"
						/>
					</View>
				</View>

				{/* Platform - Only show for fromLink mode */}
				{mode === "fromLink" && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>
							Nền tảng thương mại điện tử
						</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="globe-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.platform}
								onChangeText={(value) =>
									handleInputChange("platform", value)
								}
								placeholder="Nhập nền tảng (Amazon, Shopee...)"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>
				)}
			</View>

			{/* Seller Information - Hidden for manual mode since store info already entered in AddStore */}
			{mode === "fromLink" && (
				<StoreForm
					initialData={{
						storeName: formData.sellerInfo.name,
						phoneNumber: formData.sellerInfo.phone,
						email: formData.sellerInfo.email,
						storeAddress: formData.sellerInfo.address,
						shopLink: formData.sellerInfo.storeLink,
					}}
					mode={mode}
					onChange={handleStoreChange}
					showSubmitButton={false}
				/>
			)}

			{/* Submit Button */}
			<TouchableOpacity
				style={styles.submitButton}
				onPress={handleSubmit}
			>
				<LinearGradient
					colors={["#42A5F5", "#1976D2"]}
					style={styles.submitButtonGradient}
				>
					<Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
					<Text style={styles.submitButtonText}>Tiếp tục</Text>
				</LinearGradient>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 30,
	},
	headerCard: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#BBDEFB",
	},
	headerText: {
		flex: 1,
		marginLeft: 12,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 4,
	},
	headerDesc: {
		fontSize: 14,
		color: "#1565C0",
		lineHeight: 20,
	},
	section: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: "#FAFAFA",
	},
	inputIcon: {
		marginRight: 12,
		marginTop: 2,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		color: "#263238",
		paddingVertical: 4,
	},
	multilineInput: {
		minHeight: 60,
		textAlignVertical: "top",
	},
	imageContainer: {
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 8,
		borderStyle: "dashed",
		padding: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FAFAFA",
		minHeight: 120,
	},
	productImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
	},
	imagePlaceholder: {
		alignItems: "center",
		justifyContent: "center",
	},
	imagePlaceholderText: {
		fontSize: 14,
		color: "#78909C",
		marginTop: 8,
	},
	submitButton: {
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
		marginTop: 10,
	},
	submitButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	submitButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: 8,
	},
	readOnlyContainer: {
		backgroundColor: "#F5F5F5",
		borderColor: "#D0D0D0",
	},
	readOnlyInput: {
		color: "#666666",
		backgroundColor: "transparent",
	},
	convertedPriceInput: {
		color: "#D32F2F", // Red color for converted price
		backgroundColor: "transparent",
		fontWeight: "600",
	},
	lockIcon: {
		marginLeft: 8,
		alignSelf: "flex-start",
		marginTop: 2,
	},
	exchangeRateText: {
		fontSize: 12,
		color: "#999999",
		marginTop: 4,
		fontStyle: "italic",
	},
});
