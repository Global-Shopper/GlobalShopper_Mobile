import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "./ui/text";

interface QuotationCardProps {
	productPrice?: number;
	serviceFee?: number;
	serviceFeePercent?: number;
	internationalShipping?: number;
	importTax?: number;
	domesticShipping?: number;
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
	productPrice = 1200000,
	serviceFee = 60000,
	serviceFeePercent = 5,
	internationalShipping = 200000,
	importTax = 120000,
	domesticShipping = 35000,
	additionalFees,
	totalAmount = 1615000,
	updatedTotalAmount,
	isExpanded = false,
}: QuotationCardProps) {
	const formatCurrency = (amount: number) => {
		return `${amount.toLocaleString("vi-VN")}₫`;
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
				{/* Basic Pricing */}
				<View style={styles.section}>
					<View style={styles.priceRow}>
						<Text style={styles.label}>Giá sản phẩm:</Text>
						<Text style={styles.value}>
							{formatCurrency(productPrice)}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Phí dịch vụ ({serviceFeePercent}%):
						</Text>
						<Text style={styles.value}>
							{formatCurrency(serviceFee)}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Phí vận chuyển quốc tế (tạm tính):
						</Text>
						<Text style={styles.value}>
							{formatCurrency(internationalShipping)}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Thuế nhập khẩu (ước tính):
						</Text>
						<Text style={styles.value}>
							{formatCurrency(importTax)}
						</Text>
					</View>

					<View style={styles.priceRow}>
						<Text style={styles.label}>
							Phí giao hàng nội địa (tạm tính):
						</Text>
						<Text style={styles.value}>
							{formatCurrency(domesticShipping)}
						</Text>
					</View>
				</View>

				{/* Divider */}
				<View style={styles.divider} />

				{/* Total */}
				<View style={styles.totalSection}>
					<View style={styles.totalRow}>
						<View style={styles.totalLeft}>
							<Text style={styles.totalIcon}>💵</Text>
							<Text style={styles.totalLabel}>
								Tổng thanh toán:
							</Text>
						</View>
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
						💡 Một số phí như thuế và vận chuyển sẽ được cập nhật
						chính xác sau khi đơn hàng về kho.
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
		marginBottom: 10,
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
		padding: 16,
	},
	section: {
		marginBottom: 8,
	},
	priceRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
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
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 12,
	},
	totalSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
	},
	totalRow: {
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
		padding: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
	},
	noteText: {
		fontSize: 13,
		color: "#666",
		lineHeight: 18,
		fontStyle: "italic",
	},
});
