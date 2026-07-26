"use client";

import React, { useState } from "react";
import { useGetAllCouponsQuery, ICoupon } from "@/redux/features/coupon/couponApi";
import { DashboardPageHeader } from "@/components/dashboard";
import { CreateCouponForm, CouponsTable, EditCouponModal } from "@/components/dashboard/coupons";

export default function CouponsPage() {
    const { data: couponsData, refetch } = useGetAllCouponsQuery();
    const coupons = couponsData?.data || [];

    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (coupon: ICoupon) => {
        setSelectedCoupon(coupon);
        setShowEditModal(true);
    };

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Coupon Campaign Codes"
                subtitle="Manage discounts, percentage off and flat rate coupon codes."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Create Form Component */}
                <CreateCouponForm onCreated={refetch} />

                {/* Coupons Table Component */}
                <CouponsTable
                    coupons={coupons}
                    onEdit={handleEditClick}
                    onDeleted={refetch}
                />
            </div>

            {/* Edit Modal Component */}
            {showEditModal && selectedCoupon && (
                <EditCouponModal
                    key={selectedCoupon._id}
                    coupon={selectedCoupon}
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedCoupon(null);
                    }}
                    onUpdated={refetch}
                />
            )}
        </div>
    );
}
