import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

interface HeaderProps {
	// (WalletScreen, RequestScreen, OrderScreen)
	title?: string;

	// For avatar header (HomeScreen, ProfileScreen)
	userName?: string;
	userEmail?: string;
	subtitle?: string;
	avatar?: string;
	isVerified?: boolean;

	// Common props for all headers
	notificationCount?: number;
	chatCount?: number;
	onNotificationPress?: () => void;
	onChatPress?: () => void;
	onAvatarPress?: () => void;

	// Back navigation support
	showBackButton?: boolean;
	onBackPress?: () => void;
}

export default function Header({
	title,
	userName,
	userEmail,
	subtitle,
	avatar,
	isVerified = false,
	notificationCount = 0,
	chatCount = 0,
	onNotificationPress,
	onChatPress,
	onAvatarPress,
	showBackButton = false,
	onBackPress,
}: HeaderProps) {
	// Determine if this is a simple title header or avatar header
	const isSimpleHeader = !!title;

	return (
		<LinearGradient
			colors={["#42A5F5", "#1976D2"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.header}
		>
			<View style={styles.headerContent}>
				{/* Left side - Title or Avatar */}
				{isSimpleHeader ? (
					// Simple title header (WalletScreen, RequestScreen, OrderScreen)
					<View style={styles.headerLeft}>
						{showBackButton && (
							<TouchableOpacity
								onPress={onBackPress}
								style={styles.backButton}
								activeOpacity={0.7}
							>
								<Ionicons
									name="arrow-back"
									size={24}
									color="#FFFFFF"
								/>
							</TouchableOpacity>
						)}
						<Text style={styles.headerTitle}>{title}</Text>
					</View>
				) : (
					// Avatar header (HomeScreen, ProfileScreen)
					<View style={styles.headerLeft}>
						<View style={styles.avatarContainer}>
							<TouchableOpacity
								onPress={onAvatarPress}
								activeOpacity={0.8}
							>
								<Image
									source={{ uri: avatar }}
									style={styles.avatar}
									defaultSource={require("../assets/images/logo/logo-gshop-removebg.png")}
								/>
							</TouchableOpacity>
							{isVerified && (
								<View style={styles.verifiedBadge}>
									<Ionicons
										name="checkmark-circle"
										size={20}
										color="#28a745"
									/>
								</View>
							)}
						</View>
						<View style={styles.greetingContainer}>
							<Text style={styles.greetingText}>
								Xin chào, {userName}
							</Text>
							<Text style={styles.subGreeting}>
								{subtitle || userEmail}
							</Text>
						</View>
					</View>
				)}

				<View style={styles.headerRight}>
					{/* Notification Icon */}
					<TouchableOpacity
						style={styles.notificationContainer}
						onPress={onNotificationPress}
						activeOpacity={0.7}
					>
						<Ionicons
							name="notifications-outline"
							size={24}
							color="#FFFFFF"
						/>
						{notificationCount > 0 && (
							<View style={styles.notificationBadge}>
								<Text style={styles.notificationText}>
									{notificationCount > 9
										? "9+"
										: notificationCount}
								</Text>
							</View>
						)}
					</TouchableOpacity>

					{/* Chat Icon */}
					<TouchableOpacity
						style={styles.chatIcon}
						onPress={onChatPress}
						activeOpacity={0.7}
					>
						<Ionicons
							name="chatbubble-outline"
							size={24}
							color="#FFFFFF"
						/>
						{chatCount > 0 && (
							<View style={styles.chatBadge}>
								<Text style={styles.chatBadgeText}>
									{chatCount > 9 ? "9+" : chatCount}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 25,
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 10,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	avatarContainer: {
		position: "relative",
		marginRight: 12,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	verifiedBadge: {
		position: "absolute",
		bottom: -2,
		right: -2,
		backgroundColor: "#ffffff",
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5,
	},
	greetingContainer: {
		flex: 1,
	},
	greetingText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 2,
	},
	subGreeting: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.8)",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	notificationContainer: {
		position: "relative",
		marginRight: 16,
		padding: 4,
	},
	notificationBadge: {
		position: "absolute",
		top: 0,
		right: 0,
		backgroundColor: "#dc3545",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	notificationText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	chatIcon: {
		position: "relative",
		padding: 4,
	},
	chatBadge: {
		position: "absolute",
		top: 0,
		right: 0,
		backgroundColor: "#dc3545",
		borderRadius: 8,
		width: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	chatBadgeText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	backButton: {
		marginRight: 12,
		padding: 8,
	},
});
