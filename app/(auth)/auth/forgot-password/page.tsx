"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useResendOtpMutation,
} from "@/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
    const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
    const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email, 2: OTP, 3: Reset Pass, 4: Success
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    
    // Form inputs
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!email) {
            setErrorMessage("Email is required");
            return;
        }

        try {
            const res = await forgotPassword({ email }).unwrap();
            if (res?.success) {
                setStep(2);
                setTimer(30);
            } else {
                setErrorMessage(res?.message || "Failed to send OTP");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "User not found or server error");
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!otp) {
            setErrorMessage("OTP is required");
            return;
        }

        try {
            const res = await verifyOtp({ email, otp }).unwrap();
            if (res?.success && res.data?.token) {
                setResetToken(res.data.token);
                setStep(3);
            } else {
                setErrorMessage(res?.message || "Invalid OTP code");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "Incorrect OTP");
        }
    };

    const handleResendOtp = async () => {
        setErrorMessage("");
        try {
            const res = await resendOtp({ email }).unwrap();
            if (res?.success) {
                setTimer(30);
            } else {
                setErrorMessage(res?.message || "Failed to resend OTP");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "Failed to resend OTP");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please fill all password fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const res = await resetPassword({ token: resetToken, newPassword }).unwrap();
            if (res?.success) {
                setStep(4);
            } else {
                setErrorMessage(res?.message || "Reset failed");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "Could not reset password. Token may have expired.");
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-wide">Forgot Password</h1>
                        <p className="text-sm text-gray-400 mt-1">Enter your email to receive a reset code</p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-[#1e1633] border border-transparent rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSendingOtp}
                            className="w-full mt-6 bg-[#2c1654] hover:bg-[#3d2073] active:bg-[#1a0e33] border border-white/10 hover:border-[#c8960c]/30 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSendingOtp ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Send Reset Code"
                            )}
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-wide">Enter Code</h1>
                        <p className="text-sm text-gray-400 mt-1">We sent a 6-digit code to {email}</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        {errorMessage && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="otp">
                                Verification Code
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                className="w-full bg-[#1e1633] border border-transparent rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200 tracking-[0.5em] text-center font-bold"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifyingOtp}
                            className="w-full mt-6 bg-[#2c1654] hover:bg-[#3d2073] active:bg-[#1a0e33] border border-white/10 hover:border-[#c8960c]/30 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifyingOtp ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Verify Code"
                            )}
                        </button>

                        <div className="text-center mt-6 text-sm">
                            {timer > 0 ? (
                                <p className="text-gray-400">
                                    Resend code in <span className="text-[#c8960c] font-bold">{timer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isResendingOtp}
                                    className="text-[#c8960c] hover:underline font-semibold transition duration-200 disabled:opacity-50"
                                >
                                    {isResendingOtp ? "Resending..." : "Resend Code"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-wide">Reset Password</h1>
                        <p className="text-sm text-gray-400 mt-1">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        {errorMessage && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="newPassword">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1e1633] border border-transparent rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1e1633] border border-transparent rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isResettingPassword}
                            className="w-full mt-6 bg-[#2c1654] hover:bg-[#3d2073] active:bg-[#1a0e33] border border-white/10 hover:border-[#c8960c]/30 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResettingPassword ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </form>
                </div>
            )}

            {step === 4 && (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-[#2c1654] border border-[#c8960c]/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#c8960c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Success!</h1>
                    <p className="text-sm text-gray-400 mt-2">Your password has been successfully reset.</p>

                    <Link
                        href="/auth/login"
                        className="block w-full mt-8 bg-[#2c1654] hover:bg-[#3d2073] border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                    >
                        Return to Sign In
                    </Link>
                </div>
            )}

            {step !== 4 && (
                <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-gray-400">
                    Remembered password?{" "}
                    <Link href="/auth/login" className="font-semibold text-[#c8960c] hover:underline">
                        Sign In
                    </Link>
                </div>
            )}
        </div>
    );
}
