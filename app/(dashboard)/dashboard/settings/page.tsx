"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, updateUserData } from "@/redux/features/auth/authSlice";
import {
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useGetMeQuery,
} from "@/redux/features/auth/authApi";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/features/settings/settingsApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { Settings, Save, Lock, User, CheckCircle2, AlertCircle, Camera, Loader2 } from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";

export default function SettingsPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: userData } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    const { data: siteSettingsData } = useGetSettingsQuery(undefined, { skip: !isAdmin });
    const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();

    // Profile state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
    const [profileImage, setProfileImage] = useState("");
    const [profilePreview, setProfilePreview] = useState("");
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Site settings state (Admin)
    const [siteName, setSiteName] = useState("");
    const [currency, setCurrency] = useState("BDT");
    const [commission, setCommission] = useState("10");
    const [shippingFee, setShippingFee] = useState("60");
    const [siteSettingsMsg, setSiteSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const currentUserData = userData?.data || user;
        if (currentUserData) {
            setName(currentUserData.name || "");
            setPhone(currentUserData.phone || "");
            setGender((currentUserData.gender as any) || "MALE");
            setProfileImage(currentUserData.profileImage || "");
            setProfilePreview(currentUserData.profileImage || "");
        }
    }, [userData, user]);

    useEffect(() => {
        if (siteSettingsData?.data) {
            setSiteName(siteSettingsData.data.siteName || "");
            setCurrency(siteSettingsData.data.currency || "BDT");
            setCommission(String(siteSettingsData.data.commissionPercentage || 10));
            setShippingFee(String(siteSettingsData.data.shippingFee || 60));
        }
    }, [siteSettingsData]);

    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingImage(true);
            setProfileMsg(null);
            try {
                const cloudinaryUrl = await uploadToCloudinary(file);
                setProfilePreview(cloudinaryUrl);
                setProfileImage(cloudinaryUrl);
            } catch (err: any) {
                setProfileMsg({ type: "error", text: "Cloudinary upload failed: " + (err.message || "Unknown error") });
            } finally {
                setIsUploadingImage(false);
            }
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg(null);

        if (!name.trim()) {
            setProfileMsg({ type: "error", text: "Full name is required." });
            return;
        }

        try {
            const res = await updateProfile({
                name,
                phone: phone || undefined,
                gender,
                profileImage: profileImage || undefined,
            }).unwrap();

            if (res?.data) {
                dispatch(updateUserData(res.data));
                setProfileMsg({ type: "success", text: "Profile information updated successfully!" });
            }
        } catch (err: any) {
            setProfileMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to update profile." });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMsg({ type: "error", text: "New password must be at least 6 characters long." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: "error", text: "New password and confirmation do not match." });
            return;
        }

        try {
            await changePassword({
                currentPassword,
                newPassword,
            }).unwrap();

            setPasswordMsg({ type: "success", text: "Password changed successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setPasswordMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to change password." });
        }
    };

    const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSiteSettingsMsg(null);
        try {
            await updateSettings({
                siteName,
                currency,
                commissionPercentage: Number(commission),
                shippingFee: Number(shippingFee),
            }).unwrap();
            setSiteSettingsMsg({ type: "success", text: "Global marketplace settings saved!" });
        } catch (err: any) {
            setSiteSettingsMsg({ type: "error", text: "Error: " + (err?.data?.message || err.message) });
        }
    };

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Account Settings"
                subtitle="Manage your personal profile details, account security, and system preferences."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Col: Profile Settings Form */}
                <DashboardCard title="Edit Profile Details" headerRight={<User className="h-5 w-5 text-[#2c1654]" />} className="lg:col-span-2">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {/* Profile Avatar Upload */}
                        <div className="flex items-center gap-5 border-b border-gray-100 pb-5">
                            <div className="relative w-20 h-20 rounded-full bg-purple-50 border-2 border-purple-100 overflow-hidden flex items-center justify-center group shrink-0">
                                {profilePreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profilePreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-black text-[#2c1654] uppercase">{user?.name?.charAt(0) || "U"}</span>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                                    <Camera className="w-4 h-4 mb-0.5" />
                                    Change
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{user?.name}</h4>
                                <p className="text-xs text-gray-400">{user?.email} • <span className="font-semibold text-[#c8960c]">{user?.role}</span></p>
                                <label className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#2c1654] font-bold hover:underline cursor-pointer">
                                    <Camera className="w-3.5 h-3.5" /> Upload new photo
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {profileMsg && (
                            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                <span>{profileMsg.text}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address (Read-only)</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                    placeholder="+880 1700000000"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as any)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="px-6 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save className="h-4 w-4 text-amber-400" />
                                {isUpdatingProfile ? "Saving Profile..." : "Save Profile Changes"}
                            </button>
                        </div>
                    </form>
                </DashboardCard>

                {/* Right Col: Change Password Card */}
                <div className="space-y-8">
                    <DashboardCard title="Change Password" headerRight={<Lock className="h-5 w-5 text-[#2c1654]" />}>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            {passwordMsg && (
                                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${passwordMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                    {passwordMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                    <span>{passwordMsg.text}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password *</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password *</label>
                                <input
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password *</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Lock className="h-4 w-4 text-amber-400" />
                                {isChangingPassword ? "Updating Password..." : "Update Password"}
                            </button>
                        </form>
                    </DashboardCard>

                    {/* Admin Platform Settings Card */}
                    {isAdmin && (
                        <DashboardCard title="Marketplace Configuration" headerRight={<Settings className="h-5 w-5 text-[#2c1654]" />}>
                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-4">
                                {siteSettingsMsg && (
                                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${siteSettingsMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                        {siteSettingsMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                        <span>{siteSettingsMsg.text}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Site Name</label>
                                    <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Currency Code</label>
                                    <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Commission (%)</label>
                                    <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Shipping Fee (BDT)</label>
                                    <input type="number" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                                </div>

                                <button type="submit" disabled={isUpdatingSettings} className="w-full py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                                    <Save className="h-4 w-4 text-amber-400" />
                                    {isUpdatingSettings ? "Saving..." : "Save System Config"}
                                </button>
                            </form>
                        </DashboardCard>
                    )}
                </div>
            </div>
        </div>
    );
}
