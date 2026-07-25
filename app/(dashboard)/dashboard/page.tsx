"use client";

import React from "react";
import { 
    DollarSign, 
    ShoppingBag, 
    Users, 
    ArrowUpRight, 
    TrendingUp, 
    TrendingDown,
    PackageCheck
} from "lucide-react";
import { IMGS } from "@/components/types";

export default function DashboardOverview() {
    const stats = [
        {
            name: "Total Revenue",
            value: "৳ 128,450",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "bg-emerald-500/10 text-emerald-600",
        },
        {
            name: "Orders Received",
            value: "1,248",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingBag,
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            name: "Active Customers",
            value: "842",
            change: "-2.1%",
            trend: "down",
            icon: Users,
            color: "bg-amber-500/10 text-amber-600",
        },
        {
            name: "Items in Stock",
            value: "450",
            change: "+14.8%",
            trend: "up",
            icon: PackageCheck,
            color: "bg-purple-500/10 text-purple-600",
        },
    ];

    const recentOrders = [
        { id: "ORD-1048", customer: "Shakil Ahmed", email: "shakil@example.com", date: "Jul 25, 2026", status: "Processing", amount: "৳ 28,000" },
        { id: "ORD-1047", customer: "Farhana Yasmin", email: "farhana@example.com", date: "Jul 24, 2026", status: "Completed", amount: "৳ 4,500" },
        { id: "ORD-1046", customer: "Tanvir Rahman", email: "tanvir@example.com", date: "Jul 24, 2026", status: "Pending", amount: "৳ 1,200" },
        { id: "ORD-1045", customer: "Nusrat Jahan", email: "nusrat@example.com", date: "Jul 23, 2026", status: "Completed", amount: "৳ 12,400" },
        { id: "ORD-1044", customer: "Rashedul Islam", email: "rashed@example.com", date: "Jul 22, 2026", status: "Cancelled", amount: "৳ 8,900" },
    ];

    const topProducts = [
        { name: "Sony WH-1000XM5", image: IMGS.headphones, sales: 124, revenue: "৳ 3,472,000", price: "৳ 28,000" },
        { name: "Nike Air Max 270", image: IMGS.shoes, sales: 98, revenue: "৳ 1,176,000", price: "৳ 12,000" },
        { name: "Smart Watch Series 7", image: IMGS.watch, sales: 85, revenue: "৳ 1,530,000", price: "৳ 18,000" },
        { name: "Leather Backpack", image: IMGS.backpack, sales: 64, revenue: "৳ 288,000", price: "৳ 4,500" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Dashboard Overview</h1>
                <p className="mt-1.5 text-sm text-gray-500">
                    Welcome back, Admin. Here is what is happening with your store today.
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
                                <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    stat.trend === "up" 
                                        ? "bg-emerald-500/10 text-emerald-600" 
                                        : "bg-red-500/10 text-red-600"
                                }`}>
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="h-3 w-3 mr-0.5" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-0.5" />
                                    )}
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

            {/* Charts & Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <button className="flex items-center gap-1 text-xs font-semibold text-[#c8960c] hover:underline">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-xl">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 rounded-r-xl text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-semibold text-[#2c1654]">{order.id}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-[11px] text-gray-400">{order.email}</div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-gray-600">{order.date}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                order.status === "Completed"
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : order.status === "Processing"
                                                    ? "bg-blue-500/10 text-blue-600"
                                                    : order.status === "Pending"
                                                    ? "bg-amber-500/10 text-amber-600"
                                                    : "bg-red-500/10 text-red-600"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-medium text-gray-900">{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
                    <div className="space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                                    />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900 group-hover:text-[#2c1654] transition-colors line-clamp-1">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500">{product.sales} sales • {product.price}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xs text-[#c8960c]">{product.revenue}</div>
                                    <div className="text-[10px] text-gray-400">total rev</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
