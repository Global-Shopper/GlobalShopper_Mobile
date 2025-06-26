import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Text } from "../../../components/ui/text";

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Avatar className="h-12 w-12">
						<AvatarImage source={{ uri: "https://github.com/shadcn.png" }} />
						<AvatarFallback>
							<Text>CN</Text>
						</AvatarFallback>
					</Avatar>
					<View style={styles.greetingContainer}>
						<Text className="text-sm text-muted-foreground">Xin chào,</Text>
						<Text className="text-lg font-semibold">John Doe</Text>
					</View>
				</View>
				<View style={styles.headerRight}>
					<Ionicons name="notifications-outline" size={24} color="#333" />
					<View style={styles.notificationBadge}>
						<Text className="text-xs text-white">3</Text>
					</View>
				</View>
			</View>

			<ScrollView 
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text className="text-xl font-bold mb-4">Trang chủ</Text>
					
					<View style={styles.actionGrid}>
						<View style={styles.actionCard}>
							<Ionicons name="wallet-outline" size={32} color="#007bff" />
							<Text className="text-sm font-medium mt-2">Ví tiền</Text>
						</View>
						
						<View style={styles.actionCard}>
							<Ionicons name="document-text-outline" size={32} color="#28a745" />
							<Text className="text-sm font-medium mt-2">Yêu cầu</Text>
						</View>
						
						<View style={styles.actionCard}>
							<Ionicons name="bag-handle-outline" size={32} color="#ffc107" />
							<Text className="text-sm font-medium mt-2">Đơn hàng</Text>
						</View>
						
						<View style={styles.actionCard}>
							<Ionicons name="person-outline" size={32} color="#6f42c1" />
							<Text className="text-sm font-medium mt-2">Tài khoản</Text>
						</View>
					</View>
				</View>

				{/* Statistics */}
				<View style={styles.statsContainer}>
					<Text className="text-lg font-semibold mb-4">Thống kê</Text>
					
					<View style={styles.statsGrid}>
						<View style={styles.statCard}>
							<Text className="text-2xl font-bold text-blue-600">156</Text>
							<Text className="text-sm text-muted-foreground">Đơn hàng</Text>
						</View>
						
						<View style={styles.statCard}>
							<Text className="text-2xl font-bold text-green-600">23</Text>
							<Text className="text-sm text-muted-foreground">Hoàn thành</Text>
						</View>
						
						<View style={styles.statCard}>
							<Text className="text-2xl font-bold text-orange-600">12</Text>
							<Text className="text-sm text-muted-foreground">Đang xử lý</Text>
						</View>
					</View>
				</View>

				{/* Recent Activity */}
				<View style={styles.recentActivity}>
					<Text className="text-lg font-semibold mb-4">Hoạt động gần đây</Text>
					
					<View style={styles.activityItem}>
						<Ionicons name="checkmark-circle" size={24} color="#28a745" />
						<View style={styles.activityContent}>
							<Text className="font-medium">Đơn hàng #1234 đã hoàn thành</Text>
							<Text className="text-sm text-muted-foreground">2 giờ trước</Text>
						</View>
					</View>
					
					<View style={styles.activityItem}>
						<Ionicons name="time-outline" size={24} color="#ffc107" />
						<View style={styles.activityContent}>
							<Text className="font-medium">Đơn hàng #1235 đang xử lý</Text>
							<Text className="text-sm text-muted-foreground">4 giờ trước</Text>
						</View>
					</View>
					
					<View style={styles.activityItem}>
						<Ionicons name="add-circle" size={24} color="#007bff" />
						<View style={styles.activityContent}>
							<Text className="font-medium">Yêu cầu mới đã được tạo</Text>
							<Text className="text-sm text-muted-foreground">1 ngày trước</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 20,
		backgroundColor: "#f8f9fa",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	greetingContainer: {
		marginLeft: 12,
	},
	headerRight: {
		position: "relative",
	},
	notificationBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#dc3545",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	quickActions: {
		marginTop: 20,
	},
	actionGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	actionCard: {
		width: "48%",
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	statsContainer: {
		marginTop: 20,
	},
	statsGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginHorizontal: 4,
		borderWidth: 1,
		borderColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	recentActivity: {
		marginTop: 20,
		marginBottom: 20,
	},
	activityItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	activityContent: {
		flex: 1,
		marginLeft: 12,
	},
});
