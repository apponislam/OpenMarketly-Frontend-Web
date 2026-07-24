import { baseApi } from "../../api/baseApi";

export interface IFeedback {
    _id: string;
    userId: any;
    feedbackType: "BUG" | "SUGGESTION" | "OTHER";
    subject: string;
    message: string;
    status: "PENDING" | "REVIEWED" | "RESOLVED" | "REJECTED";
    adminNote?: string;
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
        totalPages: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    data: T;
};

const feedbackApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createFeedback: builder.mutation<ApiResponse<IFeedback>, Partial<IFeedback>>({
            query: (body) => ({
                url: "/feedbacks",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Feedback", id: "LIST" }],
        }),

        getAllFeedbacks: builder.query<ApiListResponse<IFeedback[]>, Record<string, any> | void>({
            query: (params) => ({
                url: "/feedbacks",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Feedback", id: "LIST" }],
        }),

        updateFeedbackStatus: builder.mutation<
            ApiResponse<IFeedback>,
            { id: string; status: string; adminNote?: string }
        >({
            query: ({ id, status, adminNote }) => ({
                url: `/feedbacks/${id}/status`,
                method: "PATCH",
                body: { status, adminNote },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Feedback", id },
                { type: "Feedback", id: "LIST" },
            ],
        }),

        deleteFeedback: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/feedbacks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Feedback", id },
                { type: "Feedback", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useCreateFeedbackMutation,
    useGetAllFeedbacksQuery,
    useUpdateFeedbackStatusMutation,
    useDeleteFeedbackMutation,
} = feedbackApi;
