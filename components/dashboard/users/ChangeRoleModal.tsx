"use client";

import React, { useState } from "react";
import { Modal } from "@/components/dashboard";
import { useChangeUserRoleMutation } from "@/redux/features/user/userApi";
import { Role, TUser } from "@/redux/features/auth/authSlice";

interface ChangeRoleModalProps {
    user: TUser | null;
    open?: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ChangeRoleModal({ user, open = true, onClose, onSuccess }: ChangeRoleModalProps) {
    const [newRole, setNewRole] = useState<Role>(user?.role || "CUSTOMER");
    const [msg, setMsg] = useState("");
    const [changeUserRole, { isLoading }] = useChangeUserRoleMutation();

    if (!user || !open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        try {
            await changeUserRole({ userId: user._id, role: newRole }).unwrap();
            alert(`User role updated to ${newRole}!`);
            onSuccess();
            onClose();
        } catch (err: any) {
            setMsg("Error: " + (err?.data?.message || err.message));
        }
    };

    return (
        <Modal open={true} onClose={onClose} title={`Change Role for ${user.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Role *</label>
                    <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as Role)}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654] bg-white font-semibold"
                    >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                </div>
                {msg && (
                    <p className={`text-xs font-bold ${msg.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}>
                        {msg}
                    </p>
                )}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Role"}
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
