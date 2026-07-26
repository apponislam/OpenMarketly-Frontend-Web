"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, X, type LucideIcon } from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardSidebarProps {
    navigation: NavItem[];
    userRole: string;
    onLogout: () => void;
    // Mobile-specific
    mobile?: boolean;
    open?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({
    navigation,
    userRole,
    onLogout,
    mobile = false,
    open = false,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    const sidebarContent = (
        <>
            {/* Logo / Brand */}
            <div className={`flex items-center justify-between ${mobile ? "mb-8" : "h-16 px-6 border-b border-white/10"}`}>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                        OpenMarketly
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                        {userRole}
                    </span>
                </Link>
                {mobile && onClose && (
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className={`flex-1 flex flex-col justify-between ${mobile ? "" : "overflow-y-auto p-4"}`}>
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={mobile ? onClose : undefined}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "bg-amber-500 text-[#2c1654] font-semibold shadow-lg shadow-amber-500/20"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Links */}
                <div className="pt-4 border-t border-white/10 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                        <Home className="h-5 w-5 flex-shrink-0" />
                        View Storefront
                    </Link>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 text-left cursor-pointer"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );

    // Mobile drawer
    if (mobile) {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="relative flex flex-col w-64 max-w-xs bg-[#2c1654] text-white p-4 transition-transform duration-300">
                    {sidebarContent}
                </div>
            </div>
        );
    }

    // Desktop sidebar
    return (
        <aside className="hidden md:flex md:flex-col md:w-64 bg-[#2c1654] text-white flex-shrink-0 border-r border-[#2c1654]/10">
            {sidebarContent}
        </aside>
    );
}
