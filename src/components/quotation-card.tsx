import { StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface QuotationCardProps {
	// Original prices (no conversion)
	originalProductPrice?: number;
	originalCurrency?: string;
	exchangeRate?: number;

	// USD prices for fees
	originalServiceFee?: number;
	originalShipping?: number;

	// VND converted prices (remove defaults)
	productPrice?: number;
	serviceFee?: number;
	serviceFeePercent?: number;
	internationalShipping?: number;
	importTax?: number;
	domesticShipping?: number;

	// Dynamic fees from admin
	adminFees?: {
		feeName: string;
		amount: number;
		currency: string;
	}[];

	// New props for API data
	totalVNDPrice?: number;
	totalPriceEstimate?: number;
	totalPriceBeforeExchange?: number;
	shippingEstimate?: number;

	// Tax details
	taxDetails?: {
		importDuty?: number;
		vat?: number;
		specialConsumptionTax?: number;
		environmentTax?: number;
		totalTaxAmount?: number;
	};

	// Tax rates from API
	taxRates?: {
		region: string;
		taxType: string;
		rate: number;
		taxName: string;
	}[];

	additionalFees?: {
		actualImportTax?: number;
		actualShipping?: number;
		importTaxIncrease?: number;
		shippingIncrease?: number;
	};
	totalAmount?: number;
	updatedTotalAmount?: number;
	isExpanded?: boolean;
}

export default function QuotationCard({
	// Original prices
	originalProductPrice,
	originalCurrency = "USD",
	exchangeRate = 1,

	// USD prices for fees
	originalServiceFee,
	originalShipping,

	// VND converted prices (no defaults)
	productPrice,
	serviceFee,
	serviceFeePercent = 0,
	internationalShipping,
	importTax,
	domesticShipping,

	// Dynamic fees from admin
	adminFees,

	// New props for API data
	totalVNDPrice,
	totalPriceEstimate,
	totalPriceBeforeExchange,
	shippingEstimate: shippingFromProps,

	// Tax details
	taxDetails,

	// Tax rates from API
	taxRates,

	additionalFees,
	totalAmount,
	updatedTotalAmount,
	isExpanded = false,
}: QuotationCardProps) {
	const formatCurrency = (amount: number): string => {
		return amount.toLocaleString("vi-VN");
	};

	const formatOriginalCurrency = (
		amount: number,
		currency: string = "CNY"
	): string => {
		return `${amount.toLocaleString("vi-VN")} ${currency}`;
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.headerTitle}>Báo giá chi tiết</Text>
				</View>
			</View>

			<View style={styles.content}>
				{/* Basic Pricing */}
				<View style={styles.section}>
					{/* Product Price - Show original currency */}
					<View style={styles.priceRow}>
						<Text style={styles.label}>Giá sản phẩm:</Text>
						<Text style={styles.value}>
							{originalProductPrice
								? formatOriginalCurrency(
										originalProductPrice,
										originalCurrency
								  )
								: productPrice
								? formatCurrency(productPrice) + " VNĐ"
								: "0 VNĐ"}
						</Text>
					</View>

					{/* Service Fee - Show original currency only */}
					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Phí dịch vụ ({serviceFeePercent}%):
						</Text>
						<Text style={styles.value}>
							{originalServiceFee
								? formatOriginalCurrency(
										originalServiceFee,
										originalCurrency
								  )
								: "0 " + originalCurrency}
						</Text>
					</View>

					{/* Total before conversion - Make prominent with red color */}
					{totalPriceBeforeExchange && (
						<View style={styles.priceRow}>
							<Text style={styles.label}>
								Tổng trước quy đổi:
							</Text>
							<Text style={[styles.value, styles.prominentValue]}>
								{formatOriginalCurrency(
									totalPriceBeforeExchange,
									originalCurrency
								)}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.divider} />

				{/* Admin Fees Section */}
				{adminFees && adminFees.length > 0 && (
					<View style={styles.section}>
						{adminFees.map((fee, index) => (
							<View key={index} style={styles.priceRow}>
								<Text style={styles.label}>{fee.feeName}:</Text>
								<Text style={styles.value}>
									{formatCurrency(fee.amount || 0)}{" "}
									{fee.currency}
								</Text>
							</View>
						))}
					</View>
				)}

				{/* Shipping Fee Section */}
				{shippingFromProps && (
					<View style={styles.section}>
						<View style={styles.priceRow}>
							<Text style={styles.label}>Phí vận chuyển:</Text>
							<Text style={styles.value}>
								{formatCurrency(shippingFromProps)} VNĐ
							</Text>
						</View>
					</View>
				)}

				<View style={styles.divider} />

				{/* Final Total Section */}
				<View style={styles.totalSection}>
					<View style={styles.totalRowCompact}>
						<Text style={styles.totalLabelCompact}>Tổng tiền:</Text>
						<Text style={styles.totalValue}>
							{formatCurrency(
								(totalPriceEstimate || totalVNDPrice || 0) +
									(shippingFromProps || 0)
							)}{" "}
							VNĐ
						</Text>
					</View>
				</View>

				{/* Note */}
				<View style={styles.noteSection}>
					<Text style={styles.noteText}>
						💡 Thuế và phí vận chuyển sẽ được cập nhật chính xác sau
						khi đơn hàng về kho
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		marginBottom: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	content: {
		padding: 14,
	},
	// Exchange Rate Section
	exchangeSection: {
		backgroundColor: "#e3f2fd",
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
	},
	exchangeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	exchangeLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	exchangeHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: 4,
	},
	exchangeTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1976D2",
	},
	exchangeRate: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1976D2",
	},
	section: {
		marginBottom: 8,
	},
	shippingSection: {
		marginTop: 4,
	},
	priceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 6,
	},
	priceColumn: {
		alignItems: "flex-end",
	},
	originalPrice: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
		marginBottom: 2,
	},
	label: {
		fontSize: 14,
		color: "#666",
		flex: 1,
	},
	value: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		textAlign: "right",
	},
	prominentValue: {
		color: "#D32F2F",
		fontWeight: "700",
	},
	// Tax Details Section
	taxHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 8,
		marginBottom: 8,
		paddingVertical: 6,
		paddingHorizontal: 8,
		backgroundColor: "#fff8e1",
		borderRadius: 6,
	},
	taxHeaderCompact: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginTop: 8,
		marginBottom: 6,
		paddingVertical: 4,
		paddingHorizontal: 0,
	},
	taxHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	taxTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#ff9800",
	},
	taxRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 4,
		paddingHorizontal: 12,
	},
	taxRowCompact: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 3,
		paddingHorizontal: 8,
		marginVertical: 1,
	},
	taxLabel: {
		fontSize: 13,
		color: "#666",
		flex: 1,
	},
	taxLabelCompact: {
		fontSize: 13,
		color: "#666",
		flex: 1,
	},
	taxValue: {
		fontSize: 13,
		fontWeight: "600",
		color: "#333",
		textAlign: "right",
	},
	taxValueCompact: {
		fontSize: 13,
		fontWeight: "600",
		color: "#333",
		textAlign: "right",
	},
	taxTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginTop: 4,
		borderTopWidth: 1,
		borderTopColor: "#ffe0b2",
		backgroundColor: "#fff8e1",
		borderRadius: 6,
	},
	taxTotalRowCompact: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 8,
		marginTop: 6,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
	},
	taxTotalLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#ff9800",
	},
	taxTotalValue: {
		fontSize: 14,
		fontWeight: "700",
		color: "#ff9800",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 10,
	},
	totalSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 10,
		marginBottom: 8,
	},
	originalTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#dee2e6",
	},
	originalTotalLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#666",
	},
	originalTotalValue: {
		fontSize: 14,
		fontWeight: "700",
		color: "#666",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	totalRowCompact: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	totalLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	totalIcon: {
		fontSize: 16,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: "700",
		color: "#333",
	},
	totalLabelCompact: {
		fontSize: 16,
		fontWeight: "700",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#D32F2F",
	},
	additionalFeesSection: {
		marginTop: 8,
		marginBottom: 8,
	},
	additionalFeesTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	additionalFeeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 6,
	},
	additionalFeeLabel: {
		fontSize: 14,
		color: "#666",
		flex: 1,
	},
	additionalFeeValue: {
		alignItems: "flex-end",
	},
	actualAmount: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	increaseAmount: {
		fontSize: 12,
		color: "#ff9800",
		fontWeight: "500",
		marginTop: 2,
	},
	differenceSection: {
		backgroundColor: "#fff3e0",
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
	},
	differenceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	differenceLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	differenceIcon: {
		fontSize: 16,
	},
	differenceLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	differenceValue: {
		fontSize: 16,
		fontWeight: "700",
	},
	positiveValue: {
		color: "#ff9800",
	},
	negativeValue: {
		color: "#28a745",
	},
	updatedTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#ffe0b2",
	},
	updatedTotalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	updatedTotalValue: {
		fontSize: 17,
		fontWeight: "700",
		color: "#D32F2F",
	},
	noteSection: {
		backgroundColor: "#f0f8ff",
		borderRadius: 8,
		padding: 10,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
	},
	noteText: {
		fontSize: 12,
		color: "#666",
		lineHeight: 16,
		fontStyle: "italic",
	},
});
