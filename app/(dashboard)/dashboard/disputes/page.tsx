"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllDisputesQuery, useGetMyDisputesQuery, useResolveDisputeMutation } from "@/redux/features/dispute/disputeApi";
import { AlertOctagon } from "lucide-react";
import { DashboardPageHeader, DashboardCard, StatusBadge } from "@/components/dashboard";

export default function DisputesPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: adminData, refetch: refetchAdmin } = useGetAllDisputesQuery(undefined, { skip: !isAdmin });
    const { data: sellerData } = useGetMyDisputesQuery(undefined, { skip: isAdmin });
    const [resolveDispute, { isLoading: isResolving }] = useResolveDisputeMutation();

    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const disputes = isAdmin ? adminData?.data || [] : sellerData?.data || [];

    const handleResolve = async (id: string, status: "RESOLVED" | "REJECTED") => {
        try {
            await resolveDispute({ id, status, adminRemarks: remarks[id] || "" }).unwrap();
            refetchAdmin();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to resolve dispute.");
        }
    };

    return (
        <div className="space-y-8 container mx-auto font-sans">
            <DashboardPageHeader title="Platform Disputes" subtitle={isAdmin ? "Manage raised order disputes and customer support requests." : "Track customer disputes raised on your products."} />

            <DashboardCard title="Active Disputes Queue" headerRight={<AlertOctagon className="h-5 w-5 text-[#2c1654]" />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-xl">Order ID</th>
                                <th className="px-4 py-3">Reason</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-r-xl">Resolution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {disputes.map((dispute) => (
                                <tr key={dispute._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-[#2c1654]">{dispute.orderId || "N/A"}</td>
                                    <td className="px-4 py-3.5 text-gray-900 font-semibold">{dispute.reason}</td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs">{dispute.description}</td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={dispute.status} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {isAdmin && dispute.status === "PENDING" ? (
                                            <div className="flex flex-col gap-1.5 max-w-[220px]">
                                                <input type="text" placeholder="Admin remarks..." value={remarks[dispute._id] || ""} onChange={(e) => setRemarks({ ...remarks, [dispute._id]: e.target.value })} className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs" />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleResolve(dispute._id, "RESOLVED")} disabled={isResolving} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer">
                                                        Mark Resolved
                                                    </button>
                                                    <button onClick={() => handleResolve(dispute._id, "REJECTED")} disabled={isResolving} className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">{dispute.adminRemarks || "No resolution details"}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {disputes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">
                                        No active disputes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
        </div>
    );
}
