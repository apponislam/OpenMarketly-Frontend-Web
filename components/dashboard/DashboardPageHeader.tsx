"use client";

import React from "react";

interface DashboardPageHeaderProps {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
}

export function DashboardPageHeader({ title, subtitle, action }: DashboardPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{title}</h1>
                <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
