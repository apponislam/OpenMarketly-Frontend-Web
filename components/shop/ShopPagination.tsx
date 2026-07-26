"use client";

import React from "react";

interface ShopPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function ShopPagination({ currentPage, totalPages, onPageChange }: ShopPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 pt-4">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="px-4 py-2 border border-purple-100 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        p === currentPage
                            ? "bg-[#2c1654] text-white shadow"
                            : "bg-white border border-purple-100 text-gray-700 hover:bg-purple-50"
                    }`}
                >
                    {p}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className="px-4 py-2 border border-purple-100 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                Next
            </button>
        </div>
    );
}
