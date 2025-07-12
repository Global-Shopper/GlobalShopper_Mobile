import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useGetShippingAddressQuery } from "../../services/gshopApi";

export default function MyAddress({ navigation, route }) {
	const { mode = "default", onSelectAddress } = route.params || {};

	const { data: addresses = [] } = useGetShippingAddressQuery();

	const handleAddNewAddress = () => {
		navigation.navigate("AddAddress");
	};

	const handleEditAddress = (addressId) => {
		// Find the address data
		const addressData = addresses.find((addr) => addr.id === addressId);
		// Navigate to Edit Address screen with data
		navigation.navigate("EditAddress", { addressData });
	};

	const handleSetDefault = (addressId) => {
		// Set address as default
		console.log("Set as default:", addressId);
	};

	const handleSelectAddress = (address) => {
		if (mode === "selection" && onSelectAddress) {
			// Transform address data to match expected format
			const formattedAddress = {
				id: address.id,
				recipientName: address.name,
				phone: address.phoneNumber,
				address: address.location,
				isDefault: address.default,
			};
			onSelectAddress(formattedAddress);
			navigation.goBack();
		}
	};

	const getHeaderTitle = () => {
		return mode === "selection"
			? "Chọn địa chỉ nhận hàng"
			: "Địa chỉ của tôi";
	};

	const renderAddressItem = (item) => (
		<TouchableOpacity
			key={item.id}
			style={[
				styles.addressCard,
				mode === "selection" && styles.addressCardSelectable,
			]}
			onPress={() =>
				mode === "selection" ? handleSelectAddress(item) : null
			}
			activeOpacity={mode === "selection" ? 0.7 : 1}
		>
			{/* Default badge */}
			{item.default && (
				<View style={styles.defaultBadge}>
					<Text style={styles.defaultText}>Mặc định</Text>
				</View>
			)}

			{/* Selection indicator for selection mode */}
			{mode === "selection" && (
				<View style={styles.selectionIndicator}>
					<Ionicons
						name="chevron-forward"
						size={20}
						color="#1976D2"
					/>
				</View>
			)}

			{/* Name and Phone */}
			<View style={styles.contactInfo}>
				<Text style={styles.contactName}>{item.name}</Text>
				<Text style={styles.contactPhone}> | {item.phoneNumber}</Text>
			</View>

			{/* Address */}
			<Text style={styles.addressText}>{item.location}</Text>
			<View style={styles.actionContainer}>
				<Text style={styles.addressTag}>{item.tag}</Text>
			</View>

			{/* Action buttons - Hide in selection mode */}
			{mode !== "selection" && (
				<View style={styles.actionContainer}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => handleEditAddress(item.id)}
					>
						<Ionicons
							name="create-outline"
							size={16}
							color="#1976D2"
						/>
						<Text style={styles.actionButtonText}>Chỉnh sửa</Text>
					</TouchableOpacity>

					{!item.isDefault && (
						<TouchableOpacity
							style={[styles.actionButton, styles.defaultButton]}
							onPress={() => handleSetDefault(item.id)}
						>
							<Ionicons
								name="checkmark-circle-outline"
								size={16}
								color="#4CAF50"
							/>
							<Text
								style={[
									styles.actionButtonText,
									{ color: "#4CAF50" },
								]}
							>
								Đặt mặc định
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</TouchableOpacity>
	);

	// Sort addresses to show default first
	const sortedAddresses = [...addresses].sort((a, b) => {
		if (a.isDefault && !b.isDefault) return -1;
		if (!a.isDefault && b.isDefault) return 1;
		return 0;
	});

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1976D2" barStyle="light-content" />

			{/* Header */}
			<LinearGradient
				colors={["#42A5F5", "#1976D2"]}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
					<View style={styles.placeholder} />
				</View>
			</LinearGradient>

			{/* Content */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Address List */}
				<View style={styles.addressList}>
					{sortedAddresses.map(renderAddressItem)}
				</View>

				{/* Add New Address Button */}
				<TouchableOpacity
					style={styles.addButton}
					onPress={handleAddNewAddress}
					activeOpacity={0.7}
				>
					<View style={styles.addButtonContent}>
						<View style={styles.addIconContainer}>
							<LinearGradient
								colors={["#4FC3F7", "#29B6F6"]}
								style={styles.addIconGradient}
							>
								<Ionicons
									name="add"
									size={24}
									color="#FFFFFF"
								/>
							</LinearGradient>
						</View>
						<View style={styles.addTextContainer}>
							<Text style={styles.addButtonTitle}>
								Thêm địa chỉ mới
							</Text>
							<Text style={styles.addButtonSubtitle}>
								Thêm địa chỉ giao hàng mới
							</Text>
						</View>
						<Ionicons
							name="chevron-forward"
							size={20}
							color="#B0BEC5"
						/>
					</View>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	header: {
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	addressList: {
		marginTop: 25,
	},
	addressCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		position: "relative",
	},
	addressCardSelectable: {
		borderColor: "#E3F2FD",
		backgroundColor: "#FAFAFA",
	},
	defaultBadge: {
		position: "absolute",
		top: 16,
		right: 16,
		backgroundColor: "#4CAF50",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	defaultText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	contactInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		marginRight: 80, // Space for default badge
	},
	contactName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
	},
	contactPhone: {
		fontSize: 16,
		color: "#78909C",
	},
	addressText: {
		fontSize: 14,
		color: "#546E7A",
		lineHeight: 20,
		marginBottom: 16,
	},
	addressTag: {
		fontSize: 14,
		color: "#546E7A",
		lineHeight: 20,
		marginBottom: 16,
		backgroundColor: "#F0F8FF",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	actionContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		gap: 16,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: "#F0F8FF",
	},
	defaultButton: {
		backgroundColor: "#F1F8E9",
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#1976D2",
		marginLeft: 4,
	},
	addButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
	},
	addButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	addIconContainer: {
		marginRight: 15,
	},
	addIconGradient: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	addTextContainer: {
		flex: 1,
	},
	addButtonTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#263238",
		marginBottom: 2,
	},
	addButtonSubtitle: {
		fontSize: 13,
		color: "#78909C",
	},
	selectionIndicator: {
		position: "absolute",
		top: 16,
		right: 16,
		zIndex: 1,
	},
});
