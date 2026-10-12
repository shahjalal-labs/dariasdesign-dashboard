/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../baseApi";

const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getALlDiscountList: builder.query({
      query: ({ page, limit, search }) => {
        const params: Record<string, any> = {};

        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;

        return {
          url: `/admin/discounts`,
          method: "GET",
          params,
        };
      },
      providesTags: ["discount"],
    }),

    createDiscount: builder.mutation({
      query: (discountData) => ({
        url: `/admin/create-discount`,
        method: "POST",
        body: discountData,
      }),
      invalidatesTags: ["discount"],
    }),

    discountDetails: builder.query({
      query: (id) => ({
        url: `/admin/discounts/${id}`,
        method: "GET",
      }),
      providesTags: ["discount"],
    }),

    updateDiscount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/discounts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["discount"],
    }),

    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/admin/discounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),
  }),
});

export const {
  useGetALlDiscountListQuery,
  useCreateDiscountMutation,
  useDiscountDetailsQuery,
  useLazyDiscountDetailsQuery,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;
