"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [login, { isLoading, error }] = useLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!email || !password) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            const res = await login({ email, password }).unwrap();
            if (res?.success) {
                dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
                router.push("/dashboard");
            } else {
                setErrorMessage(res?.message || "Login failed");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "Invalid credentials or server error");
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
                <p className="text-sm text-gray-400 mt-1">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                    <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-sm rounded-lg">
                        {errorMessage}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="password">
                            Password
                        </label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-[#c4b5e8] hover:text-[#c8960c] transition duration-200"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-[#2c1654] hover:bg-[#3d2073] active:bg-[#1a0e33] border border-white/10 hover:border-[#c8960c]/30 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-[#c8960c] hover:underline">
                    Create Account
                </Link>
            </div>
        </div>
    );
}
