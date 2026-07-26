import { baseApi } from "../../api/baseApi";

export interface IWithdrawRequest {
    _id: string;
    sellerId: any;
    amount: number;
    paymentMethod: string;
    paymentDetails: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminRemarks?: string;
    resolvedAt?: string;
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
        totalPage: number;
    };
    data: T;
};

const withdrawApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createWithdrawRequest: builder.mutation<
            ApiResponse<IWithdrawRequest>,
            { amount: number; paymentMethod: string; paymentDetails: string }
        >({
            query: (body) => ({
                url: "/withdraw",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "Withdraw", id: "MY_LIST" },
                { type: "Withdraw", id: "LIST" },
            ],
        }),

        getMyWithdrawRequests: builder.query<ApiResponse<IWithdrawRequest[]>, void>({
            query: () => ({
                url: "/withdraw/my",
                method: "GET",
            }),
            providesTags: [{ type: "Withdraw", id: "MY_LIST" }],
        }),

        getAllWithdrawRequests: builder.query<ApiListResponse<IWithdrawRequest[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/withdraw",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Withdraw", id: "LIST" }],
        }),

        resolveWithdrawRequest: builder.mutation<
            ApiResponse<IWithdrawRequest>,
            { id: string; status: "APPROVED" | "REJECTED"; adminRemarks?: string }
        >({
            query: ({ id, status, adminRemarks }) => ({
                url: `/withdraw/${id}/resolve`,
                method: "PATCH",
                body: { status, adminRemarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Withdraw", id },
                { type: "Withdraw", id: "MY_LIST" },
                { type: "Withdraw", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useCreateWithdrawRequestMutation,
    useGetMyWithdrawRequestsQuery,
    useGetAllWithdrawRequestsQuery,
    useResolveWithdrawRequestMutation,
} = withdrawApi;
