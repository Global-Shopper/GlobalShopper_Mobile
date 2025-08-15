import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface QuotationCardProps {
	// Original prices (no conversion)
	originalProductPrice?: number;
	originalCurrency?: string;
	exchangeRate?: number;

	// VND converted prices
	productPrice?: number;
	serviceFee?: number;
	serviceFeePercent?: number;
	internationalShipping?: number;
	importTax?: number;
	domesticShipping?: number;

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

	// VND converted prices
	productPrice = 1200000,
	serviceFee = 60000,
	serviceFeePercent = 5,
	internationalShipping = 200000,
	importTax = 120000,
	domesticShipping = 35000,

	// Tax details
	taxDetails,

	// Tax rates from API
	taxRates,

	additionalFees,
	totalAmount = 1615000,
	updatedTotalAmount,
	isExpanded = false,
}: QuotationCardProps) {
	const formatCurrency = (amount: number) => {
		return `${Math.round(amount).toLocaleString("vi-VN")} VNĐ`;
	};

	const formatOriginalCurrency = (amount: number, currency: string) => {
		return `${amount.toLocaleString("en-US")} ${currency}`;
	};

	const formatExchangeRate = (rate: number, currency: string) => {
		return `1 ${currency} = ${rate.toLocaleString("vi-VN")} VND`;
	};

	const totalDifference = additionalFees
		? (additionalFees.importTaxIncrease || 0) +
		  (additionalFees.shippingIncrease || 0)
		: 0;

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Ionicons
						name="receipt-outline"
						size={20}
						color="#1976D2"
					/>
					<Text style={styles.headerTitle}>Báo giá chi tiết</Text>
				</View>
			</View>

			<View style={styles.content}>
				{/* Exchange Rate Section */}
				{originalProductPrice && exchangeRate > 1 && (
					<>
						<View style={styles.exchangeSection}>
							<View style={styles.exchangeRow}>
								<View style={styles.exchangeLeft}>
									<Ionicons
										name="swap-horizontal-outline"
										size={16}
										color="#1976D2"
									/>
									<Text style={styles.exchangeTitle}>
										Tỷ giá:
									</Text>
								</View>
								<Text style={styles.exchangeRate}>
									{formatExchangeRate(
										exchangeRate,
										originalCurrency
									)}
								</Text>
							</View>
						</View>
						<View style={styles.divider} />
					</>
				)}

				{/* Basic Pricing */}
				<View style={styles.section}>
					{/* Product Price */}
					<View style={styles.priceRow}>
						<Text style={styles.label}>Giá sản phẩm:</Text>
						<View style={styles.priceColumn}>
							{originalProductPrice && (
								<Text style={styles.originalPrice}>
									{formatOriginalCurrency(
										originalProductPrice,
										originalCurrency
									)}
								</Text>
							)}
							<Text style={styles.value}>
								{formatCurrency(productPrice)}
							</Text>
						</View>
					</View>

					{/* Service Fee */}
					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Phí dịch vụ ({serviceFeePercent}%):
						</Text>
						<Text style={styles.value}>
							{formatCurrency(serviceFee)}
						</Text>
					</View>

					{/* Total before conversion (for online requests) */}
					{originalProductPrice && exchangeRate > 1 && (
						<View style={styles.priceRow}>
							<Text style={styles.label}>
								Tổng trước quy đổi:
							</Text>
							<Text style={styles.value}>
								{formatOriginalCurrency(
									originalProductPrice +
										(originalProductPrice *
											serviceFeePercent) /
											100,
									originalCurrency
								)}
							</Text>
						</View>
					)}

					{/* Tax Details Section */}
					{taxRates && taxRates.length > 0 ? (
						<>
							<View style={styles.taxHeaderCompact}>
								<View style={styles.taxHeaderLeft}>
									<Ionicons
										name="document-text-outline"
										size={16}
										color="#ff9800"
									/>
									<Text style={styles.taxTitle}>
										Chi tiết thuế nhập khẩu
									</Text>
								</View>
							</View>

							{taxRates.map((tax, index) => (
								<View key={index} style={styles.taxRowCompact}>
									<Text style={styles.taxLabelCompact}>
										• {tax.taxName} ({tax.rate}%)
									</Text>
									<Text style={styles.taxValueCompact}>
										{formatCurrency(
											Math.round(
												(productPrice * tax.rate) / 100
											)
										)}
									</Text>
								</View>
							))}

							<View style={styles.taxTotalRowCompact}>
								<Text style={styles.taxTotalLabel}>
									Tổng thuế nhập khẩu
								</Text>
								<Text style={styles.taxTotalValue}>
									{formatCurrency(importTax)}
								</Text>
							</View>
						</>
					) : taxDetails ? (
						<>
							<View style={styles.taxHeader}>
								<Ionicons
									name="document-text-outline"
									size={16}
									color="#ff9800"
								/>
								<Text style={styles.taxTitle}>
									Chi tiết thuế nhập khẩu
								</Text>
							</View>

							{taxDetails.importDuty &&
								taxDetails.importDuty > 0 && (
									<View style={styles.taxRow}>
										<Text style={styles.taxLabel}>
											• Thuế nhập khẩu:
										</Text>
										<Text style={styles.taxValue}>
											{formatCurrency(
												taxDetails.importDuty
											)}
										</Text>
									</View>
								)}

							{taxDetails.vat && taxDetails.vat > 0 && (
								<View style={styles.taxRow}>
									<Text style={styles.taxLabel}>
										• Thuế VAT:
									</Text>
									<Text style={styles.taxValue}>
										{formatCurrency(taxDetails.vat)}
									</Text>
								</View>
							)}

							{taxDetails.specialConsumptionTax &&
								taxDetails.specialConsumptionTax > 0 && (
									<View style={styles.taxRow}>
										<Text style={styles.taxLabel}>
											• Thuế tiêu thụ đặc biệt:
										</Text>
										<Text style={styles.taxValue}>
											{formatCurrency(
												taxDetails.specialConsumptionTax
											)}
										</Text>
									</View>
								)}

							{taxDetails.environmentTax &&
								taxDetails.environmentTax > 0 && (
									<View style={styles.taxRow}>
										<Text style={styles.taxLabel}>
											• Thuế bảo vệ môi trường:
										</Text>
										<Text style={styles.taxValue}>
											{formatCurrency(
												taxDetails.environmentTax
											)}
										</Text>
									</View>
								)}

							<View style={styles.taxTotalRow}>
								<Text style={styles.taxTotalLabel}>
									Tổng thuế nhập khẩu:
								</Text>
								<Text style={styles.taxTotalValue}>
									{formatCurrency(
										taxDetails.totalTaxAmount || importTax
									)}
								</Text>
							</View>
						</>
					) : (
						<View style={styles.priceRow}>
							<Text style={styles.label}>
								Thuế nhập khẩu (ước tính):
							</Text>
							<Text style={styles.value}>
								{formatCurrency(importTax)}
							</Text>
						</View>
					)}

					{/* Combined Shipping Fee */}
					<View style={styles.priceRow}>
						<Text style={styles.label}>Phí vận chuyển:</Text>
						<Text style={styles.value}>
							{formatCurrency(
								internationalShipping + domesticShipping
							)}
						</Text>
					</View>
				</View>

				{/* Divider */}
				<View style={styles.divider} />

				{/* Total Section */}
				<View style={styles.totalSection}>
					{/* Original Total (if applicable) */}
					{originalProductPrice && exchangeRate > 1 && (
						<View style={styles.originalTotalRow}>
							<Text style={styles.originalTotalLabel}>
								Tổng tiền gốc ({originalCurrency}):
							</Text>
							<Text style={styles.originalTotalValue}>
								{formatOriginalCurrency(
									Math.round(totalAmount / exchangeRate),
									originalCurrency
								)}
							</Text>
						</View>
					)}

					{/* VND Total */}
					<View style={styles.totalRowCompact}>
						<Text style={styles.totalLabelCompact}>
							Tổng (VNĐ):
						</Text>
						<Text style={styles.totalValue}>
							{formatCurrency(updatedTotalAmount || totalAmount)}
						</Text>
					</View>
				</View>

				{/* Additional Fees Section */}
				{additionalFees && (
					<>
						<View style={styles.additionalFeesSection}>
							<Text style={styles.additionalFeesTitle}>
								Phí phát sinh (nếu có)
							</Text>

							{additionalFees.actualImportTax && (
								<View style={styles.additionalFeeRow}>
									<Text style={styles.additionalFeeLabel}>
										+ Thuế nhập khẩu chính thức:
									</Text>
									<View style={styles.additionalFeeValue}>
										<Text style={styles.actualAmount}>
											{formatCurrency(
												additionalFees.actualImportTax
											)}
										</Text>
										<Text style={styles.increaseAmount}>
											(tăng{" "}
											{formatCurrency(
												additionalFees.importTaxIncrease ||
													0
											)}
											)
										</Text>
									</View>
								</View>
							)}

							{additionalFees.actualShipping && (
								<View style={styles.additionalFeeRow}>
									<Text style={styles.additionalFeeLabel}>
										+ Phí vận chuyển thực tế:
									</Text>
									<View style={styles.additionalFeeValue}>
										<Text style={styles.actualAmount}>
											{formatCurrency(
												additionalFees.actualShipping
											)}
										</Text>
										<Text style={styles.increaseAmount}>
											(tăng{" "}
											{formatCurrency(
												additionalFees.shippingIncrease ||
													0
											)}
											)
										</Text>
									</View>
								</View>
							)}
						</View>

						{/* Additional Fees Divider */}
						<View style={styles.divider} />

						{/* Difference Total */}
						<View style={styles.differenceSection}>
							<View style={styles.differenceRow}>
								<View style={styles.differenceLeft}>
									<Text style={styles.differenceIcon}>
										📌
									</Text>
									<Text style={styles.differenceLabel}>
										Tổng chênh lệch:
									</Text>
								</View>
								<Text
									style={[
										styles.differenceValue,
										totalDifference > 0
											? styles.positiveValue
											: styles.negativeValue,
									]}
								>
									{totalDifference > 0 ? "+" : ""}
									{formatCurrency(totalDifference)}
								</Text>
							</View>

							{updatedTotalAmount && (
								<View style={styles.updatedTotalRow}>
									<Text style={styles.updatedTotalLabel}>
										Cập nhật tổng thanh toán:
									</Text>
									<Text style={styles.updatedTotalValue}>
										{formatCurrency(updatedTotalAmount)}
									</Text>
								</View>
							)}
						</View>
					</>
				)}

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
		borderRadius: 12,
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
