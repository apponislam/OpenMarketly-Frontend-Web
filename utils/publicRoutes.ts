/**
 * Array of route patterns that do not require authentication refresh.
 * Add any new public backend API paths here.
 */
export const publicRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-otp",
    "/auth/reset-password",
    "/auth/verify-email",
];
