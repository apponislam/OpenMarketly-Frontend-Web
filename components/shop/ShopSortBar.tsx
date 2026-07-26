"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ShopSortBarProps {
    sortBy: string;
    sortOrder: string;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    onOpenMobileFilters: () => void;
}

export function ShopSortBar({ sortBy, sortOrder, onSortChange, onOpenMobileFilters }: ShopSortBarProps) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-purple-100/50 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenMobileFilters}
                    className="lg:hidden p-2.5 bg-[#f8f7fc] border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                >
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
            </div>

            <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <select
                    value={`${sortBy}:${sortOrder}`}
                    onChange={(e) => {
                        const [by, order] = e.target.value.split(":");
                        onSortChange(by, order as "asc" | "desc");
                    }}
                    className="bg-[#f8f7fc] border border-purple-100 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] cursor-pointer font-medium"
                >
                    <option value="createdAt:desc">Newest First</option>
                    <option value="price:asc">Price: Low to High</option>
                    <option value="price:desc">Price: High to Low</option>
                    <option value="name:asc">Name: A to Z</option>
                </select>
            </div>
        </div>
    );
}
