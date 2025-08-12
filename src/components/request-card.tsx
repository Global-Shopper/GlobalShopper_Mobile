import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
	formatDate,
	getRequestTypeBorderColor,
	getRequestTypeIcon,
	getShortId,
	getStatusColor,
	getStatusText,
} from "../utils/statusHandler";
import { Text } from "./ui/text";

interface RequestCardProps {
	request: {
		id: number;
		code: string;
		productCount: number;
		status:
			| "sent"
			| "checking"
			| "quoted"
			| "confirmed"
			| "cancelled"
			| "insufficient";
		date: number;
		createdAt: string;
		requestType: "ONLINE" | "OFFLINE";
		requestItems: {
			productName?: string;
			name?: string;
			[key: string]: any;
		}[];
		contactInfo?: string[];
		subRequests?: {
			contactInfo?: string[];
			requestItems?: {
				quantity?: number | string;
				[key: string]: any;
			}[];
			[key: string]: any;
		}[];
	};
	onPress?: () => void;
	onCancel?: () => void;
}

export default function RequestCard({
	request,
	onPress,
	onCancel,
}: RequestCardProps) {
	const getRequestTitle = (request: any) => {
		// For ONLINE requests, use the request code if available, otherwise use shortened ID
		if (request.requestType === "ONLINE") {
			if (request.code) {
				return `#${request.code}`;
			}
		}

		// For all requests (ONLINE without code and OFFLINE), use getShortId from statusHandler
		return getShortId(request.id);
	};
	// Remove local status functions and use imported ones from statusHandler
	// const getStatusColor = ... (removed)
	// const getStatusText = ... (removed)
	// const getRequestTypeIcon = ... (removed)
	// const getRequestTypeBorderColor = ... (removed)

	const getProductDisplayInfo = (request: any) => {
		if (request.requestType === "ONLINE") {
			let allProducts: any[] = [];

			// Trường hợp 1: requestItems (có thể có ở status "sent", "checking")
			if (
				Array.isArray(request.requestItems) &&
				request.requestItems.length > 0
			) {
				allProducts = [...allProducts, ...request.requestItems];
			}

			// Trường hợp 2: subRequests (có thể có ở tất cả status, nhất là "quoted", "confirmed")
			if (
				Array.isArray(request.subRequests) &&
				request.subRequests.length > 0
			) {
				// Gộp tất cả products từ tất cả subRequests
				request.subRequests.forEach((subReq: any) => {
					if (
						Array.isArray(subReq.requestItems) &&
						subReq.requestItems.length > 0
					) {
						allProducts = [...allProducts, ...subReq.requestItems];
					}
				});
			}

			if (allProducts.length === 0) {
				return "Không có sản phẩm";
			}

			const sortedProducts = allProducts.sort((a, b) => {
				const nameA = (a.productName || a.name || "").toLowerCase();
				const nameB = (b.productName || b.name || "").toLowerCase();
				return nameA.localeCompare(nameB);
			});

			const firstProduct = sortedProducts[0];
			const firstName =
				firstProduct.productName ||
				firstProduct.name ||
				"Sản phẩm không tên";

			if (allProducts.length === 1) {
				return firstName;
			} else {
				const remainingCount = allProducts.length - 1;
				return `${firstName}\nvà ${remainingCount} sản phẩm khác`;
			}
		} else {
			// OFFLINE logic - also support "và X sản phẩm khác" format
			// First, try to get products from subRequests like ONLINE logic
			let allProducts: any[] = [];

			if (
				Array.isArray(request.subRequests) &&
				request.subRequests.length > 0
			) {
				// Gộp tất cả products từ tất cả subRequests
				request.subRequests.forEach((subReq: any) => {
					if (
						Array.isArray(subReq.requestItems) &&
						subReq.requestItems.length > 0
					) {
						allProducts = [...allProducts, ...subReq.requestItems];
					}
				});
			}

			// If we found products, use the same logic as ONLINE
			if (allProducts.length > 0) {
				const sortedProducts = allProducts.sort((a, b) => {
					const nameA = (a.productName || a.name || "").toLowerCase();
					const nameB = (b.productName || b.name || "").toLowerCase();
					return nameA.localeCompare(nameB);
				});

				const firstProduct = sortedProducts[0];
				const firstName =
					firstProduct.productName ||
					firstProduct.name ||
					"Sản phẩm không tên";

				if (allProducts.length === 1) {
					return firstName;
				} else {
					const remainingCount = allProducts.length - 1;
					return `${firstName}\nvà ${remainingCount} sản phẩm khác`;
				}
			}

			// Fallback to store name logic if no products found
			let mainText = "";

			if (
				Array.isArray(request.subRequests) &&
				request.subRequests.length > 0
			) {
				const firstSub = request.subRequests[0];

				if (
					Array.isArray(firstSub.contactInfo) &&
					firstSub.contactInfo.length > 0
				) {
					const storeInfo = firstSub.contactInfo.find(
						(info: string) =>
							info.includes("Tên cửa hàng:") ||
							info.includes("Store:")
					);

					if (storeInfo) {
						mainText = storeInfo
							.replace("Tên cửa hàng:", "")
							.replace("Store:", "")
							.trim();
					} else {
						mainText = firstSub.contactInfo[0];
					}
				}
			}

			if (
				!mainText &&
				Array.isArray(request.contactInfo) &&
				request.contactInfo.length > 0
			) {
				const storeInfo = request.contactInfo.find(
					(info: string) =>
						info.includes("Tên cửa hàng:") ||
						info.includes("Store:")
				);

				if (storeInfo) {
					mainText = storeInfo
						.replace("Tên cửa hàng:", "")
						.replace("Store:", "")
						.trim();
				} else {
					mainText = request.contactInfo[0];
				}
			}

			if (!mainText) {
				mainText = "Cửa hàng không xác định";
			}

			return mainText;
		}
	};

	return (
		<TouchableOpacity
			style={[
				styles.requestCard,
				{
					borderLeftWidth: 4,
					borderLeftColor: getRequestTypeBorderColor(
						request.requestType
					),
				},
			]}
			onPress={onPress}
		>
			{/* Header Section */}
			<View style={styles.cardHeader}>
				<View style={styles.leftSection}>
					<View style={styles.requestTypeContainer}>
						<Ionicons
							name={
								getRequestTypeIcon(
									request.requestType?.toLowerCase() || ""
								) as any
							}
							size={26}
							color={getRequestTypeBorderColor(
								request.requestType?.toLowerCase() || ""
							)}
						/>
					</View>

					<View style={styles.requestInfo}>
						<Text style={styles.requestCode}>
							{getRequestTitle(request)}
						</Text>
						<Text style={styles.createdDate}>
							{formatDate(request.createdAt)}
						</Text>
					</View>
				</View>

				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor:
								getStatusColor(request.status) + "20",
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{
								color: getStatusColor(request.status),
							},
						]}
					>
						{getStatusText(request.status)}
					</Text>
				</View>
			</View>

			{/* Product Info Section - Combined product name and quantity */}
			<View style={styles.productInfoSection}>
				<View style={styles.productInfoContainer}>
					<Text style={styles.productInfoValue} numberOfLines={3}>
						{getProductDisplayInfo(request)}
					</Text>

					{/* Quantity Text - Show quantity of first product only */}
					<Text style={styles.quantityText}>
						x
						{(() => {
							// Sử dụng cùng logic như getProductDisplayInfo để đảm bảo consistency
							let allProducts: any[] = [];

							// Gộp products từ CẢ HAI nguồn: requestItems VÀ subRequests
							// Trường hợp 1: requestItems (có thể có ở status "sent", "checking")
							if (
								Array.isArray(request.requestItems) &&
								request.requestItems.length > 0
							) {
								allProducts = [
									...allProducts,
									...request.requestItems,
								];
							}

							// Trường hợp 2: subRequests (có thể có ở tất cả status, nhất là "quoted", "confirmed")
							if (
								Array.isArray(request.subRequests) &&
								request.subRequests.length > 0
							) {
								request.subRequests.forEach((subReq: any) => {
									if (
										Array.isArray(subReq.requestItems) &&
										subReq.requestItems.length > 0
									) {
										allProducts = [
											...allProducts,
											...subReq.requestItems,
										];
									}
								});
							}

							if (allProducts.length === 0) {
								return 1; // Default quantity
							}

							// Sort products same way as getProductDisplayInfo để đảm bảo consistency
							const sortedProducts = allProducts.sort((a, b) => {
								const nameA = (
									a.productName ||
									a.name ||
									""
								).toLowerCase();
								const nameB = (
									b.productName ||
									b.name ||
									""
								).toLowerCase();
								return nameA.localeCompare(nameB);
							});

							// Lấy số lượng của sản phẩm đầu tiên (sau khi sort)
							const firstProduct = sortedProducts[0];
							const firstProductQuantity =
								parseInt(String(firstProduct.quantity || 1)) ||
								1;

							return firstProductQuantity;
						})()}
					</Text>
				</View>
			</View>

			{/* Actions Section removed as per user request */}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	leftSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	requestTypeContainer: {
		// backgroundColor: "#f8f9fa", // Removed background
		borderRadius: 10,
		padding: 6,
		marginRight: 10,
		// borderWidth: 1, // Removed border
		// borderColor: "#e9ecef",
	},
	requestInfo: {
		flex: 1,
	},
	requestCode: {
		fontSize: 16,
		fontWeight: "700",
		color: "#343a40",
		marginBottom: 2,
	},
	createdDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 10,
		minWidth: 70,
		alignItems: "center",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
	productInfoSection: {
		marginBottom: 8,
	},
	productInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	productInfoValue: {
		fontSize: 14,
		color: "#000",
		fontWeight: "500",
		lineHeight: 20,
		flex: 1,
		marginRight: 12,
	},
	quantityText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#666666",
		textAlign: "center",
	},
	requestActions: {
		flexDirection: "row",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		alignItems: "center",
		justifyContent: "space-between",
	},
	viewDetailButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#e3f2fd",
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#1976D2",
		flex: 1,
		marginRight: 6,
		justifyContent: "center",
	},
	viewDetailText: {
		color: "#1976D2",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
	cancelButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffebee",
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#dc3545",
	},
	cancelButtonText: {
		color: "#dc3545",
		fontSize: 13,
		fontWeight: "600",
		marginLeft: 4,
	},
});
