import { baseApi } from "../../api/baseApi";

export interface IVisitorStats {
    todayTotalVisits: number;
    todayUniqueVisitors: number;
    todayWebVisits: number;
    todayWebUnique: number;
    todayAppVisits: number;
    todayAppUnique: number;
    todayPlatformBreakdown: Record<string, { visits: number; unique: number }>;
    totalVisits: number;
    totalUniqueVisitors: number;
    allTimePlatformBreakdown: Record<string, { visits: number; unique: number }>;
    dailyTrend: {
        date: string;
        totalVisits: number;
        uniqueVisitors: number;
        webVisits: number;
        webUnique: number;
        appVisits: number;
        appUnique: number;
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
        trackVisit: builder.mutation<ApiResponse<any>, { path: string; platform?: "WEB" | "ANDROID" | "IOS" | "APP" }>({
            query: (body) => ({
                url: "/visitors/track",
                method: "POST",
                body: {
                    path: body.path,
                    platform: body.platform || "WEB",
                },
            }),
        }),

        getVisitorStats: builder.query<ApiResponse<IVisitorStats>, { days?: number } | void>({
            query: (params) => ({
                url: "/visitors/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: [{ type: "Visitor", id: "STATS" }],
        }),
    }),
});

export const { useTrackVisitMutation, useGetVisitorStatsQuery } = visitorApi;
