import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setUser, logOut, TUser } from "../features/auth/authSlice";
import { publicRoutes } from "../../utils/publicRoutes";

interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState)?.auth?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log("API Response:", result);

    const url = typeof args === "string" ? args : args?.url || "";
    const isPublicRoute = publicRoutes.some((route) => url.includes(route));

    if (!isPublicRoute && (result?.error?.status === 401 || result?.error?.status === 403)) {
        // console.log("Access token expired. Attempting refresh...");

        const refreshResult = await baseQuery({ url: "/auth/refresh-token", method: "POST", credentials: "include" }, api, extraOptions);

        // console.log(refreshResult);

        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data) {
            const backendData = (refreshResult.data as RefreshTokenResponse).data;
            const user = backendData.user;
            const accessToken = backendData.accessToken;
            if (user && accessToken) {
                api.dispatch(setUser({ user, token: accessToken }));

                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
                return { error: { status: 401, data: { success: false, message: "Session expired" } } };
            }
        } else {
            api.dispatch(logOut());
            return { error: { status: 401, data: { success: false, message: "Session expired" } } };
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User",
        "Product",
        "Contact",
        "Activity",
        "Banner",
        "Cart",
        "Category",
        "Coupon",
        "Dispute",
        "Faq",
        "Feedback",
        "Notification",
        "Order",
        "Policy",
        "Rating",
        "RecentlyViewed",
        "Report",
        "Settings",
        "Visitor",
        "Wishlist",
        "Withdraw",
    ],
    endpoints: () => ({}),
});
