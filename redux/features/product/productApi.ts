import { baseApi } from "../../api/baseApi";

export interface IProductSpecification {
    key: string;
    value: string;
}

export interface IProductVariant {
    color?: string;
    size?: string;
    sku?: string;
    price?: number;
    originalPrice?: number;
    discountPercentage?: number;
    stockQuantity?: number;
    image?: string;
}

export type ProductApprovalStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "NEED_EDIT";

export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    sku?: string;
    brand?: string;
    category: any;
    seller: any;
    description: string;
    shortDescription?: string;
    specifications?: IProductSpecification[];
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    stockQuantity: number;
    colors?: string[];
    sizes?: string[];
    variants?: IProductVariant[];
    images?: string[];
    thumbnail?: string;
    unit?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
    returnPolicy?: string;
    tags?: string[];
    isFeatured?: boolean;
    isTodayDeal?: boolean;
    isTrending?: boolean;
    isActive?: boolean;
    approvalStatus?: ProductApprovalStatus;
    adminRemarks?: string;
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
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    data: T;
};

const productApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all products (with query filter support)
        getAllProducts: builder.query<ApiListResponse<IProduct[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                          ...result.data.map(({ _id }) => ({ type: "Product" as const, id: _id })),
                          { type: "Product", id: "LIST" },
                      ]
                    : [{ type: "Product", id: "LIST" }],
        }),

        // Get product by slug
        getProductBySlug: builder.query<ApiResponse<IProduct>, string>({
            query: (slug) => ({
                url: `/products/slug/${slug}`,
                method: "GET",
            }),
            providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
        }),

        // Get product by ID
        getProductById: builder.query<ApiResponse<IProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),

        // Get seller's own products
        getMyProducts: builder.query<ApiResponse<IProduct[]>, void>({
            query: () => ({
                url: "/products/my/products",
                method: "GET",
            }),
            providesTags: [{ type: "Product", id: "MY_LIST" }],
        }),

        // Create a product
        createProduct: builder.mutation<ApiResponse<IProduct>, Partial<IProduct>>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "Product", id: "LIST" },
                { type: "Product", id: "MY_LIST" },
            ],
        }),

        // Update a product
        updateProduct: builder.mutation<ApiResponse<IProduct>, { id: string; body: Partial<IProduct> }>({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
                { type: "Product", id: "MY_LIST" },
            ],
        }),

        // Delete a product
        deleteProduct: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
                { type: "Product", id: "MY_LIST" },
            ],
        }),

        // Approve or reject product (Admin only)
        approveProduct: builder.mutation<
            ApiResponse<IProduct>,
            { id: string; approvalStatus: ProductApprovalStatus; adminRemarks?: string }
        >({
            query: ({ id, approvalStatus, adminRemarks }) => ({
                url: `/products/${id}/approve`,
                method: "PATCH",
                body: { approvalStatus, adminRemarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
                { type: "Product", id: "MY_LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductBySlugQuery,
    useGetProductByIdQuery,
    useGetMyProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useApproveProductMutation,
} = productApi;
