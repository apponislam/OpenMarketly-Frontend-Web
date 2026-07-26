"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, logOut } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { DashboardSidebar, DashboardTopbar } from "@/components/dashboard";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    AlertOctagon,
    History,
    CreditCard,
    Tag,
    Image,
    MessageSquare,
    HelpCircle,
    ShieldCheck,
    FolderTree,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [logoutApi] = useLogoutMutation();
    const user = useAppSelector(currentUser);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);

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
        try { await logoutApi().unwrap(); }
        catch (err) { console.error("Logout failed:", err); }
        finally { dispatch(logOut()); router.push("/auth/login"); }
    };

    if (!authorized || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#090514]">
                <div className="w-8 h-8 border-4 border-[#c8960c] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";

    const navigation = isAdmin
        ? [
              { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
              { name: "Products", href: "/dashboard/products", icon: Package },
              { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
              { name: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
              { name: "Disputes & Tickets", href: "/dashboard/disputes", icon: AlertOctagon },
              { name: "Banners", href: "/dashboard/banners", icon: Image },
              { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
              { name: "Feedbacks", href: "/dashboard/feedbacks", icon: MessageSquare },
              { name: "Policies", href: "/dashboard/policies", icon: ShieldCheck },
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
            {/* Desktop Sidebar */}
            <DashboardSidebar navigation={navigation} userRole={user.role} onLogout={handleLogout} />

            {/* Mobile Sidebar Drawer */}
            <DashboardSidebar
                navigation={navigation}
                userRole={user.role}
                onLogout={handleLogout}
                mobile
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardTopbar
                    user={user}
                    onMenuToggle={() => setSidebarOpen(true)}
                    onLogout={handleLogout}
                />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f7fc]">
                    {children}
                </main>
            </div>
        </div>
    );
}
