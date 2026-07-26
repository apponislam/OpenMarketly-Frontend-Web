import { baseApi } from "../../api/baseApi";

export interface ICartItem {
    product: any;
    quantity: number;
    color?: string;
    size?: string;
    price: number;
}

export interface ICart {
    _id: string;
    userId: string;
    items: ICartItem[];
    totalPrice: number;
    totalQuantity: number;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const cartApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getMyCart: builder.query<ApiResponse<ICart>, void>({
            query: () => ({
                url: "/cart/my",
                method: "GET",
            }),
            providesTags: [{ type: "Cart", id: "MY_CART" }],
        }),

        addToCart: builder.mutation<
            ApiResponse<ICart>,
            { productId: string; quantity: number; color?: string; size?: string }
        >({
            query: (body) => ({
                url: "/cart/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
        }),

        updateCartItemQuantity: builder.mutation<
            ApiResponse<ICart>,
            { productId: string; quantity: number; color?: string; size?: string }
        >({
            query: (body) => ({
                url: "/cart/update",
                method: "PATCH",
                body,
            }),
            invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
        }),

        removeFromCart: builder.mutation<ApiResponse<ICart>, { productId: string; color?: string; size?: string }>({
            query: ({ productId, color, size }) => ({
                url: `/cart/item/${productId}`,
                method: "DELETE",
                params: { color, size },
            }),
            invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
        }),

        clearCart: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: "/cart/clear",
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
        }),
    }),
});

export const {
    useGetMyCartQuery,
    useAddToCartMutation,
    useUpdateCartItemQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApi;
