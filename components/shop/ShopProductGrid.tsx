"use client";

import React from "react";
import { Search, Loader2 } from "lucide-react";
import { ShopProductCard } from "./ShopProductCard";

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    thumbnail?: string;
    category?: { name: string };
}

interface ShopProductGridProps {
    products: Product[];
    isLoading: boolean;
    onAddToCart: (productId: string) => void;
    onToggleWishlist: (productId: string) => void;
    onClearFilters: () => void;
}

export function ShopProductGrid({
    products,
    isLoading,
    onAddToCart,
    onToggleWishlist,
    onClearFilters,
}: ShopProductGridProps) {
    if (isLoading) {
        return (
            <div className="min-h-[400px] bg-white rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#2c1654]" />
                <span className="text-sm font-semibold text-gray-500">Loading catalog...</span>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-[400px] bg-white rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center space-y-3 p-6 text-center">
                <Search className="h-12 w-12 text-gray-300" />
                <h3 className="font-bold text-lg text-gray-800">No Products Found</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                    We couldn&apos;t find any items matching your selected criteria. Try adjusting filters or search queries.
                </p>
                <button
                    onClick={onClearFilters}
                    className="px-5 py-2.5 bg-[#2c1654] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Reset Catalog
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
                <ShopProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                />
            ))}
        </div>
    );
}
