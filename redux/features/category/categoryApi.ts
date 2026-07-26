import { baseApi } from "../../api/baseApi";

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    parentCategory?: any;
    image?: string;
    description?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const categoryApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getParentCategories: builder.query<ApiResponse<ICategory[]>, void>({
            query: () => ({
                url: "/categories/parents",
                method: "GET",
            }),
            providesTags: [{ type: "Category", id: "PARENTS" }],
        }),

        getSubcategories: builder.query<ApiResponse<ICategory[]>, string>({
            query: (parentId) => ({
                url: `/categories/subcategories/${parentId}`,
                method: "GET",
            }),
            providesTags: (result, error, parentId) => [{ type: "Category", id: `SUB_${parentId}` }],
        }),

        getAllCategories: builder.query<ApiResponse<ICategory[]>, void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
            providesTags: [{ type: "Category", id: "LIST" }],
        }),

        getCategoryById: builder.query<ApiResponse<ICategory>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Category", id }],
        }),

        createCategory: builder.mutation<ApiResponse<ICategory>, Partial<ICategory>>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "Category", id: "LIST" },
                { type: "Category", id: "PARENTS" },
            ],
        }),

        updateCategory: builder.mutation<ApiResponse<ICategory>, { id: string; body: Partial<ICategory> }>({
            query: ({ id, body }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Category", id },
                { type: "Category", id: "LIST" },
                { type: "Category", id: "PARENTS" },
            ],
        }),

        deleteCategory: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Category", id },
                { type: "Category", id: "LIST" },
                { type: "Category", id: "PARENTS" },
            ],
        }),
    }),
});

export const {
    useGetParentCategoriesQuery,
    useGetSubcategoriesQuery,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
