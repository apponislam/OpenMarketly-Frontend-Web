import { baseApi } from "../../api/baseApi";
import { IProduct } from "../product/productApi";

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const wishlistApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getMyWishlist: builder.query<ApiResponse<IProduct[]>, void>({
            query: () => ({
                url: "/wishlist",
                method: "GET",
            }),
            providesTags: [{ type: "Wishlist", id: "MY_WISHLIST" }],
        }),

        toggleWishlist: builder.mutation<ApiResponse<{ isWishlisted: boolean }>, { productId: string }>({
            query: (body) => ({
                url: "/wishlist/toggle",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: "Wishlist", id: "MY_WISHLIST" },
                { type: "Wishlist", id: `CHECK_${productId}` },
            ],
        }),

        checkIsWishlisted: builder.query<ApiResponse<{ isWishlisted: boolean }>, string>({
            query: (productId) => ({
                url: `/wishlist/check/${productId}`,
                method: "GET",
            }),
            providesTags: (result, error, productId) => [{ type: "Wishlist", id: `CHECK_${productId}` }],
        }),
    }),
});

export const {
    useGetMyWishlistQuery,
    useToggleWishlistMutation,
    useCheckIsWishlistedQuery,
} = wishlistApi;
