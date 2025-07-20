import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
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
	const [storeData, setStoreData] = useState(null);

	const handleStoreDataChange = (data) => {
		console.log("AddStore - Store data changed:", data);
		setStoreData(data);
	};

	const handleAddProduct = () => {
		console.log("AddStore - Navigating with store data:", storeData);

		// Validate store data before navigation
		if (!storeData) {
			Alert.alert(
				"Thiếu thông tin",
				"Vui lòng điền thông tin cửa hàng trước khi thêm sản phẩm."
			);
			return;
		}

		if (!storeData.storeName?.trim()) {
			Alert.alert("Thiếu thông tin", "Vui lòng nhập tên cửa hàng.");
			return;
		}

		if (!storeData.storeAddress?.trim()) {
			Alert.alert("Thiếu thông tin", "Vui lòng nhập địa chỉ cửa hàng.");
			return;
		}

		if (!storeData.shopLink?.trim()) {
			Alert.alert("Thiếu thông tin", "Vui lòng nhập link cửa hàng.");
			return;
		}

		// Navigate to add product screen with store data
		console.log("AddStore - Navigating with storeData:", storeData);
		console.log("AddStore - StoreData keys:", Object.keys(storeData));
		console.log("AddStore - StoreData values:", Object.values(storeData));

		navigation.navigate("ProductDetails", {
			mode: "manual",
			storeData: storeData,
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
				onChatPress={() => console.log("Chat pressed")}
				navigation={navigation}
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
					<StoreForm
						mode="manual"
						showSubmitButton={false}
						onDataChange={handleStoreDataChange}
					/>

					{/* Add Product Button */}
					<TouchableOpacity
						style={styles.addProductButton}
						onPress={handleAddProduct}
					>
						<LinearGradient
							colors={["#4FC3F7", "#29B6F6"]}
							style={styles.addProductButtonGradient}
						>
							<Ionicons
								name="add-circle-outline"
								size={24}
								color="#FFFFFF"
							/>
							<Text style={styles.addProductButtonText}>
								Thêm sản phẩm
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 30,
	},
	helpButtonContainer: {
		alignItems: "flex-end",
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
	addProductButton: {
		marginTop: 20,
		marginBottom: 30,
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	addProductButtonGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	addProductButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: 8,
	},
});
