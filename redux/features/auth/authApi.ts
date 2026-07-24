import { baseApi } from "../../api/baseApi";
import { TUser, Role } from "./authSlice";

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

type LoginRegisterResponse = ApiResponse<{
    user: TUser;
    accessToken: string;
}>;

type RefreshTokenResponse = ApiResponse<{
    accessToken: string;
    user: TUser;
}>;

type VerifyOtpResponse = ApiResponse<{
    token: string;
}>;

const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // === Public Routes ===
        register: builder.mutation<LoginRegisterResponse, Partial<TUser> & { password?: string }>({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
            invalidatesTags: ["User"],
        }),

        login: builder.mutation<LoginRegisterResponse, any>({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
            invalidatesTags: ["User"],
        }),

        verifyEmail: builder.query<ApiResponse<null>, { email: string; token?: string; otp?: string }>({
            query: ({ email, token, otp }) => ({
                url: "/auth/verify-email",
                method: "GET",
                params: { email, token, otp },
            }),
        }),

        resendVerificationEmail: builder.mutation<ApiResponse<null>, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body,
            }),
        }),

        refreshToken: builder.mutation<RefreshTokenResponse, { refreshToken?: string } | void>({
            query: (body) => ({
                url: "/auth/refresh-token",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),

        forgotPassword: builder.mutation<ApiResponse<null>, { email: string }>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),

        verifyOtp: builder.mutation<VerifyOtpResponse, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
        }),

        resendOtp: builder.mutation<ApiResponse<null>, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation<ApiResponse<null>, { token: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),

        // === Protected Routes ===
        getMe: builder.query<ApiResponse<TUser>, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        logout: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        updateProfile: builder.mutation<ApiResponse<TUser>, Partial<TUser>>({
            query: (body) => ({
                url: "/auth/profile",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        changePassword: builder.mutation<ApiResponse<null>, { currentPassword: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                body,
            }),
        }),

        updateEmail: builder.mutation<ApiResponse<null>, any>({
            query: (body) => ({
                url: "/auth/update-email",
                method: "POST",
                body,
            }),
        }),

        verifyNewEmail: builder.query<ApiResponse<null>, { token: string; email: string }>({
            query: ({ token, email }) => ({
                url: "/auth/verify-new-email",
                method: "GET",
                params: { token, email },
            }),
        }),

        resendEmailUpdate: builder.mutation<ApiResponse<null>, any>({
            query: (body) => ({
                url: "/auth/resend-email-update",
                method: "POST",
                body,
            }),
        }),

        deleteAccount: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: "/auth/me",
                method: "DELETE",
            }),
        }),

        addFcmToken: builder.mutation<ApiResponse<any>, { token: string }>({
            query: (body) => ({
                url: "/auth/fcm-token",
                method: "PATCH",
                body,
            }),
        }),

        // === Admin / Super Admin Routes ===
        deleteUserByAdmin: builder.mutation<ApiResponse<null>, { userId: string }>({
            query: ({ userId }) => ({
                url: `/auth/${userId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyEmailQuery,
    useResendVerificationEmailMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useGetMeQuery,
    useLogoutMutation,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useUpdateEmailMutation,
    useVerifyNewEmailQuery,
    useResendEmailUpdateMutation,
    useDeleteAccountMutation,
    useAddFcmTokenMutation,
    useDeleteUserByAdminMutation,
} = authApi;
