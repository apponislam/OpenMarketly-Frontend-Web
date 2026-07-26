"use client";
import React from "react";
import { ReduxProviders } from "@/providers/ReduxProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProviders>
            <div className="min-h-screen flex bg-[#090514] text-white overflow-hidden font-sans">
                {/* Left Side: Cover Image (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80")' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#090514]/90 via-[#150e26]/70 to-[#090514]/90" />
                    
                    {/* Top Branding */}
                    <div className="relative z-10">
                        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-[#c4b5e8] to-[#c8960c] bg-clip-text text-transparent">
                            OpenMarketly
                        </span>
                    </div>

                    {/* Middle Quote / Feature */}
                    <div className="relative z-10 max-w-md">
                        <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
                            Discover the Best Marketplace Experience.
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Sign up today to explore thousands of verified stores, fast deliveries, and secure payment processing.
                        </p>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 text-xs text-gray-500">
                        &copy; 2026 OpenMarketly. All rights reserved.
                    </div>
                </div>

                {/* Right Side: Centered Form Container */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                    {/* Decorative Background Blobs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-radial from-[#3b1c78]/25 to-transparent blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-radial from-[#c8960c]/5 to-transparent blur-[100px] pointer-events-none" />

                    <div className="w-full max-w-md z-10">
                        {/* Logo for mobile only */}
                        <div className="text-center md:hidden mb-8">
                            <span className="inline-block text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#c4b5e8] to-[#c8960c] bg-clip-text text-transparent">
                                OpenMarketly
                            </span>
                        </div>
                        <div className="bg-[#150e26]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(12,6,28,0.37)]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ReduxProviders>
    );
}
