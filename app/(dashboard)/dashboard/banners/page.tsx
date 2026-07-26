"use client";

import React, { useState } from "react";
import { useGetAllBannersQuery, useCreateBannerMutation, useDeleteBannerMutation } from "@/redux/features/banner/bannerApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { Plus, Image as ImageIcon, Trash2, Upload, Loader2 } from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";

export default function BannersPage() {
    const { data: bannersData, refetch } = useGetAllBannersQuery();
    const [createBanner] = useCreateBannerMutation();
    const [deleteBanner] = useDeleteBannerMutation();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");

    const banners = bannersData?.data || [];

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setMessage("");
            try {
                const cloudinaryUrl = await uploadToCloudinary(file);
                setImage(cloudinaryUrl);
            } catch (err: any) {
                setMessage("Cloudinary upload error: " + (err.message || "Failed to upload"));
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!title || !image) { setMessage("Title and Image URL are required."); return; }
        try {
            await createBanner({ title, subtitle, image, link }).unwrap();
            setMessage("Banner created successfully!");
            setTitle(""); setSubtitle(""); setImage(""); setLink(""); refetch();
        } catch (err: any) { setMessage("Error: " + (err?.data?.message || err.message)); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try { await deleteBanner(id).unwrap(); refetch(); }
        catch (err: any) { alert(err?.data?.message || "Failed to delete banner."); }
    };

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader title="Hero Slider Banners" subtitle="Configure promotional slide banners appearing on storefront homepage." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <DashboardCard title="Add New Banner" headerRight={<Plus className="h-5 w-5 text-[#2c1654]" />} className="h-fit">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Banner Title *</label>
                            <input type="text" placeholder="e.g. Mega Summer Clearance Sale" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtitle (Optional)</label>
                            <input type="text" placeholder="e.g. Up to 70% Off on all products" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Banner Image (Cloudinary File or URL) *</label>
                            <div className="flex items-center gap-2 mb-2">
                                <label className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#2c1654] font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 border border-purple-100 shrink-0">
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> : <Upload className="w-4 h-4 text-amber-500" />}
                                    {isUploading ? "Uploading..." : "Upload File"}
                                    <input type="file" accept="image/*" onChange={handleImageFileChange} disabled={isUploading} className="hidden" />
                                </label>
                                <input type="text" placeholder="https://res.cloudinary.com/..." value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Redirect URL/Link (Optional)</label>
                            <input type="text" placeholder="/shop?category=electronics" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                        </div>
                        {message && <p className="text-xs text-[#c8960c] font-semibold">{message}</p>}
                        <button type="submit" disabled={isUploading} className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                            <ImageIcon className="h-4 w-4" /> Save Banner
                        </button>
                    </form>
                </DashboardCard>

                {/* Banner Cards */}
                <DashboardCard title="Current Banners" className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {banners.map((banner) => (
                            <div key={banner._id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={banner.image} alt={banner.title} className="h-40 w-full object-cover" />
                                <div className="p-4 space-y-1 bg-white">
                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{banner.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">{banner.subtitle}</p>
                                    <span className="inline-block text-[10px] text-gray-400 truncate max-w-xs">{banner.link}</span>
                                </div>
                                <button onClick={() => handleDelete(banner._id)} className="absolute top-2 right-2 p-2 bg-white/95 text-red-600 hover:text-red-700 rounded-full shadow hover:scale-110 transition-transform cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {banners.length === 0 && <p className="text-sm text-gray-400 py-8 text-center col-span-2">No homepage banners found.</p>}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
