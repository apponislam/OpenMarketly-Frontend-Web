import { baseApi } from "../../api/baseApi";

export interface IWithdrawRequest {
    _id: string;
    seller: any;
    sellerId?: any;
    amount: number;
    paymentMethod: "BKASH" | "NAGAD" | "ROCKET" | "BANK";
    paymentDetails: {
        accountName?: string;
        accountNumber: string;
        bankName?: string;
        branchName?: string;
        routingNumber?: string;
    };
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote?: string;
    transactionId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IWithdrawStats {
    availableBalance: number;
    pendingCashout: number;
    completedPayouts: number;
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

const withdrawApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createWithdrawRequest: builder.mutation<
            ApiResponse<IWithdrawRequest>,
            {
                amount: number;
                paymentMethod: string;
                paymentDetails: {
                    accountNumber: string;
                    accountName?: string;
                    bankName?: string;
                    branchName?: string;
                    routingNumber?: string;
                };
            }
        >({
            query: (body) => ({
                url: "/withdraws",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "Withdraw", id: "MY_LIST" },
                { type: "Withdraw", id: "LIST" },
                { type: "Withdraw", id: "STATS" },
            ],
        }),

        getMyWithdrawRequests: builder.query<ApiResponse<IWithdrawRequest[]>, void>({
            query: () => ({
                url: "/withdraws/my",
                method: "GET",
            }),
            providesTags: [{ type: "Withdraw", id: "MY_LIST" }],
        }),

        getWithdrawStats: builder.query<ApiResponse<IWithdrawStats>, void>({
            query: () => ({
                url: "/withdraws/stats",
                method: "GET",
            }),
            providesTags: [{ type: "Withdraw", id: "STATS" }],
        }),

        getAllWithdrawRequests: builder.query<ApiListResponse<IWithdrawRequest[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/withdraws",
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
                url: `/withdraws/${id}/resolve`,
                method: "PATCH",
                body: { status, adminRemarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Withdraw", id },
                { type: "Withdraw", id: "MY_LIST" },
                { type: "Withdraw", id: "LIST" },
                { type: "Withdraw", id: "STATS" },
            ],
        }),
    }),
});

export const {
    useCreateWithdrawRequestMutation,
    useGetMyWithdrawRequestsQuery,
    useGetWithdrawStatsQuery,
    useGetAllWithdrawRequestsQuery,
    useResolveWithdrawRequestMutation,
} = withdrawApi;
