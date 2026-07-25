import React from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { Product } from "../types";

interface TrendingProductsProps {
    trendingProducts: Product[];
    onShopClick: () => void;
    onView: (p: Product) => void;
    onAddToCart: (p: Product) => void;
}

export function TrendingProducts({ trendingProducts, onShopClick, onView, onAddToCart }: TrendingProductsProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c8960c" }}>
                        Trending
                    </p>
                    <h2 className="text-2xl font-black text-gray-900">Popular Products</h2>
                </div>
                <button onClick={onShopClick} className="hidden sm:flex items-center gap-1.5 font-bold text-sm hover:opacity-70 transition-opacity" style={{ color: "#2c1654" }}>
                    See All <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {trendingProducts.slice(0, 8).map((p) => (
                    <ProductCard key={p._id} product={p} onView={onView} onAddToCart={onAddToCart} />
                ))}
            </div>
        </section>
    );
}
