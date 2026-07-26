"use client";

import React from "react";
import { Search, SlidersHorizontal, Check, X } from "lucide-react";

interface Category {
    _id: string;
    name: string;
}

interface MobileFilterDrawerProps {
    open: boolean;
    onClose: () => void;
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

export function MobileFilterDrawer({
    open,
    onClose,
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
}: MobileFilterDrawerProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative flex flex-col w-full max-w-xs bg-white h-full p-6 shadow-2xl ml-auto animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <h2 className="font-bold text-base flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-[#2c1654]" /> Filter Options
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable filters */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                        <div className="space-y-1">
                            <button
                                onClick={() => { onCategoryChange(""); onClose(); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                                    selectedCategory === "" ? "bg-[#2c1654] text-white" : "hover:bg-purple-50 text-gray-700"
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => { onCategoryChange(cat._id); onClose(); }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center cursor-pointer ${
                                        selectedCategory === cat._id ? "bg-[#2c1654] text-white" : "hover:bg-purple-50 text-gray-700"
                                    }`}
                                >
                                    <span className="truncate">{cat.name}</span>
                                    {selectedCategory === cat._id && <Check className="h-3.5 w-3.5 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => onMinPriceChange(e.target.value)}
                                className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm bg-[#f8f7fc]"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => onMaxPriceChange(e.target.value)}
                                className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm bg-[#f8f7fc]"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom actions */}
                <div className="pt-4 border-t border-gray-100 gap-3 flex">
                    <button
                        onClick={onClearAll}
                        className="w-full py-2.5 border border-purple-100 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-[#2c1654] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
