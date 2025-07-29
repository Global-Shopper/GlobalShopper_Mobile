import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../features/user";
import { useUploadAvatarMutation } from "../services/gshopApi";
import { useDialog } from "./dialogHelpers";
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
	showChatIcon = true,
}: HeaderProps) {
	// Determine if this is a simple title header or avatar header
	const isSimpleHeader = !!title;
	const dispatch = useDispatch();
	const { showDialog, Dialog } = useDialog();
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
			showDialog({
				title: "Cần quyền truy cập",
				message:
					"Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh để tải lên ảnh đại diện của bạn.",
			});
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
			showDialog({
				title: "Tải lên ảnh đại diện",
				message: "Chọn một tùy chọn",
				primaryButton: {
					text: "Máy ảnh",
					onPress: () => pickImage("camera"),
					style: "primary",
				},
				secondaryButton: {
					text: "Thư viện",
					onPress: () => pickImage("library"),
					style: "outline",
				},
			});
		} catch (error) {
			console.error("Avatar upload error:", error);
			showDialog({
				title: "Lỗi",
				message: "Không thể tải lên ảnh đại diện",
			});
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
					showDialog({
						title: "Cần quyền truy cập",
						message: "Cần quyền truy cập máy ảnh",
					});
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
			showDialog({
				title: "Lỗi",
				message: "Không thể chọn ảnh",
			});
		}
	};

	// Upload the selected image
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
				showDialog({
					title: "Thành công",
					message: "Cập nhật ảnh đại diện thành công!",
				});
			} else {
				console.log(
					"No avatar URL found in response. Full response:",
					response
				);
				showDialog({
					title: "Thông báo",
					message:
						"Upload thành công nhưng không nhận được URL ảnh. Vui lòng thử lại sau.",
				});
			}
		} catch (error: any) {
			console.error("Upload avatar error:", error);
			const errorMessage =
				error?.data?.message ||
				error?.message ||
				"Có lỗi xảy ra khi tải lên ảnh";
			showDialog({
				title: "Lỗi",
				message: errorMessage,
			});
		}
	};

	// Handle avatar press - either custom onAvatarPress or upload functionality
	const handleAvatarPress = () => {
		if (onAvatarPress) {
			// Show custom options with upload option
			showDialog({
				title: "Thay đổi ảnh đại diện",
				message: "Chọn nguồn ảnh:",
				primaryButton: {
					text: "Máy ảnh",
					onPress: () => pickImage("camera"),
					style: "primary",
				},
				secondaryButton: {
					text: "Thư viện ảnh",
					onPress: () => pickImage("library"),
					style: "outline",
				},
			});
		} else {
			// Default behavior: allow avatar upload
			handleAvatarUpload();
		}
	};

	// Default notification handler - always navigate to NotificationScreen
	const handleNotificationPress = () => {
		if (navigation) {
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

	return (
		<>
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
												color="#FFFFFF"
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
						)}
					</View>
				</View>
			</LinearGradient>
			<Dialog />
		</>
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
