"use client";

import React, { useState } from "react";
import { ICoupon, useUpdateCouponMutation } from "@/redux/features/coupon/couponApi";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/dashboard";

interface EditCouponModalProps {
    coupon: ICoupon;
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

export function EditCouponModal({ coupon, open, onClose, onUpdated }: EditCouponModalProps) {
    const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

    const [code, setCode] = useState(coupon.code);
    const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(coupon.discountType);
    const [discountValue, setDiscountValue] = useState(String(coupon.discountValue));
    const [maxDiscountAmount, setMaxDiscountAmount] = useState(coupon.maxDiscountAmount !== undefined ? String(coupon.maxDiscountAmount) : "");
    const [minOrderAmount, setMinOrderAmount] = useState(coupon.minOrderAmount !== undefined ? String(coupon.minOrderAmount) : "");
    const [expiryDate, setExpiryDate] = useState(coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : "");
    const [usageLimit, setUsageLimit] = useState(coupon.usageLimit !== undefined ? String(coupon.usageLimit) : "");
    const [isActive, setIsActive] = useState(coupon.isActive !== false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            await updateCoupon({
                id: coupon._id,
                body: {
                    code: code.toUpperCase().trim(),
                    discountType,
                    discountValue: Number(discountValue),
                    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
                    minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
                    expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
                    usageLimit: usageLimit ? Number(usageLimit) : undefined,
                    isActive,
                },
            }).unwrap();
            setMessage({ type: "success", text: "Coupon updated successfully!" });
            onUpdated();
            setTimeout(() => onClose(), 800);
        } catch (err: any) {
            setMessage({ type: "error", text: err?.data?.message || err.message || "Failed to update coupon." });
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Edit Coupon">
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code *</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] font-mono"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Type *</label>
                    <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] cursor-pointer"
                    >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (৳)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Value *</label>
                    <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                    />
                </div>

                {discountType === "PERCENTAGE" && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Discount Amount (৳)</label>
                        <input
                            type="number"
                            value={maxDiscountAmount}
                            onChange={(e) => setMaxDiscountAmount(e.target.value)}
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Order Amount (৳)</label>
                    <input
                        type="number"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date *</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usage Limit</label>
                    <input
                        type="number"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        min="1"
                        placeholder="Leave empty for unlimited"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="editIsActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 accent-[#2c1654] cursor-pointer"
                    />
                    <label htmlFor="editIsActive" className="text-xs font-semibold text-gray-600 cursor-pointer">Active</label>
                </div>

                {message && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
