import { Ionicons } from "@expo/vector-icons";
import {
	Image,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "../../components/ui/text";

const BlogDetail = ({ navigation, route }) => {
	const { blog } = route.params;

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleShare = async () => {
		try {
			await Share.share({
				message: `${blog.title}\n\n${blog.summary}\n\nĐọc thêm tại GlobalShopper Blog`,
				title: blog.title,
			});
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	const renderContent = () => {
		// Split content by paragraphs and render with proper styling
		const paragraphs = blog.content.split("\n\n");

		return paragraphs.map((paragraph, index) => {
			if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
				// Bold headers
				return (
					<Text key={index} style={styles.contentHeader}>
						{paragraph.replace(/\*\*/g, "")}
					</Text>
				);
			} else if (paragraph.includes("- ")) {
				// List items
				const listItems = paragraph
					.split("\n")
					.filter((item) => item.trim());
				return (
					<View key={index} style={styles.listContainer}>
						{listItems.map((item, itemIndex) => (
							<View key={itemIndex} style={styles.listItem}>
								<Text style={styles.listBullet}>•</Text>
								<Text style={styles.listText}>
									{item.replace("- ", "")}
								</Text>
							</View>
						))}
					</View>
				);
			} else {
				// Regular paragraphs
				return (
					<Text key={index} style={styles.contentText}>
						{paragraph}
					</Text>
				);
			}
		});
	};

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
				<Text style={styles.headerTitle}>Chi tiết bài viết</Text>
				<TouchableOpacity
					style={styles.shareButton}
					onPress={handleShare}
				>
					<Ionicons name="share-outline" size={24} color="#1e293b" />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Featured Image */}
				<Image
					source={{ uri: blog.thumbnail }}
					style={styles.featuredImage}
					resizeMode="cover"
				/>

				<View style={styles.contentContainer}>
					{/* Category Badge */}
					<View style={styles.categoryBadge}>
						<Text style={styles.categoryBadgeText}>
							{blog.category}
						</Text>
					</View>

					{/* Title */}
					<Text style={styles.title}>{blog.title}</Text>

					{/* Meta Information */}
					<View style={styles.metaContainer}>
						<View style={styles.metaItem}>
							<Ionicons
								name="person-outline"
								size={16}
								color="#64748b"
							/>
							<Text style={styles.metaText}>{blog.author}</Text>
						</View>
						<View style={styles.metaItem}>
							<Ionicons
								name="calendar-outline"
								size={16}
								color="#64748b"
							/>
							<Text style={styles.metaText}>
								{formatDate(blog.publishDate)}
							</Text>
						</View>
						<View style={styles.metaItem}>
							<Ionicons
								name="time-outline"
								size={16}
								color="#64748b"
							/>
							<Text style={styles.metaText}>{blog.readTime}</Text>
						</View>
					</View>

					{/* Summary */}
					<View style={styles.summaryContainer}>
						<Text style={styles.summaryTitle}>Tóm tắt</Text>
						<Text style={styles.summaryText}>{blog.summary}</Text>
					</View>

					{/* Content */}
					<View style={styles.contentSection}>{renderContent()}</View>

					{/* Tags */}
					<View style={styles.tagsSection}>
						<Text style={styles.tagsTitle}>Thẻ liên quan</Text>
						<View style={styles.tagsContainer}>
							{blog.tags.map((tag, index) => (
								<View key={index} style={styles.tag}>
									<Text style={styles.tagText}>#{tag}</Text>
								</View>
							))}
						</View>
					</View>

					{/* Call to Action */}
					<View style={styles.ctaContainer}>
						<Text style={styles.ctaTitle}>
							Cần hỗ trợ mua hàng quốc tế?
						</Text>
						<Text style={styles.ctaText}>
							Liên hệ GlobalShopper để được tư vấn miễn phí về
							dịch vụ mua hộ từ các trang thương mại điện tử quốc
							tế.
						</Text>
						<TouchableOpacity
							style={styles.ctaButton}
							onPress={() => navigation.navigate("Contact")}
						>
							<Text style={styles.ctaButtonText}>
								Liên hệ ngay
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
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
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
	},
	shareButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#f1f5f9",
	},
	scrollView: {
		flex: 1,
	},
	featuredImage: {
		width: "100%",
		height: 250,
	},
	contentContainer: {
		padding: 20,
	},
	categoryBadge: {
		alignSelf: "flex-start",
		backgroundColor: "#42A5F520",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginBottom: 16,
	},
	categoryBadgeText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#42A5F5",
	},
	title: {
		fontSize: 24,
		fontWeight: "800",
		color: "#1e293b",
		lineHeight: 32,
		marginBottom: 16,
	},
	metaContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 20,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
		marginBottom: 8,
	},
	metaText: {
		fontSize: 14,
		color: "#64748b",
		marginLeft: 6,
	},
	summaryContainer: {
		backgroundColor: "#f8fafc",
		padding: 16,
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
		marginBottom: 24,
	},
	summaryTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 8,
	},
	summaryText: {
		fontSize: 15,
		color: "#475569",
		lineHeight: 22,
	},
	contentSection: {
		marginBottom: 24,
	},
	contentHeader: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		marginTop: 20,
		marginBottom: 12,
		lineHeight: 24,
	},
	contentText: {
		fontSize: 16,
		color: "#374151",
		lineHeight: 24,
		marginBottom: 16,
	},
	listContainer: {
		marginBottom: 16,
	},
	listItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	listBullet: {
		fontSize: 16,
		color: "#42A5F5",
		marginRight: 8,
		lineHeight: 24,
	},
	listText: {
		flex: 1,
		fontSize: 16,
		color: "#374151",
		lineHeight: 24,
	},
	tagsSection: {
		marginBottom: 24,
	},
	tagsTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 12,
	},
	tagsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	tag: {
		backgroundColor: "#f1f5f9",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginRight: 8,
		marginBottom: 8,
	},
	tagText: {
		fontSize: 14,
		color: "#64748b",
		fontWeight: "500",
	},
	ctaContainer: {
		backgroundColor: "#42A5F510",
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#42A5F530",
	},
	ctaTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 8,
	},
	ctaText: {
		fontSize: 15,
		color: "#475569",
		lineHeight: 22,
		marginBottom: 16,
	},
	ctaButton: {
		backgroundColor: "#42A5F5",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	ctaButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
	},
});

export default BlogDetail;
