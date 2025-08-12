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
			| "insufficient"
			| "SENT"
			| "CHECKING"
			| "QUOTED"
			| "CONFIRMED"
			| "CANCELLED"
			| "INSUFFICIENT"
			| "paid"
			| "success"
			| "completed";
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
		// For ALL statuses, always show simple product names (not seller/platform info)
		let allProducts: any[] = [];

		// Method 1: Try requestItems first (common in early stages like sent, checking)
		if (
			Array.isArray(request.requestItems) &&
			request.requestItems.length > 0
		) {
			allProducts = [...request.requestItems];
		}
		// Method 2: If no requestItems, get products from subRequests (common in later stages)
		else if (
			Array.isArray(request.subRequests) &&
			request.subRequests.length > 0
		) {
			request.subRequests.forEach((subReq: any) => {
				if (
					Array.isArray(subReq.requestItems) &&
					subReq.requestItems.length > 0
				) {
					allProducts = [...allProducts, ...subReq.requestItems];
				}
			});
		}

		// If we still have no products, try fallback for offline requests
		if (
			allProducts.length === 0 &&
			request.requestType === "OFFLINE" &&
			Array.isArray(request.subRequests)
		) {
			// Fallback to store name for offline requests with no products
			const firstSub = request.subRequests[0];
			if (
				firstSub &&
				Array.isArray(firstSub.contactInfo) &&
				firstSub.contactInfo.length > 0
			) {
				const storeInfo = firstSub.contactInfo.find(
					(info: string) =>
						info.includes("Tên cửa hàng:") ||
						info.includes("Store:")
				);

				if (storeInfo) {
					return storeInfo
						.replace("Tên cửa hàng:", "")
						.replace("Store:", "")
						.trim();
				}
				return firstSub.contactInfo[0] || "Cửa hàng không xác định";
			}
			return "Cửa hàng không xác định";
		}

		if (allProducts.length === 0) {
			return "Không có sản phẩm";
		}

		// Always show product names regardless of status
		const firstProduct = allProducts[0];
		const firstName =
			firstProduct.productName ||
			firstProduct.name ||
			"Sản phẩm không tên";

		// Debug: Log product count to understand the issue
		console.log(
			`[RequestCard] Request ${request.id}: Found ${allProducts.length} products`
		);

		if (allProducts.length === 1) {
			return firstName;
		} else {
			const remainingCount = allProducts.length - 1;
			return `${firstName}\nvà ${remainingCount} sản phẩm khác`;
		}
	};

	return (
		<TouchableOpacity style={styles.requestCard} onPress={onPress}>
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
							size={22}
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
							// Use same logic as getProductDisplayInfo to ensure consistency
							let allProducts: any[] = [];

							// Method 1: Try requestItems first (avoid duplicates)
							if (
								Array.isArray(request.requestItems) &&
								request.requestItems.length > 0
							) {
								allProducts = [...request.requestItems];
							}
							// Method 2: If no requestItems, get from subRequests
							else if (
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

							// Get quantity of first product (no sorting needed for quantity)
							const firstProduct = allProducts[0];
							const firstProductQuantity =
								parseInt(String(firstProduct.quantity || 1)) ||
								1;

							return firstProductQuantity;
						})()}
					</Text>
				</View>
			</View>

			{/* No action buttons in RequestCard - buttons will be in RequestDetails */}

			{/* Actions Section removed as per user request */}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 10,
	},
	leftSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	requestTypeContainer: {
		borderRadius: 8,
		padding: 4,
		marginRight: 8,
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
		borderRadius: 8,
		minWidth: 65,
		alignItems: "center",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.3,
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
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		alignItems: "center",
		justifyContent: "flex-end",
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
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
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
