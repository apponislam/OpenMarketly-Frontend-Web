"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFields) => {
        setErrorMessage("");
        try {
            const res = await login({ email: data.email, password: data.password }).unwrap();
            if (res?.success) {
                dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
                router.push("/dashboard");
            } else {
                setErrorMessage(res?.message || "Login failed");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || err?.message || "Invalid credentials or server error");
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
                <p className="text-sm text-gray-400 mt-1">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="w-full bg-[#1e1633] border border-transparent rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                    )}
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
                        {...register("password")}
                        placeholder="••••••••"
                        className="w-full bg-[#1e1633] border border-transparent rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                    )}
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
