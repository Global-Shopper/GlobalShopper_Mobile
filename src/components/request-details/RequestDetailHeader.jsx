import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import {
	formatDate,
	getRequestTypeBorderColor,
	getRequestTypeIcon,
	getRequestTypeText,
	getShortId,
	getStatusColor,
	getStatusText,
} from "../../utils/statusHandler";
import { Text } from "../ui/text";

const RequestDetailHeader = ({ requestData }) => {
	return (
		<View style={styles.requestCard}>
			{/* Header Section */}
			<View style={styles.cardHeader}>
				<View style={styles.leftSection}>
					<View style={styles.requestTypeContainer}>
						<Ionicons
							name={getRequestTypeIcon(
								requestData?.requestType || requestData?.type
							)}
							size={18}
							color={getRequestTypeBorderColor(
								requestData?.requestType || requestData?.type
							)}
						/>
					</View>

					<View style={styles.requestInfo}>
						<Text style={styles.requestCode}>
							{getShortId(requestData?.id || requestData?.code)}
						</Text>
						<Text style={styles.createdDate}>
							{formatDate(requestData?.createdAt)}
						</Text>
					</View>
				</View>

				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor:
								getStatusColor(requestData?.status) + "20",
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{
								color: getStatusColor(requestData?.status),
							},
						]}
					>
						{getStatusText(requestData?.status)}
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
								requestData?.requestType || requestData?.type
							),
						},
					]}
				>
					{getRequestTypeText(
						requestData?.requestType ||
							requestData?.type ||
							requestData?.category ||
							requestData?.purchaseType
					)}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
});

export default RequestDetailHeader;
