"use client";

import React from "react";

interface DashboardCardProps {
    title: string;
    headerRight?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function DashboardCard({ title, headerRight, children, className = "" }: DashboardCardProps) {
    return (
        <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {headerRight && <div>{headerRight}</div>}
            </div>
            {children}
        </div>
    );
}
