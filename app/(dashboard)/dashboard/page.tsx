"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllProductsQuery, useGetMyProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllWithdrawRequestsQuery, useGetMyWithdrawRequestsQuery } from "@/redux/features/withdraw/withdrawApi";
import { useGetVisitorStatsQuery } from "@/redux/features/visitor/visitorApi";
import { useGetAllDisputesQuery } from "@/redux/features/dispute/disputeApi";
import { useGetAllActivityLogsQuery } from "@/redux/features/activity/activityApi";
import {
    DollarSign,
    Package,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    Activity,
    AlertOctagon,
    Users,
    Clock,
    ShoppingBag
} from "lucide-react";

export default function DashboardOverview() {
    const user = useAppSelector(currentUser);

    // Dynamic checks
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    // 1. Admin/Super Admin Queries
    const { data: adminProducts } = useGetAllProductsQuery(undefined, { skip: !isAdmin });
    const { data: adminWithdraws } = useGetAllWithdrawRequestsQuery(undefined, { skip: !isAdmin });
    const { data: adminVisitors } = useGetVisitorStatsQuery(undefined, { skip: !isAdmin });
    const { data: adminDisputes } = useGetAllDisputesQuery(undefined, { skip: !isAdmin });
    const { data: adminLogs } = useGetAllActivityLogsQuery({ limit: 5 }, { skip: !isAdmin });

    // 2. Seller Queries
    const { data: sellerProducts } = useGetMyProductsQuery(undefined, { skip: isAdmin });
    const { data: sellerWithdraws } = useGetMyWithdrawRequestsQuery(undefined, { skip: isAdmin });

    if (!user) return null;

    if (isAdmin) {
        // --- ADMIN / SUPER ADMIN DASHBOARD ---
        const totalProducts = adminProducts?.data?.length || 0;
        const pendingApprovals = adminProducts?.data?.filter(p => p.approvalStatus === "PENDING").length || 0;
        const totalDisputes = adminDisputes?.data?.length || 0;
        const pendingDisputes = adminDisputes?.data?.filter(d => d.status === "PENDING").length || 0;
        const totalWithdrawRequests = adminWithdraws?.data?.length || 0;
        const uniqueVisitors = adminVisitors?.data?.uniqueVisitors || 0;

        const stats = [
            {
                name: "Unique Visitors",
                value: uniqueVisitors,
                change: "Realtime stats",
                trend: "up",
                icon: Users,
                color: "bg-emerald-500/10 text-emerald-600",
            },
            {
                name: "Platform Products",
                value: totalProducts,
                change: `${pendingApprovals} pending approval`,
                trend: "up",
                icon: Package,
                color: "bg-blue-500/10 text-blue-600",
            },
            {
                name: "Active Disputes",
                value: totalDisputes,
                change: `${pendingDisputes} unresolved`,
                trend: "down",
                icon: AlertOctagon,
                color: "bg-red-500/10 text-red-600",
            },
            {
                name: "Withdrawal Requests",
                value: totalWithdrawRequests,
                change: "From platform sellers",
                trend: "up",
                icon: DollarSign,
                color: "bg-purple-500/10 text-purple-600",
            },
        ];

        return (
            <div className="space-y-8 max-w-7xl mx-auto font-sans">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Platform Administration</h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Hello {user.name}, you are logged in as a <strong>{user.role}</strong>. Here is the platform activity log.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex items-start justify-between"
                        >
                            <div className="space-y-3">
                                <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logs and Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Logs */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Recent Platform Activity Logs</h2>
                            <Activity className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="divide-y divide-gray-100">
                            {adminLogs?.data && adminLogs.data.length > 0 ? (
                                adminLogs.data.map((log) => (
                                    <div key={log._id} className="py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                                            <p className="text-xs text-gray-500">Module: {log.module} {log.ipAddress && `• IP: ${log.ipAddress}`}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ""}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">No platform activity logs found.</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
                        <div className="space-y-4">
                            {adminProducts?.data?.filter(p => p.approvalStatus === "PENDING").slice(0, 4).map((product) => (
                                <div key={product._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {product.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center border border-gray-100">
                                                <Package className="h-6 w-6 text-[#2c1654]" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900 group-hover:text-[#2c1654] transition-colors line-clamp-1">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500">Price: ৳ {product.price}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                                            Pending
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {adminProducts?.data?.filter(p => p.approvalStatus === "PENDING").length === 0 && (
                                <p className="text-sm text-gray-400 py-6 text-center">All product listings approved.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // --- SELLER DASHBOARD ---
        const totalProducts = sellerProducts?.data?.length || 0;
        const totalWithdrawalsCount = sellerWithdraws?.data?.length || 0;
        const pendingWithdrawalsAmount = sellerWithdraws?.data
            ?.filter(w => w.status === "PENDING")
            ?.reduce((sum, curr) => sum + curr.amount, 0) || 0;

        const stats = [
            {
                name: "Your Payout Balance",
                value: `৳ ${user.balance || 0}`,
                change: "Available for withdrawal",
                trend: "up",
                icon: DollarSign,
                color: "bg-emerald-500/10 text-emerald-600",
            },
            {
                name: "Products Listed",
                value: totalProducts,
                change: "Active inventory",
                trend: "up",
                icon: Package,
                color: "bg-blue-500/10 text-blue-600",
            },
            {
                name: "Pending Cashout",
                value: `৳ ${pendingWithdrawalsAmount}`,
                change: "Awaiting approval",
                trend: "down",
                icon: Clock,
                color: "bg-amber-500/10 text-amber-600",
            },
            {
                name: "Payout Requests",
                value: totalWithdrawalsCount,
                change: "Lifetime payout counts",
                trend: "up",
                icon: ShoppingBag,
                color: "bg-purple-500/10 text-purple-600",
            },
        ];

        return (
            <div className="space-y-8 max-w-7xl mx-auto font-sans">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Seller Dashboard</h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Welcome back, {user.name}. Manage your inventory listings, earnings, and payout requests here.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex items-start justify-between"
                        >
                            <div className="space-y-3">
                                <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main section: product listing preview / payouts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Seller Products Preview */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Your Inventory Preview</h2>
                            <span className="text-xs text-gray-500">{totalProducts} active products</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {sellerProducts?.data && sellerProducts.data.length > 0 ? (
                                sellerProducts.data.slice(0, 5).map((product) => (
                                    <div key={product._id} className="py-3 flex justify-between items-center hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            {product.thumbnail ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={product.thumbnail} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-[#2c1654]/10 flex items-center justify-center text-[#2c1654]">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">Brand: {product.brand || "Generic"} • Stock: {product.stockQuantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">৳ {product.price}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                product.approvalStatus === "APPROVED"
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : product.approvalStatus === "PENDING"
                                                    ? "bg-amber-500/10 text-amber-600"
                                                    : "bg-red-500/10 text-red-600"
                                            }`}>
                                                {product.approvalStatus}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">You have not listed any products yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Seller Withdraws Preview */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Payout Requests</h2>
                        <div className="space-y-4">
                            {sellerWithdraws?.data && sellerWithdraws.data.length > 0 ? (
                                sellerWithdraws.data.slice(0, 4).map((request) => (
                                    <div key={request._id} className="flex justify-between items-center py-1">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">৳ {request.amount}</p>
                                            <p className="text-[10px] text-gray-500">{request.paymentMethod}</p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            request.status === "APPROVED"
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : request.status === "PENDING"
                                                ? "bg-amber-500/10 text-amber-600"
                                                : "bg-red-500/10 text-red-600"
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">No cashout requests raised yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
