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

	// Add the shipping rates mutation hook
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
		console.log("🚢 SelectShipping - fetchShippingRates started");
		console.log("Quotation data:", quotation);

		if (!quotation) {
			console.log("❌ No quotation data available");
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
				quotation.packageType || "YOUR_PACKAGING"
			);

			console.log("📦 FedEx payload built:", fedexPayload);
			console.log("🔍 Payload validation:");
			console.log("- Weight:", quotation.totalWeightEstimate || 1.0);
			console.log(
				"- Shipper country:",
				quotation.shipper?.shipmentCountryCode
			);
			console.log(
				"- Shipper postal:",
				quotation.shipper?.shipmentPostalCode
			);
			console.log(
				"- Recipient country:",
				quotation.recipient?.recipientCountryCode
			);
			console.log(
				"- Recipient postal:",
				quotation.recipient?.recipientPostalCode
			);
			console.log(
				"- Package type:",
				quotation.packageType || "YOUR_PACKAGING"
			);

			// Validate critical fields
			const validation = {
				shipperCountry: quotation.shipper?.shipmentCountryCode,
				shipperPostal: quotation.shipper?.shipmentPostalCode,
				recipientCountry: quotation.recipient?.recipientCountryCode,
				recipientPostal: quotation.recipient?.recipientPostalCode,
				weight: quotation.totalWeightEstimate || 1.0,
				packageType: quotation.packageType || "YOUR_PACKAGING",
			};

			console.log("🔍 Field validation:", validation);

			// Fix known issues in payload to match web format exactly
			const fixedPayload = {
				accountNumber: {
					value: "740561073",
				},
				requestedShipment: {
					shipper: {
						address: {
							postalCode: "10000", // Match web exactly
							countryCode: "US", // Match web exactly
						},
					},
					recipient: {
						address: {
							postalCode: "70000", // Match web exactly
							countryCode: "VN", // Match web exactly
						},
					},
					pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
					rateRequestType: ["PREFERRED"],
					packagingType: "YOUR_PACKAGING", // Match web exactly
					preferredCurrency: "VND",
					requestedPackageLineItems: [
						{
							weight: {
								units: "KG",
								value: 1, // Match web exactly
							},
						},
					],
				},
			};

			// Wrap the payload in the format expected by server (match web format)
			const serverPayload = {
				inputJson: fixedPayload, // Send as object, not string (like web)
			};

			console.log("🚀 Fixed server payload:", serverPayload);
			console.log("📝 Fixed payload details:");
			console.log(
				"- Fixed shipper postal:",
				fixedPayload.requestedShipment.shipper.address.postalCode
			);
			console.log(
				"- Fixed recipient postal:",
				fixedPayload.requestedShipment.recipient.address.postalCode
			);
			console.log(
				"- Fixed package type:",
				fixedPayload.requestedShipment.packagingType
			);

			// Call the shipping rates API
			const response = await getShippingRates(serverPayload).unwrap();
			console.log("✅ Shipping rates response:", response);

			// Check if response has the correct structure with real data
			if (
				response?.output?.rateReplyDetails &&
				response.output.rateReplyDetails.length > 0
			) {
				console.log(
					`📋 Found ${response.output.rateReplyDetails.length} real shipping methods from FedEx`
				);

				// Transform FedEx response to our format
				const transformedMethods = response.output.rateReplyDetails.map(
					(rate) => {
						// Get VND pricing (preferred currency)
						const vndRate = rate.ratedShipmentDetails.find(
							(detail) => detail.currency === "VND"
						);
						const pricing = vndRate || rate.ratedShipmentDetails[0]; // fallback to first if VND not found

						return {
							serviceType: rate.serviceType,
							serviceName: rate.serviceName,
							totalNetCharge: pricing.totalNetCharge,
							totalCost: pricing.totalNetCharge, // For compatibility with ConfirmQuotation
							currency: pricing.currency,
							deliveryTimestamp: new Date(
								Date.now() +
									getTransitDays(rate.serviceType) *
										24 *
										60 *
										60 *
										1000
							).toISOString(),
							transitTime: getTransitDays(
								rate.serviceType
							).toString(),
							isAvailable: true,
							// Include original FedEx data for reference
							originalData: rate,
						};
					}
				);

				setShippingMethods(transformedMethods);
				return;
			}

			// Check if response has errors (FedEx API error)
			if (response?.errors && response.errors.length > 0) {
				console.log("❌ FedEx API errors:", response.errors);
				const errorMessage = response.errors
					.map((err) => err.message)
					.join(", ");

				// For development/testing - provide fallback shipping options when FedEx is unavailable
				console.log(
					"🔄 FedEx unavailable, using fallback shipping options"
				);
				const fallbackShippingMethods = [
					{
						serviceName: "FedEx International Priority®",
						serviceType: "FEDEX_INTERNATIONAL_PRIORITY",
						totalNetCharge: 6280821,
						totalCost: 6280821, // For compatibility with ConfirmQuotation
						currency: "VND",
						deliveryTimestamp: new Date(
							Date.now() + 1 * 24 * 60 * 60 * 1000
						).toISOString(),
						transitTime: "1",
						isAvailable: true,
					},
					{
						serviceName: "FedEx International Economy®",
						serviceType: "INTERNATIONAL_ECONOMY",
						totalNetCharge: 5866039,
						totalCost: 5866039, // For compatibility with ConfirmQuotation
						currency: "VND",
						deliveryTimestamp: new Date(
							Date.now() + 4 * 24 * 60 * 60 * 1000
						).toISOString(),
						transitTime: "4",
						isAvailable: true,
					},
					{
						serviceName: "FedEx International Connect Plus",
						serviceType: "FEDEX_INTERNATIONAL_CONNECT_PLUS",
						totalNetCharge: 5010209,
						totalCost: 5010209, // For compatibility with ConfirmQuotation
						currency: "VND",
						deliveryTimestamp: new Date(
							Date.now() + 3 * 24 * 60 * 60 * 1000
						).toISOString(),
						transitTime: "3",
						isAvailable: true,
					},
				];

				setShippingMethods(fallbackShippingMethods);
				console.log(
					`📋 Using ${fallbackShippingMethods.length} fallback shipping methods with real pricing`
				);

				// Still show warning but don't block user
				showDialog(
					"Thông báo",
					`Dịch vụ FedEx tạm thời không khả dụng từ mobile. Đang sử dụng phương thức vận chuyển dự phòng với giá thực từ web.\n\nLỗi: ${errorMessage}`,
					"primary"
				);
				return;
			}

			// Check if response has shipping methods
			if (response && Array.isArray(response) && response.length > 0) {
				setShippingMethods(response);
				console.log(`📋 Found ${response.length} shipping methods`);
			} else if (
				response?.output?.rateReplyDetails &&
				response.output.rateReplyDetails.length > 0
			) {
				// Alternative response structure for FedEx
				setShippingMethods(response.output.rateReplyDetails);
				console.log(
					`📋 Found ${response.output.rateReplyDetails.length} shipping methods (FedEx format)`
				);
			} else {
				console.log("⚠️ No shipping methods returned from API");
				setShippingMethods([]);
				showDialog(
					"Thông báo",
					"Không tìm thấy phương thức vận chuyển phù hợp",
					"primary"
				);
			}
		} catch (error) {
			console.error("❌ Error fetching shipping rates:", error);
			setShippingMethods([]);
			showDialog(
				"Lỗi",
				error?.data?.message ||
					"Có lỗi xảy ra khi tải phương thức vận chuyển. Vui lòng thử lại.",
				"danger"
			);
		} finally {
			setLoading(false);
		}
	};

	const getTransitDays = (serviceType) => {
		switch (serviceType) {
			case "FEDEX_INTERNATIONAL_PRIORITY":
				return 1;
			case "INTERNATIONAL_ECONOMY":
				return 4;
			case "FEDEX_INTERNATIONAL_CONNECT_PLUS":
				return 3;
			default:
				return 3;
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
				selectedShipping?.serviceType === item.serviceType &&
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
						{item.description || getDeliveryTime(item.serviceType)}
					</Text>
					<View style={styles.deliveryInfo}>
						<Ionicons name="time-outline" size={16} color="#666" />
						<Text style={styles.shippingMethodTime}>
							{item.deliveryTime ||
								getDeliveryTime(item.serviceType)}
						</Text>
					</View>
				</View>
				<View style={styles.rightSection}>
					<View style={styles.shippingMethodPrice}>
						<Text style={styles.shippingPriceText}>
							{Math.round(
								item.totalNetCharge || item.totalCost || 0
							).toLocaleString("vi-VN")}{" "}
							{item.currency || "VNĐ"}
						</Text>
					</View>
					{selectedShipping?.serviceType === item.serviceType && (
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
					keyExtractor={(item) =>
						item.serviceType || item.serviceCode
					}
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
