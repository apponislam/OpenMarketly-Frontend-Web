"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useGetAdminDashboardStatsQuery,
    useGetSellerDashboardStatsQuery,
} from "@/redux/features/dashboard/dashboardApi";
import { useGetAllActivityLogsQuery } from "@/redux/features/activity/activityApi";
import { DollarSign, Package, Users, Clock, ShoppingBag, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { DashboardPageHeader, StatCard, StatusBadge, DashboardCard } from "@/components/dashboard";

export default function DashboardOverview() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    if (!user) return null;

    if (isAdmin) {
        return <AdminOverview user={user} />;
    }

    return <SellerOverview user={user} />;
}

// --- Admin Overview ---
function AdminOverview({ user }: { user: any }) {
    const { data: adminStatsData, isLoading } = useGetAdminDashboardStatsQuery();
    const { data: adminLogs } = useGetAllActivityLogsQuery({ limit: 5 });

    const statsData = adminStatsData?.data;
    const userStats = statsData?.userStats;
    const productStats = statsData?.productStats;
    const orderStats = statsData?.orderStats;
    const withdrawStats = statsData?.withdrawStats;

    const totalRevenueFormatted = Number(orderStats?.totalRevenue || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const totalCommissionFormatted = Number(orderStats?.totalCommission || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const stats = [
        { name: "Total Platform Revenue", value: `৳ ${totalRevenueFormatted}`, change: "Paid marketplace orders", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Admin Commission", value: `৳ ${totalCommissionFormatted}`, change: "Platform earnings", icon: DollarSign, color: "bg-purple-500/10 text-purple-600" },
        { name: "Platform Sellers", value: userStats?.totalSellers || 0, change: `${userStats?.totalCustomers || 0} registered buyers`, icon: Users, color: "bg-blue-500/10 text-blue-600" },
        { name: "Products Listed", value: productStats?.totalProducts || 0, change: `${productStats?.pending || 0} pending approval`, icon: Package, color: "bg-amber-500/10 text-amber-600" },
    ];

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Platform Administration"
                subtitle={`Hello ${user.name}, logged in as ${user.role}. Overview of backend sales, users, and marketplace activity.`}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Activity + Recent Signups Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <DashboardCard title="Recent Platform Activity Logs" headerRight={<Activity className="h-5 w-5 text-gray-400" />} className="lg:col-span-2">
                    <div className="divide-y divide-gray-100">
                        {adminLogs?.data && adminLogs.data.length > 0 ? (
                            adminLogs.data.map((log: any) => (
                                <div key={log._id} className="py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                                        <p className="text-xs text-gray-500">Module: {log.module} {log.ipAddress && `• IP: ${log.ipAddress}`}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ""}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-6 text-center">No platform activity logs found.</p>
                        )}
                    </div>
                </DashboardCard>

                <DashboardCard title="Recent Seller & User Signups">
                    <div className="space-y-4">
                        {statsData?.recentSignups && statsData.recentSignups.length > 0 ? (
                            statsData.recentSignups.map((u: any) => (
                                <div key={u._id} className="flex items-center justify-between group py-1">
                                    <div className="flex items-center gap-3">
                                        {u.profileImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={u.profileImage} alt={u.name} className="h-9 w-9 rounded-full object-cover border border-gray-100" />
                                        ) : (
                                            <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#2c1654] text-xs uppercase">
                                                {u.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-xs text-gray-900 line-clamp-1">{u.name}</p>
                                            <p className="text-[10px] text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#2c1654]">
                                        {u.role}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-6 text-center font-medium">No recent user registrations.</p>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}

// --- Seller Overview ---
function SellerOverview({ user }: { user: any }) {
    const { data: sellerStatsData } = useGetSellerDashboardStatsQuery();
    const statsData = sellerStatsData?.data;

    const formattedBalance = Number(user.balance || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedEarnings = Number(statsData?.storeSales || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedPendingCashout = Number(statsData?.withdrawStats?.pending || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const stats = [
        { name: "Available Payout Balance", value: `৳ ${formattedBalance}`, change: "Ready for withdrawal", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Total Store Sales", value: `৳ ${formattedEarnings}`, change: `${statsData?.totalOrders || 0} orders fulfilled`, icon: TrendingUp, color: "bg-[#2c1654]/10 text-[#2c1654]" },
        { name: "Products Listed", value: statsData?.totalProducts || 0, change: "Active inventory", icon: Package, color: "bg-blue-500/10 text-blue-600" },
        { name: "Pending Cashout", value: `৳ ${formattedPendingCashout}`, change: "Awaiting admin approval", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
    ];

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Seller Dashboard"
                subtitle={`Welcome back, ${user.name}. Manage inventory, total store sales earnings, and cashout requests.`}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders containing Seller's Products */}
                <DashboardCard title="Recent Store Orders" headerRight={<ShoppingBag className="h-5 w-5 text-gray-400" />} className="lg:col-span-2">
                    <div className="divide-y divide-gray-100">
                        {statsData?.recentOrders && statsData.recentOrders.length > 0 ? (
                            statsData.recentOrders.map((ord: any) => (
                                <div key={ord._id} className="py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900">Order #{ord._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500">
                                            Buyer: {ord.user?.name || "Customer"} • {ord.items?.length || 0} items
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-black text-gray-900">৳ {ord.totalPrice?.toLocaleString()}</p>
                                        <StatusBadge status={ord.orderStatus} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-8 text-center font-medium">No order activity recorded yet.</p>
                        )}
                    </div>
                </DashboardCard>

                {/* Low Stock Inventory Alerts */}
                <DashboardCard title="Low Stock Inventory Alerts" headerRight={<AlertTriangle className="h-5 w-5 text-amber-500" />}>
                    <div className="space-y-3">
                        {statsData?.lowStockAlerts && statsData.lowStockAlerts.length > 0 ? (
                            statsData.lowStockAlerts.map((prod: any) => (
                                <div key={prod._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        {prod.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={prod.thumbnail} alt={prod.name} className="h-9 w-9 rounded-lg object-cover" />
                                        ) : (
                                            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center text-[#2c1654]">
                                                <Package className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                                            <p className="text-[10px] text-gray-500">৳ {prod.price}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                        {prod.stockQuantity} left
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 p-4 rounded-xl text-center">
                                All inventory stock levels are healthy!
                            </p>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
