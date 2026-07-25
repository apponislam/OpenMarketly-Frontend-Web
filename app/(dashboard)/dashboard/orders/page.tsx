"use client";

import React, { useState } from "react";
import { 
    Search, 
    Eye, 
    MoreVertical,
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronDown
} from "lucide-react";

interface Order {
    id: string;
    customer: string;
    email: string;
    products: string;
    date: string;
    total: number;
    status: "Pending" | "Processing" | "Completed" | "Cancelled";
}

export default function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([
        { id: "ORD-1048", customer: "Shakil Ahmed", email: "shakil@example.com", products: "Sony WH-1000XM5 (x1)", date: "Jul 25, 2026", total: 28000, status: "Processing" },
        { id: "ORD-1047", customer: "Farhana Yasmin", email: "farhana@example.com", products: "Nike Air Max 270 (x2), Leather Backpack (x1)", date: "Jul 24, 2026", total: 28500, status: "Completed" },
        { id: "ORD-1046", customer: "Tanvir Rahman", email: "tanvir@example.com", products: "Modern Table Lamp (x1)", date: "Jul 24, 2026", total: 3200, status: "Pending" },
        { id: "ORD-1045", customer: "Nusrat Jahan", email: "nusrat@example.com", products: "Smart Watch Series 7 (x1), Leather Backpack (x1)", date: "Jul 23, 2026", total: 22500, status: "Completed" },
        { id: "ORD-1044", customer: "Rashedul Islam", email: "rashed@example.com", products: "Sony WH-1000XM5 (x1), Nike Air Max 270 (x1)", date: "Jul 22, 2026", total: 40000, status: "Cancelled" },
    ]);

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Processing" | "Completed" | "Cancelled">("All");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setActiveDropdown(null);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                             order.customer.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "All" || order.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "Completed": return <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />;
            case "Processing": return <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />;
            case "Pending": return <Clock className="h-4 w-4 mr-1 text-amber-500" />;
            case "Cancelled": return <XCircle className="h-4 w-4 mr-1 text-red-500" />;
        }
    };

    const getStatusStyles = (status: Order["status"]) => {
        switch (status) {
            case "Completed": return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25";
            case "Processing": return "bg-blue-500/10 text-blue-600 border border-blue-500/25";
            case "Pending": return "bg-amber-500/10 text-amber-600 border border-amber-500/25";
            case "Cancelled": return "bg-red-500/10 text-red-600 border border-red-500/25";
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Orders Management</h1>
                <p className="mt-1.5 text-sm text-gray-500">
                    Track, filter, update, and manage all user orders.
                </p>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {(["All", "Pending", "Processing", "Completed", "Cancelled"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                activeTab === tab
                                    ? "bg-[#2c1654] text-white shadow-md shadow-[#2c1654]/10"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]/30 bg-[#f8f7fc] transition-colors"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Products</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right rounded-r-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-[#2c1654]">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{order.customer}</div>
                                        <div className="text-xs text-gray-400">{order.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-700 line-clamp-1 max-w-[200px]" title={order.products}>
                                            {order.products}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600">{order.date}</td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">৳ {order.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                                <Eye className="h-4.5 w-4.5" />
                                            </button>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                                                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <MoreVertical className="h-4.5 w-4.5" />
                                                </button>
                                                
                                                {activeDropdown === order.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-100">
                                                        <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-gray-400">Update Status</div>
                                                        {(["Pending", "Processing", "Completed", "Cancelled"] as const).map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(order.id, status)}
                                                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center"
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
