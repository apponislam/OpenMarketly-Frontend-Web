import { baseApi } from "../../api/baseApi";

export interface IOrderItem {
    product: any;
    quantity: number;
    color?: string;
    size?: string;
    price: number;
}

export interface IOrder {
    _id: string;
    userId: string;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
    };
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
    paymentMethod: "SSL_COMMERZ" | "COD";
    orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    transactionId?: string;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const orderApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        checkoutOrder: builder.mutation<ApiResponse<{ paymentUrl?: string; order: IOrder }>, any>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Order", id: "MY_LIST" }],
        }),

        directCheckoutOrder: builder.mutation<ApiResponse<{ paymentUrl?: string; order: IOrder }>, any>({
            query: (body) => ({
                url: "/orders/direct-checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Order", id: "MY_LIST" }],
        }),

        getMyOrders: builder.query<ApiResponse<IOrder[]>, void>({
            query: () => ({
                url: "/orders/my",
                method: "GET",
            }),
            providesTags: [{ type: "Order", id: "MY_LIST" }],
        }),

        getOrderById: builder.query<ApiResponse<IOrder>, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Order", id }],
        }),

        retryPayment: builder.mutation<ApiResponse<{ paymentUrl: string }>, string>({
            query: (id) => ({
                url: `/orders/${id}/retry-payment`,
                method: "POST",
            }),
        }),

        paymentSuccessCallback: builder.mutation<ApiResponse<any>, string>({
            query: (tranId) => ({
                url: `/orders/payment/success/${tranId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Order", id: "MY_LIST" }],
        }),

        paymentFailCallback: builder.mutation<ApiResponse<any>, string>({
            query: (tranId) => ({
                url: `/orders/payment/fail/${tranId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Order", id: "MY_LIST" }],
        }),

        paymentCancelCallback: builder.mutation<ApiResponse<any>, string>({
            query: (tranId) => ({
                url: `/orders/payment/cancel/${tranId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Order", id: "MY_LIST" }],
        }),
    }),
});

export const {
    useCheckoutOrderMutation,
    useDirectCheckoutOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useRetryPaymentMutation,
    usePaymentSuccessCallbackMutation,
    usePaymentFailCallbackMutation,
    usePaymentCancelCallbackMutation,
} = orderApi;
