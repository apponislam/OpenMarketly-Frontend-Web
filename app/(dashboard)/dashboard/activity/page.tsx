"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useGetAllActivityLogsQuery,
    useGetMyActivityLogsQuery,
} from "@/redux/features/activity/activityApi";
import { History, Clock, Globe, Shield } from "lucide-react";

export default function ActivityPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: adminData } = useGetAllActivityLogsQuery(undefined, { skip: !isAdmin });
    const { data: sellerData } = useGetMyActivityLogsQuery(undefined, { skip: isAdmin });

    const logs = isAdmin ? adminData?.data || [] : sellerData?.data || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Activity Logs</h1>
                <p className="mt-1.5 text-sm text-gray-500">
                    {isAdmin ? "Audit trail of all administrative and vendor actions." : "Security log of your account logins and settings changes."}
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5 text-[#2c1654]" /> Log Trail
                </h2>

                <div className="divide-y divide-gray-100">
                    {logs.map((log) => (
                        <div key={log._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 rounded-xl mt-0.5">
                                    <Shield className="h-4.5 w-4.5 text-[#2c1654]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                                    <p className="text-xs text-gray-500">
                                        Module: <span className="font-semibold text-gray-700">{log.module}</span>
                                        {log.details && ` • ${log.details}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                {log.ipAddress && (
                                    <span className="flex items-center gap-1">
                                        <Globe className="h-3.5 w-3.5" />
                                        {log.ipAddress}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <p className="text-sm text-gray-400 py-8 text-center">No activity records found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
