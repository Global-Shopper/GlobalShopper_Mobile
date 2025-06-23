import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseRequest';
import endpoints from '../const/endpoints';

//Lưu ý khi cho dev, cần phải sửa lại baseURL trong file baseRequest.js
const gshopApi = createApi({
  reducerPath: 'gshopApi',
  baseQuery: axiosBaseQuery(), // Adjust base URL as needed
  endpoints: (builder) => ({
    // getAllPreorders: builder.query({
    //   query: () => ({
    //     url: endpoints.PREORDERS,
    //     method: 'GET',
    //   }),
    // }),
    // getPreorderById: builder.query({
    //   query: (id) => ({
    //     url: `${endpoints.PREORDERS}/${id}`,
    //     method: 'GET',
    //   }),
    // }),
  }),
});

export const {
  // useGetAllPreordersQuery,
  // useGetPreorderByIdQuery,
} = gshopApi;

export default gshopApi;
