const endpoints = {
	LOGIN: "/auth/login",
	REGISTER: "/auth/register",
	VERIFY_OTP: "/auth/verify-otp",
	VERIFY_CHANGE_EMAIL: "/auth/verify-otp-and-change-email",
	RESEND_OTP: "/auth/resend-otp",
	CHANGE_EMAIL: "/auth/change-email",
	RESET_PASSWORD: "/auth/forgot-password/reset",
	FORGOT_PASSWORD: "/auth/forgot-password",
	VERIFY_OTP_FORGOT_PASSWORD: "/auth/forgot-password/verify",
	SHIPPING_ADDRESS: "/shipping-address",
	DEFAULT_SHIPPING_ADDRESS: "/shipping-address/default",
	CHANGE_PASSWORD: "/auth/change-password",
	CUSTOMER_PROFILE: "/customer",
	UPLOAD_AVATAR: "/customer/avatar",
	PURCHASE_REQUEST: "/purchase-request",
	WITHOUT_LINK_PURCHASE_REQUEST: "/purchase-request/offline-request",
	ONLINE_PURCHASE_REQUEST: "/purchase-request/online-request",
	WALLET: "/wallet",
	WITHDRAW_WALLET: "/wallet/withdraw-request",
	CHECKPAYMENT: "/wallet/check-payment-vnpay",
	TRANSACTION_HISTORY: "/transactions/current-user",
	BANK_ACCOUNTS: "/bank-account",
	BANK_ACCOUNTS_CURRENT: "/bank-account/current",
	BANKS: "/banks",
	AI_RAW_DATA: "/ai/get-raw-data",
	CURRENCY_CONVERT_TO_VND: "/currency/convert-to-vnd",
	// Order endpoints
	ORDERS: "/orders",
	ORDER_DETAIL: "/orders", // for specific order by ID
	CANCEL_ORDER: "/orders", // for cancel order by ID
	DIRECT_CHECKOUT: "/orders/direct-checkout",
	CHECKOUT: "/orders/checkout",
	// Feedback endpoints
	FEEDBACK: "/feedback",
	FEEDBACK_ALL: "/feedback",
};
export default endpoints;
