"use client";

import React from "react";

interface DashboardTableProps {
    headers: string[];
    headerAligns?: ("left" | "right" | "center")[];
    children: React.ReactNode;
    emptyMessage?: string;
    isEmpty?: boolean;
}

export function DashboardTable({
    headers,
    headerAligns,
    children,
    emptyMessage = "No data found.",
    isEmpty = false,
}: DashboardTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                        <tr>
                            {headers.map((header, i) => {
                                const align = headerAligns?.[i] || "left";
                                return (
                                    <th
                                        key={header}
                                        className={`px-6 py-3 ${
                                            align === "right" ? "text-right" : align === "center" ? "text-center" : ""
                                        }`}
                                    >
                                        {header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
