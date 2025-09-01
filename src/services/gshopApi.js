import { createApi } from "@reduxjs/toolkit/query/react";
import endpoints from "../const/endpoints";
import { axiosBaseQuery } from "./baseRequest";

//Lưu ý khi cho dev, cần phải sửa lại baseURL trong file baseRequest.js
const gshopApi = createApi({
	reducerPath: "gshopApi",
	tagTypes: [
		"CustomerProfile",
		"ShippingAddress",
		"PurchaseRequest",
		"Wallet",
		"Banks",
		"BankAccounts",
		"Order",
		"Feedback",
		"RefundTicket",
		"Variants",
	],
	baseQuery: axiosBaseQuery(), // Adjust base URL as needed
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.LOGIN,
				method: "POST",
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.REGISTER,
				method: "POST",
			}),
		}),
		changeEmail: builder.mutation({
			query: (newEmail) => ({
				params: newEmail,
				url: endpoints.CHANGE_EMAIL,
				method: "POST",
			}),
		}),
		verifyChangeEmail: builder.mutation({
			query: (data) => ({
				params: data,
				url: endpoints.VERIFY_CHANGE_EMAIL,
				method: "POST",
			}),
		}),
		verifyOTP: builder.mutation({
			query: (data) => ({
				params: data,
				url: endpoints.VERIFY_OTP,
				method: "POST",
			}),
		}),
		resendOTP: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.RESEND_OTP,
			}),
		}),
		verifyOTPForgotPassword: builder.mutation({
			query: (data) => ({
				params: data,
				url: endpoints.VERIFY_OTP_FORGOT_PASSWORD,
				method: "POST",
			}),
		}),
		forgotPassword: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.FORGOT_PASSWORD,
			}),
		}),
		getCustomerInfo: builder.query({
			query: () => ({
				url: `${endpoints.CUSTOMER_PROFILE}/current-information`,
				method: "GET",
			}),
			providesTags: ["CustomerProfile"],
		}),
		updateCustomerProfile: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CUSTOMER_PROFILE,
				method: "PUT",
			}),
			invalidatesTags: ["CustomerProfile"],
		}),
		uploadAvatar: builder.mutation({
			query: (formData) => ({
				data: formData,
				url: endpoints.UPLOAD_AVATAR,
				method: "POST",
				// Don't set Content-Type, let axios handle it for FormData
			}),
			invalidatesTags: ["CustomerProfile"],
		}),
		resetPassword: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.RESET_PASSWORD,
				method: "PUT",
			}),
		}),
		getShippingAddress: builder.query({
			query: () => ({
				url: endpoints.SHIPPING_ADDRESS,
				method: "GET",
			}),
			transformResponse: (response) => {
				if (Array.isArray(response)) {
					response = [...response].sort(
						(a, b) => (b.default === true) - (a.default === true)
					);
				}
				return response;
			},
			providesTags: ["ShippingAddress"],
		}),
		createShippingAddress: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.SHIPPING_ADDRESS,
				method: "POST",
			}),
			invalidatesTags: ["ShippingAddress"],
		}),
		updateShippingAddress: builder.mutation({
			query: ({ id, ...data }) => ({
				data: data,
				url: `${endpoints.SHIPPING_ADDRESS}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["ShippingAddress"],
		}),
		deleteShippingAddress: builder.mutation({
			query: (id) => ({
				url: `${endpoints.SHIPPING_ADDRESS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["ShippingAddress"],
		}),
		defaultShippingAddress: builder.mutation({
			query: (id) => ({
				url: `${endpoints.DEFAULT_SHIPPING_ADDRESS}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["ShippingAddress"],
		}),
		getShipmentRate: builder.query({
			query: (data) => ({
				data: data,
				url: endpoints.SHIPMENT_RATE,
				method: "POST",
			}),
		}),
		getShippingRates: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.SHIPMENT_RATE, // Try the single rate endpoint first
				method: "POST",
			}),
		}),
		createShipment: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CREATE_SHIPMENT,
				method: "POST",
			}),
		}),
		getShippingTracking: builder.query({
			query: (data) => ({
				params: data,
				url: `${endpoints.SHIPMENT_TRACKING}`,
				method: "GET",
			}),
		}),
		changePassword: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CHANGE_PASSWORD,
				method: "PUT",
			}),
		}),
		getPurchaseRequest: builder.query({
			query: (params = {}) => {
				return {
					params: params,
					url: endpoints.PURCHASE_REQUEST,
					method: "GET",
				};
			},
			providesTags: ["PurchaseRequest"],
			transformResponse: (response, meta, arg) => {
				// Handle different response structures
				if (response) {
					// If response has data property
					if (response.data) {
						return response.data;
					}
					// If response is direct content
					return response;
				}

				return { content: [], totalElements: 0, totalPages: 0 };
			},
		}),
		getPurchaseRequestById: builder.query({
			query: (id) => {
				return {
					url: `${endpoints.PURCHASE_REQUEST}/${id}`,
					method: "GET",
				};
			},
			providesTags: (result, error, id) => [
				{ type: "PurchaseRequest", id },
			],
			transformResponse: (response, meta, arg) => {
				// Handle different response structures
				if (response) {
					// If response has data property
					if (response.data) {
						return response.data;
					}
					// If response is direct content
					return response;
				}

				return null;
			},
		}),
		createWithLinkPurchaseRequest: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.WITH_LINK_PURCHASE_REQUEST,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequest"],
		}),
		createWithoutLinkPurchaseRequest: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.WITHOUT_LINK_PURCHASE_REQUEST,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequest"],
		}),
		createOnlinePurchaseRequest: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.ONLINE_PURCHASE_REQUEST,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequest"],
		}),
		// AI Raw Data mutation
		getRawDataFromUrl: builder.mutation({
			query: (url) => ({
				params: { link: url },
				url: endpoints.AI_RAW_DATA,
				method: "GET",
			}),
		}),
		// Currency conversion mutation
		convertToVnd: builder.mutation({
			query: ({ amount, fromCurrency }) => ({
				data: {
					amount: parseFloat(amount),
					fromCurrency: fromCurrency.toUpperCase(),
				},
				url: endpoints.CURRENCY_CONVERT_TO_VND,
				method: "POST",
			}),
		}),
		getPurchaseRequestDetail: builder.query({
			query: (id) => ({
				url: `${endpoints.PURCHASE_REQUEST}/${id}`,
				method: "GET",
			}),
			providesTags: ["PurchaseRequest"],
		}),
		getWallet: builder.query({
			query: () => ({
				url: endpoints.WALLET,
				method: "GET",
			}),
			providesTags: ["Wallet"],
		}),
		depositWallet: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.WALLET,
				method: "POST",
			}),
			invalidatesTags: ["Wallet"],
		}),
		withdrawWallet: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.WITHDRAW_WALLET,
				method: "POST",
			}),
			invalidatesTags: ["Wallet"],
		}),
		checkPayment: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.CHECKPAYMENT,
				method: "GET",
			}),
			invalidatesTags: ["Wallet"],
		}),

		// Bank Accounts APIs
		getBankAccounts: builder.query({
			query: () => ({
				url: endpoints.BANK_ACCOUNTS,
				method: "GET",
			}),
			providesTags: ["BankAccounts"],
			transformResponse: (response, meta, arg) => {
				console.log("getBankAccounts API Response:", response);

				// Handle different response structures
				if (response) {
					// If response has data property
					if (response.data) {
						return Array.isArray(response.data)
							? response.data
							: [];
					}
					// If response has content property (pagination)
					if (response.content) {
						return Array.isArray(response.content)
							? response.content
							: [];
					}
					// If response is direct array
					if (Array.isArray(response)) {
						return response;
					}
				}

				return [];
			},
		}),
		getBanks: builder.query({
			query: () => ({
				url: endpoints.BANKS,
				method: "GET",
			}),
			providesTags: ["Banks"],
		}),
		createBankAccount: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.BANK_ACCOUNTS,
				method: "POST",
			}),
			invalidatesTags: ["BankAccounts"],
		}),
		updateBankAccount: builder.mutation({
			query: ({ id, ...data }) => ({
				data: data,
				url: `${endpoints.BANK_ACCOUNTS}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["BankAccounts"],
		}),
		deleteBankAccount: builder.mutation({
			query: (id) => ({
				url: `${endpoints.BANK_ACCOUNTS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["BankAccounts"],
		}),

		currentUserTransactions: builder.query({
			query: () => ({
				url: endpoints.TRANSACTION_HISTORY,
				method: "GET",
				params: {
					direction: "DESC",
					page: 0,
					size: 50,
				},
			}),
			providesTags: ["Wallet"],
		}),

		// Order endpoints
		getAllOrders: builder.query({
			query: (params = {}) => ({
				url: endpoints.ORDERS,
				method: "GET",
				params: {
					page: params.page || 0,
					size: params.size || 20,
					sortBy: params.sortBy || "createdAt",
					sortDirection: params.sortDirection || "DESC",
					status: params.status || undefined, // Filter by status if provided
				},
			}),
			providesTags: ["Order"],
		}),

		getOrderById: builder.query({
			query: (orderId) => ({
				url: `${endpoints.ORDER_DETAIL}/${orderId}`,
				method: "GET",
			}),
			providesTags: (result, error, orderId) => [
				{ type: "Order", id: orderId },
			],
		}),

		cancelOrder: builder.mutation({
			query: ({ orderId, reason }) => {
				if (!orderId) {
					throw new Error("Order ID is required");
				}
				console.log("Cancel order API call for orderId:", orderId);
				console.log("Cancel reason:", reason);
				const url = `${endpoints.CANCEL_ORDER}/${orderId}/cancel`;
				console.log("Cancel order URL:", url);
				const requestBody = reason ? { reason } : {};
				console.log("Cancel order body:", requestBody);
				return {
					url: url,
					method: "PUT",
					data: requestBody,
				};
			},
			invalidatesTags: ["Order"],
		}),

		// Checkout endpoints
		checkout: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CHECKOUT,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequest", "Wallet", "Order"],
		}),

		directCheckout: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.DIRECT_CHECKOUT,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequest", "Wallet", "Order"],
		}),

		// Feedback endpoints
		createFeedback: builder.mutation({
			query: (feedbackData) => {
				console.log("Creating feedback with data:", feedbackData);
				return {
					url: endpoints.FEEDBACK,
					method: "POST",
					data: feedbackData,
				};
			},
			invalidatesTags: ["Feedback", "Order"],
		}),

		// Refund APIs
		getRefundReasons: builder.query({
			query: () => ({
				url: endpoints.REFUND_REASONS,
				method: "GET",
			}),
		}),

		createRefundTicket: builder.mutation({
			query: (refundData) => {
				console.log("Creating refund ticket with data:", refundData);
				return {
					url: endpoints.REFUND_TICKET,
					method: "POST",
					data: refundData,
				};
			},
			invalidatesTags: ["RefundTicket", "Order"],
		}),

		getRefundTicketsByOrderId: builder.query({
			query: (orderId) => ({
				url: `${endpoints.REFUND_BY_ORDER}/${orderId}`,
				method: "GET",
			}),
			providesTags: (result, error, orderId) => [
				{ type: "RefundTicket", id: orderId },
			],
		}),

		getAllRefundTickets: builder.query({
			query: ({ page = 0, size = 1000 } = {}) => {
				const params = new URLSearchParams({
					page: page.toString(),
					size: size.toString(),
				});
				return {
					url: `${endpoints.REFUND_TICKET}?${params.toString()}`,
					method: "GET",
				};
			},
			providesTags: ["RefundTicket"],
		}),

		getAllFeedback: builder.query({
			query: ({ page = 0, size = 10 } = {}) => {
				const params = new URLSearchParams({
					page: page.toString(),
					size: size.toString(),
				});
				console.log(
					"Getting all feedback with params:",
					params.toString()
				);
				return {
					url: `${endpoints.FEEDBACK_ALL}?${params}`,
					method: "GET",
				};
			},
			providesTags: ["Feedback"],
		}),
		saveFCMToken: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.FCM_SAVE_TOKEN,
				method: "POST",
			}),
		}),
		deleteFCMToken: builder.mutation({
			query: (token) => ({
				data: {
					token: token,
					deviceType: "ANDROID", // Default to ANDROID as requested
				},
				url: endpoints.FCM_DELETE_TOKEN,
				method: "POST",
			}),
		}),

		// Variants API
		getAllVariants: builder.query({
			query: () => ({
				url: endpoints.VARIANTS,
				method: "GET",
			}),
			providesTags: ["Variants"],
		}),
	}),
});

export const {
	useLoginMutation,
	useVerifyOTPMutation,
	useLazyResendOTPQuery,
	useLazyForgotPasswordQuery,
	useResetPasswordMutation,
	useRegisterMutation,
	useChangeEmailMutation,
	useVerifyChangeEmailMutation,
	useVerifyOTPForgotPasswordMutation,
	useCreateShippingAddressMutation,
	useUpdateShippingAddressMutation,
	useGetShippingAddressQuery,
	useDeleteShippingAddressMutation,
	useChangePasswordMutation,
	useGetCustomerInfoQuery,
	useUpdateCustomerProfileMutation,
	useDefaultShippingAddressMutation,
	useGetShipmentRateQuery,
	useGetShippingRatesMutation,
	useCreateShipmentMutation,
	useUploadAvatarMutation,
	useGetPurchaseRequestQuery,
	useGetPurchaseRequestByIdQuery,
	useCreateWithLinkPurchaseRequestMutation,
	useCreateWithoutLinkPurchaseRequestMutation,
	useCreateOnlinePurchaseRequestMutation,
	useGetRawDataFromUrlMutation,
	useConvertToVndMutation,
	useGetWalletQuery,
	useDepositWalletMutation,
	useWithdrawWalletMutation,
	useLazyCheckPaymentQuery,
	useGetPurchaseRequestDetailQuery,
	useLazyGetShippingTrackingQuery,
	useTransactionHistoryQuery,
	useCurrentUserTransactionsQuery,
	useGetBankAccountsQuery,
	useGetBanksQuery,
	useCreateBankAccountMutation,
	useUpdateBankAccountMutation,
	useDeleteBankAccountMutation,
	useGetAllOrdersQuery,
	useGetOrderByIdQuery,
	useLazyGetOrderByIdQuery,
	useCancelOrderMutation,
	useCheckoutMutation,
	useDirectCheckoutMutation,
	useCreateFeedbackMutation,
	useGetAllFeedbackQuery,
	useGetRefundReasonsQuery,
	useCreateRefundTicketMutation,
	useGetRefundTicketsByOrderIdQuery,
	useGetAllRefundTicketsQuery,
	useSaveFCMTokenMutation,
	useDeleteFCMTokenMutation,
	useGetAllVariantsQuery,
} = gshopApi;

export default gshopApi;
