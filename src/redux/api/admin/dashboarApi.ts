/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminDashboardOverview: builder.query({
      query: (filterType) => {
        const params: Record<string, any> = {};

        if (filterType) params.filter = filterType;

        return {
          url: `/admin/overview-data`,
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    myProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/set-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),

    getAllUserList: builder.query({
      query: ({ page, limit, search }) => {
        const params: Record<string, any> = {};

        if (search) params.search = search;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return {
          url: `/admin/users`,
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["dashboard"],
    }),
  }),
});

export const {
  useAdminDashboardOverviewQuery,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useGetAllUserListQuery,
  useDeleteUserMutation,
} = dashboardApi;
