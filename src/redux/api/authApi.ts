import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/admin-login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    myProfile: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
      providesTags: ["auth"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-pass",
        method: "PATCH",
        body: data,
      }),
    }),

    updateProfile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["auth"],
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-forget-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useMyProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
