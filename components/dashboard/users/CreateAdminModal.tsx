"use client";

import React, { useState } from "react";
import { Modal } from "@/components/dashboard";
import { useCreateAdminMutation } from "@/redux/features/user/userApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { Camera, Loader2 } from "lucide-react";

interface CreateAdminModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateAdminModal({ open, onClose, onSuccess }: CreateAdminModalProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        profileImage: "",
    });
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [msg, setMsg] = useState("");
    const [createAdmin, { isLoading }] = useCreateAdminMutation();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setIsUploading(true);
        setMsg("");

        try {
            const url = await uploadToCloudinary(file);
            setForm((prev) => ({ ...prev, profileImage: url }));
        } catch (err: any) {
            setMsg("Image upload failed: " + (err.message || "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        if (!form.name || !form.email || !form.password) {
            setMsg("Name, Email, and Password are required.");
            return;
        }
        try {
            await createAdmin({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password.trim(),
                phone: form.phone.trim() || undefined,
                profileImage: form.profileImage || undefined,
            }).unwrap();
            setMsg("Admin created successfully!");
            setForm({ name: "", email: "", password: "", phone: "", profileImage: "" });
            setPreviewUrl("");
            onSuccess();
            onClose();
        } catch (err: any) {
            setMsg("Error: " + (err?.data?.message || err.message));
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Create New Admin Account">
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* Profile Avatar Upload */}
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="relative group w-20 h-20 rounded-full border-2 border-purple-200 overflow-hidden bg-purple-50 flex items-center justify-center">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-8 h-8 text-purple-400" />
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                            Upload
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold">Click avatar to upload photo</span>
                </div>

                {/* Form Fields */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                    <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                    <input
                        type="text"
                        placeholder="e.g. +8801700000000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#2c1654]"
                    />
                </div>
                {msg && (
                    <p className={`text-xs font-bold ${msg.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}>
                        {msg}
                    </p>
                )}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="flex-1 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : isUploading ? "Uploading Image..." : "Create Admin Account"}
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
