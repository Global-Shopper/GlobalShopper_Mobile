import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import ProductCard from "../../components/product-card";
import StoreCard from "../../components/store-card";
import { Text } from "../../components/ui/text";

export default function RequestDetails({ navigation, route }) {
	const { request } = route.params || {};
	const [isNoteExpanded, setIsNoteExpanded] = useState(false);

	// Mock data
	const requestDetails = {
		...request,
		deliveryAddress: {
			recipientName: "Nguyễn Văn A",
			phone: "0123456789",
			address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
			isDefault: true,
		},
		note: "Vui lòng kiểm tra kỹ chất lượng sản phẩm trước khi gửi.",
		products: [
			{
				id: "1",
				name: "iPhone 15 Pro Max 256GB",
				description: "Màu xanh dương, chính hãng Apple",
				images: [],
				price: "$1,199",
				convertedPrice: "29,500,000 VNĐ",
				exchangeRate: "24,600",
				category: "Điện tử",
				brand: "Apple",
				material: "Titanium",
				size: "6.7 inch",
				color: "Xanh dương",
				platform: "Apple Store",
				productLink: "https://apple.com/iphone-15-pro",
				mode: request?.type === "with_link" ? "withLink" : "manual",
				status: "pending",
			},
			{
				id: "2",
				name: "AirPods Pro 2nd Gen",
				description: "Có Active Noise Cancellation",
				images: [],
				price: "$249",
				convertedPrice: "6,125,000 VNĐ",
				exchangeRate: "24,600",
				category: "Điện tử",
				brand: "Apple",
				material: "Silicone",
				size: "Standard",
				color: "Trắng",
				platform: "Apple Store",
				productLink: "https://apple.com/airpods-pro",
				mode: request?.type === "with_link" ? "withLink" : "manual",
				status: "pending",
			},
		],
		storeData:
			request?.type === "without_link"
				? {
						storeName: "Tech Store Vietnam",
						storeAddress: "456 Nguyễn Huệ, Quận 1, TP.HCM",
						phoneNumber: "028-3829-5555",
						email: "contact@techstore.vn",
						shopLink: "https://techstore.vn",
				  }
				: null,
	};

	// Generate history based on request status
	const getHistoryByStatus = (status) => {
		const baseHistory = [
			{
				id: "1",
				date: "15/01/2024 14:30",
				action: "Tạo yêu cầu",
				description: "Yêu cầu được tạo với 3 sản phẩm",
				status: "completed",
				isCurrent: false,
			},
		];

		if (status === "processing") {
			return [
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "processing",
					isCurrent: true,
				},
				...baseHistory,
			];
		}

		if (status === "quoted") {
			return [
				{
					id: "3",
					date: "16/01/2024 10:30",
					action: "Đã báo giá",
					description:
						"Nhân viên đã gửi báo giá chi tiết cho yêu cầu",
					status: "quoted",
					isCurrent: true,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		if (status === "cancelled") {
			return [
				{
					id: "3",
					date: "16/01/2024 09:15",
					action: "Đã hủy",
					description:
						"Yêu cầu đã được hủy theo yêu cầu của khách hàng",
					status: "cancelled",
					isCurrent: true,
				},
				{
					id: "2",
					date: "15/01/2024 15:45",
					action: "Đang xử lý",
					description: "Nhân viên đã tiếp nhận và đang xử lý yêu cầu",
					status: "completed",
					isCurrent: false,
				},
				...baseHistory,
			];
		}

		// Default case
		return baseHistory;
	};

	// Add generated history to requestDetails
	requestDetails.history = getHistoryByStatus(request?.status);

	const getStatusColor = (status) => {
		switch (status) {
			case "processing":
				return "#1976D2";
			case "quoted":
				return "#1976D2";
			case "cancelled":
				return "#1976D2";
			case "completed":
				return "#6c757d";
			default:
				return "#6c757d";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "processing":
				return "Đang xử lý";
			case "quoted":
				return "Đã báo giá";
			case "cancelled":
				return "Đã huỷ";
			default:
				return "Không xác định";
		}
	};

	const getRequestTypeIcon = (type) => {
		return type === "with_link" ? "link-outline" : "create-outline";
	};

	const getRequestTypeBorderColor = (type) => {
		return type === "with_link" ? "#42A5F5" : "#28a745";
	};

	const getRequestTypeText = (type) => {
		return type === "with_link" ? "Có link sản phẩm" : "Không có link";
	};

	// Calculate total value for withLink products only
	const withLinkProducts = requestDetails.products.filter(
		(product) => product.mode === "withLink"
	);
	const totalValue = withLinkProducts.reduce((sum, product) => {
		const price = parseFloat(
			product.convertedPrice?.replace(/[^0-9]/g, "") || "0"
		);
		return sum + price;
	}, 0);

	const hasWithLinkProducts = withLinkProducts.length > 0 && totalValue > 0;

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
				contentContainerStyle={styles.scrollContent}
			>
				{/* Request Card - Without product count */}
				<View style={styles.section}>
					<View style={styles.requestCard}>
						{/* Header Section */}
						<View style={styles.cardHeader}>
							<View style={styles.leftSection}>
								<View style={styles.requestTypeContainer}>
									<Ionicons
										name={getRequestTypeIcon(request.type)}
										size={18}
										color={getRequestTypeBorderColor(
											request.type
										)}
									/>
								</View>

								<View style={styles.requestInfo}>
									<Text style={styles.requestCode}>
										#{request.code}
									</Text>
									<Text style={styles.createdDate}>
										{request.createdAt}
									</Text>
								</View>
							</View>

							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(request.status) +
											"20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												request.status
											),
										},
									]}
								>
									{getStatusText(request.status)}
								</Text>
							</View>
						</View>

						{/* Request Type Section */}
						<View style={styles.typeSection}>
							<Text style={styles.typeLabel}>Loại yêu cầu:</Text>
							<Text
								style={[
									styles.typeValue,
									{
										color: getRequestTypeBorderColor(
											request.type
										),
									},
								]}
							>
								{getRequestTypeText(request.type)}
							</Text>
						</View>
					</View>
				</View>

				{/* Delivery Address */}
				<View style={styles.section}>
					<AddressSmCard
						recipientName={
							requestDetails.deliveryAddress?.recipientName
						}
						phone={requestDetails.deliveryAddress?.phone}
						address={requestDetails.deliveryAddress?.address}
						isDefault={requestDetails.deliveryAddress?.isDefault}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={false}
						showEditButton={false}
					/>
				</View>

				{/* Store Information - Show only for without_link requests */}
				{request.type === "without_link" &&
					requestDetails.storeData && (
						<View style={styles.section}>
							<StoreCard
								storeName={requestDetails.storeData.storeName}
								storeAddress={
									requestDetails.storeData.storeAddress
								}
								phoneNumber={
									requestDetails.storeData.phoneNumber
								}
								email={requestDetails.storeData.email}
								shopLink={requestDetails.storeData.shopLink}
								mode="manual"
								showEditButton={false}
							/>
						</View>
					)}

				{/* Product List */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm ({requestDetails.products.length}{" "}
							sản phẩm)
						</Text>
					</View>

					{requestDetails.products.map((product, index) => (
						<ProductCard
							key={product.id || index}
							id={product.id || index.toString()}
							name={product.name || "Sản phẩm không tên"}
							description={product.description}
							images={product.images}
							price={
								product.mode === "manual"
									? ""
									: product.price || ""
							}
							convertedPrice={
								product.mode === "manual"
									? ""
									: product.convertedPrice
							}
							exchangeRate={
								product.mode === "manual"
									? undefined
									: product.exchangeRate
							}
							category={product.category}
							brand={product.brand}
							material={product.material}
							size={product.size}
							color={product.color}
							platform={product.platform}
							productLink={product.productLink}
							mode={product.mode}
							sellerInfo={product.sellerInfo}
							status="pending"
							showEditButton={false}
						/>
					))}

					{/* Divider */}
					<View style={styles.divider} />

					{/* Total Value - Only show for withLink products */}
					{hasWithLinkProducts && (
						<View style={styles.totalSection}>
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>
									Tổng giá trị ước tính:
								</Text>
								<Text style={styles.totalValue}>
									{totalValue.toLocaleString("vi-VN")} VNĐ
								</Text>
							</View>
							<Text style={styles.totalNote}>
								*Giá cuối cùng có thể thay đổi tùy thuộc vào tỷ
								giá, phí vận chuyển và phí dịch vụ
							</Text>
						</View>
					)}
				</View>

				{/* Note Section */}
				{requestDetails.note && (
					<View style={styles.section}>
						<TouchableOpacity
							style={styles.noteHeader}
							onPress={() => setIsNoteExpanded(!isNoteExpanded)}
						>
							<View style={styles.noteHeaderLeft}>
								<Ionicons
									name="chatbox-outline"
									size={20}
									color="#1976D2"
								/>
								<Text style={styles.sectionTitle}>
									Lời nhắn từ khách hàng
								</Text>
							</View>
							<View style={styles.noteHeaderRight}>
								<Ionicons
									name={
										isNoteExpanded
											? "chevron-up-outline"
											: "chevron-down-outline"
									}
									size={22}
									color="#1976D2"
								/>
							</View>
						</TouchableOpacity>

						{isNoteExpanded && (
							<View style={styles.noteContainer}>
								<Text style={styles.noteText}>
									{requestDetails.note}
								</Text>
							</View>
						)}
					</View>
				)}

				{/* Request History */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Lịch sử yêu cầu</Text>
					</View>

					<View style={styles.historyContainer}>
						{requestDetails.history.map((item, index) => (
							<View
								key={item.id}
								style={[
									styles.historyItem,
									item.isCurrent && styles.currentHistoryItem,
								]}
							>
								<View style={styles.historyLeft}>
									<View
										style={[
											styles.historyDot,
											{
												backgroundColor: getStatusColor(
													item.status
												),
											},
											item.isCurrent &&
												styles.currentHistoryDot,
										]}
									/>
									{index <
										requestDetails.history.length - 1 && (
										<View style={styles.historyLine} />
									)}
								</View>
								<View
									style={[
										styles.historyContent,
										item.isCurrent &&
											styles.currentHistoryContent,
									]}
								>
									<View style={styles.historyHeader}>
										<Text
											style={[
												styles.historyAction,
												item.isCurrent &&
													styles.currentHistoryAction,
											]}
										>
											{item.action}
										</Text>
										<Text
											style={[
												styles.historyDate,
												item.isCurrent &&
													styles.currentHistoryDate,
											]}
										>
											{item.date}
										</Text>
									</View>
									<Text
										style={[
											styles.historyDescription,
											item.isCurrent &&
												styles.currentHistoryDescription,
										]}
									>
										{item.description}
									</Text>
								</View>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
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
		paddingVertical: 8,
		paddingBottom: 30,
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
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 14,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
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
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 6,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#e9ecef",
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
	typeSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	typeLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
	},
	typeValue: {
		fontSize: 14,
		fontWeight: "600",
	},
	totalSection: {
		backgroundColor: "#F3F4F6",
		padding: 10,
		borderRadius: 10,
		marginTop: 6,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	totalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#D32F2F",
	},
	totalNote: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 8,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		marginBottom: 4,
	},
	noteHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		flex: 1,
	},
	noteHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	noteContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		padding: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	noteText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
	},
	historyContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 18,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	historyItem: {
		flexDirection: "row",
		marginBottom: 20,
		paddingVertical: 4,
	},
	currentHistoryItem: {
		backgroundColor: "#f0f8ff",
		marginHorizontal: -12,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e3f2fd",
	},
	historyLeft: {
		alignItems: "center",
		marginRight: 14,
	},
	historyDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginTop: 6,
	},
	currentHistoryDot: {
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 3,
		borderColor: "#ffffff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
	},
	historyLine: {
		width: 2,
		flex: 1,
		backgroundColor: "#e9ecef",
		marginTop: 10,
	},
	historyContent: {
		flex: 1,
	},
	currentHistoryContent: {
		paddingLeft: 4,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 6,
		flexWrap: "wrap",
	},
	historyAction: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		flex: 1,
	},
	currentHistoryAction: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1976D2",
	},
	currentBadge: {
		fontSize: 12,
		fontWeight: "500",
		color: "#42A5F5",
	},
	historyDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	currentHistoryDate: {
		fontSize: 13,
		color: "#1976D2",
		fontWeight: "600",
	},
	historyDescription: {
		fontSize: 13,
		color: "#666",
		lineHeight: 19,
	},
	currentHistoryDescription: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		fontWeight: "500",
	},
});
