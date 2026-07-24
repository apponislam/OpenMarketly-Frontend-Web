import { baseApi } from "../../api/baseApi";

export interface ICoupon {
    _id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    expiryDate: string;
    usageLimit?: number;
    usageCount?: number;
    isActive?: boolean;
    isDeleted?: boolean;
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
    data: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
};

const couponApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        validateCoupon: builder.query<ApiResponse<{ couponId: string; code: string; discountType: string; discountValue: number; discountAmount: number; finalAmount: number }>, { code: string; orderAmount: number }>({
            query: ({ code, orderAmount }) => ({
                url: "/coupons/validate",
                method: "POST",
                body: { code, orderAmount },
            }),
        }),

        getAllCoupons: builder.query<ApiListResponse<ICoupon[]>, void>({
            query: () => ({
                url: "/coupons",
                method: "GET",
            }),
            providesTags: [{ type: "Coupon", id: "LIST" }],
        }),

        createCoupon: builder.mutation<ApiResponse<ICoupon>, Partial<ICoupon>>({
            query: (body) => ({
                url: "/coupons",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Coupon", id: "LIST" }],
        }),

        updateCoupon: builder.mutation<ApiResponse<ICoupon>, { id: string; body: Partial<ICoupon> }>({
            query: ({ id, body }) => ({
                url: `/coupons/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Coupon", id },
                { type: "Coupon", id: "LIST" },
            ],
        }),

        deleteCoupon: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Coupon", id },
                { type: "Coupon", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useValidateCouponQuery,
    useLazyValidateCouponQuery,
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponApi;
