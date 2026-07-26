import { baseApi } from "../../api/baseApi";

export interface IAdminDashboardStats {
    userStats: {
        totalCustomers: number;
        totalSellers: number;
        totalAdmins: number;
        totalSuperAdmins: number;
    };
    productStats: {
        totalProducts: number;
        draft: number;
        pending: number;
        approved: number;
        rejected: number;
        needEdit: number;
    };
    orderStats: {
        totalOrders: number;
        totalRevenue: number;
        totalCommission: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    withdrawStats: {
        totalPendingAmount: number;
        totalApprovedAmount: number;
        totalRequests: number;
    };
    recentOrders: any[];
    recentSignups: any[];
}

export interface ISellerDashboardStats {
    storeSales: number;
    totalOrders: number;
    totalProducts: number;
    lowStockAlerts: any[];
    withdrawStats: {
        pending: number;
        approved: number;
        rejected: number;
        totalWithdrawn: number;
    };
    recentOrders: any[];
}

export interface ICustomerDashboardStats {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    wishlistCount: number;
    recentOrders: any[];
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const dashboardApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAdminDashboardStats: builder.query<ApiResponse<IAdminDashboardStats>, void>({
            query: () => ({
                url: "/dashboard/admin",
                method: "GET",
            }),
            providesTags: [{ type: "Dashboard", id: "ADMIN" }],
        }),

        getSellerDashboardStats: builder.query<ApiResponse<ISellerDashboardStats>, void>({
            query: () => ({
                url: "/dashboard/seller",
                method: "GET",
            }),
            providesTags: [{ type: "Dashboard", id: "SELLER" }],
        }),

        getCustomerDashboardStats: builder.query<ApiResponse<ICustomerDashboardStats>, void>({
            query: () => ({
                url: "/dashboard/customer",
                method: "GET",
            }),
            providesTags: [{ type: "Dashboard", id: "CUSTOMER" }],
        }),
    }),
});

export const {
    useGetAdminDashboardStatsQuery,
    useGetSellerDashboardStatsQuery,
    useGetCustomerDashboardStatsQuery,
} = dashboardApi;
