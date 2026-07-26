"use client";

import React from "react";
import { Heart, ShoppingCart, Grid } from "lucide-react";

interface ShopProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        originalPrice?: number;
        discountPercentage?: number;
        thumbnail?: string;
        category?: { name: string };
    };
    onAddToCart: (productId: string) => void;
    onToggleWishlist: (productId: string) => void;
}

export function ShopProductCard({ product, onAddToCart, onToggleWishlist }: ShopProductCardProps) {
    const discount = product.discountPercentage || 0;

    return (
        <div className="bg-white border border-purple-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col justify-between">
            {/* Image */}
            <div className="relative aspect-square bg-purple-50/50 overflow-hidden">
                {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-200">
                        <Grid className="h-12 w-12" />
                    </div>
                )}

                {/* Discount badge */}
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-[#c8960c] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {discount}% Off
                    </span>
                )}

                {/* Wishlist */}
                <button
                    onClick={() => onToggleWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 rounded-full shadow transition-all duration-200 cursor-pointer"
                >
                    <Heart className="h-4.5 w-4.5 fill-current" />
                </button>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#c8960c]">
                        {product.category?.name || "Product"}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug hover:text-[#2c1654] transition-colors cursor-pointer">
                        {product.name}
                    </h3>
                </div>

                <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-gray-900">৳{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                        )}
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={() => onAddToCart(product._id)}
                        className="w-full py-2.5 bg-[#f8f7fc] hover:bg-[#2c1654] border border-purple-100 hover:border-transparent text-gray-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/btn"
                    >
                        <ShoppingCart className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
