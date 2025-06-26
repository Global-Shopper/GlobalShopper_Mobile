import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Text } from "../../components/ui/text";

export default function AccountScreen({ navigation }) {
	const [user] = useState({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+84 123 456 789",
		avatar: "https://github.com/shadcn.png",
		memberSince: "2023",
		isVerified: true,
	});

	const menuItems = [
		{
			id: 1,
			title: "Thông tin cá nhân",
			subtitle: "Cập nhật thông tin và cài đặt",
			icon: "person-outline",
			action: () => console.log("Navigate to profile"),
		},
		{
			id: 2,
			title: "Bảo mật",
			subtitle: "Mật khẩu và xác thực 2 yếu tố",
			icon: "shield-checkmark-outline",
			action: () => console.log("Navigate to security"),
		},
		{
			id: 3,
			title: "Thông báo",
			subtitle: "Cài đặt nhận thông báo",
			icon: "notifications-outline",
			action: () => console.log("Navigate to notifications"),
		},
		{
			id: 4,
			title: "Ngôn ngữ",
			subtitle: "Tiếng Việt",
			icon: "language-outline",
			action: () => console.log("Navigate to language"),
		},
		{
			id: 5,
			title: "Hỗ trợ",
			subtitle: "Trung tâm trợ giúp và liên hệ",
			icon: "help-circle-outline",
			action: () => console.log("Navigate to support"),
		},
		{
			id: 6,
			title: "Điều khoản sử dụng",
			subtitle: "Quyền riêng tư và điều khoản",
			icon: "document-text-outline",
			action: () => console.log("Navigate to terms"),
		},
	];

	const quickActions = [
		{
			id: 1,
			title: "Ví tiền",
			icon: "wallet-outline",
			color: "#007bff",
			value: "2,500,000 ₫",
		},
		{
			id: 2,
			title: "Điểm thưởng",
			icon: "star-outline",
			color: "#ffc107",
			value: "1,250 điểm",
		},
		{
			id: 3,
			title: "Ưu đãi",
			icon: "gift-outline",
			color: "#28a745",
			value: "5 mã giảm giá",
		},
	];

	const handleLogout = () => {
		Alert.alert(
			"Đăng xuất",
			"Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Đăng xuất",
					style: "destructive",
					onPress: () => {
						// Clear user data and navigate to login
						navigation.reset({
							index: 0,
							routes: [{ name: "Login" }],
						});
					},
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text className="text-2xl font-bold text-white">Tài khoản</Text>
				<TouchableOpacity style={styles.settingsButton}>
					<Ionicons name="settings-outline" size={24} color="#ffffff" />
				</TouchableOpacity>
			</View>

			<ScrollView 
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Card */}
				<View style={styles.profileCard}>
					<Avatar className="h-20 w-20">
						<AvatarImage source={{ uri: user.avatar }} />
						<AvatarFallback>
							<Text className="text-xl font-bold">JD</Text>
						</AvatarFallback>
					</Avatar>
					
					<View style={styles.profileInfo}>
						<View style={styles.nameContainer}>
							<Text className="text-xl font-bold">{user.name}</Text>
							{user.isVerified && (
								<Ionicons name="checkmark-circle" size={20} color="#28a745" style={styles.verifiedIcon} />
							)}
						</View>
						<Text className="text-sm text-muted-foreground">{user.email}</Text>
						<Text className="text-sm text-muted-foreground">{user.phone}</Text>
						<Text className="text-xs text-muted-foreground mt-2">
							Thành viên từ {user.memberSince}
						</Text>
					</View>
					
					<TouchableOpacity style={styles.editButton}>
						<Ionicons name="create-outline" size={20} color="#007bff" />
					</TouchableOpacity>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActionsContainer}>
					{quickActions.map((action) => (
						<TouchableOpacity key={action.id} style={styles.quickActionCard}>
							<View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
								<Ionicons name={action.icon} size={24} color={action.color} />
							</View>
							<Text className="text-sm font-medium">{action.title}</Text>
							<Text className="text-xs text-muted-foreground">{action.value}</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Menu Items */}
				<View style={styles.menuContainer}>
					{menuItems.map((item) => (
						<TouchableOpacity
							key={item.id}
							style={styles.menuItem}
							onPress={item.action}
						>
							<View style={styles.menuItemLeft}>
								<View style={styles.menuIconContainer}>
									<Ionicons name={item.icon} size={22} color="#007bff" />
								</View>
								<View style={styles.menuItemContent}>
									<Text className="font-medium">{item.title}</Text>
									<Text className="text-sm text-muted-foreground">{item.subtitle}</Text>
								</View>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#ccc" />
						</TouchableOpacity>
					))}
				</View>

				{/* App Info */}
				<View style={styles.appInfoContainer}>
					<Text className="text-center text-sm text-muted-foreground">
						GlobalShopper Mobile v1.0.0
					</Text>
					<Text className="text-center text-xs text-muted-foreground mt-1">
						© 2024 GlobalShopper. All rights reserved.
					</Text>
				</View>

				{/* Logout Button */}
				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={20} color="#dc3545" />
					<Text className="text-red-600 font-medium ml-2">Đăng xuất</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		backgroundColor: "#007bff",
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	settingsButton: {
		padding: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	profileCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginTop: -30,
		marginBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	profileInfo: {
		flex: 1,
		marginLeft: 16,
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	verifiedIcon: {
		marginLeft: 8,
	},
	editButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f0f8ff",
		justifyContent: "center",
		alignItems: "center",
	},
	quickActionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	quickActionCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginHorizontal: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	quickActionIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	menuContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	menuIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f0f8ff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	menuItemContent: {
		flex: 1,
	},
	appInfoContainer: {
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		marginBottom: 20,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		paddingVertical: 16,
		marginBottom: 40,
		borderWidth: 1,
		borderColor: "#fee",
	},
});
