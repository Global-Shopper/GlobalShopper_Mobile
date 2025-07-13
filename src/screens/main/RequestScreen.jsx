import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import RequestCard from "../../components/request-card";
import { Text } from "../../components/ui/text";

export default function RequestScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState("all");

	const requests = [
		{
			id: 1,
			code: "REQ001",
			productCount: 3,
			status: "processing",
			date: "2024-01-15",
			createdAt: "15/01/2024 14:30",
			type: "with_link",
		},
		{
			id: 2,
			code: "REQ002",
			productCount: 1,
			status: "processing",
			date: "2024-01-14",
			createdAt: "14/01/2024 09:15",
			type: "without_link",
		},
		{
			id: 3,
			code: "REQ003",
			productCount: 2,
			status: "confirmed",
			date: "2024-01-13",
			createdAt: "13/01/2024 16:45",
			type: "with_link",
		},
		{
			id: 4,
			code: "REQ004",
			productCount: 2,
			status: "quoted",
			date: "2024-01-13",
			createdAt: "13/01/2024 16:45",
			type: "with_link",
		},
		{
			id: 5,
			code: "REQ005",
			productCount: 5,
			status: "cancelled",
			date: "2024-01-12",
			createdAt: "12/01/2024 11:20",
			type: "without_link",
		},
	];

	const tabs = [
		{ id: "all", label: "Tất cả", status: null },
		{ id: "processing", label: "Đang xử lý", status: "processing" },
		{ id: "quoted", label: "Đã báo giá", status: "quoted" },
		{ id: "confirmed", label: "Đã xác nhận", status: "confirmed" },
		{ id: "cancelled", label: "Đã huỷ", status: "cancelled" },
	];

	const handleRequestPress = (request) => {
		console.log("Request pressed:", request.id);
		// Navigate to request detail screen
		navigation.navigate("RequestDetails", { request });
	};

	const handleRequestCancel = (request) => {
		console.log("Cancel request:", request.id);
		// Handle cancel request logic
	};

	const filteredRequests = requests.filter((request) => {
		if (activeTab === "all") return true;
		return request.status === activeTab;
	});

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Yêu cầu"
				notificationCount={2}
				chatCount={0}
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
			/>

			{/* Tabs */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{tabs.map((tab) => (
						<TouchableOpacity
							key={tab.id}
							style={[
								styles.tab,
								activeTab === tab.id && styles.activeTab,
							]}
							onPress={() => setActiveTab(tab.id)}
						>
							<Text
								style={[
									styles.tabText,
									activeTab === tab.id &&
										styles.activeTabText,
								]}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Request List */}
				<View style={styles.requestsList}>
					{filteredRequests.map((request) => (
						<RequestCard
							key={request.id}
							request={request}
							onPress={() => handleRequestPress(request)}
							onCancel={() => handleRequestCancel(request)}
						/>
					))}
				</View>

				{filteredRequests.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons
							name="document-outline"
							size={64}
							color="#ccc"
						/>
						<Text className="text-lg font-medium text-muted-foreground mt-4">
							Không có yêu cầu nào
						</Text>
						<Text className="text-sm text-muted-foreground text-center mt-2">
							Tạo yêu cầu mới để được hỗ trợ
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Floating Action Button */}
			<TouchableOpacity style={styles.fab}>
				<Ionicons name="add" size={24} color="#ffffff" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	tabContainer: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
	},
	tab: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		marginRight: 16,
		borderRadius: 25,
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	activeTab: {
		backgroundColor: "#42A5F5",
		borderColor: "#42A5F5",
	},
	tabText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#6c757d",
	},
	activeTabText: {
		color: "#ffffff",
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	requestsList: {
		marginBottom: 20,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	fab: {
		position: "absolute",
		bottom: 30,
		right: 30,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#007bff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
});
