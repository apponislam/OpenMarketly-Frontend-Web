import { baseApi } from "../../api/baseApi";

export interface ICoupon {
    _id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const couponApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        validateCoupon: builder.query<ApiResponse<ICoupon>, string>({
            query: (code) => ({
                url: "/coupons/validate",
                method: "GET",
                params: { code },
            }),
        }),

        getAllCoupons: builder.query<ApiResponse<ICoupon[]>, void>({
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
