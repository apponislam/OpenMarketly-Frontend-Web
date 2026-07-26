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
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex items-start justify-between">
            <div className="space-y-3">
                <span className="text-sm font-medium text-gray-500">{name}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-400 font-medium">{change}</span>
                </div>
            </div>
            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${color}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
    );
}
