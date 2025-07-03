import { createApi } from '@reduxjs/toolkit/query/react';
import endpoints from '../const/endpoints';
import { axiosBaseQuery } from './baseRequest';

//Lưu ý khi cho dev, cần phải sửa lại baseURL trong file baseRequest.js
const gshopApi = createApi({
  reducerPath: 'gshopApi',
  baseQuery: axiosBaseQuery(), // Adjust base URL as needed
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.LOGIN,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.REGISTER,
        method: 'POST',
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_OTP,
        method: 'POST',
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
        method: 'POST',
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
        method: 'GET',
      }),
      invalidatesTags: ['CustomerProfile'],
    }),
    updateCustomerProfile: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.CUSTOMER_PROFILE,
        method: 'PUT',
      }),
      providesTags: ['CustomerProfile'],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.RESET_PASSWORD,
        method: 'PUT',
      }),
    }),
    getShippingAddress: builder.query({
      query: () => ({
        url: endpoints.SHIPPING_ADDRESS,
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          response = [...response].sort((a, b) => (b.default === true) - (a.default === true));
        }
        return response;
      },
      providesTags: ['ShippingAddress'],
    }),
    createShippingAddress: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.SHIPPING_ADDRESS,
        method: 'POST',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        data: data,
        params: id,
        url: endpoints.SHIPPING_ADDRESS,
        method: 'PUT',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${endpoints.SHIPPING_ADDRESS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    defaultShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${endpoints.DEFAULT_SHIPPING_ADDRESS}/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.CHANGE_PASSWORD,
        method: 'PUT',
      }),
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
  useVerifyOTPForgotPasswordMutation,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useGetShippingAddressQuery,
  useDeleteShippingAddressMutation,
  useChangePasswordMutation,
  useGetCustomerInfoQuery,
  useUpdateCustomerProfileMutation,
  useDefaultShippingAddressMutation,
} = gshopApi;

export default gshopApi;
