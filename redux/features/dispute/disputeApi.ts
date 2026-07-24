import { baseApi } from "../../api/baseApi";

export interface IDispute {
    _id: string;
    orderId: any;
    raisedBy: any;
    reason: string;
    description: string;
    status: "PENDING" | "UNDER_INVESTIGATION" | "RESOLVED" | "REJECTED";
    adminRemarks?: string;
    resolvedBy?: any;
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

const disputeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        raiseDispute: builder.mutation<ApiResponse<IDispute>, { orderId: string; reason: string; description: string }>({
            query: (body) => ({
                url: "/disputes",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "Dispute", id: "MY_LIST" },
                { type: "Dispute", id: "LIST" },
            ],
        }),

        getMyDisputes: builder.query<ApiResponse<IDispute[]>, void>({
            query: () => ({
                url: "/disputes/my",
                method: "GET",
            }),
            providesTags: [{ type: "Dispute", id: "MY_LIST" }],
        }),

        getAllDisputes: builder.query<ApiListResponse<IDispute[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/disputes",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Dispute", id: "LIST" }],
        }),

        resolveDispute: builder.mutation<ApiResponse<IDispute>, { id: string; status: string; adminRemarks?: string }>({
            query: ({ id, status, adminRemarks }) => ({
                url: `/disputes/resolve/${id}`,
                method: "PATCH",
                body: { status, adminRemarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Dispute", id },
                { type: "Dispute", id: "MY_LIST" },
                { type: "Dispute", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useRaiseDisputeMutation,
    useGetMyDisputesQuery,
    useGetAllDisputesQuery,
    useResolveDisputeMutation,
} = disputeApi;
