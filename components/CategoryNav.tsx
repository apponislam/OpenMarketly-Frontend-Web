import React from "react";
import { NAV_CATS } from "./types";

interface CategoryNavProps {
    onCategoryClick: (cat: string) => void;
    activeCategory: string;
}

export function CategoryNav({ onCategoryClick, activeCategory }: CategoryNavProps) {
    return (
        <nav className="bg-white border-b border-purple-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center overflow-x-auto scrollbar-hide">
                    {NAV_CATS.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategoryClick(cat)}
                            className={`shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                                activeCategory === cat || (cat === "All Categories" && activeCategory === "All")
                                    ? "border-[#2c1654] text-[#2c1654]"
                                    : cat === "Deals"
                                      ? "border-transparent text-red-500 hover:text-red-600 hover:border-red-300"
                                      : "border-transparent text-gray-600 hover:text-[#2c1654] hover:border-purple-200"
                            }`}
                        >
                            {cat === "Deals" ? "🔥 Deals" : cat}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
