"use client";

import React, { useState } from "react";
import { Eye, MoreVertical, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";
import { DashboardPageHeader, DashboardTable, SearchInput, TabFilter, StatusBadge } from "@/components/dashboard";

interface Order {
    id: string;
    customer: string;
    email: string;
    products: string;
    date: string;
    total: number;
    status: "Pending" | "Processing" | "Completed" | "Cancelled";
}

const TABS = ["All", "Pending", "Processing", "Completed", "Cancelled"];
const TABLE_HEADERS = ["Order ID", "Customer", "Products", "Date", "Total", "Status", "Actions"];
const TABLE_ALIGNS: ("left" | "right" | "center")[] = ["left", "left", "left", "left", "right", "left", "right"];

export default function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([
        { id: "ORD-1048", customer: "Shakil Ahmed", email: "shakil@example.com", products: "Sony WH-1000XM5 (x1)", date: "Jul 25, 2026", total: 28000, status: "Processing" },
        { id: "ORD-1047", customer: "Farhana Yasmin", email: "farhana@example.com", products: "Nike Air Max 270 (x2), Leather Backpack (x1)", date: "Jul 24, 2026", total: 28500, status: "Completed" },
        { id: "ORD-1046", customer: "Tanvir Rahman", email: "tanvir@example.com", products: "Modern Table Lamp (x1)", date: "Jul 24, 2026", total: 3200, status: "Pending" },
        { id: "ORD-1045", customer: "Nusrat Jahan", email: "nusrat@example.com", products: "Smart Watch Series 7 (x1), Leather Backpack (x1)", date: "Jul 23, 2026", total: 22500, status: "Completed" },
        { id: "ORD-1044", customer: "Rashedul Islam", email: "rashed@example.com", products: "Sony WH-1000XM5 (x1), Nike Air Max 270 (x1)", date: "Jul 22, 2026", total: 40000, status: "Cancelled" },
    ]);

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        setActiveDropdown(null);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || order.customer.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "All" || order.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <DashboardPageHeader title="Orders Management" subtitle="Track, filter, update, and manage all user orders." />

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <TabFilter tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                <SearchInput value={search} onChange={setSearch} placeholder="Search by Order ID or Customer..." className="w-full md:w-80" />
            </div>

            {/* Table */}
            <DashboardTable headers={TABLE_HEADERS} headerAligns={TABLE_ALIGNS} isEmpty={filteredOrders.length === 0} emptyMessage="No orders match your filters.">
                {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#2c1654]">{order.id}</td>
                        <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{order.customer}</div>
                            <div className="text-xs text-gray-400">{order.email}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-xs text-gray-700 line-clamp-1 max-w-[200px]" title={order.products}>{order.products}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">৳ {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-right relative">
                            <div className="flex items-center justify-end gap-2">
                                <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
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
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
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
            </DashboardTable>
        </div>
    );
}
