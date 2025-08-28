import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Dialog from "../../components/dialog";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useGetShippingRatesMutation } from "../../services/gshopApi";
import { getFedexRatePayload } from "../../utils/fedexPayload";

export default function SelectShipping({ navigation, route }) {
	const { quotation, onShippingSelect } = route.params || {};
	const [shippingMethods, setShippingMethods] = useState([]);
	const [selectedShipping, setSelectedShipping] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dialogConfig, setDialogConfig] = useState({
		visible: false,
		title: "",
		message: "",
		primaryButtonText: "OK",
		primaryButtonStyle: "primary",
		onPrimaryPress: null,
		secondaryButtonText: null,
		onSecondaryPress: null,
	});

	const [getShippingRates] = useGetShippingRatesMutation();

	// Helper functions for dialog management
	const showDialog = (
		title,
		message,
		style = "primary",
		primaryText = "OK",
		onPrimaryPress = null,
		secondaryText = null,
		onSecondaryPress = null
	) => {
		setDialogConfig({
			visible: true,
			title,
			message,
			primaryButtonText: primaryText,
			primaryButtonStyle: style,
			onPrimaryPress: onPrimaryPress || closeDialog,
			secondaryButtonText: secondaryText,
			onSecondaryPress: onSecondaryPress,
		});
	};

	const closeDialog = () => {
		setDialogConfig((prev) => ({ ...prev, visible: false }));
	};

	useEffect(() => {
		fetchShippingRates();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchShippingRates = async () => {
		if (!quotation) {
			showDialog(
				"Lỗi",
				"Không có thông tin quotation",
				"danger",
				"OK",
				() => {
					closeDialog();
					navigation.goBack();
				}
			);
			return;
		}

		setLoading(true);
		try {
			// Build FedEx API compatible payload using utils
			const fedexPayload = getFedexRatePayload(
				quotation.totalWeightEstimate || 1.0,
				quotation.shipper,
				quotation.recipient,
				"VND",
				quotation.packageType || "FEDEX_SMALL_BOX"
			);
		} catch (_error) {
			setShippingMethods([]);
			showDialog(
				"Lỗi",
				"Có lỗi không xác định xảy ra. Vui lòng thử lại.",
				"danger"
			);
		} finally {
			setLoading(false);
		}
	};

	const getDeliveryTime = (serviceType) => {
		switch (serviceType) {
			case "FEDEX_INTERNATIONAL_PRIORITY":
				return "1-2 ngày làm việc";
			case "INTERNATIONAL_ECONOMY":
				return "4-6 ngày làm việc";
			case "FEDEX_INTERNATIONAL_CONNECT_PLUS":
				return "3-4 ngày làm việc";
			default:
				return "3-5 ngày làm việc";
		}
	};

	const handleSelectShipping = () => {
		if (!selectedShipping) {
			showDialog(
				"Thông báo",
				"Vui lòng chọn một phương thức vận chuyển",
				"primary"
			);
			return;
		}

		// Use callback if available, otherwise use navigation params
		if (onShippingSelect) {
			onShippingSelect(selectedShipping);
			navigation.goBack();
		} else {
			// Fallback: navigate back with params
			navigation.navigate("ConfirmQuotation", {
				selectedShipping: selectedShipping,
			});
		}
	};

	const renderShippingItem = ({ item }) => (
		<TouchableOpacity
			style={[
				styles.shippingMethodItem,
				selectedShipping?.serviceCode === item.serviceCode &&
					styles.selectedShippingMethod,
			]}
			onPress={() => setSelectedShipping(item)}
		>
			<View style={styles.shippingMethodContent}>
				<View style={styles.shippingMethodInfo}>
					<Text style={styles.shippingMethodName}>
						{item.serviceName}
					</Text>
					<Text style={styles.shippingMethodDesc}>
						{item.description}
					</Text>
					<View style={styles.deliveryInfo}>
						<Ionicons name="time-outline" size={16} color="#666" />
						<Text style={styles.shippingMethodTime}>
							{item.deliveryTime}
						</Text>
					</View>
				</View>
				<View style={styles.rightSection}>
					<View style={styles.shippingMethodPrice}>
						<Text style={styles.shippingPriceText}>
							{Math.round(item.totalCost || 0).toLocaleString(
								"vi-VN"
							)}{" "}
							{item.currency || "VNĐ"}
						</Text>
					</View>
					{selectedShipping?.serviceCode === item.serviceCode && (
						<View style={styles.selectedIndicator}>
							<Ionicons
								name="checkmark-circle"
								size={24}
								color="#1976D2"
							/>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<Header
					title="Chọn phương thức vận chuyển"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1976D2" />
					<Text style={styles.loadingText}>
						Đang tải phương thức vận chuyển...
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header
				title="Chọn phương thức vận chuyển"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<View style={styles.content}>
				<View style={styles.infoSection}>
					<Text style={styles.infoTitle}>
						Chọn phương thức vận chuyển phù hợp
					</Text>
					<Text style={styles.infoText}>
						Phí vận chuyển và thời gian giao hàng có thể thay đổi
						tùy theo trọng lượng và kích thước thực tế của hàng hóa
					</Text>
				</View>

				<FlatList
					data={shippingMethods}
					renderItem={renderShippingItem}
					keyExtractor={(item) => item.serviceCode}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContainer}
					ItemSeparatorComponent={() => (
						<View style={styles.separator} />
					)}
					ListEmptyComponent={() => (
						<View style={styles.emptyContainer}>
							<Ionicons
								name="cube-outline"
								size={64}
								color="#ccc"
							/>
							<Text style={styles.emptyTitle}>
								Không có phương thức vận chuyển
							</Text>
							<Text style={styles.emptyText}>
								Không thể tải phương thức vận chuyển. Vui lòng
								kiểm tra thông tin địa chỉ và thử lại.
							</Text>
						</View>
					)}
				/>
			</View>

			{/* Fixed Confirm Button */}
			<View style={styles.fixedButtonContainer}>
				<TouchableOpacity
					style={[
						styles.confirmButton,
						!selectedShipping && styles.confirmButtonDisabled,
					]}
					onPress={handleSelectShipping}
					disabled={!selectedShipping}
				>
					<Text
						style={[
							styles.confirmButtonText,
							!selectedShipping &&
								styles.confirmButtonTextDisabled,
						]}
					>
						{selectedShipping
							? "Xác nhận"
							: "Chọn phương thức vận chuyển"}
					</Text>
				</TouchableOpacity>
			</View>

			{/* Dialog Component */}
			<Dialog
				visible={dialogConfig.visible}
				title={dialogConfig.title}
				message={dialogConfig.message}
				onClose={closeDialog}
				primaryButton={{
					text: dialogConfig.primaryButtonText,
					onPress: dialogConfig.onPrimaryPress,
					style: dialogConfig.primaryButtonStyle,
				}}
				secondaryButton={
					dialogConfig.secondaryButtonText
						? {
								text: dialogConfig.secondaryButtonText,
								onPress: dialogConfig.onSecondaryPress,
						  }
						: undefined
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	infoSection: {
		backgroundColor: "#ffffff",
		padding: 16,
		borderRadius: 12,
		marginTop: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	infoText: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	listContainer: {
		paddingBottom: 100, // Reduced since no preview section
	},
	separator: {
		height: 12,
	},
	shippingMethodItem: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	selectedShippingMethod: {
		borderColor: "#1976D2",
		borderWidth: 2,
		backgroundColor: "#F3F8FF",
	},
	shippingMethodContent: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	shippingMethodInfo: {
		flex: 1,
		marginRight: 12,
	},
	rightSection: {
		alignItems: "flex-end",
		justifyContent: "center",
		minWidth: 100,
	},
	shippingMethodName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 6,
	},
	shippingMethodDesc: {
		fontSize: 14,
		color: "#666",
		marginBottom: 8,
		lineHeight: 18,
	},
	deliveryInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	shippingMethodTime: {
		fontSize: 13,
		color: "#666",
		marginLeft: 6,
	},
	shippingMethodPrice: {
		alignItems: "flex-end",
	},
	shippingPriceText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1976D2",
		marginBottom: 4,
	},
	selectedIndicator: {
		marginTop: 4,
		alignItems: "center",
	},
	fixedButtonContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	confirmButton: {
		backgroundColor: "#1976D2",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	confirmButtonDisabled: {
		backgroundColor: "#E0E0E0",
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	confirmButtonTextDisabled: {
		color: "#9E9E9E",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 60,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	emptyText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 20,
	},
	// Preview section styles
	previewSection: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	previewTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	previewCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 2,
		borderColor: "#1976D2",
	},
	previewHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	previewServiceName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		flex: 1,
		marginRight: 12,
	},
	previewTotalCost: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1976D2",
	},
	previewDescription: {
		fontSize: 14,
		color: "#666",
		marginBottom: 12,
		lineHeight: 18,
	},
	previewDetails: {
		gap: 8,
	},
	previewDetailRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	previewDetailText: {
		fontSize: 13,
		color: "#666",
		flex: 1,
	},
});
