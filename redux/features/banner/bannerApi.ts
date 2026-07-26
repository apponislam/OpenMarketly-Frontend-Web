import { baseApi } from "../../api/baseApi";

export interface IBanner {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const bannerApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllBanners: builder.query<ApiResponse<IBanner[]>, void>({
            query: () => ({
                url: "/banners",
                method: "GET",
            }),
            providesTags: [{ type: "Banner", id: "LIST" }],
        }),

        getBannerById: builder.query<ApiResponse<IBanner>, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Banner", id }],
        }),

        createBanner: builder.mutation<ApiResponse<IBanner>, Partial<IBanner>>({
            query: (body) => ({
                url: "/banners",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Banner", id: "LIST" }],
        }),

        updateBanner: builder.mutation<ApiResponse<IBanner>, { id: string; body: Partial<IBanner> }>({
            query: ({ id, body }) => ({
                url: `/banners/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Banner", id },
                { type: "Banner", id: "LIST" },
            ],
        }),

        deleteBanner: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Banner", id },
                { type: "Banner", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllBannersQuery,
    useGetBannerByIdQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannerApi;
