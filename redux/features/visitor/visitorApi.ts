import { baseApi } from "../../api/baseApi";

export interface IVisitorStats {
    totalViews: number;
    uniqueVisitors: number;
    pageViewsBreakdown: {
        pageUrl: string;
        views: number;
    }[];
}

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const visitorApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        trackVisit: builder.mutation<ApiResponse<any>, { pageUrl: string; referrer?: string; userAgent?: string }>({
            query: (body) => ({
                url: "/visitor/track",
                method: "POST",
                body,
            }),
        }),

        getVisitorStats: builder.query<ApiResponse<IVisitorStats>, Record<string, any> | void>({
            query: (params) => ({
                url: "/visitor/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Visitor", id: "STATS" }],
        }),
    }),
});

export const { useTrackVisitMutation, useGetVisitorStatsQuery } = visitorApi;
