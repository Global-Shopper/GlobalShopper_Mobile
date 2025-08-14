import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "../../components/ui/text";
import blogData from "./blog.json";

const BlogListScreen = ({ navigation }) => {
	const [selectedCategory, setSelectedCategory] = useState("Tất cả");

	const categories = ["Tất cả", ...blogData.categories];

	const filteredBlogs =
		selectedCategory === "Tất cả"
			? blogData.blogs
			: blogData.blogs.filter(
					(blog) => blog.category === selectedCategory
			  );

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const renderCategoryFilter = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.categoryContainer}
			contentContainerStyle={styles.categoryContent}
		>
			{categories.map((category, index) => (
				<TouchableOpacity
					key={index}
					style={[
						styles.categoryButton,
						selectedCategory === category &&
							styles.categoryButtonActive,
					]}
					onPress={() => setSelectedCategory(category)}
				>
					<Text
						style={[
							styles.categoryText,
							selectedCategory === category &&
								styles.categoryTextActive,
						]}
					>
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const renderBlogItem = ({ item }) => (
		<TouchableOpacity
			style={styles.blogCard}
			onPress={() => navigation.navigate("BlogDetail", { blog: item })}
			activeOpacity={0.7}
		>
			<Image
				source={{ uri: item.thumbnail }}
				style={styles.blogImage}
				resizeMode="cover"
			/>
			<View style={styles.blogContent}>
				<View style={styles.blogHeader}>
					<View style={styles.categoryBadge}>
						<Text style={styles.categoryBadgeText}>
							{item.category}
						</Text>
					</View>
					<View style={styles.readTimeContainer}>
						<Ionicons
							name="time-outline"
							size={12}
							color="#64748b"
						/>
						<Text style={styles.readTime}>{item.readTime}</Text>
					</View>
				</View>

				<Text style={styles.blogTitle} numberOfLines={2}>
					{item.title}
				</Text>

				<Text style={styles.blogSummary} numberOfLines={3}>
					{item.summary}
				</Text>

				<View style={styles.blogFooter}>
					<View style={styles.authorContainer}>
						<Ionicons
							name="person-outline"
							size={14}
							color="#64748b"
						/>
						<Text style={styles.author}>{item.author}</Text>
					</View>
					<Text style={styles.publishDate}>
						{formatDate(item.publishDate)}
					</Text>
				</View>

				<View style={styles.tagsContainer}>
					{item.tags.slice(0, 3).map((tag, index) => (
						<View key={index} style={styles.tag}>
							<Text style={styles.tagText}>#{tag}</Text>
						</View>
					))}
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} color="#1e293b" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Blog</Text>
				<View style={styles.headerRight} />
			</View>

			{/* Category Filter */}
			{renderCategoryFilter()}

			{/* Blog List */}
			<FlatList
				data={filteredBlogs}
				renderItem={renderBlogItem}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
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
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1e293b",
	},
	headerRight: {
		width: 40,
	},
	categoryContainer: {
		backgroundColor: "#fff",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	categoryContent: {
		paddingHorizontal: 16,
	},
	categoryButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 8,
		borderRadius: 20,
		backgroundColor: "#f1f5f9",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	categoryButtonActive: {
		backgroundColor: "#42A5F5",
		borderColor: "#42A5F5",
	},
	categoryText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#64748b",
	},
	categoryTextActive: {
		color: "#fff",
	},
	listContainer: {
		padding: 16,
	},
	blogCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	blogImage: {
		width: "100%",
		height: 200,
	},
	blogContent: {
		padding: 16,
	},
	blogHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	categoryBadge: {
		backgroundColor: "#42A5F520",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	categoryBadgeText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#42A5F5",
	},
	readTimeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	readTime: {
		fontSize: 12,
		color: "#64748b",
		marginLeft: 4,
	},
	blogTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 8,
		lineHeight: 24,
	},
	blogSummary: {
		fontSize: 14,
		color: "#64748b",
		lineHeight: 20,
		marginBottom: 12,
	},
	blogFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	authorContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	author: {
		fontSize: 12,
		color: "#64748b",
		marginLeft: 4,
	},
	publishDate: {
		fontSize: 12,
		color: "#64748b",
	},
	tagsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	tag: {
		backgroundColor: "#f1f5f9",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginRight: 6,
		marginBottom: 4,
	},
	tagText: {
		fontSize: 11,
		color: "#64748b",
		fontWeight: "500",
	},
	separator: {
		height: 16,
	},
});

export default BlogListScreen;
