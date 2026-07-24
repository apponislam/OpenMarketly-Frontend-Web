"use client";

import React, { useState } from "react";
import { useCreateCouponMutation } from "@/redux/features/coupon/couponApi";
import { Tag, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { DashboardCard } from "@/components/dashboard";

interface CreateCouponFormProps {
    onCreated: () => void;
}

export function CreateCouponForm({ onCreated }: CreateCouponFormProps) {
    const [createCoupon, { isLoading }] = useCreateCouponMutation();

    const [code, setCode] = useState("");
    const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
    const [discountValue, setDiscountValue] = useState("");
    const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
    const [minOrderAmount, setMinOrderAmount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const resetForm = () => {
        setCode("");
        setDiscountType("PERCENTAGE");
        setDiscountValue("");
        setMaxDiscountAmount("");
        setMinOrderAmount("");
        setExpiryDate("");
        setUsageLimit("");
        setIsActive(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!code.trim() || !discountValue || !expiryDate) {
            setMessage({ type: "error", text: "Code, discount value, and expiry date are required." });
            return;
        }

        try {
            await createCoupon({
                code: code.toUpperCase().trim(),
                discountType,
                discountValue: Number(discountValue),
                maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
                minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
                expiryDate: new Date(expiryDate).toISOString(),
                usageLimit: usageLimit ? Number(usageLimit) : undefined,
                isActive,
            }).unwrap();
            setMessage({ type: "success", text: "Coupon created successfully!" });
            resetForm();
            onCreated();
        } catch (err: any) {
            setMessage({ type: "error", text: err?.data?.message || err.message || "Failed to create coupon." });
        }
    };

    return (
        <DashboardCard title="Create New Coupon" headerRight={<Plus className="h-5 w-5 text-[#2c1654]" />} className="h-fit">
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code *</label>
                    <input
                        type="text"
                        placeholder="e.g. SUMMER50"
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Discount Value * {discountType === "PERCENTAGE" ? "(% off)" : "(৳ flat)"}
                    </label>
                    <input
                        type="number"
                        placeholder={discountType === "PERCENTAGE" ? "e.g. 10" : "e.g. 100"}
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
                            placeholder="e.g. 500 (caps % discount)"
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
                        placeholder="e.g. 500"
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usage Limit (Total Uses)</label>
                    <input
                        type="number"
                        placeholder="Leave empty for unlimited"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 accent-[#2c1654] cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-xs font-semibold text-gray-600 cursor-pointer">Active immediately after creation</label>
                </div>

                {message && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    <Tag className="h-4 w-4" /> {isLoading ? "Creating..." : "Create Coupon"}
                </button>
            </form>
        </DashboardCard>
    );
}
