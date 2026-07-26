"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, logOut } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    Menu,
    X,
    Bell,
    ChevronDown,
    LogOut,
    Home,
    AlertOctagon,
    History,
    CreditCard,
    Tag,
    Image,
    MessageSquare,
    HelpCircle
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [logoutApi] = useLogoutMutation();

    const user = useAppSelector(currentUser);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    // Redirect guest users or customers
    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        } else if (user.role === "CUSTOMER") {
            router.push("/");
        } else {
            setAuthorized(true);
        }
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            dispatch(logOut());
            router.push("/auth/login");
        }
    };

    if (!authorized || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#090514]">
                <div className="w-8 h-8 border-4 border-[#c8960c] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

    // Setup dynamic navigation based on user roles
    const navigation = isAdmin
        ? [
              { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { name: "Products", href: "/dashboard/products", icon: Package },
              { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
              { name: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
              { name: "Disputes & Tickets", href: "/dashboard/disputes", icon: AlertOctagon },
              { name: "Banners", href: "/dashboard/banners", icon: Image },
              { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
              { name: "Feedbacks", href: "/dashboard/feedbacks", icon: MessageSquare },
              { name: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
              { name: "Activity Logs", href: "/dashboard/activity", icon: History },
              { name: "Settings", href: "/dashboard/settings", icon: Settings },
          ]
        : [
              { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { name: "My Products", href: "/dashboard/products", icon: Package },
              { name: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
              { name: "Settings", href: "/dashboard/settings", icon: Settings },
          ];

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
                            {user.role}
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
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 text-left cursor-pointer"
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
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all text-left cursor-pointer"
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
                            className="p-1 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
                        >
                            <Menu className="h-6 w-6 text-gray-600" />
                        </button>

                        <div className="text-sm font-semibold text-gray-700 hidden sm:block">
                            Dashboard Workspace
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                {user.profileImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-[#2c1654]/10 flex items-center justify-center font-semibold text-[#2c1654] uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden md:block">{user.name}</span>
                                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold">{user.role}</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
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
