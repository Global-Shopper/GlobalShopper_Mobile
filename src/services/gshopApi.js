import { createApi } from "@reduxjs/toolkit/query/react";
import endpoints from "../const/endpoints";
import { axiosBaseQuery } from "./baseRequest";

//Lưu ý khi cho dev, cần phải sửa lại baseURL trong file baseRequest.js
const gshopApi = createApi({
	reducerPath: "gshopApi",
	tagTypes: ["CustomerProfile", "ShippingAddress", "PurchaseRequest", "Wallet"],
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
		checkPayment: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.CHECKPAYMENT,
				method: "GET",
			}),
			invalidatesTags: ["Wallet"],
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
	useUploadAvatarMutation,
	useGetPurchaseRequestQuery,
	useGetPurchaseRequestByIdQuery,
	useCreateWithLinkPurchaseRequestMutation,
	useCreateWithoutLinkPurchaseRequestMutation,
	useGetWalletQuery,
	useDepositWalletMutation,
	useLazyCheckPaymentQuery,
} = gshopApi;

export default gshopApi;
