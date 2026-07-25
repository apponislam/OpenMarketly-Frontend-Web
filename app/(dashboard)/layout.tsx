"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown,
    LogOut,
    Home
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f8f7fc] text-[#0d0a1a] overflow-hidden">
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-[#2c1654] text-white flex-shrink-0 border-r border-[#2c1654]/10">
                <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                            OpenMarketly
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                            Admin
                        </span>
                    </Link>
                </div>
                
                <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4">
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
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

                    <div className="pt-4 border-t border-white/10 space-y-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <Home className="h-5 w-5 flex-shrink-0" />
                            View Storefront
                        </Link>
                        <button
                            onClick={() => console.log("Logout")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 text-left"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar/Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative flex flex-col w-64 max-w-xs bg-[#2c1654] text-white p-4 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                                OpenMarketly
                            </span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? "bg-amber-500 text-[#2c1654] font-semibold"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="pt-4 border-t border-white/10 space-y-1">
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <Home className="h-5 w-5" />
                                View Storefront
                            </Link>
                            <button
                                onClick={() => console.log("Logout")}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all text-left"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-[#2c1654]/10 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1 rounded-lg hover:bg-gray-100 md:hidden"
                        >
                            <Menu className="h-6 w-6 text-gray-600" />
                        </button>

                        <div className="relative hidden sm:block w-64 md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products, orders..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]/30 bg-[#f8f7fc] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2 rounded-xl hover:bg-gray-100 relative transition-colors"
                            >
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-amber-500 rounded-full border border-white" />
                            </button>
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                        <span className="font-semibold text-sm">Notifications</span>
                                        <button className="text-xs text-[#c8960c] hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                                            <p className="text-xs font-semibold">New Order #1048</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">By Shakil Ahmed • 2 mins ago</p>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                                            <p className="text-xs font-semibold">Product Stock Alert</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">Sony WH-1000XM5 is low in stock • 1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-[#2c1654]/10 flex items-center justify-center font-semibold text-[#2c1654]">
                                    A
                                </div>
                                <span className="text-sm font-medium hidden md:block">Admin</span>
                                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-800">admin@openmarketly.com</p>
                                    </div>
                                    <Link
                                        href="/dashboard/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => console.log("Logout")}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Pages Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f7fc]">
                    {children}
                </main>
            </div>
        </div>
    );
}
