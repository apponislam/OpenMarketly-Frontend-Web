"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
    useGetSingleUserQuery,
    useGetUserProductsQuery,
    useGetUserOrdersQuery,
    useGetUserActivitiesQuery,
    useGetUserNotificationsQuery,
    useGetUserRatingsQuery,
} from "@/redux/features/user/userApi";
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    Wallet,
    Key,
    UserCog,
    Package,
    ShoppingCart,
    Activity,
    Bell,
    Star,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { DashboardPageHeader, DashboardCard, StatusBadge } from "@/components/dashboard";
import { ChangeRoleModal, SetPasswordModal } from "@/components/dashboard/users";

export default function SingleUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"products" | "orders" | "activities" | "notifications" | "ratings">("products");

    // Modal states
    const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
    const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);

    // Queries
    const { data: userData, isLoading: loadingUser, refetch: refetchUser } = useGetSingleUserQuery(id);
    const user = userData?.data;

    const { data: productsData, isLoading: loadingProducts } = useGetUserProductsQuery({ userId: id }, { skip: activeTab !== "products" });
    const { data: ordersData, isLoading: loadingOrders } = useGetUserOrdersQuery({ userId: id }, { skip: activeTab !== "orders" });
    const { data: activitiesData, isLoading: loadingActivities } = useGetUserActivitiesQuery({ userId: id }, { skip: activeTab !== "activities" });
    const { data: notificationsData, isLoading: loadingNotifications } = useGetUserNotificationsQuery({ userId: id }, { skip: activeTab !== "notifications" });
    const { data: ratingsData, isLoading: loadingRatings } = useGetUserRatingsQuery({ userId: id }, { skip: activeTab !== "ratings" });

    const products = productsData?.data || [];
    const orders = ordersData?.data || [];
    const activities = activitiesData?.data || [];
    const notifications = notificationsData?.data || [];
    const ratings = ratingsData?.data || [];

    if (loadingUser) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#2c1654] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-16 space-y-4">
                <p className="text-gray-500 text-sm font-semibold">User account not found.</p>
                <button
                    onClick={() => router.push("/dashboard/users")}
                    className="px-4 py-2 bg-[#2c1654] text-white text-xs font-bold rounded-xl"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 container mx-auto font-sans pb-16">
            {/* Page Header */}
            <div>
                <button
                    onClick={() => router.push("/dashboard/users")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#2c1654] transition-colors mb-3 cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Users Management
                </button>
                <DashboardPageHeader
                    title={`User Details: ${user.name}`}
                    subtitle={`ID: ${user._id} • ${user.email}`}
                    action={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsChangeRoleOpen(true)}
                                className="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <UserCog className="w-4 h-4" />
                                Change Role
                            </button>
                            <button
                                onClick={() => setIsSetPasswordOpen(true)}
                                className="px-3.5 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Key className="w-4 h-4" />
                                Set Password
                            </button>
                        </div>
                    }
                />
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2c1654] to-[#4a2b8c] text-amber-400 font-black text-2xl flex items-center justify-center shadow-md">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-xl font-bold text-gray-950">{user.name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    user.role === "SUPER_ADMIN"
                                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                                        : user.role === "ADMIN"
                                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                                        : user.role === "SELLER"
                                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                                        : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}>
                                    {user.role}
                                </span>
                                <StatusBadge status={(user as any).isBanned ? "BANNED" : user.isActive ? "ACTIVE" : "INACTIVE"} />
                            </div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-purple-500" />
                                {user.email}
                            </p>
                            {user.phone && (
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                    {user.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-purple-100 pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto text-xs">
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Balance</span>
                            <p className="font-bold text-gray-900 flex items-center gap-1">
                                <Wallet className="w-3.5 h-3.5 text-amber-500" />
                                ৳{user.balance ?? 0}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Joined Date</span>
                            <p className="font-bold text-gray-900 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Last Login</span>
                            <p className="font-bold text-gray-900 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-resources Tabs & Content */}
            <DashboardCard
                title="User Sub-Resources & Records"
                headerRight={
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {[
                            { key: "products", label: "Products", icon: Package },
                            { key: "orders", label: "Orders", icon: ShoppingCart },
                            { key: "activities", label: "Activities", icon: Activity },
                            { key: "notifications", label: "Notifications", icon: Bell },
                            { key: "ratings", label: "Ratings", icon: Star },
                        ].map((t) => {
                            const Icon = t.icon;
                            const isActive = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key as any)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        isActive
                                            ? "bg-[#2c1654] text-white shadow-md shadow-purple-900/10"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                }
                className="space-y-4"
            >
                <div className="min-h-[250px]">
                    {/* Products Tab */}
                    {activeTab === "products" && (
                        loadingProducts ? (
                            <p className="text-xs text-gray-400 py-12 text-center">Loading products...</p>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {products.map((p: any) => (
                                    <div key={p._id} className="p-4 border border-purple-100/80 rounded-2xl bg-[#f8f7fc] space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold uppercase text-[#2c1654] bg-purple-100 px-2 py-0.5 rounded">
                                                {p.category?.name || "Product"}
                                            </span>
                                            <StatusBadge status={p.approvalStatus || p.status || "UNKNOWN"} />
                                        </div>
                                        <h4 className="font-bold text-sm text-gray-950">{p.name || p.title}</h4>
                                        <p className="text-xs text-gray-500">Price: ৳{p.price} • Stock: {p.stock}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-12 text-center">No products associated with this user.</p>
                        )
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        loadingOrders ? (
                            <p className="text-xs text-gray-400 py-12 text-center">Loading orders...</p>
                        ) : orders.length > 0 ? (
                            <div className="space-y-2.5">
                                {orders.map((o: any) => (
                                    <div key={o._id} className="p-4 border border-purple-100/80 rounded-2xl bg-[#f8f7fc] flex items-center justify-between text-xs">
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-900">Order #{o.orderId || o._id}</p>
                                            <p className="text-gray-500">Items: {o.items?.length || 1} • Total: ৳{o.totalAmount || o.totalPrice}</p>
                                        </div>
                                        <StatusBadge status={o.orderStatus || o.status || "PENDING"} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-12 text-center">No orders associated with this user.</p>
                        )
                    )}

                    {/* Activities Tab */}
                    {activeTab === "activities" && (
                        loadingActivities ? (
                            <p className="text-xs text-gray-400 py-12 text-center">Loading activity logs...</p>
                        ) : activities.length > 0 ? (
                            <div className="space-y-2.5">
                                {activities.map((a: any) => (
                                    <div key={a._id} className="p-4 border border-purple-100/80 rounded-2xl bg-[#f8f7fc] text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#2c1654] uppercase text-[10px] bg-purple-100 px-2 py-0.5 rounded">
                                                {a.actionType || a.type || "ACTIVITY"}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 font-medium">{a.description || a.details}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-12 text-center">No activity logs recorded for this user.</p>
                        )
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        loadingNotifications ? (
                            <p className="text-xs text-gray-400 py-12 text-center">Loading notifications...</p>
                        ) : notifications.length > 0 ? (
                            <div className="space-y-2.5">
                                {notifications.map((n: any) => (
                                    <div key={n._id} className="p-4 border border-purple-100/80 rounded-2xl bg-[#f8f7fc] text-xs space-y-1">
                                        <p className="font-bold text-gray-900">{n.title}</p>
                                        <p className="text-gray-600">{n.message || n.body}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-12 text-center">No notifications found for this user.</p>
                        )
                    )}

                    {/* Ratings Tab */}
                    {activeTab === "ratings" && (
                        loadingRatings ? (
                            <p className="text-xs text-gray-400 py-12 text-center">Loading ratings...</p>
                        ) : ratings.length > 0 ? (
                            <div className="space-y-2.5">
                                {ratings.map((r: any) => (
                                    <div key={r._id} className="p-4 border border-purple-100/80 rounded-2xl bg-[#f8f7fc] text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-amber-600 flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r.rating} / 5
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
                            <p className="text-xs text-gray-400 py-12 text-center">No ratings submitted by this user.</p>
                        )
                    )}
                </div>
            </DashboardCard>

            {/* Modals */}
            <ChangeRoleModal
                user={user}
                open={isChangeRoleOpen}
                onClose={() => setIsChangeRoleOpen(false)}
                onSuccess={() => refetchUser()}
            />

            <SetPasswordModal
                user={isSetPasswordOpen ? user : null}
                onClose={() => setIsSetPasswordOpen(false)}
            />
        </div>
    );
}
