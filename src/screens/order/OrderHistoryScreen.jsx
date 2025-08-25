import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../../components/header";
import { Text } from "../../components/ui/text";
import { useGetOrderByIdQuery } from "../../services/gshopApi";
import { getTracking } from "../../services/trackingMoreService";
import { formatDate, getStatusColor } from "../../utils/statusHandler.js";

export default function OrderHistoryScreen({ navigation, route }) {
	const { orderId } = route.params || {};

	// State
	const [trackingData, setTrackingData] = useState(null);
	const [trackingLoading, setTrackingLoading] = useState(false);
	const [trackingError, setTrackingError] = useState(null);

	// Get order details
	const {
		data: orderData,
		isLoading: orderLoading,
		error: orderError,
		refetch: refetchOrder,
	} = useGetOrderByIdQuery(orderId, {
		skip: !orderId,
	});

	// Back button handler
	const handleBackPress = () => {
		navigation.goBack();
	};

	// Fetch tracking data when order data is available
	useEffect(() => {
		const fetchTrackingData = async () => {
			if (!orderData?.trackingNumber) {
				return;
			}

			setTrackingLoading(true);
			setTrackingError(null);

			try {
				const response = await getTracking(
					orderData.trackingNumber,
					orderData.shippingCarrier
				);

				if (
					response.data &&
					response.data.data &&
					response.data.data.length > 0
				) {
					const trackingInfo = response.data.data[0];
					setTrackingData(trackingInfo);
				} else {
					setTrackingError("Không tìm thấy thông tin vận chuyển");
				}
			} catch (error) {
				// More specific error messages
				let errorMessage = "Lỗi khi tải thông tin vận chuyển";

				if (error.message.includes("Invalid tracking number")) {
					errorMessage = `Mã vận đơn không hợp lệ: ${orderData.trackingNumber}`;
				} else if (error.message.includes("Invalid API key")) {
					errorMessage = "Lỗi cấu hình API. Vui lòng liên hệ hỗ trợ";
				} else if (error.message.includes("timeout")) {
					errorMessage = "Kết nối chậm. Vui lòng thử lại";
				} else if (error.message.includes("Too many requests")) {
					errorMessage = "Quá nhiều yêu cầu. Vui lòng đợi ít phút";
				}

				setTrackingError(errorMessage);
			} finally {
				setTrackingLoading(false);
			}
		};

		fetchTrackingData();
	}, [orderData]);

	// Transform TrackingMore data to our format
	const getTransformedTrackingHistory = () => {
		if (!trackingData?.origin_info?.trackinfo) {
			return [];
		}

		return trackingData.origin_info.trackinfo.map((item, index) => ({
			id: index + 1,
			status: item.checkpoint_delivery_status || "transit",
			title: item.tracking_detail || "Cập nhật trạng thái",
			description: item.tracking_detail || "",
			date: item.checkpoint_date || new Date().toISOString(),
			location: item.location || item.city || "Việt Nam", // Default to Vietnam if no location
			isCompleted: true,
			isLatest: index === 0, // First item is latest from API
		}));
		// Remove reverse() - keep TrackingMore's order (newest first)
	};

	// Get transformed tracking history
	const trackingHistory = getTransformedTrackingHistory();

	// Retry tracking function
	const retryTracking = async () => {
		if (!orderData?.trackingNumber) return;

		setTrackingLoading(true);
		setTrackingError(null);

		try {
			const response = await getTracking(
				orderData.trackingNumber,
				orderData.shippingCarrier
			);

			if (
				response.data &&
				response.data.data &&
				response.data.data.length > 0
			) {
				const trackingInfo = response.data.data[0];
				setTrackingData(trackingInfo);
			} else {
				setTrackingError("Không tìm thấy thông tin vận chuyển");
			}
		} catch (error) {
			console.error("Retry tracking error:", error);
			setTrackingError(error.message);
		} finally {
			setTrackingLoading(false);
		}
	};

	// Get status icon for main status card
	const getMainStatusIcon = (deliveryStatus) => {
		const status = deliveryStatus?.toLowerCase() || "";

		if (status.includes("delivered")) {
			return { name: "checkmark-circle", color: "#28a745" };
		} else if (status.includes("pickup") || status.includes("out")) {
			return { name: "bicycle", color: "#007bff" };
		} else if (status.includes("transit")) {
			return { name: "car", color: "#ffc107" };
		} else if (status.includes("exception") || status.includes("failed")) {
			return { name: "warning", color: "#dc3545" };
		} else {
			return { name: "time", color: "#6c757d" };
		}
	};

	// Get status icon
	const getStatusIcon = (status) => {
		// Map TrackingMore status to our icons
		const statusLower = status.toLowerCase();

		if (statusLower.includes("delivered") || statusLower.includes("giao")) {
			return "checkmark-circle";
		} else if (
			statusLower.includes("out for delivery") ||
			statusLower.includes("đang giao") ||
			statusLower.includes("pickup")
		) {
			return "bicycle";
		} else if (
			statusLower.includes("arrival") ||
			statusLower.includes("đến")
		) {
			return "location";
		} else if (
			statusLower.includes("transit") ||
			statusLower.includes("vận chuyển") ||
			statusLower.includes("transporting") ||
			statusLower.includes("received")
		) {
			return "car"; // 🚛 Đổi từ airplane sang car (truck icon)
		} else if (
			statusLower.includes("shipped") ||
			statusLower.includes("xuất kho")
		) {
			return "cube";
		} else if (
			statusLower.includes("purchase") ||
			statusLower.includes("thanh toán") ||
			statusLower.includes("inforeceived") ||
			statusLower.includes("created")
		) {
			return "card";
		} else {
			return "ellipse";
		}
	};

	// Loading state
	if (orderLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Lịch sử vận chuyển"
					showBackButton
					onBackPress={handleBackPress}
					navigation={navigation}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#007bff" />
					<Text style={styles.loadingText}>
						Đang tải thông tin đơn hàng...
					</Text>
				</View>
			</View>
		);
	}

	// Error state
	if (orderError) {
		return (
			<View style={styles.container}>
				<Header
					title="Lịch sử vận chuyển"
					showBackButton
					onBackPress={handleBackPress}
					navigation={navigation}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color="#dc3545"
					/>
					<Text style={styles.errorText}>
						Không thể tải thông tin đơn hàng
					</Text>
					<Text style={styles.errorSubtext}>
						Vui lòng thử lại sau
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				title="Lịch sử vận chuyển"
				showBackButton
				onBackPress={handleBackPress}
				navigation={navigation}
			/>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Tracking Info */}
				<View style={styles.trackingCard}>
					<View style={styles.trackingHeader}>
						<Text style={styles.trackingTitle}>
							Mã vận đơn: {orderData?.trackingNumber || "Chưa có"}
						</Text>
						<Text style={styles.trackingSubtitle}>
							{orderData?.shippingCarrier || "Đơn vị vận chuyển"}
						</Text>
					</View>

					{/* 📦 TRACKING STATUS */}
					{trackingData && (
						<View style={styles.trackingStatusCard}>
							<View style={styles.statusHeader}>
								<View style={styles.statusTitleRow}>
									{(() => {
										const statusIcon = getMainStatusIcon(
											trackingData.delivery_status
										);
										return (
											<Ionicons
												name={statusIcon.name}
												size={24}
												color={statusIcon.color}
												style={styles.statusIcon}
											/>
										);
									})()}
									<Text style={styles.statusTitle}>
										{trackingData.delivery_status?.toUpperCase() ||
											"UNKNOWN"}
									</Text>
								</View>
								<Text style={styles.statusSubtitle}>
									{trackingData.latest_event ||
										"Không có thông tin"}
								</Text>
							</View>

							<View style={styles.statusDetails}>
								{/* Giao dự kiến */}
								{trackingData.origin_info?.milestone_date
									?.delivery_date && (
									<View style={styles.statusRow}>
										<View style={styles.statusLabelRow}>
											<Ionicons
												name="calendar-outline"
												size={16}
												color="#6c757d"
											/>
											<Text style={styles.statusLabel}>
												Giao dự kiến:
											</Text>
										</View>
										<Text style={styles.statusValue}>
											{new Date(
												trackingData.origin_info.milestone_date.delivery_date
											).toLocaleString("vi-VN")}
										</Text>
									</View>
								)}

								<View style={styles.statusRow}>
									<View style={styles.statusLabelRow}>
										<Ionicons
											name="car-outline"
											size={16}
											color="#6c757d"
										/>
										<Text style={styles.statusLabel}>
											Đơn vị vận chuyển:
										</Text>
									</View>
									<Text style={styles.statusValue}>
										{trackingData.courier_code ||
											trackingData.origin_info
												?.courier_code ||
											"N/A"}
									</Text>
								</View>

								{trackingData.origin_info?.courier_phone && (
									<View style={styles.statusRow}>
										<View style={styles.statusLabelRow}>
											<Ionicons
												name="call-outline"
												size={16}
												color="#6c757d"
											/>
											<Text style={styles.statusLabel}>
												SĐT hỗ trợ:
											</Text>
										</View>
										<Text style={styles.statusValue}>
											{
												trackingData.origin_info
													.courier_phone
											}
										</Text>
									</View>
								)}

								<View style={styles.statusRow}>
									<View style={styles.statusLabelRow}>
										<Ionicons
											name="speedometer-outline"
											size={16}
											color="#6c757d"
										/>
										<Text style={styles.statusLabel}>
											Thời gian vận chuyển:
										</Text>
									</View>
									<Text style={styles.statusValue}>
										{trackingData.transit_time
											? `${trackingData.transit_time} ngày`
											: "N/A"}
									</Text>
								</View>
							</View>
						</View>
					)}

					{/* Loading/Error states for tracking */}
					{trackingLoading && (
						<View style={styles.trackingLoadingContainer}>
							<ActivityIndicator size="small" color="#007bff" />
							<Text style={styles.trackingLoadingText}>
								Đang tải thông tin vận chuyển...
							</Text>
						</View>
					)}

					{trackingError && (
						<View style={styles.trackingErrorContainer}>
							<View style={styles.trackingErrorContent}>
								<Ionicons
									name="warning-outline"
									size={24}
									color="#856404"
								/>
								<Text style={styles.trackingErrorText}>
									{trackingError}
								</Text>
							</View>
							<TouchableOpacity
								style={styles.retryButton}
								onPress={retryTracking}
								disabled={trackingLoading}
							>
								<Ionicons
									name="refresh-outline"
									size={16}
									color="#007bff"
								/>
								<Text style={styles.retryButtonText}>
									Thử lại
								</Text>
							</TouchableOpacity>
						</View>
					)}

					{/* Timeline */}
					{!trackingLoading &&
						!trackingError &&
						trackingHistory.length > 0 && (
							<View style={styles.timeline}>
								{trackingHistory.map((item, index) => (
									<View
										key={item.id}
										style={styles.timelineItem}
									>
										{/* Timeline Line */}
										<View
											style={styles.timelineLineContainer}
										>
											{/* Icon */}
											<View
												style={[
													styles.timelineIcon,
													{
														backgroundColor:
															getStatusColor(
																item.status,
																item.isCompleted
															),
													},
													item.isLatest &&
														styles.latestIcon,
												]}
											>
												<Ionicons
													name={getStatusIcon(
														item.status
													)}
													size={16}
													color="#ffffff"
												/>
											</View>

											{/* Connecting Line */}
											{index <
												trackingHistory.length - 1 && (
												<View
													style={[
														styles.timelineLine,
														{
															backgroundColor:
																item.isCompleted
																	? getStatusColor(
																			item.status,
																			item.isCompleted
																	  )
																	: "#e9ecef",
														},
													]}
												/>
											)}
										</View>

										{/* Content */}
										<View style={styles.timelineContent}>
											<View style={styles.timelineHeader}>
												<Text
													style={[
														styles.timelineTitle,
														item.isLatest &&
															styles.latestTitle,
													]}
												>
													{item.title}
												</Text>
												<Text
													style={styles.timelineDate}
												>
													{formatDate(item.date)}
												</Text>
											</View>

											<Text
												style={
													styles.timelineDescription
												}
											>
												{item.description}
											</Text>

											<View
												style={styles.timelineLocation}
											>
												<Ionicons
													name="location-outline"
													size={14}
													color="#6c757d"
												/>
												<Text
													style={styles.locationText}
												>
													{item.location}
												</Text>
											</View>
										</View>
									</View>
								))}
							</View>
						)}

					{/* No tracking data message */}
					{!trackingLoading &&
						!trackingError &&
						trackingHistory.length === 0 && (
							<View style={styles.noTrackingContainer}>
								<Ionicons
									name="information-circle-outline"
									size={32}
									color="#6c757d"
								/>
								<Text style={styles.noTrackingText}>
									Chưa có thông tin vận chuyển
								</Text>
							</View>
						)}
				</View>

				{/* Additional Info */}
				<View style={styles.infoCard}>
					<Text style={styles.infoTitle}>Thông tin bổ sung</Text>

					<View style={styles.infoItem}>
						<Ionicons
							name="time-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Thời gian giao hàng dự kiến: 3-5 ngày làm việc
						</Text>
					</View>

					<View style={styles.infoItem}>
						<Ionicons
							name="call-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Hotline hỗ trợ: 1900 1234
						</Text>
					</View>

					<View style={styles.infoItem}>
						<Ionicons
							name="information-circle-outline"
							size={16}
							color="#6c757d"
						/>
						<Text style={styles.infoText}>
							Liên hệ shipper trước khi giao hàng 30 phút
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	trackingCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	trackingHeader: {
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	trackingTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 4,
	},
	trackingSubtitle: {
		fontSize: 14,
		color: "#6c757d",
	},
	timeline: {
		paddingLeft: 8,
	},
	timelineItem: {
		flexDirection: "row",
		marginBottom: 20,
	},
	timelineLineContainer: {
		alignItems: "center",
		marginRight: 16,
	},
	timelineIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
	},
	latestIcon: {
		transform: [{ scale: 1.1 }],
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	timelineLine: {
		width: 2,
		height: 40,
		marginTop: 4,
	},
	timelineContent: {
		flex: 1,
		paddingTop: 2,
	},
	timelineHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 6,
	},
	timelineTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#212529",
		flex: 1,
		marginRight: 8,
	},
	latestTitle: {
		color: "#28a745",
		fontSize: 16,
	},
	timelineDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	timelineDescription: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		marginBottom: 8,
	},
	timelineLocation: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	locationText: {
		fontSize: 13,
		color: "#6c757d",
		fontStyle: "italic",
	},
	infoCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		marginBottom: 16,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12,
		gap: 8,
	},
	infoText: {
		fontSize: 14,
		color: "#495057",
		lineHeight: 20,
		flex: 1,
	},
	// Loading and error states
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	loadingText: {
		fontSize: 16,
		color: "#6c757d",
		marginTop: 16,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	errorText: {
		fontSize: 18,
		color: "#dc3545",
		marginTop: 16,
		textAlign: "center",
		fontWeight: "600",
	},
	errorSubtext: {
		fontSize: 14,
		color: "#6c757d",
		marginTop: 8,
		textAlign: "center",
	},
	// Tracking states
	trackingLoadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	trackingLoadingText: {
		fontSize: 14,
		color: "#6c757d",
		marginLeft: 12,
	},
	trackingErrorContainer: {
		flexDirection: "column",
		alignItems: "center",
		paddingVertical: 20,
		backgroundColor: "#fff3cd",
		borderRadius: 8,
		marginBottom: 16,
		gap: 12,
	},
	trackingErrorContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	trackingErrorText: {
		fontSize: 14,
		color: "#856404",
		textAlign: "center",
		flex: 1,
	},
	retryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#007bff",
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 6,
		gap: 6,
	},
	retryButtonText: {
		fontSize: 12,
		color: "#007bff",
		fontWeight: "600",
	},
	noTrackingContainer: {
		alignItems: "center",
		paddingVertical: 32,
	},
	noTrackingText: {
		fontSize: 14,
		color: "#6c757d",
		marginTop: 8,
		textAlign: "center",
	},
	// 📦 Tracking Status Styles
	trackingStatusCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginVertical: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		borderLeftWidth: 5,
		borderLeftColor: "#28a745",
	},
	statusHeader: {
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	statusTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	statusIcon: {
		marginRight: 8,
	},
	statusTitle: {
		fontSize: 20,
		fontWeight: "800",
		color: "#28a745",
		letterSpacing: 0.5,
	},
	statusSubtitle: {
		fontSize: 15,
		color: "#495057",
		lineHeight: 22,
		fontWeight: "500",
		marginLeft: 32, // Indent to align with title text
	},
	statusDetails: {
		gap: 12,
	},
	statusRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 4,
	},
	statusLabelRow: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1.2,
		gap: 6,
	},
	statusLabel: {
		fontSize: 13,
		color: "#6c757d",
		fontWeight: "600",
	},
	statusValue: {
		fontSize: 13,
		color: "#212529",
		fontWeight: "700",
		flex: 2,
		textAlign: "right",
	},
});
