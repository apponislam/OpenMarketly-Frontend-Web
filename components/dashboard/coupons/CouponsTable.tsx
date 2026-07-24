"use client";

import React from "react";
import { ICoupon, useDeleteCouponMutation } from "@/redux/features/coupon/couponApi";
import { Edit, Trash2 } from "lucide-react";
import { DashboardCard, StatusBadge } from "@/components/dashboard";

interface CouponsTableProps {
    coupons: ICoupon[];
    onEdit: (coupon: ICoupon) => void;
    onDeleted: () => void;
}

export function CouponsTable({ coupons, onEdit, onDeleted }: CouponsTableProps) {
    const [deleteCoupon] = useDeleteCouponMutation();

    const isExpired = (date: string) => new Date(date) < new Date();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await deleteCoupon(id).unwrap();
            onDeleted();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to delete coupon.");
        }
    };

    return (
        <DashboardCard title={`All Coupons (${coupons.length})`} className="lg:col-span-2">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3 rounded-l-xl">Code</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">Expiry</th>
                            <th className="px-4 py-3">Min Order</th>
                            <th className="px-4 py-3">Usage</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => {
                            const expired = isExpired(coupon.expiryDate);
                            const limitReached = coupon.usageLimit !== undefined && (coupon.usageCount || 0) >= coupon.usageLimit;
                            return (
                                <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-gray-950 font-mono">{coupon.code}</td>
                                    <td className="px-4 py-3.5 text-xs">
                                        {coupon.discountType === "PERCENTAGE"
                                            ? `${coupon.discountValue}% Off`
                                            : `৳${coupon.discountValue} Flat`}
                                        {coupon.discountType === "PERCENTAGE" && coupon.maxDiscountAmount
                                            ? ` (max ৳${coupon.maxDiscountAmount})`
                                            : ""}
                                    </td>
                                    <td className={`px-4 py-3.5 text-xs ${expired ? "text-red-500 font-bold" : "text-gray-500"}`}>
                                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500">
                                        {coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500">
                                        {coupon.usageCount || 0}{coupon.usageLimit !== undefined ? ` / ${coupon.usageLimit}` : " / ∞"}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge
                                            status={
                                                expired ? "EXPIRED"
                                                    : limitReached ? "INACTIVE"
                                                        : coupon.isActive !== false ? "ACTIVE"
                                                            : "INACTIVE"
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => onEdit(coupon)}
                                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="Edit Coupon"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                                    No coupons found. Create your first coupon above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
}
