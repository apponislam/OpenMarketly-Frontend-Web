"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface ShopBannerProps {
    totalProducts: number;
    onHomeClick: () => void;
}

export function ShopBanner({ totalProducts, onHomeClick }: ShopBannerProps) {
    return (
        <div className="py-8" style={{ background: "linear-gradient(135deg, rgb(44, 22, 84), rgb(74, 43, 140))" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <nav className="flex items-center gap-1.5 text-sm text-purple-300 mb-3">
                    <button
                        onClick={onHomeClick}
                        className="hover:text-white transition-colors font-medium cursor-pointer"
                    >
                        Home
                    </button>
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="text-white font-semibold">Shop</span>
                </nav>
                <h1 className="text-3xl font-black text-white">All Products</h1>
                <p className="text-purple-300 mt-1 text-sm">
                    {totalProducts} products found
                </p>
            </div>
        </div>
    );
}
