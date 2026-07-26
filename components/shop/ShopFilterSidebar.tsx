"use client";

import React from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface Category {
    _id: string;
    name: string;
}

interface ShopFilterSidebarProps {
    search: string;
    onSearchChange: (value: string) => void;
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (id: string) => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    onClearAll: () => void;
}

export function ShopFilterSidebar({
    search,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onClearAll,
}: ShopFilterSidebarProps) {
    return (
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-purple-100/50 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="font-bold text-base flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-[#2c1654]" /> Filters
                </h2>
                <button
                    onClick={onClearAll}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer"
                >
                    Clear All
                </button>
            </div>

            {/* Search */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <button
                        onClick={() => onCategoryChange("")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                            selectedCategory === ""
                                ? "bg-[#2c1654] text-white font-bold"
                                : "hover:bg-purple-50 text-gray-700"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => onCategoryChange(cat._id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer flex justify-between items-center ${
                                selectedCategory === cat._id
                                    ? "bg-[#2c1654] text-white font-bold"
                                    : "hover:bg-purple-50 text-gray-700"
                            }`}
                        >
                            <span className="truncate">{cat.name}</span>
                            {selectedCategory === cat._id && <Check className="h-4 w-4 text-white" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range (BDT)</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onMinPriceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                    />
                </div>
            </div>
        </aside>
    );
}
