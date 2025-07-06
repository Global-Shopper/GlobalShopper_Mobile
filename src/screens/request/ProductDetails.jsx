import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import Header from "../../components/header";
import ProductForm from "../../components/product-form";

export default function ProductDetails({ navigation, route }) {
	const { mode = "manual", initialData = null } = route.params || {};

	const handleSubmit = (productData) => {
		console.log("Product data submitted:", productData);

		// navigate về màn trước và truyền data
		navigation.navigate("OrderConfirmation", {
			productData,
			mode,
		});
	};

	const getHeaderTitle = () => {
		switch (mode) {
			case "fromLink":
				return "Chi tiết sản phẩm";
			case "manual":
				return "Thông tin sản phẩm";
			default:
				return "Chi tiết sản phẩm";
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "padding"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
		>
			{/* Header */}
			<Header
				title={getHeaderTitle()}
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				notificationCount={3}
				chatCount={1}
				onNotificationPress={() => console.log("Notification pressed")}
				onChatPress={() => console.log("Chat pressed")}
			/>

			{/* Product Form */}
			<ProductForm
				initialData={initialData}
				mode={mode}
				onSubmit={handleSubmit}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
});
