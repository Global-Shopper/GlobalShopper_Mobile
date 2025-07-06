import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import StoreForm from "../../components/store-form";

export default function AddStore({ navigation }) {
	const [showInstructions, setShowInstructions] = useState(false);

	const handleSubmit = (storeData) => {
		// Store data saved successfully, navigate to ProductDetails
		navigation.navigate("ProductDetails", {
			mode: "manual",
			initialData: {
				sellerInfo: {
					name: storeData.storeName,
					phone: storeData.phoneNumber,
					email: storeData.email,
					address: storeData.storeAddress,
					storeLink: storeData.shopLink,
				},
			},
		});
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Thêm cửa hàng"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onNotificationPress={() => console.log("Notification pressed")}
				onChatPress={() => console.log("Chat pressed")}
			/>

			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
			>
				<ScrollView
					style={styles.scrollContainer}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={styles.scrollContent}
				>
					{/* Help Button */}
					<View style={styles.helpButtonContainer}>
						<TouchableOpacity
							style={styles.helpButton}
							onPress={() =>
								setShowInstructions(!showInstructions)
							}
						>
							<Ionicons
								name="information-circle-outline"
								size={20}
								color="#42A5F5"
							/>
						</TouchableOpacity>
					</View>

					{/* Collapsible Instructions */}
					{showInstructions && (
						<View style={styles.instructionCard}>
							<Ionicons
								name="information-circle"
								size={24}
								color="#42A5F5"
							/>
							<View style={styles.instructionText}>
								<Text style={styles.instructionTitle}>
									Hướng dẫn sử dụng
								</Text>
								<Text style={styles.instructionDesc}>
									Nhập thông tin cửa hàng mà bạn muốn mua sản
									phẩm. Chúng tôi sẽ liên hệ với cửa hàng để
									hỗ trợ bạn đặt hàng.
								</Text>
							</View>
						</View>
					)}

					{/* Store Form */}
					<StoreForm onSubmit={handleSubmit} mode="manual" />
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	helpButtonContainer: {
		alignItems: "flex-end",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 5,
	},
	helpButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		paddingVertical: 6,
		paddingHorizontal: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#E8F2FF",
	},
	instructionCard: {
		backgroundColor: "#E3F2FD",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "flex-start",
		marginHorizontal: 20,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#BBDEFB",
		shadowColor: "#42A5F5",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 2,
	},
	instructionText: {
		flex: 1,
		marginLeft: 12,
	},
	instructionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 4,
	},
	instructionDesc: {
		fontSize: 14,
		color: "#1565C0",
		lineHeight: 20,
	},
});
