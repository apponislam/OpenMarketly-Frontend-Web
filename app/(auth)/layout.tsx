"use client";
import React from "react";
import { ReduxProviders } from "@/providers/ReduxProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProviders>
            <div className="relative min-h-screen flex items-center justify-center bg-[#090514] text-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-[#3b1c78]/30 to-transparent blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-[#c8960c]/10 to-transparent blur-[120px] pointer-events-none" />
                
                {/* Auth Page Content Wrapper */}
                <div className="relative w-full max-w-md z-10">
                    <div className="bg-[#150e26]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(12,6,28,0.37)]">
                        {/* Logo / Title Area */}
                        <div className="text-center mb-8">
                            <span className="inline-block text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#c4b5e8] to-[#c8960c] bg-clip-text text-transparent">
                                OpenMarketly
                            </span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </ReduxProviders>
    );
}
