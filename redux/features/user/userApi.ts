import { baseApi } from "../../api/baseApi";
import { Role, TUser } from "../auth/authSlice";

export interface IUserStats {
    totalUsers?: number;
    totalSellers?: number;
    totalCustomers?: number;
    totalAdmins?: number;
    activeUsers?: number;
    bannedUsers?: number;
    [key: string]: any;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

type ApiListResponse<T> = {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    data: T;
};

const userApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getUserStats: builder.query<ApiResponse<IUserStats>, void>({
            query: () => ({
                url: "/users/stats",
                method: "GET",
            }),
            providesTags: [{ type: "User", id: "STATS" }],
        }),

        createAdmin: builder.mutation<ApiResponse<TUser>, { name: string; email: string; password: string; phone?: string; profileImage?: string }>({
            query: (body) => ({
                url: "/users/create-admin",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "User", id: "LIST" },
                { type: "User", id: "STATS" },
            ],
        }),


        setUserPasswordByAdmin: builder.mutation<ApiResponse<null>, { userId: string; password?: string }>({
            query: ({ userId, password }) => ({
                url: `/users/set-password/${userId}`,
                method: "POST",
                body: { password },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
            ],
        }),

        changeUserRole: builder.mutation<ApiResponse<TUser>, { userId: string; role: Role }>({
            query: ({ userId, role }) => ({
                url: `/users/change-role/${userId}`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "User", id: "LIST" },
                { type: "User", id: "STATS" },
            ],
        }),

        getAllUsers: builder.query<ApiListResponse<TUser[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/users",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                          ...result.data.map(({ _id }) => ({ type: "User" as const, id: _id })),
                          { type: "User", id: "LIST" },
                      ]
                    : [{ type: "User", id: "LIST" }],
        }),

        getSingleUser: builder.query<ApiResponse<TUser>, string>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) => [{ type: "User", id: userId }],
        }),

        getUserProducts: builder.query<ApiListResponse<any[]>, { userId: string; [key: string]: any }>({
            query: ({ userId, ...params }) => ({
                url: `/users/${userId}/products`,
                method: "GET",
                params: Object.keys(params).length ? params : undefined,
            }),
            providesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "Product", id: userId },
                { type: "Product", id: "LIST" },
            ],
        }),

        getUserOrders: builder.query<ApiListResponse<any[]>, { userId: string; [key: string]: any }>({
            query: ({ userId, ...params }) => ({
                url: `/users/${userId}/orders`,
                method: "GET",
                params: Object.keys(params).length ? params : undefined,
            }),
            providesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "Order", id: userId },
                { type: "Order", id: "LIST" },
            ],
        }),

        getUserActivities: builder.query<ApiListResponse<any[]>, { userId: string; [key: string]: any }>({
            query: ({ userId, ...params }) => ({
                url: `/users/${userId}/activities`,
                method: "GET",
                params: Object.keys(params).length ? params : undefined,
            }),
            providesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "Activity", id: userId },
                { type: "Activity", id: "LIST" },
            ],
        }),

        getUserNotifications: builder.query<ApiListResponse<any[]>, { userId: string; [key: string]: any }>({
            query: ({ userId, ...params }) => ({
                url: `/users/${userId}/notifications`,
                method: "GET",
                params: Object.keys(params).length ? params : undefined,
            }),
            providesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "Notification", id: userId },
                { type: "Notification", id: "LIST" },
            ],
        }),

        getUserRatings: builder.query<ApiListResponse<any[]>, { userId: string; [key: string]: any }>({
            query: ({ userId, ...params }) => ({
                url: `/users/${userId}/ratings`,
                method: "GET",
                params: Object.keys(params).length ? params : undefined,
            }),
            providesTags: (result, error, { userId }) => [
                { type: "User", id: userId },
                { type: "Rating", id: userId },
                { type: "Rating", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetUserStatsQuery,
    useCreateAdminMutation,
    useSetUserPasswordByAdminMutation,
    useChangeUserRoleMutation,
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useGetUserProductsQuery,
    useGetUserOrdersQuery,
    useGetUserActivitiesQuery,
    useGetUserNotificationsQuery,
    useGetUserRatingsQuery,
} = userApi;
