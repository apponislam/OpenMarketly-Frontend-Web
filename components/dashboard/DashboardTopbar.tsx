"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";

interface DashboardTopbarProps {
    user: {
        name: string;
        email: string;
        role: string;
        profileImage?: string;
    };
    onMenuToggle: () => void;
    onLogout: () => void;
}

export function DashboardTopbar({ user, onMenuToggle, onLogout }: DashboardTopbarProps) {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-[#2c1654]/10 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="p-1 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
                >
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>
                <div className="text-sm font-semibold text-gray-700 hidden sm:block">
                    Dashboard Workspace
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        {user.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-[#2c1654]/10 flex items-center justify-center font-semibold text-[#2c1654] uppercase">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm font-medium hidden md:block">{user.name}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-[10px] text-gray-500 uppercase font-semibold">{user.role}</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                            </div>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setProfileOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Settings
                            </Link>
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
