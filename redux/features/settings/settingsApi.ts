import { baseApi } from "../../api/baseApi";

export interface ISettings {
    _id: string;
    siteName: string;
    currency: string;
    logoUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    commissionPercentage?: number;
    shippingFee?: number;
    metaTitle?: string;
    metaDescription?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const settingsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getSettings: builder.query<ApiResponse<ISettings>, void>({
            query: () => ({
                url: "/settings",
                method: "GET",
            }),
            providesTags: [{ type: "Settings", id: "SITE_SETTINGS" }],
        }),

        updateSettings: builder.mutation<ApiResponse<ISettings>, Partial<ISettings>>({
            query: (body) => ({
                url: "/settings",
                method: "PATCH",
                body,
            }),
            invalidatesTags: [{ type: "Settings", id: "SITE_SETTINGS" }],
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
