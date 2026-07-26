import { baseApi } from "../../api/baseApi";

export interface IActivityLog {
    _id: string;
    userId: any;
    action: string;
    module: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
    createdAt?: string;
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
        totalPage: number;
    };
    data: T;
};

const activityApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getMyActivityLogs: builder.query<ApiResponse<IActivityLog[]>, void>({
            query: () => ({
                url: "/activity/my",
                method: "GET",
            }),
            providesTags: [{ type: "Activity", id: "MY_LIST" }],
        }),

        getAllActivityLogs: builder.query<ApiListResponse<IActivityLog[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/activity",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Activity", id: "LIST" }],
        }),
    }),
});

export const { useGetMyActivityLogsQuery, useGetAllActivityLogsQuery } = activityApi;
