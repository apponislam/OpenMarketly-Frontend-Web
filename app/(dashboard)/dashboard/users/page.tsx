"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserStatsQuery, useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/auth/authSlice";
import { useLazyLoad } from "@/utils/lazyLoad";
import { Users, UserCheck, UserPlus, Shield, Package, Search } from "lucide-react";
import { DashboardPageHeader, StatCard, DashboardCard } from "@/components/dashboard";
import {
    CreateAdminModal,
    SetPasswordModal,
    ChangeRoleModal,
    UserSubResourceInspectorModal,
    UsersTable,
} from "@/components/dashboard/users";

export default function UsersManagementPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("ALL");

    // Modals state
    const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
    const [passwordModalUser, setPasswordModalUser] = useState<TUser | null>(null);
    const [roleModalUser, setRoleModalUser] = useState<TUser | null>(null);
    const [detailUser, setDetailUser] = useState<TUser | null>(null);

    // RTK Queries
    const { data: statsData } = useGetUserStatsQuery();
    const stats = statsData?.data || {};

    const { data: usersData, isFetching, refetch } = useGetAllUsersQuery({
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: selectedRole !== "ALL" ? selectedRole : undefined,
    });

    // Lazy load hook for Users table
    const {
        items: allUsers,
        totalCount,
        hasNextPage,
        scrollContainerRef,
        loadMoreRef,
        reset,
    } = useLazyLoad<TUser>({
        data: usersData?.data,
        meta: usersData?.meta,
        isFetching,
        searchQuery: search + selectedRole,
        page,
        onPageChange: setPage,
    });

    const handleRefresh = () => {
        reset();
        refetch();
    };

    return (
        <div className="space-y-8 container mx-auto font-sans pb-16">
            {/* Header */}
            <DashboardPageHeader
                title="Users Management"
                subtitle="Manage user accounts, change roles, update passwords, and inspect sub-resources."
                action={
                    <button
                        onClick={() => setIsCreateAdminOpen(true)}
                        className="px-4 py-2.5 bg-[#2c1654] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>Create Admin</span>
                    </button>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    name="Total Users"
                    value={stats.totalUsers ?? totalCount}
                    change="Total registered accounts"
                    icon={Users}
                    color="bg-purple-100 text-purple-700"
                />
                <StatCard
                    name="Customers"
                    value={stats.totalCustomers ?? 0}
                    change="Registered buyers"
                    icon={UserCheck}
                    color="bg-emerald-100 text-emerald-700"
                />
                <StatCard
                    name="Sellers"
                    value={stats.totalSellers ?? 0}
                    change="Active vendors"
                    icon={Package}
                    color="bg-amber-100 text-amber-700"
                />
                <StatCard
                    name="Admins"
                    value={stats.totalAdmins ?? 0}
                    change="System administrators"
                    icon={Shield}
                    color="bg-blue-100 text-blue-700"
                />
            </div>

            {/* Main Users Table Card */}
            <DashboardCard
                title="User Accounts"
                headerRight={
                    <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                        Showing {allUsers.length} of {totalCount} Users
                    </span>
                }
                className="space-y-4"
            >
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search user by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-[#f8f7fc] border border-purple-100 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>

                    {/* Role Filter Badges */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        {["ALL", "CUSTOMER", "SELLER", "ADMIN", "SUPER_ADMIN"].map((role) => (
                            <button
                                key={role}
                                onClick={() => {
                                    setSelectedRole(role);
                                    setPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                    selectedRole === role
                                        ? "bg-[#2c1654] text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {role === "ALL" ? "All Roles" : role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users Table */}
                <UsersTable
                    users={allUsers}
                    isFetching={isFetching}
                    hasNextPage={hasNextPage}
                    scrollContainerRef={scrollContainerRef}
                    loadMoreRef={loadMoreRef}
                    onInspect={(u) => router.push(`/dashboard/users/${u._id}`)}
                    onChangeRole={(u) => setRoleModalUser(u)}
                    onSetPassword={(u) => setPasswordModalUser(u)}
                />
            </DashboardCard>

            {/* Modals */}
            <CreateAdminModal
                open={isCreateAdminOpen}
                onClose={() => setIsCreateAdminOpen(false)}
                onSuccess={handleRefresh}
            />

            <SetPasswordModal
                user={passwordModalUser}
                onClose={() => setPasswordModalUser(null)}
            />

            <ChangeRoleModal
                user={roleModalUser}
                onClose={() => setRoleModalUser(null)}
                onSuccess={handleRefresh}
            />

            <UserSubResourceInspectorModal
                user={detailUser}
                onClose={() => setDetailUser(null)}
            />
        </div>
    );
}
