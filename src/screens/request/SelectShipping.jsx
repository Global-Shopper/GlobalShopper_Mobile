import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useGetShippingRatesMutation } from "../../services/gshopApi";
import { getFedexRatePayload } from "../../utils/fedexPayload";

export default function SelectShipping({ navigation, route }) {
	const { quotation, onShippingSelect } = route.params || {};
	const [shippingMethods, setShippingMethods] = useState([]);
	const [selectedShipping, setSelectedShipping] = useState(null);
	const [loading, setLoading] = useState(true);

	const [getShippingRates] = useGetShippingRatesMutation();

	useEffect(() => {
		fetchShippingRates();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchShippingRates = async () => {
		if (!quotation) {
			Alert.alert("Lỗi", "Không có thông tin quotation");
			navigation.goBack();
			return;
		}

		console.log("📦 Quotation data for shipping rates:", {
			totalWeightEstimate: quotation.totalWeightEstimate,
			packageType: quotation.packageType,
			shipper: quotation.shipper,
			recipient: quotation.recipient,
		});

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

			// Try both payload formats
			const shippingPayload = {
				inputJson: fedexPayload, // Wrapped format
			};

			const directPayload = fedexPayload; // Direct format

			console.log(
				"Fetching shipping rates with wrapped payload:",
				JSON.stringify(shippingPayload, null, 2)
			);
			console.log(
				"Direct payload format:",
				JSON.stringify(directPayload, null, 2)
			);
			console.log("API Endpoint being called: /shipping/rate");
			console.log("Full URL will be: [BASE_URL]/shipping/rate");

			try {
				// Try wrapped format first
				let result;
				try {
					console.log("🔄 Trying wrapped format (inputJson)...");
					result = await getShippingRates(shippingPayload).unwrap();
					console.log(
						"✅ Shipping rates API success with wrapped format:",
						result
					);
				} catch (wrappedError) {
					console.log(
						"❌ Wrapped format failed, trying direct format..."
					);
					console.log("Wrapped error:", wrappedError);

					// Try direct format
					result = await getShippingRates(directPayload).unwrap();
					console.log(
						"✅ Shipping rates API success with direct format:",
						result
					);
				}

				// Parse actual FedEx response - check multiple possible structures
				let rateReplyDetails = null;

				if (result?.output?.rateReplyDetails) {
					// Structure: result.output.rateReplyDetails
					rateReplyDetails = result.output.rateReplyDetails;
					console.log("📦 Found rateReplyDetails in result.output");
				} else if (result?.rateReplyDetails) {
					// Structure: result.rateReplyDetails (direct)
					rateReplyDetails = result.rateReplyDetails;
					console.log("📦 Found rateReplyDetails in result directly");
				}

				if (rateReplyDetails && Array.isArray(rateReplyDetails)) {
					console.log(
						"📦 Parsing real API response with",
						rateReplyDetails.length,
						"shipping options"
					);
					const shippingOptions = rateReplyDetails.map((rate) => {
						console.log(
							"Processing rate:",
							rate.serviceType,
							rate.serviceName
						);

						// Find VND rate (PREFERRED_CURRENCY) first
						let bestRate = null;
						if (
							rate.ratedShipmentDetails &&
							Array.isArray(rate.ratedShipmentDetails)
						) {
							// Look for PREFERRED_CURRENCY with VND
							bestRate = rate.ratedShipmentDetails.find(
								(detail) =>
									detail.rateType === "PREFERRED_CURRENCY" &&
									detail.currency === "VND"
							);

							// If no VND PREFERRED_CURRENCY, try any VND rate
							if (!bestRate) {
								bestRate = rate.ratedShipmentDetails.find(
									(detail) => detail.currency === "VND"
								);
							}

							// Fallback to first rate (usually ACCOUNT rate)
							if (!bestRate) {
								bestRate = rate.ratedShipmentDetails[0];
							}
						}

						console.log("Selected rate detail:", {
							rateType: bestRate?.rateType,
							currency: bestRate?.currency,
							totalNetCharge: bestRate?.totalNetCharge,
							totalBaseCharge: bestRate?.totalBaseCharge,
						});

						// Convert USD to VND if needed (approximate rate: 1 USD = 24000 VND)
						let displayCost =
							bestRate?.totalNetCharge ||
							bestRate?.totalBaseCharge ||
							0;
						let displayCurrency = bestRate?.currency || "USD";

						if (displayCurrency === "USD" && displayCost > 0) {
							displayCost = displayCost * 24000; // Rough conversion
							displayCurrency = "VNĐ (ước tính)";
							console.log("Converted USD to VND:", displayCost);
						}

						return {
							serviceCode: rate.serviceType,
							serviceName: rate.serviceName,
							description:
								rate.serviceDescription?.description ||
								rate.operationalDetail?.astraDescription ||
								"Vận chuyển quốc tế",
							totalCost: displayCost,
							currency: displayCurrency,
							deliveryTime: getDeliveryTime(rate.serviceType),
							packageType:
								rate.packagingType || "FEDEX_SMALL_BOX",
							// Additional details for UI
							baseCharge: bestRate?.totalBaseCharge || 0,
							surcharges: bestRate?.totalSurcharges || 0,
							discounts: bestRate?.totalDiscounts || 0,
							rateType: bestRate?.rateType || "UNKNOWN",
							// Raw data for debugging
							rawRate: rate,
						};
					});

					console.log(
						"✅ Parsed shipping options from real API:",
						shippingOptions
					);
					setShippingMethods(shippingOptions);
				} else {
					console.log("❌ No valid rateReplyDetails found");
					console.log("Response structure:", Object.keys(result));
					setShippingMethods([]);
					Alert.alert(
						"Lỗi",
						"Không thể tải phương thức vận chuyển. Vui lòng thử lại sau.",
						[{ text: "OK" }]
					);
				}
			} catch (apiError) {
				console.log("❌ API call failed");
				console.error("API Error details:", {
					status: apiError?.status,
					message: apiError?.data?.message,
					statusCode: apiError?.data?.statusCode,
					fullError: apiError,
				});

				setShippingMethods([]);
				Alert.alert(
					"Lỗi",
					"Không thể kết nối với dịch vụ vận chuyển. Vui lòng kiểm tra kết nối mạng và thử lại.",
					[{ text: "OK" }]
				);
			}
		} catch (error) {
			console.error("Outer error fetching shipping rates:", error);
			setShippingMethods([]);
			Alert.alert(
				"Lỗi",
				"Có lỗi không xác định xảy ra. Vui lòng thử lại.",
				[{ text: "OK" }]
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
			Alert.alert(
				"Thông báo",
				"Vui lòng chọn một phương thức vận chuyển"
			);
			return;
		}

		// Call the callback function to pass selected shipping back to ConfirmQuotation
		if (onShippingSelect) {
			onShippingSelect(selectedShipping);
		}

		navigation.goBack();
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
