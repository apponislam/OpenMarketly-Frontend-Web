"use client";

import React, { useState } from "react";
import { useGetAllFeedbacksQuery, useUpdateFeedbackStatusMutation, useDeleteFeedbackMutation } from "@/redux/features/feedback/feedbackApi";
import { MessageSquare, Check, Trash2 } from "lucide-react";
import { DashboardPageHeader, DashboardCard, StatusBadge } from "@/components/dashboard";

export default function FeedbacksPage() {
    const { data: feedbackData, refetch } = useGetAllFeedbacksQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateFeedbackStatusMutation();
    const [deleteFeedback] = useDeleteFeedbackMutation();

    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
    const feedbacks = feedbackData?.data || [];

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatus({ id, status, adminNote: adminNotes[id] || "" }).unwrap();
            refetch();
        } catch (err: any) { alert(err?.data?.message || "Failed to update feedback status."); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;
        try { await deleteFeedback(id).unwrap(); refetch(); }
        catch (err: any) { alert(err?.data?.message || "Failed to delete feedback."); }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <DashboardPageHeader title="App Feedback & Bug Reports" subtitle="Track and respond to user-submitted feedback, bug reports, and features requests." />

            <DashboardCard title="Feedback Inbox" headerRight={<MessageSquare className="h-5 w-5 text-[#2c1654]" />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-xl">Type</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-r-xl">Resolve</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {feedbacks.map((feedback) => (
                                <tr key={feedback._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            feedback.feedbackType === "BUG" ? "bg-red-500/10 text-red-600"
                                                : feedback.feedbackType === "SUGGESTION" ? "bg-blue-500/10 text-blue-600"
                                                : "bg-gray-500/10 text-gray-600"
                                        }`}>
                                            {feedback.feedbackType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-950 font-bold">{feedback.subject}</td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs">{feedback.message}</td>
                                    <td className="px-4 py-3.5"><StatusBadge status={feedback.status} /></td>
                                    <td className="px-4 py-3.5">
                                        {feedback.status === "PENDING" ? (
                                            <div className="flex flex-col gap-1.5 max-w-[200px]">
                                                <input type="text" placeholder="Admin note..." value={adminNotes[feedback._id] || ""} onChange={(e) => setAdminNotes({ ...adminNotes, [feedback._id]: e.target.value })} className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs" />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStatus(feedback._id, "RESOLVED")} disabled={isUpdating} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-0.5">
                                                        <Check className="h-3 w-3" /> Resolved
                                                    </button>
                                                    <button onClick={() => handleDelete(feedback._id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer flex items-center gap-0.5">
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">{feedback.adminNote || "No note added"}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {feedbacks.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">No feedbacks received yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
        </div>
    );
}
