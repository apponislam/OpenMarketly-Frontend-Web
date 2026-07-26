"use client";

import React, { useState } from "react";
import {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from "@/redux/features/coupon/couponApi";
import { Plus, Tag, Trash2, Edit } from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";

export default function CouponsPage() {
    const { data: couponsData, refetch } = useGetAllCouponsQuery();
    const [createCoupon] = useCreateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [code, setCode] = useState("");
    const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
    const [discountValue, setDiscountValue] = useState("");
    const [minOrder, setMinOrder] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");

    const coupons = couponsData?.data || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!code || !discountValue || !startDate || !endDate) {
            setMessage("Please fill all required fields.");
            return;
        }

        try {
            await createCoupon({
                code,
                discountType,
                discountValue: Number(discountValue),
                minOrderAmount: minOrder ? Number(minOrder) : undefined,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
            }).unwrap();
            setMessage("Coupon created successfully!");
            setCode("");
            setDiscountValue("");
            setMinOrder("");
            refetch();
        } catch (err: any) {
            setMessage("Error: " + (err?.data?.message || err.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await deleteCoupon(id).unwrap();
            refetch();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to delete coupon.");
        }
    };

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader title="Coupon Campaign Codes" subtitle="Manage discounts, percentage off and flat rates coupon codes." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <DashboardCard title="Create New Coupon" headerRight={<Plus className="h-5 w-5 text-[#2c1654]" />} className="h-fit">

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code *</label>
                            <input
                                type="text"
                                placeholder="e.g. SUMMER50"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Type *</label>
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Flat Amount (BDT)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Value *</label>
                            <input
                                type="number"
                                placeholder="value (e.g. 10)"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Order Amount (Optional)</label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                value={minOrder}
                                onChange={(e) => setMinOrder(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date *</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date *</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>
                        </div>

                        {message && <p className="text-xs text-[#c8960c] font-semibold">{message}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Tag className="h-4 w-4" /> Create Coupon
                        </button>
                    </form>
                </DashboardCard>

                <DashboardCard title="Active Coupons" className="lg:col-span-2">

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-xl">Code</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3">Expiry</th>
                                    <th className="px-4 py-3">Min Order</th>
                                    <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-bold text-gray-950">{coupon.code}</td>
                                        <td className="px-4 py-3.5 text-xs">
                                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% Off` : `৳ ${coupon.discountValue} Flat`}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-gray-500">
                                            {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : ""}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-gray-500">
                                            ৳ {coupon.minOrderAmount || 0}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-block"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">
                                            No active coupons found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
