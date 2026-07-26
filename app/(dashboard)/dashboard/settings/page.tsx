"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/features/settings/settingsApi";
import { Settings, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: siteSettingsData } = useGetSettingsQuery(undefined, { skip: !isAdmin });
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [siteName, setSiteName] = useState("");
    const [currency, setCurrency] = useState("BDT");
    const [commission, setCommission] = useState("10");
    const [shippingFee, setShippingFee] = useState("60");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (siteSettingsData?.data) {
            setSiteName(siteSettingsData.data.siteName || "");
            setCurrency(siteSettingsData.data.currency || "BDT");
            setCommission(String(siteSettingsData.data.commissionPercentage || 10));
            setShippingFee(String(siteSettingsData.data.shippingFee || 60));
        }
    }, [siteSettingsData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await updateSettings({
                siteName,
                currency,
                commissionPercentage: Number(commission),
                shippingFee: Number(shippingFee),
            }).unwrap();
            setMessage("Settings saved successfully!");
        } catch (err: any) {
            setMessage("Error saving settings: " + (err?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Configuration Settings</h1>
                <p className="mt-1.5 text-sm text-gray-500">{isAdmin ? "Manage global marketplace policies, branding and currency settings." : "View your account credentials and personal configs."}</p>
            </div>

            {isAdmin ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Settings className="h-5 w-5 text-[#2c1654]" />
                            <h2 className="text-lg font-bold text-gray-900">Branding & Marketplace Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Site Name</label>
                                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Currency Code</label>
                                <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Commission Percentage (%)</label>
                                <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Shipping Fee (BDT)</label>
                                <input type="number" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                            </div>
                        </div>

                        {message && (
                            <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> {message}
                            </p>
                        )}

                        <button type="submit" disabled={isUpdating} className="px-6 py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                            <Save className="h-4 w-4" /> {isUpdating ? "Saving..." : "Save Settings"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Settings className="h-5 w-5 text-[#2c1654]" />
                        <h2 className="text-lg font-bold text-gray-900">Your Account Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <span className="block text-xs font-semibold text-gray-500">Name</span>
                            <p className="text-sm font-bold text-gray-800 mt-1">{user?.name}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500">Email</span>
                            <p className="text-sm font-bold text-gray-800 mt-1">{user?.email}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500">Role</span>
                            <p className="text-sm font-bold text-[#c8960c] mt-1">{user?.role}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500">Payout Balance</span>
                            <p className="text-sm font-bold text-gray-800 mt-1">৳ {user?.balance || 0}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
