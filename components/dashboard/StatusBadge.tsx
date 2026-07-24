"use client";

import React from "react";

type StatusType =
    | "APPROVED"
    | "PENDING"
    | "REJECTED"
    | "NEED_EDIT"
    | "DRAFT"
    | "COMPLETED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED"
    | "PAID"
    | "UNPAID"
    | "FAILED"
    | "ACTIVE"
    | "INACTIVE"
    | "BANNED"
    | "SUSPENDED"
    | "BLOCKED"
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | string;

interface StatusBadgeProps {
    status: StatusType;
}

const statusStyles: Record<string, string> = {
    // Green (Positive / Success)
    APPROVED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    DELIVERED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    PAID: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    VERIFIED: "bg-emerald-100 text-emerald-700 border border-emerald-200",

    // Amber / Yellow (Pending / Warning)
    PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
    UNPAID: "bg-amber-100 text-amber-700 border border-amber-200",
    OPEN: "bg-amber-100 text-amber-700 border border-amber-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border border-amber-200",

    // Blue (In Progress / Transit)
    PROCESSING: "bg-blue-100 text-blue-700 border border-blue-200",
    SHIPPED: "bg-blue-100 text-blue-700 border border-blue-200",

    // Orange (Action required)
    NEED_EDIT: "bg-orange-100 text-orange-700 border border-orange-200",

    // Purple (Draft / Initial)
    DRAFT: "bg-purple-100 text-purple-700 border border-purple-200",

    // Red (Negative / Errors / Cancelled)
    REJECTED: "bg-red-100 text-red-700 border border-red-200",
    CANCELLED: "bg-red-100 text-red-700 border border-red-200",
    REFUNDED: "bg-red-100 text-red-700 border border-red-200",
    FAILED: "bg-red-100 text-red-700 border border-red-200",
    BANNED: "bg-red-100 text-red-700 border border-red-200",
    SUSPENDED: "bg-red-100 text-red-700 border border-red-200",
    BLOCKED: "bg-red-100 text-red-700 border border-red-200",
    CLOSED: "bg-red-100 text-red-700 border border-red-200",

    // Gray (Neutral / Inactive)
    INACTIVE: "bg-gray-100 text-gray-700 border border-gray-200",
    EXPIRED: "bg-gray-100 text-gray-700 border border-gray-200",
    DISABLED: "bg-gray-100 text-gray-700 border border-gray-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const rawStatus = status || "UNKNOWN";
    const uppercaseStatus = rawStatus.toString().toUpperCase().replace(/\s+/g, "_");
    const style = statusStyles[uppercaseStatus] || "bg-gray-100 text-gray-700 border border-gray-200";

    const displayLabel = rawStatus.toString().replace(/_/g, " ");

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style}`}>
            {displayLabel}
        </span>
    );
}
