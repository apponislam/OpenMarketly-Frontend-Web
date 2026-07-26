import { baseApi } from "../../api/baseApi";

export interface IContact {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    replyMessage?: string;
    repliedBy?: any;
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
        totalPage: number;
    };
    data: T;
};

const contactApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Submit contact message (Public)
        submitMessage: builder.mutation<ApiResponse<IContact>, Omit<IContact, "_id" | "isRead" | "isReplied">>({
            query: (body) => ({
                url: "/contact",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Contact", id: "LIST" }],
        }),

        // Get all messages (Admin only)
        getAllMessages: builder.query<ApiListResponse<IContact[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/contact",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                          ...result.data.map(({ _id }) => ({ type: "Contact" as const, id: _id })),
                          { type: "Contact", id: "LIST" },
                      ]
                    : [{ type: "Contact", id: "LIST" }],
        }),

        // Get message by ID (Admin only)
        getMessageById: builder.query<ApiResponse<IContact>, string>({
            query: (id) => ({
                url: `/contact/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Contact", id }],
        }),

        // Reply to contact message (Admin only)
        replyToMessage: builder.mutation<ApiResponse<IContact>, { id: string; replyMessage: string }>({
            query: ({ id, replyMessage }) => ({
                url: `/contact/${id}/reply`,
                method: "PATCH",
                body: { replyMessage },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Contact", id },
                { type: "Contact", id: "LIST" },
            ],
        }),

        // Delete contact message (Admin only)
        deleteMessage: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/contact/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Contact", id },
                { type: "Contact", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useSubmitMessageMutation,
    useGetAllMessagesQuery,
    useGetMessageByIdQuery,
    useReplyToMessageMutation,
    useDeleteMessageMutation,
} = contactApi;
