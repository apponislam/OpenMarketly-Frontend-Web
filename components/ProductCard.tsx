import React, { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import { StarRating } from "./StarRating";
import { Product, IMGS } from "./types";

interface ProductCardProps {
    product: Product;
    onView: (p: Product) => void;
    onAddToCart: (p: Product) => void;
}

export function ProductCard({ product, onView, onAddToCart }: ProductCardProps) {
    const [wishlisted, setWishlisted] = useState(false);
    const discount = product.discountPercentage || product.discount || 0;
    const image = product.thumbnail || product.image || IMGS.headphones;

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer">
            <div className="relative overflow-hidden bg-gray-50 aspect-square" onClick={() => onView(product)}>
                <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.badge && (
                    <span className="absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase" style={{ backgroundColor: "#2c1654" }}>
                        {product.badge}
                    </span>
                )}
                {discount > 0 && <span className="absolute top-3 right-9 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">-{discount}%</span>}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setWishlisted(!wishlisted);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#2c1654" }}>
                    {product.brand}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug flex-1 hover:text-[#2c1654] transition-colors" onClick={() => onView(product)}>
                    {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-400">({(product.reviews || 120).toLocaleString()})</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-gray-900">৳{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#2c1654" }}
                    >
                        Add to Cart
                    </button>
                    <button onClick={() => onView(product)} className="px-3 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors text-[#2c1654]" title="View Details">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
