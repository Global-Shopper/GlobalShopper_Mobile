import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";

export default function TaxDetail({ navigation, route }) {
	const { taxInfo } = route.params;

	const renderSection = (title, content) => {
		if (!content) return null;

		return (
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{title}</Text>
				<Text style={styles.sectionContent}>{content}</Text>
			</View>
		);
	};

	const renderListSection = (title, items, isRates = false) => {
		if (!items || items.length === 0) return null;

		return (
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{title}</Text>
				{items.map((item, index) => (
					<View key={index} style={styles.listItem}>
						<View style={styles.bulletPoint} />
						<View style={styles.listItemContent}>
							{isRates ? (
								<>
									<Text style={styles.listItemTitle}>
										{item.product ||
											item.category ||
											item.state ||
											item.province ||
											item.applies ||
											item.rate}
									</Text>
									<Text style={styles.listItemSubtext}>
										{item.rate ||
											item.applies ||
											`${item.GST} + ${item.PST} = ${item.total}`}
									</Text>
								</>
							) : (
								<Text style={styles.listItemText}>
									{typeof item === "string"
										? item
										: item.product || item.applies || item}
								</Text>
							)}
						</View>
					</View>
				))}
			</View>
		);
	};

	const renderExamples = () => {
		if (!taxInfo.details.examples) return null;

		return (
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Ví dụ tính thuế</Text>
				{taxInfo.details.examples.map((example, index) => (
					<View key={index} style={styles.exampleCard}>
						<Text style={styles.exampleTitle}>
							{example.product}
						</Text>
						<Text style={styles.exampleCalculation}>
							{example.calculation}
						</Text>
					</View>
				))}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Header
				title={taxInfo.shortName}
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Header Card */}
				<View style={styles.headerCard}>
					<View
						style={[
							styles.headerIcon,
							{ backgroundColor: `${taxInfo.color}20` },
						]}
					>
						<Ionicons
							name={taxInfo.icon}
							size={32}
							color={taxInfo.color}
						/>
					</View>
					<Text style={styles.taxTitle}>{taxInfo.name}</Text>
					<Text style={styles.taxDescription}>
						{taxInfo.description}
					</Text>
				</View>

				{/* Definition */}
				{renderSection("Định nghĩa", taxInfo.details.definition)}

				{/* Calculation */}
				{renderSection("Cách tính", taxInfo.details.calculation)}

				{/* For Imports */}
				{renderSection(
					"Đối với hàng nhập khẩu",
					taxInfo.details.forImports
				)}

				{/* Applicable Products */}
				{renderListSection(
					"Sản phẩm áp dụng",
					taxInfo.details.applicableProducts
				)}

				{/* Tax Rates */}
				{renderListSection(
					"Thuế suất",
					taxInfo.details.taxRates || taxInfo.details.commonRates,
					true
				)}

				{/* US States Rates */}
				{renderListSection(
					"Thuế suất theo bang (Mỹ)",
					taxInfo.details.ratesByState,
					true
				)}

				{/* Canada GST */}
				{renderListSection(
					"Thuế suất Canada",
					taxInfo.details.canadaGST,
					true
				)}

				{/* Benefits */}
				{renderListSection("Lợi ích", taxInfo.details.benefits)}

				{/* Purpose */}
				{renderListSection("Mục đích", taxInfo.details.purpose)}

				{/* Conditions */}
				{renderListSection(
					"Điều kiện áp dụng",
					taxInfo.details.conditions
				)}

				{/* Characteristics */}
				{renderListSection("Đặc điểm", taxInfo.details.characteristics)}

				{/* For Vietnam Buyers */}
				{renderListSection(
					"Lưu ý cho người mua Việt Nam",
					taxInfo.details.forVietnamBuyers
				)}

				{/* Tips */}
				{renderListSection("Mẹo tiết kiệm", taxInfo.details.tips)}

				{/* Examples */}
				{renderExamples()}

				{/* Important Notes */}
				{renderSection(
					"Lưu ý quan trọng",
					taxInfo.details.importNote || taxInfo.details.note
				)}

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 16,
	},
	headerCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 24,
		alignItems: "center",
		marginTop: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 6,
	},
	headerIcon: {
		width: 64,
		height: 64,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	taxTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#1e293b",
		textAlign: "center",
		marginBottom: 8,
	},
	taxDescription: {
		fontSize: 14,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 20,
	},
	section: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 12,
	},
	sectionContent: {
		fontSize: 14,
		color: "#374151",
		lineHeight: 22,
	},
	listItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	bulletPoint: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#3b82f6",
		marginTop: 8,
		marginRight: 10,
	},
	listItemContent: {
		flex: 1,
	},
	listItemText: {
		fontSize: 14,
		color: "#374151",
		lineHeight: 20,
	},
	listItemTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 2,
	},
	listItemSubtext: {
		fontSize: 13,
		color: "#dc2626",
		fontWeight: "500",
	},
	exampleCard: {
		backgroundColor: "#f1f5f9",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		borderLeft: 4,
		borderLeftColor: "#3b82f6",
	},
	exampleTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 6,
	},
	exampleCalculation: {
		fontSize: 13,
		color: "#374151",
		fontFamily: "monospace",
		lineHeight: 18,
	},
	bottomSpacing: {
		height: 20,
	},
});
