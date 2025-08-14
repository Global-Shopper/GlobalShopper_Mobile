import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StoreCard from "../store-card";
import { Text } from "../ui/text";

const RequestDetailsInfo = ({ requestData, navigation }) => {
	return (
		<>
			{/* Request History Button */}
			<View style={styles.section}>
				<TouchableOpacity
					style={styles.historyViewButton}
					onPress={() =>
						navigation.navigate("RequestHistory", {
							request: requestData,
						})
					}
				>
					<View style={styles.historyViewLeft}>
						<Ionicons
							name="time-outline"
							size={20}
							color="#1976D2"
						/>
						<Text style={styles.historyViewTitle}>
							Lịch sử yêu cầu
						</Text>
					</View>
					<View style={styles.historyViewRight}>
						<Text style={styles.viewDetailsText}>Xem chi tiết</Text>
						<Ionicons
							name="chevron-forward-outline"
							size={20}
							color="#1976D2"
						/>
					</View>
				</TouchableOpacity>
			</View>

			{/* Store Information - Show only for OFFLINE requests */}
			{(requestData?.requestType?.toLowerCase() === "offline" ||
				requestData?.type?.toLowerCase() === "offline") &&
				(() => {
					// Extract store info from requestData.store OR subRequests.contactInfo
					let storeInfo = null;

					// Method 1: Direct store object
					if (requestData?.store) {
						storeInfo = {
							storeName:
								requestData.store.storeName ||
								requestData.store.name ||
								"",
							storeAddress:
								requestData.store.storeAddress ||
								requestData.store.address ||
								"",
							phoneNumber:
								requestData.store.phoneNumber ||
								requestData.store.phone ||
								"",
							email: requestData.store.email || "",
							shopLink:
								requestData.store.shopLink ||
								requestData.store.storeLink ||
								"",
						};
					}
					// Method 2: Extract from subRequests.contactInfo
					else if (requestData?.subRequests?.length > 0) {
						const firstSubRequest = requestData.subRequests[0];
						if (
							firstSubRequest?.contactInfo &&
							Array.isArray(firstSubRequest.contactInfo)
						) {
							const contactInfo = firstSubRequest.contactInfo;

							// Parse contactInfo array to extract store details
							const parseContactInfo = (infoArray) => {
								const parsed = {
									storeName: "",
									storeAddress: "",
									phoneNumber: "",
									email: "",
									shopLink: "",
								};

								infoArray.forEach((info) => {
									if (typeof info === "string") {
										if (
											info.includes("Tên cửa hàng:") ||
											info.includes("Store:")
										) {
											parsed.storeName = info
												.replace("Tên cửa hàng:", "")
												.replace("Store:", "")
												.trim();
										} else if (
											info.includes("Địa chỉ:") ||
											info.includes("Address:")
										) {
											parsed.storeAddress = info
												.replace("Địa chỉ:", "")
												.replace("Address:", "")
												.trim();
										} else if (
											info.includes("SĐT:") ||
											info.includes("Phone:") ||
											info.includes("Số điện thoại:")
										) {
											parsed.phoneNumber = info
												.replace("SĐT:", "")
												.replace("Phone:", "")
												.replace("Số điện thoại:", "")
												.trim();
										} else if (
											info.includes("Email:") ||
											info.includes("@")
										) {
											parsed.email = info
												.replace("Email:", "")
												.trim();
										} else if (
											info.includes("Link:") ||
											info.includes("Link shop:") ||
											info.includes("http")
										) {
											parsed.shopLink = info
												.replace("Link:", "")
												.replace("Link shop:", "")
												.trim();
										}
									}
								});

								return parsed;
							};

							storeInfo = parseContactInfo(contactInfo);
						}
					}

					// Only render if we have store info
					if (
						storeInfo &&
						(storeInfo.storeName ||
							storeInfo.storeAddress ||
							storeInfo.phoneNumber)
					) {
						return (
							<View style={styles.section}>
								<StoreCard
									storeName={storeInfo.storeName}
									storeAddress={storeInfo.storeAddress}
									phoneNumber={storeInfo.phoneNumber}
									email={storeInfo.email}
									shopLink={storeInfo.shopLink}
									mode="manual"
									showEditButton={false}
								/>
							</View>
						);
					}

					return null;
				})()}
		</>
	);
};

const styles = StyleSheet.create({
	section: {
		marginBottom: 10,
	},
	historyViewButton: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	historyViewLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
	},
	historyViewTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	historyViewRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	viewDetailsText: {
		fontSize: 14,
		color: "#1976D2",
		fontWeight: "500",
	},
});

export default RequestDetailsInfo;
