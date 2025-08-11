// Status Handler - Helper functions for managing request statuses
// Giúp quản lý và xử lý các trạng thái request một cách thống nhất

/**
 * Danh sách các status có thể có
 */
export const REQUEST_STATUS = {
	PENDING: "pending",
	PROCESSING: "processing",
	QUOTED: "quoted",
	CONFIRMED: "confirmed",
	PAID: "paid",
	SHIPPING: "shipping",
	DELIVERED: "delivered",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	REJECTED: "rejected",
};

/**
 * Danh sách các request type
 */
export const REQUEST_TYPE = {
	ONLINE: "online",
	OFFLINE: "offline",
	WITH_LINK: "with_link",
	MANUAL: "manual",
};

/**
 * Lấy text hiển thị cho status
 * @param {string} status - Status của request
 * @returns {string} - Text hiển thị
 */
export const getStatusText = (status) => {
	if (!status) return "Không xác định";

	const statusMap = {
		[REQUEST_STATUS.PENDING]: "Chờ xử lý",
		[REQUEST_STATUS.PROCESSING]: "Đang xử lý",
		[REQUEST_STATUS.QUOTED]: "Đã báo giá",
		[REQUEST_STATUS.CONFIRMED]: "Đã xác nhận",
		[REQUEST_STATUS.PAID]: "Đã thanh toán",
		[REQUEST_STATUS.SHIPPING]: "Đang giao hàng",
		[REQUEST_STATUS.DELIVERED]: "Đã giao hàng",
		[REQUEST_STATUS.COMPLETED]: "Hoàn thành",
		[REQUEST_STATUS.CANCELLED]: "Đã hủy",
		[REQUEST_STATUS.REJECTED]: "Bị từ chối",
	};

	return statusMap[status.toLowerCase()] || status;
};

/**
 * Lấy màu sắc cho status
 * @param {string} status - Status của request
 * @returns {string} - Hex color code
 */
export const getStatusColor = (status) => {
	if (!status) return "#999999";

	const colorMap = {
		[REQUEST_STATUS.PENDING]: "#FFA726", // Orange - Chờ xử lý
		[REQUEST_STATUS.PROCESSING]: "#42A5F5", // Blue - Đang xử lý
		[REQUEST_STATUS.QUOTED]: "#AB47BC", // Purple - Đã báo giá
		[REQUEST_STATUS.CONFIRMED]: "#66BB6A", // Green - Đã xác nhận
		[REQUEST_STATUS.PAID]: "#26A69A", // Teal - Đã thanh toán
		[REQUEST_STATUS.SHIPPING]: "#29B6F6", // Light Blue - Đang giao hàng
		[REQUEST_STATUS.DELIVERED]: "#9CCC65", // Light Green - Đã giao hàng
		[REQUEST_STATUS.COMPLETED]: "#4CAF50", // Green - Hoàn thành
		[REQUEST_STATUS.CANCELLED]: "#EF5350", // Red - Đã hủy
		[REQUEST_STATUS.REJECTED]: "#F44336", // Dark Red - Bị từ chối
	};

	return colorMap[status.toLowerCase()] || "#999999";
};

/**
 * Lấy text hiển thị cho request type
 * @param {string} type - Type của request
 * @returns {string} - Text hiển thị
 */
export const getRequestTypeText = (type) => {
	if (!type) return "Không xác định";

	const typeMap = {
		[REQUEST_TYPE.ONLINE]: "Mua hàng Online",
		[REQUEST_TYPE.OFFLINE]: "Mua hàng Offline",
		[REQUEST_TYPE.WITH_LINK]: "Có link sản phẩm",
		[REQUEST_TYPE.MANUAL]: "Nhập thủ công",
	};

	return typeMap[type.toLowerCase()] || type;
};

/**
 * Lấy icon cho request type
 * @param {string} type - Type của request
 * @returns {string} - Icon name (Ionicons)
 */
export const getRequestTypeIcon = (type) => {
	if (!type) return "help-outline";

	const iconMap = {
		[REQUEST_TYPE.ONLINE]: "link-outline",
		[REQUEST_TYPE.OFFLINE]: "create-outline",
		[REQUEST_TYPE.WITH_LINK]: "link-outline",
		[REQUEST_TYPE.MANUAL]: "create-outline",
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

	const colorMap = {
		[REQUEST_TYPE.ONLINE]: "#42A5F5", // Blue - Online
		[REQUEST_TYPE.OFFLINE]: "#28a745", // Green - Offline
		[REQUEST_TYPE.WITH_LINK]: "#42A5F5", // Blue - With Link
		[REQUEST_TYPE.MANUAL]: "#28a745", // Green - Manual
	};

	return colorMap[type.toLowerCase()] || "#999999";
};

/**
 * Kiểm tra xem status có thể chỉnh sửa được không
 * @param {string} status - Status của request
 * @returns {boolean} - Có thể edit hay không
 */
export const canEditRequest = (status) => {
	if (!status) return false;

	const editableStatuses = [
		REQUEST_STATUS.PENDING,
		REQUEST_STATUS.PROCESSING,
	];

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
		REQUEST_STATUS.PENDING,
		REQUEST_STATUS.PROCESSING,
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
		REQUEST_STATUS.PAID,
		REQUEST_STATUS.SHIPPING,
		REQUEST_STATUS.DELIVERED,
		REQUEST_STATUS.COMPLETED,
	];

	return quotationStatuses.includes(status.toLowerCase());
};

/**
 * Lấy next status có thể có
 * @param {string} currentStatus - Status hiện tại
 * @returns {string[]} - Array các status tiếp theo có thể
 */
export const getNextPossibleStatuses = (currentStatus) => {
	if (!currentStatus) return [];

	const statusFlow = {
		[REQUEST_STATUS.PENDING]: [
			REQUEST_STATUS.PROCESSING,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.PROCESSING]: [
			REQUEST_STATUS.QUOTED,
			REQUEST_STATUS.REJECTED,
		],
		[REQUEST_STATUS.QUOTED]: [
			REQUEST_STATUS.CONFIRMED,
			REQUEST_STATUS.CANCELLED,
		],
		[REQUEST_STATUS.CONFIRMED]: [REQUEST_STATUS.PAID],
		[REQUEST_STATUS.PAID]: [REQUEST_STATUS.SHIPPING],
		[REQUEST_STATUS.SHIPPING]: [REQUEST_STATUS.DELIVERED],
		[REQUEST_STATUS.DELIVERED]: [REQUEST_STATUS.COMPLETED],
		[REQUEST_STATUS.COMPLETED]: [],
		[REQUEST_STATUS.CANCELLED]: [],
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
