import { baseApi } from "../../api/baseApi";

export interface IReport {
    _id: string;
    reportedBy: any;
    targetType: "PRODUCT" | "SELLER" | "ORDER" | "OTHER";
    targetId: string;
    reason: string;
    description: string;
    status: "PENDING" | "RESOLVED" | "DISMISSED";
    adminRemarks?: string;
    createdAt?: string;
    updatedAt?: string;
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
        totalPages: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    data: T;
};

const reportApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createReport: builder.mutation<
            ApiResponse<IReport>,
            { targetType: string; targetId: string; reason: string; description: string }
        >({
            query: (body) => ({
                url: "/reports",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Report", id: "LIST" }],
        }),

        getReportById: builder.query<ApiResponse<IReport>, string>({
            query: (id) => ({
                url: `/reports/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Report", id }],
        }),

        getAllReports: builder.query<ApiListResponse<IReport[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/reports",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Report", id: "LIST" }],
        }),

        resolveReport: builder.mutation<ApiResponse<IReport>, { id: string; status: string; adminRemarks?: string }>({
            query: ({ id, status, adminRemarks }) => ({
                url: `/reports/resolve/${id}`,
                method: "PATCH",
                body: { status, adminRemarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Report", id },
                { type: "Report", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useCreateReportMutation,
    useGetReportByIdQuery,
    useGetAllReportsQuery,
    useResolveReportMutation,
} = reportApi;
