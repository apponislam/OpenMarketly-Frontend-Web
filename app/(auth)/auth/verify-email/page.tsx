"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailQuery } from "@/redux/features/auth/authApi";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || undefined;
    const otp = searchParams.get("otp") || undefined;

    // Only skip query if email is missing
    const { data, error, isLoading } = useVerifyEmailQuery(
        { email, token, otp },
        { skip: !email }
    );

    if (!email) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Missing Information</h1>
                <p className="text-sm text-gray-400 mt-2">
                    Invalid email verification link. Email is required.
                </p>
                <Link
                    href="/auth/login"
                    className="block w-full mt-8 bg-[#2c1654] hover:bg-[#3d2073] border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                >
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center py-6">
            {isLoading && (
                <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-t-transparent border-[#c8960c] rounded-full animate-spin mx-auto" />
                    <h1 className="text-lg font-semibold text-white">Verifying Email...</h1>
                    <p className="text-xs text-gray-400">Please wait while we verify your email address.</p>
                </div>
            )}

            {!isLoading && error && (
                <div>
                    <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">Verification Failed</h1>
                    <p className="text-sm text-gray-400 mt-2">
                        {(error as any)?.data?.message || "The verification link might have expired or is invalid."}
                    </p>
                    <Link
                        href="/auth/login"
                        className="block w-full mt-8 bg-[#2c1654] hover:bg-[#3d2073] border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                    >
                        Back to Sign In
                    </Link>
                </div>
            )}

            {!isLoading && data?.success && (
                <div>
                    <div className="w-16 h-16 bg-[#2c1654] border border-[#c8960c]/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#c8960c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">Email Verified!</h1>
                    <p className="text-sm text-gray-400 mt-2">
                        Your email address has been successfully verified. You can now log in to your account.
                    </p>
                    <Link
                        href="/auth/login"
                        className="block w-full mt-8 bg-[#2c1654] hover:bg-[#3d2073] border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                    >
                        Proceed to Sign In
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 border-4 border-t-transparent border-[#c8960c] rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Loading page...</p>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
