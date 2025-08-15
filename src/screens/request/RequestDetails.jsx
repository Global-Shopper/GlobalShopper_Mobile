import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import ProductCard from "../../components/product-card";
import RequestActionButtons from "../../components/request-details/RequestActionButtons";
import RequestDetailHeader from "../../components/request-details/RequestDetailHeader";
import RequestDetailsInfo from "../../components/request-details/RequestDetailsInfo";
import SubRequestItem from "../../components/request-details/SubRequestItem";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestByIdQuery } from "../../services/gshopApi";
import { shouldShowQuotation } from "../../utils/statusHandler";

// Helper function to check if request/sub-request is completed/paid
const isRequestCompleted = (status) => {
	if (!status) return false;
	const normalizedStatus = status.toLowerCase();
	return (
		normalizedStatus === "completed" ||
		normalizedStatus === "paid" ||
		normalizedStatus === "success" ||
		normalizedStatus === "delivered"
	);
};

export default function RequestDetails({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id || route.params?.requestId;

	const [acceptedQuotations, setAcceptedQuotations] = useState({});
	const [expandedQuotations, setExpandedQuotations] = useState({});

	// Fetch purchase request detail from API
	const {
		data: requestDetails,
		isLoading,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId,
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
	});

	// Refetch data when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			if (requestId) {
				console.log(
					"[RequestDetails] Screen focused, refetching data for request:",
					requestId
				);
				refetch();
			}
		}, [requestId, refetch])
	);

	// Handle loading state
	if (isLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1976D2" />
					<Text style={styles.loadingText}>
						Đang tải thông tin...
					</Text>
				</View>
			</View>
		);
	}

	// Handle error state
	if (error || !requestDetails) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color="#dc3545"
					/>
					<Text style={styles.errorTitle}>
						Không thể tải thông tin
					</Text>
					<Text style={styles.errorMessage}>
						{error?.data?.message ||
							error?.message ||
							"Vui lòng thử lại sau"}
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => refetch()}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	const displayData = requestDetails;

	// Calculate total products
	const calculateTotalProducts = () => {
		if (displayData?.requestItems?.length > 0) {
			return displayData.requestItems.length;
		} else if (displayData?.items?.length > 0) {
			return displayData.items.length;
		} else if (displayData?.products?.length > 0) {
			return displayData.products.length;
		} else if (displayData?.productList?.length > 0) {
			return displayData.productList.length;
		} else if (displayData?.subRequests?.length > 0) {
			let totalProducts = 0;
			displayData.subRequests.forEach((subRequest) => {
				if (subRequest?.requestItems?.length > 0) {
					totalProducts += subRequest.requestItems.length;
				}
			});
			return totalProducts;
		}
		return 0;
	};

	// Render product list
	const renderProductList = () => {
		// Method 1: If we have sub-requests, show by sub-request structure
		if (displayData?.subRequests?.length > 0) {
			return displayData.subRequests
				.map((subRequest, subIndex) => {
					if (!subRequest?.requestItems?.length) return null;

					// Check if request or sub-request is completed/paid
					const isCompleted =
						isRequestCompleted(displayData?.status) ||
						isRequestCompleted(subRequest?.status);

					return (
						<SubRequestItem
							key={`sub-${subIndex}`}
							subRequest={subRequest}
							subIndex={subIndex}
							requestType={
								displayData?.requestType || displayData?.type
							}
							isCompleted={isCompleted}
							acceptedQuotations={acceptedQuotations}
							setAcceptedQuotations={setAcceptedQuotations}
							expandedQuotations={expandedQuotations}
							setExpandedQuotations={setExpandedQuotations}
							navigation={navigation}
							displayData={displayData}
						/>
					);
				})
				.filter(Boolean);
		}

		// Method 2: Fallback for direct product arrays (legacy support)
		else {
			let allProducts = [];
			if (displayData?.requestItems?.length > 0) {
				allProducts = displayData.requestItems;
			} else if (displayData?.items?.length > 0) {
				allProducts = displayData.items;
			} else if (displayData?.products?.length > 0) {
				allProducts = displayData.products;
			} else if (displayData?.productList?.length > 0) {
				allProducts = displayData.productList;
			}

			if (allProducts.length === 0) {
				return (
					<View style={styles.emptyProductContainer}>
						<Text style={styles.emptyProductText}>
							Chưa có sản phẩm nào trong yêu cầu này
						</Text>
					</View>
				);
			}

			return allProducts.map((product, index) => {
				const productMode =
					displayData?.requestType?.toLowerCase() === "online" ||
					displayData?.type?.toLowerCase() === "online"
						? "withLink"
						: "manual";

				// Parse variants helper function
				const parseVariants = (variants) => {
					if (!variants || !Array.isArray(variants)) return {};

					const result = {};
					variants.forEach((variant) => {
						if (typeof variant === "string") {
							if (variant.includes("Màu sắc:")) {
								result.color = variant
									.replace("Màu sắc:", "")
									.trim();
							} else if (variant.includes("Kích cỡ:")) {
								result.size = variant
									.replace("Kích cỡ:", "")
									.trim();
							} else if (variant.includes("Chất liệu:")) {
								result.material = variant
									.replace("Chất liệu:", "")
									.trim();
							} else if (variant.includes("Thương hiệu:")) {
								result.brand = variant
									.replace("Thương hiệu:", "")
									.trim();
							}
						}
					});
					return result;
				};

				const parsedVariants = parseVariants(product.variants);

				return (
					<ProductCard
						key={product.id || index}
						id={product.id || index.toString()}
						name={
							product.productName ||
							product.name ||
							"Sản phẩm không tên"
						}
						description={
							product.description || product.productDescription
						}
						images={product.images || product.productImages || []}
						price={
							productMode === "manual"
								? ""
								: product.price || product.productPrice || ""
						}
						convertedPrice={
							productMode === "manual"
								? ""
								: product.convertedPrice
						}
						exchangeRate={
							productMode === "manual"
								? undefined
								: product.exchangeRate
						}
						category={
							product.category ||
							product.productCategory ||
							parsedVariants.category
						}
						brand={
							product.brand ||
							product.productBrand ||
							parsedVariants.brand
						}
						material={
							product.material ||
							product.productMaterial ||
							parsedVariants.material
						}
						size={
							product.size ||
							product.productSize ||
							parsedVariants.size
						}
						color={
							product.color ||
							product.productColor ||
							parsedVariants.color
						}
						unit={product.unit || ""}
						platform={product.platform || product.ecommercePlatform}
						productLink={
							product.productURL ||
							product.productLink ||
							product.url
						}
						quantity={product.quantity || 1}
						mode={productMode}
						sellerInfo={
							productMode === "manual"
								? {
										name: product.sellerName || "",
										phone: product.sellerPhone || "",
										email: product.sellerEmail || "",
										address: product.sellerAddress || "",
										storeLink:
											product.sellerStoreLink || "",
								  }
								: undefined
						}
					/>
				);
			});
		}
	};

	// Handle action buttons
	const handleCancelRequest = () => {
		console.log("Cancel request:", displayData?.id);
		// TODO: Implement cancel request API call
	};

	const handleUpdateRequest = () => {
		console.log("Update request:", displayData?.id);
		// TODO: Navigate to update request screen
	};

	return (
		<View style={styles.container}>
			<Header
				title="Chi tiết yêu cầu"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
				showNotificationIcon={false}
			/>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.scrollContent,
					shouldShowQuotation(displayData?.status) &&
						styles.scrollContentWithButton,
				]}
			>
				{/* Request Header */}
				<View style={styles.section}>
					<RequestDetailHeader requestData={displayData} />
				</View>

				{/* Request Info and Store (if applicable) */}
				<RequestDetailsInfo
					requestData={displayData}
					navigation={navigation}
				/>

				{/* Delivery Address */}
				<View style={styles.section}>
					<AddressSmCard
						recipientName={
							displayData?.shippingAddress?.name ||
							displayData?.deliveryAddress?.name ||
							displayData?.address?.recipientName ||
							displayData?.recipientName ||
							""
						}
						phone={
							displayData?.shippingAddress?.phoneNumber ||
							displayData?.deliveryAddress?.phoneNumber ||
							displayData?.address?.phone ||
							displayData?.phone ||
							""
						}
						address={
							displayData?.shippingAddress?.location ||
							displayData?.deliveryAddress?.location ||
							displayData?.address?.address ||
							displayData?.address ||
							""
						}
						isDefault={
							displayData?.shippingAddress?.default ||
							displayData?.deliveryAddress?.default ||
							displayData?.address?.isDefault ||
							false
						}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={
							!(
								displayData?.shippingAddress?.name ||
								displayData?.deliveryAddress?.name ||
								displayData?.address?.recipientName ||
								displayData?.recipientName ||
								displayData?.shippingAddress?.phoneNumber ||
								displayData?.deliveryAddress?.phoneNumber ||
								displayData?.address?.phone ||
								displayData?.phone ||
								displayData?.shippingAddress?.location ||
								displayData?.deliveryAddress?.location ||
								displayData?.address?.address ||
								displayData?.address
							)
						}
						showEditButton={false}
					/>
				</View>

				{/* Product List */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm ({calculateTotalProducts()} sản
							phẩm)
						</Text>
					</View>

					{renderProductList()}

					{/* Divider */}
					<View style={styles.divider} />
				</View>
			</ScrollView>

			{/* Action Buttons */}
			<RequestActionButtons
				status={displayData?.status}
				onCancel={handleCancelRequest}
				onUpdate={handleUpdateRequest}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 18,
		paddingVertical: 5,
		paddingBottom: 30,
	},
	scrollContentWithButton: {
		paddingBottom: 1,
	},
	section: {
		marginBottom: 10,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
		gap: 6,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 8,
	},
	// Loading and Error States
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		marginTop: 16,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#dc3545",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	errorMessage: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
	},
	retryButton: {
		backgroundColor: "#1976D2",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#fff",
	},
	emptyProductContainer: {
		backgroundColor: "#f8f9fa",
		padding: 20,
		borderRadius: 8,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderStyle: "dashed",
	},
	emptyProductText: {
		fontSize: 14,
		color: "#666",
		fontStyle: "italic",
	},
});
