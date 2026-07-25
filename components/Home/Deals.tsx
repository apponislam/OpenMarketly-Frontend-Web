import React from "react";
import { Tag, ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { ProductCard } from "../ProductCard";
import { Product } from "../types";

interface DealsProps {
    todayDeals: Product[];
    onShopClick: () => void;
    onView: (p: Product) => void;
    onAddToCart: (p: Product) => void;
}

export function Deals({ todayDeals, onShopClick, onView, onAddToCart }: DealsProps) {
    if (todayDeals.length === 0) return null;

    return (
        <section className="py-14 bg-[#f8f7fc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-5 flex-wrap gap-y-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Tag className="w-5 h-5 text-red-500" />
                                <h2 className="text-2xl font-black text-gray-900">Today's Top Deals</h2>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Offer ends in</p>
                        </div>
                        <CountdownTimer />
                    </div>
                    <button onClick={onShopClick} className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm border-2 transition-colors hover:text-white hover:border-[#2c1654] hover:bg-[#2c1654]" style={{ borderColor: "#2c1654", color: "#2c1654" }}>
                        View All Deals <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {todayDeals.slice(0, 4).map((p) => (
                        <ProductCard key={p._id} product={p} onView={onView} onAddToCart={onAddToCart} />
                    ))}
                </div>
            </div>
        </section>
    );
}
