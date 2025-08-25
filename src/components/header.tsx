import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../features/user";
import { useUploadAvatarMutation } from "../services/gshopApi";
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

	// Navigation support
	navigation?: any;

	// Control visibility of icons
	showNotificationIcon?: boolean;
	showChatIcon?: boolean;

	// Header variant control
	variant?: "gradient" | "clean";

	// Right side button support (for clean variant)
	rightButton?: {
		icon: string;
		onPress: () => void;
	};
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
	navigation,
	showNotificationIcon = true,
	showChatIcon = false,
	variant = "gradient",
	rightButton,
}: HeaderProps) {
	// Determine if this is a simple title header or avatar header
	const isSimpleHeader = !!title;
	const dispatch = useDispatch();
	const email = useSelector((state: any) => state?.rootReducer?.user?.email);
	const name = useSelector((state: any) => state?.rootReducer?.user?.name);
	const avatarUrl = useSelector(
		(state: any) => state?.rootReducer?.user?.avatar
	);

	// Upload avatar mutation
	const [uploadAvatar, { isLoading: isUploadingAvatar }] =
		useUploadAvatarMutation();

	// Request permission for camera/gallery access
	const requestPermission = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission Required",
				"Sorry, we need camera roll permissions to upload your avatar.",
				[{ text: "OK" }]
			);
			return false;
		}
		return true;
	};

	// Handle avatar upload
	const handleAvatarUpload = async () => {
		try {
			const hasPermission = await requestPermission();
			if (!hasPermission) return;

			// Show options: Camera or Gallery
			Alert.alert("Upload Avatar", "Choose an option", [
				{
					text: "Camera",
					onPress: () => pickImage("camera"),
				},
				{
					text: "Gallery",
					onPress: () => pickImage("library"),
				},
				{
					text: "Cancel",
					style: "cancel",
				},
			]);
		} catch (error) {
			console.error("Avatar upload error:", error);
			Alert.alert("Error", "Failed to upload avatar");
		}
	};

	// Pick image from camera or library
	const pickImage = async (source: "camera" | "library") => {
		try {
			let result;

			if (source === "camera") {
				const cameraPermission =
					await ImagePicker.requestCameraPermissionsAsync();
				if (cameraPermission.status !== "granted") {
					Alert.alert(
						"Permission Required",
						"Camera permission is required"
					);
					return;
				}
				result = await ImagePicker.launchCameraAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.8,
				});
			} else {
				result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.8,
				});
			}

			if (!result.canceled && result.assets[0]) {
				await uploadAvatarImage(result.assets[0]);
			}
		} catch (error) {
			console.error("Pick image error:", error);
			Alert.alert("Error", "Failed to pick image");
		}
	}; // Upload the selected image
	const uploadAvatarImage = async (asset: any) => {
		try {
			// Create FormData for file upload
			const formData = new FormData();

			// Get file extension from URI or default to jpg
			const uriParts = asset.uri.split(".");
			const fileExtension = uriParts[uriParts.length - 1] || "jpg";
			const fileName = `avatar_${Date.now()}.${fileExtension}`;

			formData.append("file", {
				uri: asset.uri,
				type: asset.mimeType || `image/${fileExtension}`,
				name: fileName,
			} as any);

			console.log("FormData created:", formData);
			console.log(
				"FormData instanceof FormData:",
				formData instanceof FormData
			);
			console.log("Uploading avatar with data:", {
				uri: asset.uri,
				type: asset.mimeType || `image/${fileExtension}`,
				name: fileName,
			});

			// Upload avatar using RTK Query
			const response = await uploadAvatar(formData).unwrap();

			console.log(
				"Full upload response:",
				JSON.stringify(response, null, 2)
			);
			console.log("Response keys:", Object.keys(response || {}));

			// Try multiple possible response formats
			let newAvatarUrl = null;

			// Check various possible response structures
			if (response?.url) {
				newAvatarUrl = response.url;
				console.log("Found URL in response.url:", newAvatarUrl);
			} else if (response?.data?.url) {
				newAvatarUrl = response.data.url;
				console.log("Found URL in response.data.url:", newAvatarUrl);
			} else if (response?.avatarUrl) {
				newAvatarUrl = response.avatarUrl;
				console.log("Found URL in response.avatarUrl:", newAvatarUrl);
			} else if (response?.data?.avatarUrl) {
				newAvatarUrl = response.data.avatarUrl;
				console.log(
					"Found URL in response.data.avatarUrl:",
					newAvatarUrl
				);
			} else if (response?.data?.avatar) {
				newAvatarUrl = response.data.avatar;
				console.log("Found URL in response.data.avatar:", newAvatarUrl);
			} else if (response?.avatar) {
				newAvatarUrl = response.avatar;
				console.log("Found URL in response.avatar:", newAvatarUrl);
			} else if (response?.image) {
				newAvatarUrl = response.image;
				console.log("Found URL in response.image:", newAvatarUrl);
			} else if (response?.imageUrl) {
				newAvatarUrl = response.imageUrl;
				console.log("Found URL in response.imageUrl:", newAvatarUrl);
			} else if (response?.fileUrl) {
				newAvatarUrl = response.fileUrl;
				console.log("Found URL in response.fileUrl:", newAvatarUrl);
			} else if (typeof response === "string") {
				newAvatarUrl = response;
				console.log("Response is string URL:", newAvatarUrl);
			}

			if (newAvatarUrl) {
				dispatch(setAvatar(newAvatarUrl));
				Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
			} else {
				console.log(
					"No avatar URL found in response. Full response:",
					response
				);
				Alert.alert(
					"Thông báo",
					"Upload thành công nhưng không nhận được URL ảnh. Vui lòng thử lại sau."
				);
			}
		} catch (error: any) {
			console.error("Upload avatar error:", error);
			const errorMessage =
				error?.data?.message ||
				error?.message ||
				"Có lỗi xảy ra khi tải lên ảnh";
			Alert.alert("Lỗi", errorMessage);
		}
	};

	// Handle avatar press - either custom onAvatarPress or upload functionality
	const handleAvatarPress = () => {
		if (onAvatarPress) {
			// Show custom options with upload option
			Alert.alert("Thay đổi ảnh đại diện", "Chọn nguồn ảnh:", [
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Camera",
					onPress: () => pickImage("camera"),
				},
				{
					text: "Thư viện ảnh",
					onPress: () => pickImage("library"),
				},
			]);
		} else {
			// Default behavior: allow avatar upload
			handleAvatarUpload();
		}
	};

	// Default notification handler
	const handleNotificationPress = () => {
		if (onNotificationPress) {
			onNotificationPress();
		} else if (navigation) {
			navigation.navigate("NotificationScreen");
		}
	};

	// Default chat handler
	const handleChatPress = () => {
		if (onChatPress) {
			onChatPress();
		} else {
			console.log("Chat pressed - implement chat navigation");
		}
	};

	console.log(email, name);

	// Render clean variant (for blog screens)
	if (variant === "clean") {
		return (
			<View style={styles.cleanHeader}>
				<TouchableOpacity
					style={styles.cleanBackButton}
					onPress={onBackPress}
				>
					<Ionicons name="arrow-back" size={24} color="#1e293b" />
				</TouchableOpacity>
				<Text style={styles.cleanHeaderTitle}>{title}</Text>
				{rightButton ? (
					<TouchableOpacity
						style={styles.cleanRightButton}
						onPress={rightButton.onPress}
					>
						<Ionicons
							name={rightButton.icon as any}
							size={24}
							color="#FFFFFF"
						/>
					</TouchableOpacity>
				) : (
					<View style={styles.cleanHeaderRight} />
				)}
			</View>
		);
	}

	// Original clean variant (now default style)
	return (
		<View style={isSimpleHeader ? styles.header : styles.avatarHeader}>
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
									color="#1e293b"
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
								onPress={handleAvatarPress}
								activeOpacity={0.8}
								disabled={isUploadingAvatar}
							>
								<Image
									source={
										avatarUrl && avatarUrl.trim() !== ""
											? { uri: avatarUrl }
											: require("../assets/images/logo/logo-gshop-removebg.png")
									}
									style={[
										styles.avatar,
										isUploadingAvatar &&
											styles.avatarLoading,
									]}
									onError={(error) => {
										console.log(
											"Avatar load error:",
											error
										);
									}}
								/>
								{isUploadingAvatar && (
									<View style={styles.uploadingOverlay}>
										<Ionicons
											name="camera"
											size={20}
											color="#1e293b"
										/>
									</View>
								)}
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
								Xin chào, {name}
							</Text>
							<Text style={styles.subGreeting}>
								{subtitle || email}
							</Text>
						</View>
					</View>
				)}

				<View style={styles.headerRight}>
					{/* Right button for simple headers */}
					{isSimpleHeader && rightButton && (
						<TouchableOpacity
							style={styles.rightButton}
							onPress={rightButton.onPress}
							activeOpacity={0.7}
						>
							<Ionicons
								name={rightButton.icon as any}
								size={24}
								color="#1e293b"
							/>
						</TouchableOpacity>
					)}

					{/* Notification Icon */}
					{showNotificationIcon && (
						<TouchableOpacity
							style={styles.notificationContainer}
							onPress={handleNotificationPress}
							activeOpacity={0.7}
						>
							<Ionicons
								name="notifications-outline"
								size={24}
								color="#1e293b"
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
					)}

					{/* Chat Icon */}
					{showChatIcon && (
						<TouchableOpacity
							style={styles.chatIcon}
							onPress={handleChatPress}
							activeOpacity={0.7}
						>
							<Ionicons
								name="chatbubble-outline"
								size={24}
								color="#1e293b"
							/>
							{chatCount > 0 && (
								<View style={styles.chatBadge}>
									<Text style={styles.chatBadgeText}>
										{chatCount > 9 ? "9+" : chatCount}
									</Text>
								</View>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
		shadowColor: "#007AFF",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 8,
	},
	avatarHeader: {
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 25,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
		shadowColor: "#007AFF",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.12,
		shadowRadius: 5,
		elevation: 6,
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
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
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
	avatarLoading: {
		opacity: 0.6,
	},
	uploadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
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
		color: "#1e293b",
		marginBottom: 2,
	},
	subGreeting: {
		fontSize: 14,
		color: "#64748b",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	rightButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
		marginRight: 8,
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
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
		marginRight: 12,
	},
	// Clean variant styles
	cleanHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	cleanBackButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
	},
	cleanHeaderTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
	},
	cleanRightButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#42A5F5",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
	},
	cleanHeaderRight: {
		width: 40,
	},
});
