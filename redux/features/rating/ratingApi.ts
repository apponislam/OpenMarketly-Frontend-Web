import { baseApi } from "../../api/baseApi";

export interface IRating {
    _id: string;
    productId: string;
    userId: any;
    rating: number;
    review?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRatingSummary {
    averageRating: number;
    totalRatings: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const ratingApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getProductRatings: builder.query<ApiResponse<IRating[]>, string>({
            query: (productId) => ({
                url: `/ratings/product/${productId}`,
                method: "GET",
            }),
            providesTags: (result, error, productId) => [{ type: "Rating", id: `LIST_${productId}` }],
        }),

        getRatingSummary: builder.query<ApiResponse<IRatingSummary>, string>({
            query: (productId) => ({
                url: `/ratings/summary/${productId}`,
                method: "GET",
            }),
            providesTags: (result, error, productId) => [{ type: "Rating", id: `SUMMARY_${productId}` }],
        }),

        createOrUpdateRating: builder.mutation<ApiResponse<IRating>, { productId: string; rating: number; review?: string }>({
            query: (body) => ({
                url: "/ratings",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: "Rating", id: `LIST_${productId}` },
                { type: "Rating", id: `SUMMARY_${productId}` },
                { type: "Product", id: productId },
            ],
        }),

        deleteRating: builder.mutation<ApiResponse<null>, { id: string; productId: string }>({
            query: ({ id }) => ({
                url: `/ratings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: "Rating", id: `LIST_${productId}` },
                { type: "Rating", id: `SUMMARY_${productId}` },
                { type: "Product", id: productId },
            ],
        }),
    }),
});

export const {
    useGetProductRatingsQuery,
    useGetRatingSummaryQuery,
    useCreateOrUpdateRatingMutation,
    useDeleteRatingMutation,
} = ratingApi;
