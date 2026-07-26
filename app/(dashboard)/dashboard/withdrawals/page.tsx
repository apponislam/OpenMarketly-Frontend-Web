"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useCreateWithdrawRequestMutation,
    useGetMyWithdrawRequestsQuery,
    useGetAllWithdrawRequestsQuery,
    useResolveWithdrawRequestMutation,
} from "@/redux/features/withdraw/withdrawApi";
import { DollarSign, Clock, CheckCircle, XCircle, Plus, Send } from "lucide-react";

export default function WithdrawalsPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: adminData, refetch: refetchAdmin } = useGetAllWithdrawRequestsQuery(undefined, { skip: !isAdmin });
    const { data: sellerData, refetch: refetchSeller } = useGetMyWithdrawRequestsQuery(undefined, { skip: isAdmin });

    const [createWithdraw, { isLoading: isCreating }] = useCreateWithdrawRequestMutation();
    const [resolveWithdraw, { isLoading: isResolving }] = useResolveWithdrawRequestMutation();

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("Bkash");
    const [details, setDetails] = useState("");
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const withdraws = isAdmin ? adminData?.data || [] : sellerData?.data || [];

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        
        if (!amount || Number(amount) <= 0) {
            setErrorMsg("Please enter a valid amount.");
            return;
        }

        try {
            await createWithdraw({
                amount: Number(amount),
                paymentMethod: method,
                paymentDetails: details,
            }).unwrap();
            setSuccessMsg("Withdraw request submitted successfully!");
            setAmount("");
            setDetails("");
            refetchSeller();
        } catch (err: any) {
            setErrorMsg(err?.data?.message || "Failed to submit request.");
        }
    };

    const handleResolve = async (id: string, status: "APPROVED" | "REJECTED") => {
        try {
            await resolveWithdraw({
                id,
                status,
                adminRemarks: remarks[id] || "",
            }).unwrap();
            refetchAdmin();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to resolve withdraw request.");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Withdrawal Requests</h1>
                <p className="mt-1.5 text-sm text-gray-500">
                    {isAdmin ? "Review, approve or reject seller payout requests." : "Request payouts and track your withdrawal history."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Form (Seller Only) */}
                {!isAdmin && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-[#2c1654]" /> Request Payout
                        </h2>
                        
                        <form onSubmit={handleCreateRequest} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (BDT)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                >
                                    <option value="Bkash">Bkash</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Details / Account Info</label>
                                <textarea
                                    placeholder="Account number, bank details, branch, etc."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] h-24"
                                />
                            </div>

                            {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
                            {successMsg && <p className="text-xs text-emerald-500 font-semibold">{successMsg}</p>}

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Send className="h-4 w-4" /> {isCreating ? "Submitting..." : "Submit Request"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Right / Full width list */}
                <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 ${isAdmin ? "lg:col-span-3" : "lg:col-span-2"}`}>
                    <h2 className="text-lg font-bold text-gray-900">Payout Requests History</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                <tr>
                                    {isAdmin && <th className="px-4 py-3 rounded-l-xl">Seller</th>}
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Details</th>
                                    <th className="px-4 py-3">Status</th>
                                    {isAdmin && <th className="px-4 py-3 rounded-r-xl">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdraws.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                                        {isAdmin && (
                                            <td className="px-4 py-3.5 font-semibold text-[#2c1654]">
                                                {request.sellerId?.name || "Unknown Seller"}
                                            </td>
                                        )}
                                        <td className="px-4 py-3.5 text-gray-900 font-bold">৳ {request.amount}</td>
                                        <td className="px-4 py-3.5 text-xs font-medium text-gray-600">{request.paymentMethod}</td>
                                        <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs truncate">{request.paymentDetails}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                request.status === "APPROVED"
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : request.status === "PENDING"
                                                    ? "bg-amber-500/10 text-amber-600"
                                                    : "bg-red-500/10 text-red-600"
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3.5 space-y-2">
                                                {request.status === "PENDING" ? (
                                                    <div className="flex flex-col gap-1.5 max-w-[200px]">
                                                        <input
                                                            type="text"
                                                            placeholder="Remarks..."
                                                            value={remarks[request._id] || ""}
                                                            onChange={(e) => setRemarks({ ...remarks, [request._id]: e.target.value })}
                                                            className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleResolve(request._id, "APPROVED")}
                                                                disabled={isResolving}
                                                                className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleResolve(request._id, "REJECTED")}
                                                                disabled={isResolving}
                                                                className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">
                                                        {request.adminRemarks || "No remarks"}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {withdraws.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 4} className="px-4 py-6 text-center text-sm text-gray-400">
                                            No withdrawal records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
