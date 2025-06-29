import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "./ui/text";

interface Platform {
	id: string;
	name: string;
	image: any;
	placeholder: string;
}

const platforms: Platform[] = [
	{
		id: "amazon",
		name: "Amazon",
		image: require("../assets/images/ecommerce/amazon-logo.png"),
		placeholder: "Dán link Amazon tại đây...",
	},
	{
		id: "ebay",
		name: "eBay",
		image: require("../assets/images/ecommerce/ebay-logo.png"),
		placeholder: "Dán link eBay tại đây...",
	},
	{
		id: "aliexpress",
		name: "AliExpress",
		image: require("../assets/images/ecommerce/aliexpress-logo.png"),
		placeholder: "Dán link AliExpress tại đây...",
	},
	{
		id: "asos",
		name: "ASOS",
		image: require("../assets/images/ecommerce/asos-logo.png"),
		placeholder: "Dán link ASOS tại đây...",
	},
	{
		id: "dhgate",
		name: "DHgate",
		image: require("../assets/images/ecommerce/dhgate-logo.png"),
		placeholder: "Dán link DHgate tại đây...",
	},
	{
		id: "gmarket",
		name: "Gmarket",
		image: require("../assets/images/ecommerce/gmarket-logo.png"),
		placeholder: "Dán link Gmarket tại đây...",
	},
	{
		id: "shein",
		name: "Shein",
		image: require("../assets/images/ecommerce/shein-logo.png"),
		placeholder: "Dán link Shein tại đây...",
	},
	{
		id: "other",
		name: "Khác",
		image: null,
		placeholder: "Dán link sản phẩm tại đây...",
	},
];

interface LinkCardProps {
	index: number;
	onRemove: () => void;
	onLinkChange: (link: string) => void;
	canRemove: boolean;
}

export default function LinkCard({
	index,
	onRemove,
	onLinkChange,
	canRemove,
}: LinkCardProps) {
	const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
		null
	);
	const [productLink, setProductLink] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	const handlePlatformSelect = (platform: Platform) => {
		setSelectedPlatform(platform);
		setShowDropdown(false);
	};

	const handleLinkChange = (text: string) => {
		setProductLink(text);
		onLinkChange(text);
	};

	const isValidUrl = (string: string) => {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	};

	return (
		<View style={styles.linkCard}>
			<View style={styles.cardHeader}>
				<Text style={styles.cardTitle}>Sản phẩm {index + 1}</Text>
				{canRemove && (
					<TouchableOpacity
						style={styles.removeButton}
						onPress={onRemove}
					>
						<Ionicons name="close" size={20} color="#dc3545" />
					</TouchableOpacity>
				)}
			</View>

			{/* Platform Selector */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					Chọn sàn thương mại <Text style={styles.required}>*</Text>
				</Text>
				<TouchableOpacity
					style={styles.dropdown}
					onPress={() => setShowDropdown(!showDropdown)}
				>
					{selectedPlatform ? (
						<View style={styles.selectedPlatform}>
							{selectedPlatform.image ? (
								<Image
									source={selectedPlatform.image}
									style={styles.platformImage}
								/>
							) : (
								<Ionicons
									name="storefront-outline"
									size={24}
									color="#42A5F5"
									style={{ marginRight: 12 }}
								/>
							)}
							<Text style={styles.platformName}>
								{selectedPlatform.name}
							</Text>
						</View>
					) : (
						<Text style={styles.dropdownPlaceholder}>
							Chọn sàn thương mại
						</Text>
					)}
					<Ionicons
						name={showDropdown ? "chevron-up" : "chevron-down"}
						size={20}
						color="#666"
					/>
				</TouchableOpacity>

				{showDropdown && (
					<View style={styles.dropdownList}>
						<ScrollView
							style={styles.dropdownScrollView}
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled={true}
						>
							{platforms.map((platform, platformIndex) => (
								<TouchableOpacity
									key={platform.id}
									style={[
										styles.dropdownItem,
										platformIndex ===
											platforms.length - 1 &&
											styles.lastDropdownItem,
									]}
									onPress={() =>
										handlePlatformSelect(platform)
									}
								>
									{platform.image ? (
										<Image
											source={platform.image}
											style={styles.platformImage}
										/>
									) : (
										<Ionicons
											name="storefront-outline"
											size={24}
											color="#42A5F5"
											style={{ marginRight: 12 }}
										/>
									)}
									<Text style={styles.platformName}>
										{platform.name}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				)}
			</View>

			{/* Link Input */}
			{selectedPlatform && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Link sản phẩm <Text style={styles.required}>*</Text>
					</Text>
					<TextInput
						style={[
							styles.textInput,
							productLink &&
								!isValidUrl(productLink) &&
								styles.errorInput,
						]}
						placeholder={selectedPlatform.placeholder}
						value={productLink}
						onChangeText={handleLinkChange}
						multiline
						numberOfLines={3}
						autoCapitalize="none"
						keyboardType="url"
					/>
					{productLink && !isValidUrl(productLink) && (
						<Text style={styles.errorText}>
							Link không hợp lệ. Vui lòng kiểm tra lại.
						</Text>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	linkCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	removeButton: {
		padding: 4,
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	required: {
		color: "#dc3545",
	},
	dropdown: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		paddingVertical: 16,
		paddingHorizontal: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	selectedPlatform: {
		flexDirection: "row",
		alignItems: "center",
	},
	platformImage: {
		width: 24,
		height: 24,
		marginRight: 12,
		resizeMode: "contain",
	},
	platformName: {
		fontSize: 16,
		color: "#333",
	},
	dropdownPlaceholder: {
		fontSize: 16,
		color: "#999",
	},
	dropdownList: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginTop: 8,
		maxHeight: 160,
		overflow: "hidden",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		zIndex: 1000,
	},
	dropdownScrollView: {
		maxHeight: 160,
	},
	dropdownItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	lastDropdownItem: {
		borderBottomWidth: 0,
	},
	textInput: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		paddingVertical: 16,
		paddingHorizontal: 16,
		fontSize: 16,
		color: "#333",
		textAlignVertical: "top",
		minHeight: 80,
	},
	errorInput: {
		borderColor: "#dc3545",
		backgroundColor: "#FFF5F5",
	},
	errorText: {
		fontSize: 12,
		color: "#dc3545",
		marginTop: 4,
	},
});
