import { baseApi } from "../../api/baseApi";

export interface INotification {
    _id: string;
    recipientId: string;
    title: string;
    message: string;
    isRead: boolean;
    type?: string;
    createdAt?: string;
}

export interface INotificationCount {
    unreadCount: number;
    totalCount: number;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const notificationApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getMyNotifications: builder.query<ApiResponse<INotification[]>, void>({
            query: () => ({
                url: "/notifications/my",
                method: "GET",
            }),
            providesTags: [{ type: "Notification", id: "MY_LIST" }],
        }),

        getNotificationCount: builder.query<ApiResponse<INotificationCount>, void>({
            query: () => ({
                url: "/notifications/count",
                method: "GET",
            }),
            providesTags: [{ type: "Notification", id: "COUNT" }],
        }),

        markAllAsRead: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: [
                { type: "Notification", id: "MY_LIST" },
                { type: "Notification", id: "COUNT" },
            ],
        }),

        markAsRead: builder.mutation<ApiResponse<INotification>, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Notification", id },
                { type: "Notification", id: "MY_LIST" },
                { type: "Notification", id: "COUNT" },
            ],
        }),
    }),
});

export const {
    useGetMyNotificationsQuery,
    useGetNotificationCountQuery,
    useMarkAllAsReadMutation,
    useMarkAsReadMutation,
} = notificationApi;
