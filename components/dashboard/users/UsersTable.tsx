"use client";

import React from "react";
import { TUser } from "@/redux/features/auth/authSlice";
import { StatusBadge } from "@/components/dashboard";
import { Eye, UserCog, Key } from "lucide-react";

interface UsersTableProps {
    users: TUser[];
    isFetching: boolean;
    hasNextPage: boolean;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
    onInspect: (user: TUser) => void;
    onChangeRole: (user: TUser) => void;
    onSetPassword: (user: TUser) => void;
}

export function UsersTable({
    users,
    isFetching,
    hasNextPage,
    scrollContainerRef,
    loadMoreRef,
    onInspect,
    onChangeRole,
    onSetPassword,
}: UsersTableProps) {
    return (
        <div
            ref={scrollContainerRef}
            className="max-h-[580px] overflow-y-auto pr-1 space-y-2 custom-scrollbar border border-gray-100 rounded-2xl"
        >
            <table className="w-full text-left text-xs border-collapse">
                <thead>
                    <tr className="bg-purple-50/50 text-[#2c1654] font-bold border-b border-purple-100 sticky top-0 backdrop-blur-md z-10">
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Joined</th>
                        <th className="p-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                        <tr key={u._id} className="hover:bg-purple-50/20 transition-colors">
                            <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                    {u.profileImage ? (
                                        <img
                                            src={u.profileImage}
                                            alt={u.name}
                                            className="w-8 h-8 rounded-full object-cover border border-purple-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#2c1654] text-amber-400 font-bold flex items-center justify-center text-xs">
                                            {u.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-900">{u.name}</p>
                                        <p className="text-[11px] text-gray-500">{u.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3.5">
                                <span
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        u.role === "SUPER_ADMIN"
                                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                                            : u.role === "ADMIN"
                                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                                            : u.role === "SELLER"
                                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                                            : "bg-gray-100 text-gray-800 border border-gray-200"
                                    }`}
                                >
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-3.5">
                                <StatusBadge status={u.isActive ? "ACTIVE" : "INACTIVE"} />
                            </td>
                            <td className="p-3.5 text-gray-500 font-medium">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    {/* Sub-resource Inspector */}
                                    <button
                                        onClick={() => onInspect(u)}
                                        className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                                        title="Inspect User Details & Sub-resources"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>

                                    {/* Change Role */}
                                    <button
                                        onClick={() => onChangeRole(u)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        title="Change Role"
                                    >
                                        <UserCog className="w-4 h-4" />
                                    </button>

                                    {/* Set Password */}
                                    <button
                                        onClick={() => onSetPassword(u)}
                                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                        title="Set Password"
                                    >
                                        <Key className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Lazy Loading Sentinel */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="py-4 text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2c1654] bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-[#2c1654] animate-ping" />
                        {isFetching ? "Loading more users..." : "Scroll for more..."}
                    </div>
                </div>
            )}

            {!isFetching && users.length === 0 && (
                <p className="text-sm text-gray-400 py-12 text-center">No matching user accounts found.</p>
            )}
        </div>
    );
}
