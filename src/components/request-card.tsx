import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
	// Debug: Log toàn bộ request object để xem cấu trúc
	console.log("=== FULL REQUEST OBJECT ===");
	console.log(JSON.stringify(request, null, 2));

	const getRequestTitle = (request: any) => {
		console.log("=== REQUEST TITLE DEBUG ===");
		console.log("Request Type:", request.requestType);
		console.log("Request ID:", request.id);
		console.log("Request Code:", request.code);

		// Lấy ID hoặc Code
		const fullId = request.code || request.id || "N/A";
		console.log("Full ID:", fullId);

		// Rút ngắn UUID: chỉ lấy phần trước dấu "-" đầu tiên
		let shortId = fullId;
		if (typeof fullId === "string" && fullId.includes("-")) {
			shortId = fullId.split("-")[0];
			console.log("Shortened ID:", shortId);
		}

		console.log("Final display ID:", shortId);
		return `#${shortId}`;
	};

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "sent":
				return "#28a745";
			case "checking":
				return "#17a2b8";
			case "quoted":
				return "#ffc107";
			case "confirmed":
				return "#007bff";
			case "cancelled":
				return "#dc3545";
			case "insufficient":
				return "#fd7e14";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status: string) => {
		switch (status?.toLowerCase()) {
			case "sent":
				return "Đã gửi";
			case "checking":
				return "Đang xử lý";
			case "quoted":
				return "Đã báo giá";
			case "confirmed":
				return "Đã xác nhận";
			case "cancelled":
				return "Đã hủy";
			case "insufficient":
				return "Cập nhật";
			default:
				return "Không xác định";
		}
	};

	const getRequestTypeIcon = (type: string) => {
		console.log("Request type for icon:", type);
		// ONLINE = có link, OFFLINE = manual input
		return type === "ONLINE" ? "link-outline" : "create-outline";
	};

	const getRequestTypeBorderColor = (type: string) => {
		console.log("Request type for border:", type);
		// ONLINE = xanh dương, OFFLINE = xanh lá
		return type === "ONLINE" ? "#42A5F5" : "#28a745";
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
							name={getRequestTypeIcon(request.requestType)}
							size={26}
							color={getRequestTypeBorderColor(
								request.requestType
							)}
						/>
					</View>

					<View style={styles.requestInfo}>
						<Text style={styles.requestCode}>
							{getRequestTitle(request)}
						</Text>
						<Text style={styles.createdDate}>
							{new Date(
								Number(request.createdAt)
							).toLocaleDateString("vi-VN")}{" "}
							-{" "}
							{new Date(
								Number(request.createdAt)
							).toLocaleTimeString(["vi-VN"], {
								hour: "2-digit",
								minute: "2-digit",
							})}
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
					<Text style={styles.productInfoValue} numberOfLines={2}>
						{(() => {
							// Hiển thị tên sản phẩm đầu tiên hoặc tên cửa hàng
							let mainText = "";

							if (request.requestType === "ONLINE") {
								// Lấy tên sản phẩm đầu tiên
								if (
									Array.isArray(request.requestItems) &&
									request.requestItems.length > 0
								) {
									const firstProduct =
										request.requestItems[0];
									mainText =
										firstProduct.productName ||
										firstProduct.name ||
										"Sản phẩm không tên";
								} else {
									mainText = "Không có sản phẩm";
								}
							} else {
								// Lấy tên cửa hàng từ contactInfo hoặc subRequests
								if (
									Array.isArray(request.subRequests) &&
									request.subRequests.length > 0
								) {
									const firstSub = request.subRequests[0];
									if (
										Array.isArray(firstSub.contactInfo) &&
										firstSub.contactInfo.length > 0
									) {
										// Tìm tên cửa hàng trong contactInfo
										const storeInfo =
											firstSub.contactInfo.find(
												(info) =>
													info.includes(
														"Tên cửa hàng:"
													) || info.includes("Store:")
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
										(info) =>
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
							}

							return mainText;
						})()}
					</Text>

					{/* Quantity Text */}
					<Text style={styles.quantityText}>
						x
						{(() => {
							console.log("=== PRODUCT COUNT DEBUG ===");

							// Tính tổng số lượng sản phẩm
							let totalQuantity = 0;

							// Trường hợp 1: Có requestItems trực tiếp
							if (
								Array.isArray(request.requestItems) &&
								request.requestItems.length > 0
							) {
								request.requestItems.forEach((item, index) => {
									const qty =
										parseInt(String(item.quantity || 0)) ||
										0;
									console.log(`Item ${index} quantity:`, qty);
									totalQuantity += qty;
								});
								console.log(
									"Total from requestItems:",
									totalQuantity
								);
								return totalQuantity;
							}

							// Trường hợp 2: Có subRequests
							if (
								Array.isArray(request.subRequests) &&
								request.subRequests.length > 0
							) {
								request.subRequests.forEach(
									(subReq, subIndex) => {
										if (
											Array.isArray(subReq.requestItems)
										) {
											subReq.requestItems.forEach(
												(item, itemIndex) => {
													const qty =
														parseInt(
															String(
																item.quantity ||
																	0
															)
														) || 0;
													console.log(
														`SubReq ${subIndex} Item ${itemIndex} quantity:`,
														qty
													);
													totalQuantity += qty;
												}
											);
										}
									}
								);
								console.log(
									"Total from subRequests:",
									totalQuantity
								);
								return totalQuantity;
							}

							// Fallback: Dùng productCount nếu có
							if (request.productCount) {
								console.log(
									"Using productCount fallback:",
									request.productCount
								);
								return request.productCount;
							}

							console.log("No quantity found, returning 0");
							return 0;
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
		textTransform: "uppercase",
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
		color: "#1b5e20",
		fontWeight: "500",
		lineHeight: 18,
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
