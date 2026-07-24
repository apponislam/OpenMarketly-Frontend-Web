import { baseApi } from "../../api/baseApi";

export interface IFaq {
    _id: string;
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type ApiListResponse<T> = {
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

const faqApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllFaqs: builder.query<ApiListResponse<IFaq[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/faqs",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Faq", id: "LIST" }],
        }),

        createFaq: builder.mutation<ApiResponse<IFaq>, Partial<IFaq>>({
            query: (body) => ({
                url: "/faqs",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Faq", id: "LIST" }],
        }),

        updateFaq: builder.mutation<ApiResponse<IFaq>, { id: string; body: Partial<IFaq> }>({
            query: ({ id, body }) => ({
                url: `/faqs/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Faq", id },
                { type: "Faq", id: "LIST" },
            ],
        }),

        deleteFaq: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Faq", id },
                { type: "Faq", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllFaqsQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;
