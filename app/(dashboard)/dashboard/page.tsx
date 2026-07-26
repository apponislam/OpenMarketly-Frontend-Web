"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllProductsQuery, useGetMyProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllWithdrawRequestsQuery, useGetMyWithdrawRequestsQuery } from "@/redux/features/withdraw/withdrawApi";
import { useGetVisitorStatsQuery } from "@/redux/features/visitor/visitorApi";
import { useGetAllDisputesQuery } from "@/redux/features/dispute/disputeApi";
import { useGetAllActivityLogsQuery } from "@/redux/features/activity/activityApi";
import { DollarSign, Package, AlertOctagon, Users, Clock, ShoppingBag, Activity } from "lucide-react";
import { DashboardPageHeader, StatCard, StatusBadge, DashboardCard } from "@/components/dashboard";

export default function DashboardOverview() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    // Admin queries
    const { data: adminProducts } = useGetAllProductsQuery(undefined, { skip: !isAdmin });
    const { data: adminWithdraws } = useGetAllWithdrawRequestsQuery(undefined, { skip: !isAdmin });
    const { data: adminVisitors } = useGetVisitorStatsQuery(undefined, { skip: !isAdmin });
    const { data: adminDisputes } = useGetAllDisputesQuery(undefined, { skip: !isAdmin });
    const { data: adminLogs } = useGetAllActivityLogsQuery({ limit: 5 }, { skip: !isAdmin });

    // Seller queries
    const { data: sellerProducts } = useGetMyProductsQuery(undefined, { skip: isAdmin });
    const { data: sellerWithdraws } = useGetMyWithdrawRequestsQuery(undefined, { skip: isAdmin });

    if (!user) return null;

    if (isAdmin) {
        return <AdminOverview user={user} products={adminProducts} withdraws={adminWithdraws} visitors={adminVisitors} disputes={adminDisputes} logs={adminLogs} />;
    }

    return <SellerOverview user={user} products={sellerProducts} withdraws={sellerWithdraws} />;
}

// --- Admin Overview ---
function AdminOverview({ user, products, withdraws, visitors, disputes, logs }: any) {
    const totalProducts = products?.data?.length || 0;
    const pendingApprovals = products?.data?.filter((p: any) => p.approvalStatus === "PENDING").length || 0;
    const totalDisputes = disputes?.data?.length || 0;
    const pendingDisputes = disputes?.data?.filter((d: any) => d.status === "PENDING").length || 0;
    const totalWithdrawRequests = withdraws?.data?.length || 0;
    const uniqueVisitors = visitors?.data?.uniqueVisitors || 0;

    const stats = [
        { name: "Unique Visitors", value: uniqueVisitors, change: "Realtime stats", icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Platform Products", value: totalProducts, change: `${pendingApprovals} pending approval`, icon: Package, color: "bg-blue-500/10 text-blue-600" },
        { name: "Active Disputes", value: totalDisputes, change: `${pendingDisputes} unresolved`, icon: AlertOctagon, color: "bg-red-500/10 text-red-600" },
        { name: "Withdrawal Requests", value: totalWithdrawRequests, change: "From platform sellers", icon: DollarSign, color: "bg-purple-500/10 text-purple-600" },
    ];

    const pendingProducts = products?.data?.filter((p: any) => p.approvalStatus === "PENDING").slice(0, 4) || [];

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Platform Administration"
                subtitle={`Hello ${user.name}, you are logged in as a ${user.role}. Here is the platform activity overview.`}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Activity + Pending grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <DashboardCard title="Recent Platform Activity Logs" headerRight={<Activity className="h-5 w-5 text-gray-400" />} className="lg:col-span-2">
                    <div className="divide-y divide-gray-100">
                        {logs?.data && logs.data.length > 0 ? (
                            logs.data.map((log: any) => (
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

                <DashboardCard title="Pending Approvals">
                    <div className="space-y-4">
                        {pendingProducts.length > 0 ? (
                            pendingProducts.map((product: any) => (
                                <div key={product._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {product.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={product.thumbnail} alt={product.name} className="h-12 w-12 rounded-xl object-cover border border-gray-100" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center border border-gray-100">
                                                <Package className="h-6 w-6 text-[#2c1654]" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900 group-hover:text-[#2c1654] transition-colors line-clamp-1">{product.name}</div>
                                            <div className="text-xs text-gray-500">Price: ৳ {product.price?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <StatusBadge status="PENDING" />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-6 text-center">All product listings approved.</p>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}

// --- Seller Overview ---
function SellerOverview({ user, products, withdraws }: any) {
    const totalProducts = products?.data?.length || 0;
    const totalWithdrawalsCount = withdraws?.data?.length || 0;
    const pendingWithdrawalsAmount = withdraws?.data?.filter((w: any) => w.status === "PENDING")?.reduce((sum: number, curr: any) => sum + curr.amount, 0) || 0;

    const formattedBalance = Number(user.balance || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedPendingCashout = Number(pendingWithdrawalsAmount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const stats = [
        { name: "Your Payout Balance", value: `৳ ${formattedBalance}`, change: "Available for withdrawal", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Products Listed", value: totalProducts, change: "Active inventory", icon: Package, color: "bg-blue-500/10 text-blue-600" },
        { name: "Pending Cashout", value: `৳ ${formattedPendingCashout}`, change: "Awaiting approval", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
        { name: "Payout Requests", value: totalWithdrawalsCount, change: "Lifetime payout counts", icon: ShoppingBag, color: "bg-purple-500/10 text-purple-600" },
    ];

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Seller Dashboard"
                subtitle={`Welcome back, ${user.name}. Manage your inventory listings, earnings, and payout requests here.`}
            />

            {/* Stats Grid - Full Width */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Preview sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <DashboardCard title="Your Inventory Preview" headerRight={<span className="text-xs text-gray-500 font-semibold">{totalProducts} active products</span>} className="lg:col-span-2">
                    <div className="divide-y divide-gray-100">
                        {products?.data && products.data.length > 0 ? (
                            products.data.slice(0, 5).map((product: any) => (
                                <div key={product._id} className="py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                    <div className="flex items-center gap-3.5">
                                        {product.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={product.thumbnail} alt={product.name} className="h-11 w-11 rounded-xl object-cover border border-gray-100" />
                                        ) : (
                                            <div className="h-11 w-11 rounded-xl bg-[#2c1654]/10 flex items-center justify-center text-[#2c1654]">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">Brand: {product.brand || "Generic"} • Stock: {product.stockQuantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-black text-gray-900">৳ {product.price?.toLocaleString()}</p>
                                        <StatusBadge status={product.approvalStatus} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-8 text-center">You have not listed any products yet.</p>
                        )}
                    </div>
                </DashboardCard>

                <DashboardCard title="Recent Payout Requests">
                    <div className="space-y-4">
                        {withdraws?.data && withdraws.data.length > 0 ? (
                            withdraws.data.slice(0, 4).map((request: any) => (
                                <div key={request._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">৳ {request.amount?.toLocaleString()}</p>
                                        <p className="text-[10px] font-semibold text-gray-400">{request.paymentMethod}</p>
                                    </div>
                                    <StatusBadge status={request.status} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 py-8 text-center">No cashout requests raised yet.</p>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
