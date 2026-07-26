"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    name: string;
    value: string | number;
    change: string;
    icon: LucideIcon;
    color: string; // e.g. "bg-emerald-500/10 text-emerald-600"
}

export function StatCard({ name, value, change, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{name}</span>
                <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105 shrink-0 ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-none truncate" title={String(value)}>
                    {value}
                </div>
                <p className="text-xs text-gray-400 font-medium truncate">{change}</p>
            </div>
        </div>
    );
}
