"use client";

import React, { useState } from "react";
import { Modal, StatusBadge } from "@/components/dashboard";
import {
    useGetUserProductsQuery,
    useGetUserOrdersQuery,
    useGetUserActivitiesQuery,
    useGetUserNotificationsQuery,
    useGetUserRatingsQuery,
} from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/auth/authSlice";
import { Package, ShoppingCart, Activity, Bell, Star } from "lucide-react";

interface UserSubResourceInspectorModalProps {
    user: TUser | null;
    onClose: () => void;
}

export function UserSubResourceInspectorModal({ user, onClose }: UserSubResourceInspectorModalProps) {
    const [activeTab, setActiveTab] = useState<"products" | "orders" | "activities" | "notifications" | "ratings">("products");

    const userId = user?._id || "";

    const { data: productsData, isLoading: loadingProducts } = useGetUserProductsQuery({ userId }, { skip: !user || activeTab !== "products" });
    const { data: ordersData, isLoading: loadingOrders } = useGetUserOrdersQuery({ userId }, { skip: !user || activeTab !== "orders" });
    const { data: activitiesData, isLoading: loadingActivities } = useGetUserActivitiesQuery({ userId }, { skip: !user || activeTab !== "activities" });
    const { data: notificationsData, isLoading: loadingNotifications } = useGetUserNotificationsQuery({ userId }, { skip: !user || activeTab !== "notifications" });
    const { data: ratingsData, isLoading: loadingRatings } = useGetUserRatingsQuery({ userId }, { skip: !user || activeTab !== "ratings" });

    if (!user) return null;

    const products = productsData?.data || [];
    const orders = ordersData?.data || [];
    const activities = activitiesData?.data || [];
    const notifications = notificationsData?.data || [];
    const ratings = ratingsData?.data || [];

    return (
        <Modal open={true} onClose={onClose} title={`Inspector: ${user.name} (${user.role})`}>
            <div className="space-y-4 max-w-2xl mx-auto">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 border-b pb-2 overflow-x-auto">
                    {[
                        { key: "products", label: "Products", icon: Package, count: products.length },
                        { key: "orders", label: "Orders", icon: ShoppingCart, count: orders.length },
                        { key: "activities", label: "Activities", icon: Activity, count: activities.length },
                        { key: "notifications", label: "Notifications", icon: Bell, count: notifications.length },
                        { key: "ratings", label: "Ratings", icon: Star, count: ratings.length },
                    ].map((t) => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                    isActive ? "bg-[#2c1654] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Display */}
                <div className="max-h-96 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {/* Products Tab */}
                    {activeTab === "products" && (
                        loadingProducts ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading products...</p>
                        ) : products.length > 0 ? (
                            <div className="space-y-2">
                                {products.map((p: any) => (
                                    <div key={p._id} className="p-3 border rounded-xl bg-purple-50/20 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-gray-900">{p.name || p.title}</p>
                                            <p className="text-[11px] text-gray-500">Price: ৳{p.price} | Stock: {p.stock}</p>
                                        </div>
                                        <StatusBadge status={p.approvalStatus || p.status || "UNKNOWN"} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-8 text-center">No products found for this user.</p>
                        )
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        loadingOrders ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading orders...</p>
                        ) : orders.length > 0 ? (
                            <div className="space-y-2">
                                {orders.map((o: any) => (
                                    <div key={o._id} className="p-3 border rounded-xl bg-purple-50/20 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-gray-900">Order #{o.orderId || o._id?.substring(0, 8)}</p>
                                            <p className="text-[11px] text-gray-500">Total: ৳{o.totalAmount || o.totalPrice}</p>
                                        </div>
                                        <StatusBadge status={o.orderStatus || o.status || "PENDING"} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-8 text-center">No orders found for this user.</p>
                        )
                    )}

                    {/* Activities Tab */}
                    {activeTab === "activities" && (
                        loadingActivities ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading activities...</p>
                        ) : activities.length > 0 ? (
                            <div className="space-y-2">
                                {activities.map((a: any) => (
                                    <div key={a._id} className="p-3 border rounded-xl bg-purple-50/20 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#2c1654] uppercase text-[10px] bg-purple-100 px-2 py-0.5 rounded">
                                                {a.actionType || a.type || "ACTIVITY"}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{a.description || a.details}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-8 text-center">No activity logs recorded.</p>
                        )
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        loadingNotifications ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading notifications...</p>
                        ) : notifications.length > 0 ? (
                            <div className="space-y-2">
                                {notifications.map((n: any) => (
                                    <div key={n._id} className="p-3 border rounded-xl bg-purple-50/20 text-xs space-y-1">
                                        <p className="font-bold text-gray-900">{n.title}</p>
                                        <p className="text-gray-600">{n.message || n.body}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-8 text-center">No notifications found.</p>
                        )
                    )}

                    {/* Ratings Tab */}
                    {activeTab === "ratings" && (
                        loadingRatings ? (
                            <p className="text-xs text-gray-400 py-8 text-center">Loading ratings...</p>
                        ) : ratings.length > 0 ? (
                            <div className="space-y-2">
                                {ratings.map((r: any) => (
                                    <div key={r._id} className="p-3 border rounded-xl bg-purple-50/20 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-amber-600 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400" /> {r.rating} / 5
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{r.comment || r.review}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-8 text-center">No ratings submitted by this user.</p>
                        )
                    )}
                </div>
            </div>
        </Modal>
    );
}
