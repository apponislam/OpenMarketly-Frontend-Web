import { baseApi } from "../../api/baseApi";

export interface IPolicy {
    _id: string;
    type: "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS" | "RETURN_POLICY" | "SHIPPING_POLICY" | "OTHER";
    title: string;
    content: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const policyApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllPolicies: builder.query<ApiResponse<IPolicy[]>, void>({
            query: () => ({
                url: "/policies",
                method: "GET",
            }),
            providesTags: [{ type: "Policy", id: "LIST" }],
        }),

        getPolicyByType: builder.query<ApiResponse<IPolicy>, string>({
            query: (type) => ({
                url: `/policies/${type}`,
                method: "GET",
            }),
            providesTags: (result, error, type) => [{ type: "Policy", id: type }],
        }),

        createOrUpdatePolicy: builder.mutation<ApiResponse<IPolicy>, Partial<IPolicy>>({
            query: (body) => ({
                url: "/policies",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Policy", id: "LIST" }],
        }),

        deletePolicy: builder.mutation<ApiResponse<null>, string>({
            query: (type) => ({
                url: `/policies/${type}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, type) => [
                { type: "Policy", id: type },
                { type: "Policy", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllPoliciesQuery,
    useGetPolicyByTypeQuery,
    useCreateOrUpdatePolicyMutation,
    useDeletePolicyMutation,
} = policyApi;
