"use client";

import React, { useState } from "react";
import { Modal } from "@/components/dashboard";
import { useSetUserPasswordByAdminMutation } from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react";

interface SetPasswordModalProps {
    user: TUser | null;
    onClose: () => void;
}

export function SetPasswordModal({ user, onClose }: SetPasswordModalProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [msg, setMsg] = useState("");
    const [setUserPassword, { isLoading }] = useSetUserPasswordByAdminMutation();

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        if (!newPassword.trim()) {
            setMsg("New Password is required.");
            return;
        }

        if (newPassword.length < 6) {
            setMsg("Password must be at least 6 characters long.");
            return;
        }

        if (!confirmPassword.trim()) {
            setMsg("Please confirm the new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMsg("Passwords do not match.");
            return;
        }

        try {
            await setUserPassword({ userId: user._id, password: newPassword.trim() }).unwrap();
            alert("Password updated successfully!");
            setNewPassword("");
            setConfirmPassword("");
            onClose();
        } catch (err: any) {
            setMsg("Error: " + (err?.data?.message || err.message));
        }
    };

    return (
        <Modal open={true} onClose={onClose} title={`Set Password for ${user.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* New Password */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Password *</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-3.5 pr-10 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password *</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-3.5 pr-10 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {msg && (
                    <p className={`text-xs font-bold ${msg.startsWith("Error") || msg.includes("not match") || msg.includes("required") || msg.includes("characters") ? "text-red-600" : "text-emerald-600"}`}>
                        {msg}
                    </p>
                )}

                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 border text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
