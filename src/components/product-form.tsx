import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useGetAllVariantsQuery } from "../services/gshopApi";
import { uploadToCloudinary } from "../utils/uploadToCloundinary";
import { useDialog } from "./dialogHelpers";
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
	images: string[]; // Changed from single image to array of images
	price: string;
	convertedPrice: string;
	exchangeRate: number;
	category: string;
	brand: string;
	material: string;
	size: string;
	color: string;
	unit: string; // Unit of product (chiếc, quyển, cái, chai, etc.)
	quantity: number | string; // Allow string for temporary editing
	platform: string;
	seller: string; // Add seller field
	productLink: string;
	// Dynamic variant fields
	variants?: { [key: string]: string };
	sellerInfo?: {
		name: string;
		phone: string;
		email: string;
		address: string;
		storeLink: string;
	};
}

// Helper function to create initial form data
function getInitialFormData(
	initialData: any,
	storeData: any,
	mode: string
): ProductData {
	const initialPrice = initialData?.price || "";
	const initialExchangeRate = initialData?.exchangeRate || 25000;

	// Calculate converted price if price is available
	let initialConvertedPrice = "";
	if (initialPrice && mode === "fromLink") {
		const numericPrice = parseFloat(initialPrice.replace(/[^0-9.]/g, ""));
		if (!isNaN(numericPrice) && numericPrice > 0) {
			const convertedAmount = Math.round(
				numericPrice * initialExchangeRate
			);
			initialConvertedPrice = convertedAmount.toLocaleString("vi-VN");
		}
	}

	const baseData: any = {
		name: initialData?.title || initialData?.name || "",
		description: initialData?.description || "",
		images:
			initialData?.images ||
			(initialData?.image ? [initialData.image] : []),
		price: initialPrice,
		convertedPrice: initialConvertedPrice,
		exchangeRate: initialExchangeRate,
		category: initialData?.category || "",
		brand: initialData?.brand || "",
		material: initialData?.material || "",
		size: initialData?.size || "",
		color: initialData?.color || "",
		unit: initialData?.unit || "",
		quantity: initialData?.quantity || "", // Default empty, let user input
		platform: initialData?.platform || "",
		seller: initialData?.seller || "", // Add seller field
		productLink: initialData?.productLink || "",
		variants: initialData?.variants || {}, // Initialize variants object
	};

	// Only include sellerInfo in manual mode
	if (mode === "manual") {
		baseData.sellerInfo = {
			name: storeData?.storeName || initialData?.sellerInfo?.name || "",
			phone:
				storeData?.phoneNumber || initialData?.sellerInfo?.phone || "",
			email: storeData?.email || initialData?.sellerInfo?.email || "",
			address:
				storeData?.storeAddress ||
				initialData?.sellerInfo?.address ||
				"",
			storeLink:
				storeData?.shopLink || initialData?.sellerInfo?.storeLink || "",
		};
	}

	return baseData;
}

// Helper function to truncate URL
function truncateUrl(url: string, maxLength: number = 50): string {
	if (!url) return "";
	if (url.length <= maxLength) return url;
	return url.substring(0, maxLength) + "...";
}

// Helper function to get platform logo
function getPlatformLogo(platform: string) {
	const platformLower = platform.toLowerCase();
	if (platformLower.includes("amazon")) {
		return require("../assets/images/ecommerce/amazon-logo.png");
	}
	if (platformLower.includes("aliexpress")) {
		return require("../assets/images/ecommerce/aliexpress-logo.png");
	}
	if (platformLower.includes("ebay")) {
		return require("../assets/images/ecommerce/ebay-logo.png");
	}
	if (platformLower.includes("asos")) {
		return require("../assets/images/ecommerce/asos-logo.png");
	}
	if (platformLower.includes("dhgate")) {
		return require("../assets/images/ecommerce/dhgate-logo.png");
	}
	if (platformLower.includes("gmarket")) {
		return require("../assets/images/ecommerce/gmarket-logo.png");
	}
	if (platformLower.includes("shein")) {
		return require("../assets/images/ecommerce/shein-logo.png");
	}
	// Fallback for other platforms
	if (platformLower.includes("shopee")) return null;
	if (platformLower.includes("lazada")) return null;
	if (platformLower.includes("tiki")) return null;
	if (platformLower.includes("sendo")) return null;
	return null;
}

// Helper function to get variant field icon and placeholder
function getVariantFieldInfo(variantName: string) {
	const lowerName = variantName.toLowerCase();

	if (lowerName.includes("kích thước") || lowerName.includes("size")) {
		return {
			icon: "resize-outline",
			placeholder: "Nhập kích thước (VD: S, M, L, XL...)",
			fieldKey: "size",
		};
	}
	if (lowerName.includes("màu") || lowerName.includes("color")) {
		return {
			icon: "color-palette-outline",
			placeholder: "Nhập màu sắc (VD: Đỏ, Xanh, Trắng...)",
			fieldKey: "color",
		};
	}
	if (lowerName.includes("chất liệu") || lowerName.includes("material")) {
		return {
			icon: "layers-outline",
			placeholder: "Nhập chất liệu (VD: Cotton, Da, Gỗ...)",
			fieldKey: "material",
		};
	}
	if (lowerName.includes("chất lượng") || lowerName.includes("quality")) {
		return {
			icon: "star-outline",
			placeholder: "Nhập chất lượng (VD: Cao cấp, Trung bình...)",
			fieldKey: "quality",
		};
	}
	if (lowerName.includes("nguồn gốc") || lowerName.includes("origin")) {
		return {
			icon: "location-outline",
			placeholder: "Nhập nguồn gốc (VD: Việt Nam, Trung Quốc...)",
			fieldKey: "origin",
		};
	}

	// Default fallback
	return {
		icon: "information-circle-outline",
		placeholder: `Nhập ${variantName.toLowerCase()}`,
		fieldKey: lowerName.replace(/\s+/g, ""),
	};
}

export default function ProductForm({
	initialData,
	mode,
	storeData,
	onSubmit,
	onChange,
}: ProductFormProps) {
	const { showDialog, hideDialog, Dialog } = useDialog();

	// Fetch variants from API
	const { data: variantsData, isLoading: variantsLoading } =
		useGetAllVariantsQuery(undefined);

	console.log("Variants loading:", variantsLoading, "Data:", variantsData);

	// State for managing selected variants
	const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
	const [showVariantSelector, setShowVariantSelector] = useState(false);

	const [formData, setFormData] = useState<ProductData>(() => {
		return getInitialFormData(initialData, storeData, mode);
	});

	// Update form data when initialData changes (when switching tabs)
	useEffect(() => {
		const newFormData = getInitialFormData(initialData, storeData, mode);
		setFormData(newFormData);
	}, [initialData, storeData, mode]);

	const handleInputChange = (field: string, value: string | number) => {
		// Skip convertedPrice as it's read-only and auto-calculated
		if (field === "convertedPrice") {
			return;
		}

		let newFormData = { ...formData };

		if (field.includes("sellerInfo.") && formData.sellerInfo) {
			const sellerField = field.split(".")[1];
			newFormData = {
				...formData,
				sellerInfo: {
					...formData.sellerInfo,
					[sellerField]: value,
				},
			};
		} else if (field.includes("variants.")) {
			// Handle variants fields
			const variantField = field.split(".")[1];
			newFormData = {
				...formData,
				variants: {
					...formData.variants,
					[variantField]: String(value), // Ensure value is string
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
		if (field === "price" && typeof value === "string") {
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
		// Request permission
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			showDialog({
				title: "Quyền truy cập",
				message: "Cần quyền truy cập thư viện ảnh để chọn hình ảnh",
			});
			return;
		}

		// Check if max images reached
		if (formData.images.length >= 4) {
			showDialog({
				title: "Giới hạn ảnh",
				message: "Bạn chỉ có thể thêm tối đa 4 ảnh",
			});
			return;
		}

		// Launch image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const imageAsset = result.assets[0];

			try {
				// Show loading state
				showDialog({
					title: "Đang tải ảnh",
					message: "Vui lòng đợi...",
				});

				// Create file object for Cloudinary
				const file = {
					uri: imageAsset.uri,
					type: "image/jpeg",
					name: `product_${Date.now()}.jpg`,
				};

				// Upload to Cloudinary
				const cloudinaryUrl = await uploadToCloudinary(file);

				if (cloudinaryUrl) {
					// Hide loading dialog
					hideDialog();

					const updatedData = {
						...formData,
						images: [...formData.images, cloudinaryUrl],
					};
					setFormData(updatedData);
					if (onChange) {
						onChange(updatedData);
					}
				} else {
					showDialog({
						title: "Lỗi upload",
						message: "Không thể tải ảnh lên. Vui lòng thử lại.",
					});
				}
			} catch (error) {
				console.error("Error uploading image:", error);
				showDialog({
					title: "Lỗi upload",
					message: "Không thể tải ảnh lên. Vui lòng thử lại.",
				});
			}
		}
	};

	const removeImage = (index: number) => {
		const updatedImages = formData.images.filter((_, i) => i !== index);
		const updatedData = {
			...formData,
			images: updatedImages,
		};
		setFormData(updatedData);
		if (onChange) {
			onChange(updatedData);
		}
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập tên sản phẩm",
			});
			return false;
		}
		// Only validate price for fromLink mode
		if (mode === "fromLink" && !formData.price.trim()) {
			showDialog({
				title: "Lỗi",
				message: "Vui lòng nhập giá sản phẩm",
			});
			return false;
		}
		// Converted price is auto-calculated, no need to validate manually

		// No validation for seller info in either mode:
		// - fromLink mode: Each product may come from different stores
		// - manual mode: Store info already entered in AddStore

		return true;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		// Ensure quantity is a valid number when submitting (default to 1 if empty)
		let finalQuantity = 1; // Default
		if (formData.quantity !== "" && formData.quantity !== undefined) {
			finalQuantity =
				typeof formData.quantity === "string"
					? parseInt(formData.quantity) || 1
					: formData.quantity;
		}

		const submissionData = {
			...formData,
			quantity: finalQuantity,
		};

		onSubmit(submissionData);
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

				{/* Product Link - Show at top for fromLink mode (read-only) */}
				{mode === "fromLink" && formData.productLink && (
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
							<Text style={styles.readOnlyText}>
								{truncateUrl(formData.productLink, 60)}
							</Text>
						</View>
					</View>
				)}

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

				{/* Platform */}
				{formData.platform && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Nền tảng</Text>
						<View style={styles.platformContainer}>
							{getPlatformLogo(formData.platform) ? (
								<Image
									source={getPlatformLogo(formData.platform)}
									style={styles.platformLogo}
									resizeMode="contain"
								/>
							) : (
								<Ionicons
									name="storefront-outline"
									size={20}
									color="#78909C"
									style={styles.inputIcon}
								/>
							)}
							<Text style={styles.platformText}>
								{formData.platform}
							</Text>
						</View>
					</View>
				)}

				{/* Seller - Only show for fromLink mode (online requests) */}
				{mode === "fromLink" && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Người bán</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="person-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.seller}
								onChangeText={(value) =>
									handleInputChange("seller", value)
								}
								placeholder="Nhập tên người bán"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>
				)}

				{/* Product Link - Show for manual mode (editable) */}
				{mode === "manual" && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Link sản phẩm</Text>
						<View style={styles.inputContainer}>
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
								]}
								value={formData.productLink}
								onChangeText={(value) =>
									handleInputChange("productLink", value)
								}
								placeholder="Nhập link sản phẩm (tùy chọn)"
								placeholderTextColor="#B0BEC5"
								multiline
								numberOfLines={2}
								textAlignVertical="top"
							/>
						</View>
					</View>
				)}

				{/* Unit - User input field (only for manual mode) */}
				{mode === "manual" && (
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Đơn vị sản phẩm</Text>
						<View style={styles.inputContainer}>
							<Ionicons
								name="cube-outline"
								size={20}
								color="#78909C"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								value={formData.unit}
								onChangeText={(value) =>
									handleInputChange("unit", value)
								}
								placeholder="Nhập đơn vị (VD: chiếc, quyển, cái, chai...)"
								placeholderTextColor="#B0BEC5"
							/>
						</View>
					</View>
				)}

				{/* Quantity - User input field */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Số lượng</Text>
					<View style={styles.inputContainer}>
						<Ionicons
							name="layers-outline"
							size={20}
							color="#78909C"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							value={formData.quantity.toString()}
							onChangeText={(value) =>
								handleInputChange("quantity", value)
							}
							placeholder="Nhập số lượng"
							placeholderTextColor="#B0BEC5"
							keyboardType="numeric"
						/>
					</View>
				</View>

				{/* Product Images */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Hình ảnh sản phẩm (Tối đa 4 ảnh)
					</Text>

					{/* Images Grid */}
					<View style={styles.imagesGrid}>
						{formData.images.map((imageUri, index) => (
							<View key={index} style={styles.imageItem}>
								<Image
									source={{ uri: imageUri }}
									style={styles.gridImage}
								/>
								<TouchableOpacity
									style={styles.removeImageButton}
									onPress={() => removeImage(index)}
								>
									<Ionicons
										name="close-circle"
										size={24}
										color="#FF5722"
									/>
								</TouchableOpacity>
							</View>
						))}

						{/* Add Image Button */}
						{formData.images.length < 4 && (
							<TouchableOpacity
								style={styles.addImageButton}
								onPress={pickImage}
							>
								<Ionicons
									name="add-circle-outline"
									size={32}
									color="#78909C"
								/>
								<Text style={styles.addImageText}>
									Thêm ảnh
								</Text>
							</TouchableOpacity>
						)}
					</View>

					{/* Image count info */}
					<Text style={styles.imageCountText}>
						{formData.images.length}/4 ảnh
					</Text>
				</View>

				{/* Dynamic Variants from API - Selective Display */}
				{variantsData && variantsData.length > 0 && (
					<>
						{/* Add Variant Button */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								Thuộc tính sản phẩm
							</Text>
							<TouchableOpacity
								style={styles.addVariantButton}
								onPress={() =>
									setShowVariantSelector(!showVariantSelector)
								}
							>
								<Ionicons
									name="add-circle-outline"
									size={20}
									color="#42A5F5"
									style={styles.inputIcon}
								/>
								<Text style={styles.addVariantText}>
									Thêm thuộc tính
								</Text>
								<Ionicons
									name={
										showVariantSelector
											? "chevron-up"
											: "chevron-down"
									}
									size={16}
									color="#42A5F5"
									style={{ marginLeft: "auto" }}
								/>
							</TouchableOpacity>

							{/* Variant Dropdown - appears right below the button */}
							{showVariantSelector && (
								<View style={styles.variantDropdown}>
									<ScrollView
										style={styles.variantScrollView}
										showsVerticalScrollIndicator={false}
										nestedScrollEnabled={true}
									>
										{variantsData
											.filter(
												(variant: any) =>
													variant.isActive &&
													!selectedVariants.includes(
														variant.id
													)
											)
											.map((variant: any) => {
												const fieldInfo =
													getVariantFieldInfo(
														variant.name
													);
												return (
													<TouchableOpacity
														key={variant.id}
														style={
															styles.variantOption
														}
														onPress={() => {
															setSelectedVariants(
																(prev) => [
																	...prev,
																	variant.id,
																]
															);
															setShowVariantSelector(
																false
															);
														}}
													>
														<Ionicons
															name={
																fieldInfo.icon as any
															}
															size={20}
															color="#42A5F5"
														/>
														<Text
															style={
																styles.variantOptionText
															}
														>
															{variant.name}
														</Text>
													</TouchableOpacity>
												);
											})}
										{variantsData.filter(
											(variant: any) =>
												variant.isActive &&
												!selectedVariants.includes(
													variant.id
												)
										).length === 0 && (
											<View
												style={
													styles.noVariantsContainer
												}
											>
												<Text
													style={
														styles.noVariantsText
													}
												>
													Tất cả thuộc tính đã được
													thêm
												</Text>
											</View>
										)}
									</ScrollView>
								</View>
							)}
						</View>

						{/* Selected Variants Fields */}
						{selectedVariants.map((variantId) => {
							const variant = variantsData.find(
								(v: any) => v.id === variantId
							);
							if (!variant) return null;

							const fieldInfo = getVariantFieldInfo(variant.name);
							return (
								<View
									key={variant.id}
									style={styles.inputGroup}
								>
									<View style={styles.labelWithRemove}>
										<Text style={styles.label}>
											{variant.name}
										</Text>
										<TouchableOpacity
											onPress={() => {
												setSelectedVariants((prev) =>
													prev.filter(
														(id) => id !== variantId
													)
												);
												// Clear the form data for this variant
												handleInputChange(
													`variants.${fieldInfo.fieldKey}`,
													""
												);
											}}
											style={styles.removeVariantButton}
										>
											<Ionicons
												name="close-circle"
												size={18}
												color="#FF5722"
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.inputContainer}>
										<Ionicons
											name={fieldInfo.icon as any}
											size={20}
											color="#78909C"
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.textInput}
											value={
												formData.variants?.[
													fieldInfo.fieldKey
												] || ""
											}
											onChangeText={(value) =>
												handleInputChange(
													`variants.${fieldInfo.fieldKey}`,
													value
												)
											}
											placeholder={fieldInfo.placeholder}
											placeholderTextColor="#B0BEC5"
										/>
									</View>
								</View>
							);
						})}
					</>
				)}

				{/* Fallback to basic variants if API fails */}
				{(!variantsData || variantsData.length === 0) && (
					<>
						{/* Size - User input field */}
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
									placeholder="Nhập kích thước (VD: S, M, L, XL...)"
									placeholderTextColor="#B0BEC5"
								/>
							</View>
						</View>

						{/* Color - User input field */}
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
									placeholder="Nhập màu sắc (VD: Đỏ, Xanh, Trắng...)"
									placeholderTextColor="#B0BEC5"
								/>
							</View>
						</View>
					</>
				)}
			</View>

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
			<Dialog />
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
	imagesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		gap: 12,
	},
	imageItem: {
		position: "relative",
		width: 80,
		height: 80,
	},
	gridImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	removeImageButton: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: "#fff",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	addImageButton: {
		width: 80,
		height: 80,
		borderWidth: 2,
		borderColor: "#E0E0E0",
		borderStyle: "dashed",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FAFAFA",
	},
	addImageText: {
		fontSize: 12,
		color: "#78909C",
		marginTop: 4,
		textAlign: "center",
	},
	imageCountText: {
		fontSize: 12,
		color: "#666",
		marginTop: 8,
		textAlign: "right",
		fontStyle: "italic",
	},
	readOnlyText: {
		flex: 1,
		fontSize: 16,
		color: "#666",
		paddingVertical: 4,
	},
	platformContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E9ECEF",
	},
	platformLogo: {
		width: 24,
		height: 24,
		marginRight: 8,
	},
	platformText: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
	},
	addVariantButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E3F2FD",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#BBDEFB",
	},
	addVariantText: {
		fontSize: 14,
		color: "#42A5F5",
		fontWeight: "500",
	},
	variantDropdown: {
		marginTop: 8,
		backgroundColor: "white",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		maxHeight: 200,
		overflow: "hidden",
	},
	variantScrollView: {
		maxHeight: 200,
	},
	variantOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	variantOptionText: {
		fontSize: 14,
		color: "#263238",
		marginLeft: 12,
		fontWeight: "400",
	},
	noVariantsContainer: {
		paddingVertical: 16,
		paddingHorizontal: 16,
		alignItems: "center",
	},
	noVariantsText: {
		fontSize: 14,
		color: "#999",
		fontStyle: "italic",
	},
	labelWithRemove: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	removeVariantButton: {
		padding: 4,
	},
});
