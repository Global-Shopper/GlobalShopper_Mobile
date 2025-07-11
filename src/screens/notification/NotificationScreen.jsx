import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import NotificationCard from "../../components/noti-card";
import { Text } from "../../components/ui/text";

export default function NotificationScreen({ navigation }) {
	const [refreshing, setRefreshing] = useState(false);
	const [notifications, setNotifications] = useState([
		{
			id: "1",
			title: "Đơn hàng #12345 đã được xác nhận",
			description:
				"Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị. Dự kiến giao hàng trong 3-5 ngày làm việc.",
			createdAt: new Date().toISOString(),
			type: "order",
			referenceId: "12345",
			isRead: false,
		},
		{
			id: "2",
			title: "Thanh toán thành công",
			description:
				"Thanh toán cho đơn hàng #12344 đã được xử lý thành công. Số tiền: 1.250.000 VNĐ",
			createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			type: "payment",
			referenceId: "12344",
			isRead: true,
		},
		{
			id: "3",
			title: "Khuyến mãi đặc biệt",
			description:
				"Giảm giá 20% cho tất cả sản phẩm thời trang. Ưu đãi có hiệu lực đến hết ngày 31/12.",
			createdAt: new Date(
				Date.now() - 2 * 24 * 60 * 60 * 1000
			).toISOString(),
			type: "promotion",
			referenceId: "promo_001",
			isRead: false,
		},
		{
			id: "4",
			title: "Đơn hàng đang được vận chuyển",
			description:
				"Đơn hàng #12343 của bạn đang trên đường giao. Mã vận đơn: GHN123456789",
			createdAt: new Date(
				Date.now() - 3 * 24 * 60 * 60 * 1000
			).toISOString(),
			type: "shipping",
			referenceId: "12343",
			isRead: true,
		},
		{
			id: "5",
			title: "Cập nhật hệ thống",
			description:
				"Ứng dụng sẽ được bảo trì từ 2:00 - 4:00 sáng ngày mai. Vui lòng thử lại sau.",
			createdAt: new Date(
				Date.now() - 5 * 24 * 60 * 60 * 1000
			).toISOString(),
			type: "system",
			referenceId: "maintenance_001",
			isRead: true,
		},
	]);

	const handleRefresh = () => {
		setRefreshing(true);
		// Simulate API call
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};

	const handleNotificationPress = (notification) => {
		console.log("Notification pressed:", notification);

		// Navigate based on notification type
		switch (notification.type) {
			case "order":
				navigation.navigate("OrderDetails", {
					orderId: notification.referenceId,
				});
				break;
			case "payment":
				navigation.navigate("TransactionHistory");
				break;
			case "promotion":
				navigation.navigate("Home");
				break;
			case "shipping":
				navigation.navigate("OrderTracking", {
					orderId: notification.referenceId,
				});
				break;
			default:
				// Stay on notification screen
				break;
		}
	};

	const handleMarkAsRead = (notificationId) => {
		setNotifications((prev) =>
			prev.map((notif) =>
				notif.id === notificationId ? { ...notif, isRead: true } : notif
			)
		);
	};

	const renderNotificationItem = ({ item }) => (
		<NotificationCard
			{...item}
			onPress={() => handleNotificationPress(item)}
			onMarkAsRead={handleMarkAsRead}
		/>
	);

	const renderEmptyState = () => (
		<View style={styles.emptyContainer}>
			<Text style={styles.emptyTitle}>Không có thông báo</Text>
			<Text style={styles.emptyDescription}>
				Bạn sẽ nhận được thông báo về đơn hàng, thanh toán và khuyến mãi
				tại đây.
			</Text>
		</View>
	);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<View style={styles.container}>
			<Header
				title="Thông báo"
				subtitle={
					unreadCount > 0
						? `${unreadCount} thông báo chưa đọc`
						: "Tất cả đã đọc"
				}
				onBackPress={() => navigation.goBack()}
				showBackButton={true}
				showNotificationIcon={false}
				showChatIcon={true}
				chatCount={0}
				navigation={navigation}
			/>

			<FlatList
				data={notifications}
				renderItem={renderNotificationItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						colors={["#2196F3"]}
						tintColor="#2196F3"
					/>
				}
				ListEmptyComponent={renderEmptyState}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	listContainer: {
		paddingVertical: 8,
		paddingBottom: 20,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
		paddingHorizontal: 32,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 8,
		textAlign: "center",
	},
	emptyDescription: {
		fontSize: 14,
		color: "#78909C",
		textAlign: "center",
		lineHeight: 20,
	},
});
