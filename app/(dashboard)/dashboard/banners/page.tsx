"use client";

import React, { useState } from "react";
import {
    useGetAllBannersQuery,
    useCreateBannerMutation,
    useDeleteBannerMutation,
} from "@/redux/features/banner/bannerApi";
import { Plus, Image, Trash2 } from "lucide-react";

export default function BannersPage() {
    const { data: bannersData, refetch } = useGetAllBannersQuery();
    const [createBanner] = useCreateBannerMutation();
    const [deleteBanner] = useDeleteBannerMutation();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");

    const banners = bannersData?.data || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!title || !image) {
            setMessage("Title and Image URL are required.");
            return;
        }

        try {
            await createBanner({
                title,
                subtitle,
                image,
                link,
            }).unwrap();
            setMessage("Banner created successfully!");
            setTitle("");
            setSubtitle("");
            setImage("");
            setLink("");
            refetch();
        } catch (err: any) {
            setMessage("Error: " + (err?.data?.message || err.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteBanner(id).unwrap();
            refetch();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to delete banner.");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Hero Slider Banners</h1>
                <p className="mt-1.5 text-sm text-gray-500">Configure promotional slide banners appearing on storefront homepage.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Banner Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#2c1654]" /> Add New Banner
                    </h2>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Banner Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. Mega Summer Clearance Sale"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtitle (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Up to 70% Off on all products"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL *</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Redirect URL/Link (Optional)</label>
                            <input
                                type="text"
                                placeholder="/shop?category=electronics"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        {message && <p className="text-xs text-[#c8960c] font-semibold">{message}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Image className="h-4 w-4" /> Save Banner
                        </button>
                    </form>
                </div>

                {/* Banner list preview */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Current Banners</h2>

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
                                <button
                                    onClick={() => handleDelete(banner._id)}
                                    className="absolute top-2 right-2 p-2 bg-white/95 text-red-600 hover:text-red-700 rounded-full shadow hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {banners.length === 0 && (
                            <p className="text-sm text-gray-400 py-8 text-center col-span-2">No homepage banners found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
