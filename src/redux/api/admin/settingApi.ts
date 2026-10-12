/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "../baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: `/auth/profile`,
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["auth"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = settingApi;
