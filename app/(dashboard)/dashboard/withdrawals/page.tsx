"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useCreateWithdrawRequestMutation,
    useGetMyWithdrawRequestsQuery,
    useGetWithdrawStatsQuery,
    useGetAllWithdrawRequestsQuery,
    useResolveWithdrawRequestMutation,
} from "@/redux/features/withdraw/withdrawApi";
import { DollarSign, Clock, CheckCircle2, Plus, Send } from "lucide-react";
import { DashboardPageHeader, DashboardCard, StatCard, StatusBadge } from "@/components/dashboard";

export default function WithdrawalsPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: adminData, refetch: refetchAdmin } = useGetAllWithdrawRequestsQuery(undefined, { skip: !isAdmin });
    const { data: sellerData, refetch: refetchSeller } = useGetMyWithdrawRequestsQuery(undefined, { skip: isAdmin });
    const { data: withdrawStatsData } = useGetWithdrawStatsQuery(undefined, { skip: isAdmin });

    const [createWithdraw, { isLoading: isCreating }] = useCreateWithdrawRequestMutation();
    const [resolveWithdraw, { isLoading: isResolving }] = useResolveWithdrawRequestMutation();

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"BKASH" | "NAGAD" | "ROCKET" | "BANK">("BKASH");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const withdraws = isAdmin ? adminData?.data || [] : sellerData?.data || [];
    const statsData = withdrawStatsData?.data;

    // Use backend stats endpoint data if available, fallback to user balance / calculate
    const availableBalanceNum = statsData ? statsData.availableBalance : Number(user?.balance || 0);
    const pendingCashoutNum = statsData ? statsData.pendingCashout : 0;
    const completedPayoutsNum = statsData ? statsData.completedPayouts : 0;

    const formattedBalance = availableBalanceNum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedPending = pendingCashoutNum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedApproved = completedPayoutsNum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const sellerStats = [
        { name: "Available Balance", value: `৳ ${formattedBalance}`, change: "Ready for payout request", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600" },
        { name: "Pending Cashout", value: `৳ ${formattedPending}`, change: "Awaiting admin review", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
        { name: "Completed Payouts", value: `৳ ${formattedApproved}`, change: "Total lifetime cashout", icon: CheckCircle2, color: "bg-[#2c1654]/10 text-[#2c1654]" },
    ];

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(""); setSuccessMsg("");
        if (!amount || Number(amount) <= 0) { setErrorMsg("Please enter a valid amount."); return; }
        if (Number(amount) > availableBalanceNum) { setErrorMsg("Entered amount exceeds your available balance."); return; }
        if (!accountNumber.trim()) { setErrorMsg("Account number / phone number is required."); return; }

        try {
            await createWithdraw({
                amount: Number(amount),
                paymentMethod: method,
                paymentDetails: {
                    accountNumber: accountNumber.trim(),
                    accountName: accountName.trim() || undefined,
                    bankName: method === "BANK" ? bankName.trim() : undefined,
                    branchName: method === "BANK" ? branchName.trim() : undefined,
                },
            }).unwrap();

            setSuccessMsg("Withdraw request submitted successfully!");
            setAmount(""); setAccountNumber(""); setAccountName(""); setBankName(""); setBranchName(""); refetchSeller();
        } catch (err: any) { setErrorMsg(err?.data?.message || "Failed to submit request."); }
    };

    const handleResolve = async (id: string, status: "APPROVED" | "REJECTED") => {
        try {
            await resolveWithdraw({ id, status, adminRemarks: remarks[id] || "" }).unwrap();
            refetchAdmin();
        } catch (err: any) { alert(err?.data?.message || "Failed to resolve withdraw request."); }
    };

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Withdrawal Requests"
                subtitle={isAdmin ? "Review, approve or reject seller payout requests." : "Request payouts and track your withdrawal history."}
            />

            {/* Seller Balance Summary Cards */}
            {!isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {sellerStats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Seller: Create Request Form */}
                {!isAdmin && (
                    <DashboardCard title="Request Payout" headerRight={<Plus className="h-5 w-5 text-[#2c1654]" />} className="h-fit">
                        <form onSubmit={handleCreateRequest} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Amount (BDT) <span className="text-[#c8960c] font-bold">(Available: ৳ {formattedBalance})</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payout Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value as any)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                >
                                    <option value="BKASH">bKash</option>
                                    <option value="NAGAD">Nagad</option>
                                    <option value="ROCKET">Rocket</option>
                                    <option value="BANK">Bank Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Account Number / Phone *
                                </label>
                                <input
                                    type="text"
                                    placeholder={method === "BANK" ? "e.g. 150220394..." : "e.g. 01700000000"}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Account Holder Name (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            {method === "BANK" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Dutch Bangla Bank"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Branch Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Gulshan Branch"
                                            value={branchName}
                                            onChange={(e) => setBranchName(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                        />
                                    </div>
                                </>
                            )}

                            {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
                            {successMsg && <p className="text-xs text-emerald-500 font-semibold">{successMsg}</p>}

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Send className="h-4 w-4 text-amber-400" /> {isCreating ? "Submitting..." : "Submit Payout Request"}
                            </button>
                        </form>
                    </DashboardCard>
                )}

                {/* Table */}
                <DashboardCard title="Payout Requests History" className={isAdmin ? "lg:col-span-3" : "lg:col-span-2"}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                <tr>
                                    {isAdmin && <th className="px-4 py-3 rounded-l-xl">Seller</th>}
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Account No</th>
                                    <th className="px-4 py-3">Status</th>
                                    {isAdmin && <th className="px-4 py-3 rounded-r-xl">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdraws.map((request: any) => {
                                    const accNo = typeof request.paymentDetails === "object"
                                        ? request.paymentDetails?.accountNumber || JSON.stringify(request.paymentDetails)
                                        : request.paymentDetails;
                                    return (
                                        <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                                            {isAdmin && <td className="px-4 py-3.5 font-semibold text-[#2c1654]">{request.sellerId?.name || request.seller?.name || "Seller"}</td>}
                                            <td className="px-4 py-3.5 text-gray-900 font-bold">৳ {request.amount?.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-xs font-semibold text-gray-700">{request.paymentMethod}</td>
                                            <td className="px-4 py-3.5 text-xs text-gray-500 font-mono">{accNo}</td>
                                            <td className="px-4 py-3.5"><StatusBadge status={request.status} /></td>
                                            {isAdmin && (
                                                <td className="px-4 py-3.5 space-y-2">
                                                    {request.status === "PENDING" ? (
                                                        <div className="flex flex-col gap-1.5 max-w-[200px]">
                                                            <input type="text" placeholder="Remarks..." value={remarks[request._id] || ""} onChange={(e) => setRemarks({ ...remarks, [request._id]: e.target.value })} className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs" />
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleResolve(request._id, "APPROVED")} disabled={isResolving} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer">Approve</button>
                                                                <button onClick={() => handleResolve(request._id, "REJECTED")} disabled={isResolving} className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer">Reject</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">{request.adminNote || request.adminRemarks || "No remarks"}</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                                {withdraws.length === 0 && (
                                    <tr><td colSpan={isAdmin ? 6 : 5} className="px-4 py-6 text-center text-sm text-gray-400">No withdrawal records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
