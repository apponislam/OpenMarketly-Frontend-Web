"use client";

import React from "react";

type StatusType = "APPROVED" | "PENDING" | "REJECTED" | "COMPLETED" | "PROCESSING" | "CANCELLED" | string;

interface StatusBadgeProps {
    status: StatusType;
}

const statusStyles: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-600",
    COMPLETED: "bg-emerald-500/10 text-emerald-600",
    Completed: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25",
    PENDING: "bg-amber-500/10 text-amber-600",
    Pending: "bg-amber-500/10 text-amber-600 border border-amber-500/25",
    PROCESSING: "bg-blue-500/10 text-blue-600",
    Processing: "bg-blue-500/10 text-blue-600 border border-blue-500/25",
    REJECTED: "bg-red-500/10 text-red-600",
    CANCELLED: "bg-red-500/10 text-red-600",
    Cancelled: "bg-red-500/10 text-red-600 border border-red-500/25",
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const style = statusStyles[status] || "bg-gray-100 text-gray-600";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style}`}>
            {status}
        </span>
    );
}
