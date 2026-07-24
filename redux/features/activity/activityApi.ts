import { baseApi } from "../../api/baseApi";

export interface IActivityLog {
    _id: string;
    user?: {
        _id: string;
        name?: string;
        email?: string;
        role?: string;
        profileImage?: string;
    } | any;
    userId?: any;
    action: string;
    module?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
    createdAt?: string;
}

type ApiListResponse<T> = {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    data: T;
};

export interface IActivityFilterParams {
    action?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    userId?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
}

const activityApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllActivityLogs: builder.query<ApiListResponse<IActivityLog[]>, IActivityFilterParams | void>({
            query: (params) => ({
                url: "/activities",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Activity", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllActivityLogsQuery,
    useLazyGetAllActivityLogsQuery,
} = activityApi;
