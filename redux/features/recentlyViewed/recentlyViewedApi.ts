import { baseApi } from "../../api/baseApi";
import { IProduct } from "../product/productApi";

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const recentlyViewedApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        addProductToRecentlyViewed: builder.mutation<ApiResponse<any>, { productId: string }>({
            query: (body) => ({
                url: "/recently-viewed",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "RecentlyViewed", id: "MY_LIST" }],
        }),

        getRecentlyViewedProducts: builder.query<ApiResponse<IProduct[]>, void>({
            query: () => ({
                url: "/recently-viewed",
                method: "GET",
            }),
            providesTags: [{ type: "RecentlyViewed", id: "MY_LIST" }],
        }),

        clearRecentlyViewed: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: "/recently-viewed",
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "RecentlyViewed", id: "MY_LIST" }],
        }),
    }),
});

export const {
    useAddProductToRecentlyViewedMutation,
    useGetRecentlyViewedProductsQuery,
    useClearRecentlyViewedMutation,
} = recentlyViewedApi;
