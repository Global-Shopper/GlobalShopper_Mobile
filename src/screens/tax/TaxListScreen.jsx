import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import taxData from "./tax.json";

export default function TaxListScreen({ navigation }) {
	const renderTaxItem = ({ item }) => (
		<TouchableOpacity
			style={styles.taxItem}
			onPress={() => navigation.navigate("TaxDetail", { taxInfo: item })}
			activeOpacity={0.7}
		>
			<View style={styles.taxItemContent}>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: `${item.color}20` },
					]}
				>
					<Ionicons name={item.icon} size={24} color={item.color} />
				</View>
				<View style={styles.textContent}>
					<Text style={styles.taxName}>{item.shortName}</Text>
					<Text style={styles.taxDescription} numberOfLines={2}>
						{item.description}
					</Text>
				</View>
				<Ionicons name="chevron-forward" size={20} color="#94a3b8" />
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<Header
				title="Thông tin thuế"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>

			<View style={styles.content}>
				<View style={styles.introSection}>
					<Text style={styles.introTitle}>
						Tìm hiểu về các loại thuế
					</Text>
					<Text style={styles.introText}>
						Hướng dẫn chi tiết về các loại thuế liên quan đến việc
						mua sắm và nhập khẩu hàng hóa quốc tế
					</Text>
				</View>

				<FlatList
					data={taxData.taxTypes}
					renderItem={renderTaxItem}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContainer}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	introSection: {
		backgroundColor: "#ffffff",
		padding: 20,
		borderRadius: 16,
		marginTop: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	introTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 8,
		textAlign: "center",
	},
	introText: {
		fontSize: 14,
		color: "#64748b",
		textAlign: "center",
		lineHeight: 20,
	},
	listContainer: {
		paddingBottom: 20,
	},
	taxItem: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	taxItemContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	textContent: {
		flex: 1,
	},
	taxName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 4,
	},
	taxDescription: {
		fontSize: 13,
		color: "#64748b",
		lineHeight: 18,
	},
});
