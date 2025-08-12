/**
 * Danh sách các status có thể có (theo API thực tế)
 */
export const REQUEST_STATUS = {
	SENT: "sent",
	CHECKING: "checking",
	QUOTED: "quoted",
	CONFIRMED: "confirmed",
	CANCELLED: "cancelled",
	INSUFFICIENT: "insufficient",
	COMPLETED: "completed",
	// Legacy statuses (for backward compatibility)
	PENDING: "pending",
	PROCESSING: "processing",
	PAID: "paid",
	SHIPPING: "shipping",
	DELIVERED: "delivered",
	REJECTED: "rejected",
};

/**
 * Danh sách các Order Status (theo API Order)
 */
export const ORDER_STATUS = {
	ORDER_REQUESTED: "ORDER_REQUESTED",
	PURCHASED: "PURCHASED",
	IN_TRANSIT: "IN_TRANSIT",
	ARRIVED_IN_DESTINATION: "ARRIVED_IN_DESTINATION",
	DELIVERED: "DELIVERED",
	CANCELED: "CANCELED",
};

/**
 * Danh sách các request type
 */
export const REQUEST_TYPE = {
	ONLINE: "online", // API value - có link sản phẩm
	OFFLINE: "offline", // API value - nhập thủ công
	// Legacy UI values (for backward compatibility)
	WITH_LINK: "online", // Alias for ONLINE
	WITHOUT_LINK: "offline", // Alias for OFFLINE
};

/**
 * Lấy text hiển thị cho status
 * @param {string} status - Status của request
 * @returns {string} - Text hiển thị
 */
export const getStatusText = (status) => {
	if (!status) return "Không xác định";

	const statusMap = {
		// Order API statuses
		[ORDER_STATUS.ORDER_REQUESTED]: "Đang đặt hàng",
		[ORDER_STATUS.PURCHASED]: "Đã mua",
		[ORDER_STATUS.IN_TRANSIT]: "Đang vận chuyển",
		[ORDER_STATUS.ARRIVED_IN_DESTINATION]: "Đã đến nơi",
		[ORDER_STATUS.DELIVERED]: "Đã giao hàng",
		[ORDER_STATUS.CANCELED]: "Đã hủy",
		// Actual API statuses
		[REQUEST_STATUS.SENT]: "Đã gửi",
		[REQUEST_STATUS.CHECKING]: "Đang xử lý",
		[REQUEST_STATUS.QUOTED]: "Đã báo giá",
		[REQUEST_STATUS.CONFIRMED]: "Đã xác nhận",
		[REQUEST_STATUS.CANCELLED]: "Đã hủy",
		[REQUEST_STATUS.INSUFFICIENT]: "Cập nhật",
		[REQUEST_STATUS.COMPLETED]: "Hoàn thành",
		// Legacy statuses (for backward compatibility)
		[REQUEST_STATUS.PENDING]: "Chờ xử lý",
		[REQUEST_STATUS.PROCESSING]: "Đang xử lý",
		[REQUEST_STATUS.PAID]: "Đã thanh toán",
		[REQUEST_STATUS.SHIPPING]: "Đang giao hàng",
		[REQUEST_STATUS.DELIVERED]: "Đã giao hàng",
		[REQUEST_STATUS.REJECTED]: "Bị từ chối",
	};

	return statusMap[status] || statusMap[status?.toLowerCase()] || status;
};

/**
 * Lấy màu sắc cho status
 * @param {string} status - Status của request
 * @returns {string} - Hex color code
 */
export const getStatusColor = (status) => {
	if (!status) return "#999999";

	const colorMap = {
		// Order API statuses
		[ORDER_STATUS.ORDER_REQUESTED]: "#007bff", // Blue - Đang đặt hàng
		[ORDER_STATUS.PURCHASED]: "#28a745", // Green - Đã mua
		[ORDER_STATUS.IN_TRANSIT]: "#6610f2", // Purple - Đang vận chuyển
		[ORDER_STATUS.ARRIVED_IN_DESTINATION]: "#fd7e14", // Orange - Đã đến nơi
		[ORDER_STATUS.DELIVERED]: "#28a745", // Green - Đã giao hàng
		[ORDER_STATUS.CANCELED]: "#dc3545", // Red - Đã hủy
		// Actual API statuses
		[REQUEST_STATUS.SENT]: "#FFA726", // Orange - Đã gửi
		[REQUEST_STATUS.CHECKING]: "#42A5F5", // Blue - Đang xử lý
		[REQUEST_STATUS.QUOTED]: "#AB47BC", // Purple - Đã báo giá
		[REQUEST_STATUS.CONFIRMED]: "#66BB6A", // Green - Đã xác nhận
		[REQUEST_STATUS.CANCELLED]: "#EF5350", // Red - Đã hủy
		[REQUEST_STATUS.INSUFFICIENT]: "#FF9800", // Orange - Cập nhật
		[REQUEST_STATUS.COMPLETED]: "#4CAF50", // Green - Hoàn thành
		// Legacy statuses (for backward compatibility)
		[REQUEST_STATUS.PENDING]: "#FFA726", // Orange - Chờ xử lý
		[REQUEST_STATUS.PROCESSING]: "#42A5F5", // Blue - Đang xử lý
		[REQUEST_STATUS.PAID]: "#26A69A", // Teal - Đã thanh toán
		[REQUEST_STATUS.SHIPPING]: "#29B6F6", // Light Blue - Đang giao hàng
		[REQUEST_STATUS.DELIVERED]: "#9CCC65", // Light Green - Đã giao hàng
		[REQUEST_STATUS.REJECTED]: "#F44336", // Dark Red - Bị từ chối
	};

	return colorMap[status] || colorMap[status?.toLowerCase()] || "#999999";
};

/**
 * Lấy text hiển thị cho request type
 * @param {string} type - Type của request
 * @param {string} mode - Mode hiển thị: 'default' | 'history' | 'detail'
 * @returns {string} - Text hiển thị
 */
export const getRequestTypeText = (type, mode = "default") => {
	if (!type) return "Không xác định";

	const typeMap = {
		default: {
			[REQUEST_TYPE.ONLINE]: "Hàng từ nền tảng e-commerce",
			[REQUEST_TYPE.OFFLINE]: "Hàng nội địa/quốc tế",
		},
		history: {
			[REQUEST_TYPE.ONLINE]: "Hàng từ nền tảng e-commerce",
			[REQUEST_TYPE.OFFLINE]: "Hàng nội địa/quốc tế",
			// Legacy UI compatibility
		},
		detail: {
			[REQUEST_TYPE.ONLINE]: "Hàng từ nền tảng e-commerce",
			[REQUEST_TYPE.OFFLINE]: "Hàng nội địa/quốc tế",
		},
	};

	const selectedMap = typeMap[mode] || typeMap.default;
	return selectedMap[type.toLowerCase()] || type;
};

/**
 * Lấy icon cho request type
 * @param {string} type - Type của request
 * @returns {string} - Icon name (Ionicons)
 */
export const getRequestTypeIcon = (type) => {
	if (!type) return "help-outline";

	const iconMap = {
		[REQUEST_TYPE.ONLINE]: "link-outline", // withLink -> link icon
		[REQUEST_TYPE.OFFLINE]: "create-outline", // withoutLink -> create icon
		// Legacy UI compatibility
		with_link: "link-outline",
		without_link: "create-outline",
	};

	return iconMap[type.toLowerCase()] || "help-outline";
};

/**
 * Lấy màu border cho request type
 * @param {string} type - Type của request
 * @returns {string} - Hex color code
 */
export const getRequestTypeBorderColor = (type) => {
	if (!type) return "#999999";

	// Map for legacy compatibility
	const typeMap = {
		with_link: REQUEST_TYPE.ONLINE,
		without_link: REQUEST_TYPE.OFFLINE,
	};

	// Normalize type
	const normalizedType = typeMap[type] || type;

	const colorMap = {
		[REQUEST_TYPE.ONLINE]: "#42A5F5", // Blue - Online (API) / withLink (UI)
		[REQUEST_TYPE.OFFLINE]: "#28a745", // Green - Offline (API) / withoutLink (UI)
	};

	return colorMap[normalizedType] || "#999999";
};

/**
 * Kiểm tra xem status có thể chỉnh sửa được không
 * @param {string} status - Status của request
 * @returns {boolean} - Có thể edit hay không
 */
export const canEditRequest = (status) => {
	if (!status) return false;

	const editableStatuses = [REQUEST_STATUS.SENT, REQUEST_STATUS.CHECKING];

	return editableStatuses.includes(status.toLowerCase());
};

/**
 * Kiểm tra xem status có thể hủy được không
 * @param {string} status - Status của request
 * @returns {boolean} - Có thể cancel hay không
 */
export const canCancelRequest = (status) => {
	if (!status) return false;

	const cancellableStatuses = [
		REQUEST_STATUS.SENT,
		REQUEST_STATUS.CHECKING,
		REQUEST_STATUS.QUOTED,
	];

	return cancellableStatuses.includes(status.toLowerCase());
};

/**
 * Kiểm tra xem status có thể thanh toán được không
 * @param {string} status - Status của request
 * @returns {boolean} - Có thể payment hay không
 */
export const canPayRequest = (status) => {
	if (!status) return false;

	return status.toLowerCase() === REQUEST_STATUS.QUOTED;
};

/**
 * Kiểm tra xem có hiển thị quotation không
 * @param {string} status - Status của request
 * @returns {boolean} - Có hiển thị quotation hay không
 */
export const shouldShowQuotation = (status) => {
	if (!status) return false;

	const quotationStatuses = [
		REQUEST_STATUS.QUOTED,
		REQUEST_STATUS.CONFIRMED,
		REQUEST_STATUS.COMPLETED,
		// Legacy statuses
		REQUEST_STATUS.PAID,
		REQUEST_STATUS.SHIPPING,
		REQUEST_STATUS.DELIVERED,
	];

	return quotationStatuses.includes(status.toLowerCase());
};

/**
 * Lấy next status có thể có (theo flow thực tế của API)
 * @param {string} currentStatus - Status hiện tại
 * @returns {string[]} - Array các status tiếp theo có thể
 */
export const getNextPossibleStatuses = (currentStatus) => {
	if (!currentStatus) return [];

	const statusFlow = {
		// Actual API status flow
		[REQUEST_STATUS.SENT]: [
			REQUEST_STATUS.CHECKING,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.CHECKING]: [
			REQUEST_STATUS.QUOTED,
			REQUEST_STATUS.INSUFFICIENT,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.QUOTED]: [
			REQUEST_STATUS.CONFIRMED,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.CONFIRMED]: [REQUEST_STATUS.COMPLETED],
		[REQUEST_STATUS.INSUFFICIENT]: [
			REQUEST_STATUS.CHECKING,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.COMPLETED]: [],
		[REQUEST_STATUS.CANCELLED]: [],
		// Legacy flows (for backward compatibility)
		[REQUEST_STATUS.PENDING]: [
			REQUEST_STATUS.PROCESSING,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.PROCESSING]: [
			REQUEST_STATUS.QUOTED,
			REQUEST_STATUS.REJECTED,
		],
		[REQUEST_STATUS.PAID]: [REQUEST_STATUS.SHIPPING],
		[REQUEST_STATUS.SHIPPING]: [REQUEST_STATUS.DELIVERED],
		[REQUEST_STATUS.DELIVERED]: [REQUEST_STATUS.COMPLETED],
		[REQUEST_STATUS.REJECTED]: [],
	};

	return statusFlow[currentStatus.toLowerCase()] || [];
};

/**
 * Format date theo định dạng Việt Nam
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
	if (!dateString) return "";

	try {
		const date = new Date(dateString);
		return date.toLocaleString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch (error) {
		console.error("Date format error:", error);
		return dateString;
	}
};

/**
 * Tạo short ID từ full ID
 * @param {string} fullId - Full ID
 * @returns {string} - Short ID with #
 */
export const getShortId = (fullId) => {
	if (!fullId) return "";

	if (typeof fullId === "string" && fullId.includes("-")) {
		return "#" + fullId.split("-")[0];
	}

	return "#" + fullId;
};

/**
 * Validate status value
 * @param {string} status - Status to validate
 * @returns {boolean} - Is valid status
 */
export const isValidStatus = (status) => {
	if (!status) return false;
	return Object.values(REQUEST_STATUS).includes(status.toLowerCase());
};

/**
 * Validate request type value
 * @param {string} type - Type to validate
 * @returns {boolean} - Is valid type
 */
export const isValidRequestType = (type) => {
	if (!type) return false;
	return Object.values(REQUEST_TYPE).includes(type.toLowerCase());
};
