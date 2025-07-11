import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationCardProps {
	id: string;
	title: string;
	description?: string;
	createdAt: string;
	type: string;
	referenceId: string;
	isRead: boolean;
	onPress?: () => void;
	onMarkAsRead?: (id: string) => void;
}

export default function NotificationCard({
	id,
	title,
	description,
	createdAt,
	type,
	referenceId,
	isRead,
	onPress,
	onMarkAsRead,
}: NotificationCardProps) {
	// Function to get icon based on notification type
	const getNotificationIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case "order":
				return "bag-outline";
			case "payment":
				return "card-outline";
			case "shipping":
				return "airplane-outline";
			case "promotion":
				return "gift-outline";
			case "system":
				return "settings-outline";
			case "warning":
				return "warning-outline";
			case "success":
				return "checkmark-circle-outline";
			case "info":
				return "information-circle-outline";
			default:
				return "notifications-outline";
		}
	};

	// Function to get icon color based on notification type
	const getIconColor = (type: string) => {
		switch (type.toLowerCase()) {
			case "order":
				return "#2196F3";
			case "payment":
				return "#4CAF50";
			case "shipping":
				return "#FF9800";
			case "promotion":
				return "#E91E63";
			case "system":
				return "#9E9E9E";
			case "warning":
				return "#FF5722";
			case "success":
				return "#4CAF50";
			case "info":
				return "#2196F3";
			default:
				return "#757575";
		}
	};

	// Function to format the date
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - date.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays === 1) {
				return "Hôm nay";
			} else if (diffDays === 2) {
				return "Hôm qua";
			} else if (diffDays <= 7) {
				return `${diffDays - 1} ngày trước`;
			} else {
				return date.toLocaleDateString("vi-VN", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
			}
		} catch {
			return dateString;
		}
	};

	const handlePress = () => {
		// Mark as read when pressed if it's unread
		if (!isRead && onMarkAsRead) {
			onMarkAsRead(id);
		}
		// Call onPress callback if provided
		if (onPress) {
			onPress();
		}
	};

	return (
		<TouchableOpacity
			style={[styles.container, !isRead && styles.unreadContainer]}
			onPress={handlePress}
			activeOpacity={0.7}
		>
			{/* Notification Icon */}
			<View
				style={[
					styles.iconContainer,
					{ backgroundColor: getIconColor(type) + "20" },
				]}
			>
				<Ionicons
					name={getNotificationIcon(type)}
					size={24}
					color={getIconColor(type)}
				/>
			</View>

			{/* Content */}
			<View style={styles.content}>
				{/* Title and Date */}
				<View style={styles.header}>
					<Text
						style={[styles.title, !isRead && styles.unreadTitle]}
						numberOfLines={2}
					>
						{title}
					</Text>
					<Text style={styles.date}>{formatDate(createdAt)}</Text>
				</View>

				{/* Description */}
				{description && (
					<Text
						style={[
							styles.description,
							!isRead && styles.unreadDescription,
						]}
						numberOfLines={3}
					>
						{description}
					</Text>
				)}

				{/* Type Badge */}
				<View style={styles.footer}>
					<View
						style={[
							styles.typeBadge,
							{ backgroundColor: getIconColor(type) + "15" },
						]}
					>
						<Text
							style={[
								styles.typeText,
								{ color: getIconColor(type) },
							]}
						>
							{type.toUpperCase()}
						</Text>
					</View>

					{/* Unread Indicator */}
					{!isRead && <View style={styles.unreadDot} />}
				</View>
			</View>

			{/* Arrow Icon */}
			<View style={styles.arrowContainer}>
				<Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 16,
		marginVertical: 6,
		flexDirection: "row",
		alignItems: "flex-start",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#F0F0F0",
	},
	unreadContainer: {
		backgroundColor: "#F8F9FF",
		borderColor: "#E3F2FD",
		borderLeftWidth: 4,
		borderLeftColor: "#2196F3",
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	content: {
		flex: 1,
		marginRight: 8,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 6,
	},
	title: {
		flex: 1,
		fontSize: 16,
		fontWeight: "500",
		color: "#263238",
		lineHeight: 22,
		marginRight: 8,
	},
	unreadTitle: {
		fontWeight: "600",
		color: "#1976D2",
	},
	date: {
		fontSize: 12,
		color: "#9E9E9E",
		fontWeight: "400",
	},
	description: {
		fontSize: 14,
		color: "#546E7A",
		lineHeight: 20,
		marginBottom: 8,
	},
	unreadDescription: {
		color: "#37474F",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	typeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	typeText: {
		fontSize: 10,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#2196F3",
	},
	arrowContainer: {
		marginLeft: 4,
		marginTop: 2,
	},
});
