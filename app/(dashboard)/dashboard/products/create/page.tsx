"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import {
    useGetParentCategoriesQuery,
    useGetSubcategoriesQuery,
    useGetAllCategoriesQuery,
    ICategory,
} from "@/redux/features/category/categoryApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { DashboardPageHeader } from "@/components/dashboard";
import {
    ArrowLeft,
    Package,
    Upload,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Save,
    Tag,
    Layers,
    DollarSign,
    Shield,
    Image as ImageIcon,
    Loader2,
    FolderTree,
    ChevronRight,
    Sparkles,
    SlidersHorizontal,
    Box,
    Check,
} from "lucide-react";

export default function CreateProductPage() {
    const router = useRouter();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    // Selected Final Category ID (at any depth)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);

    // Basic Details
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [sku, setSku] = useState("");
    const [unit, setUnit] = useState("Piece");

    // Pricing & Inventory
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [stockQuantity, setStockQuantity] = useState("10");

    // Description
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");

    // Media / Images
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Variants (Colors & Sizes)
    const [colorsInput, setColorsInput] = useState("");
    const [sizesInput, setSizesInput] = useState("");

    // Dynamic Specifications Key-Value
    const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
        { key: "Material", value: "" },
    ]);

    // Shipping & Physical Specs
    const [weight, setWeight] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [warranty, setWarranty] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("7 Days Replacement");

    // Tags & Marketing Toggles
    const [tagsInput, setTagsInput] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isTodayDeal, setIsTodayDeal] = useState(false);
    const [isTrending, setIsTrending] = useState(false);

    // Upload & Feedback States
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);

    // Thumbnail Upload Handler
    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingThumbnail(true);
            setStatusMsg(null);
            try {
                const cloudinaryUrl = await uploadToCloudinary(file);
                setThumbnailPreview(cloudinaryUrl);
                setThumbnail(cloudinaryUrl);
            } catch (err: any) {
                setStatusMsg({ type: "error", text: "Thumbnail Cloudinary upload failed: " + (err.message || "Unknown error") });
            } finally {
                setIsUploadingThumbnail(false);
            }
        }
    };

    // Gallery Photo Upload Handler
    const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingGallery(true);
            setStatusMsg(null);
            try {
                const cloudinaryUrl = await uploadToCloudinary(file);
                setGalleryImages((prev) => [...prev, cloudinaryUrl]);
            } catch (err: any) {
                setStatusMsg({ type: "error", text: "Gallery image Cloudinary upload failed: " + (err.message || "Unknown error") });
            } finally {
                setIsUploadingGallery(false);
            }
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    // Specifications Handlers
    const handleAddSpecRow = () => {
        setSpecifications([...specifications, { key: "", value: "" }]);
    };

    const handleRemoveSpecRow = (index: number) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
        const updated = [...specifications];
        updated[index][field] = val;
        setSpecifications(updated);
    };

    // Price & Discount Auto Calculations
    const handleOriginalPriceChange = (val: string) => {
        setOriginalPrice(val);
        const orig = Number(val);
        const sell = Number(price);
        if (orig > 0 && sell > 0 && orig > sell) {
            const disc = Math.round(((orig - sell) / orig) * 100);
            setDiscountPercentage(String(disc));
        }
    };

    const handlePriceChange = (val: string) => {
        setPrice(val);
        const sell = Number(val);
        const orig = Number(originalPrice);
        if (orig > 0 && sell > 0 && orig > sell) {
            const disc = Math.round(((orig - sell) / orig) * 100);
            setDiscountPercentage(String(disc));
        }
    };

    // Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMsg(null);

        if (!name.trim()) {
            setStatusMsg({ type: "error", text: "Product title/name is required." });
            return;
        }

        if (!selectedCategoryId) {
            setStatusMsg({ type: "error", text: "Please select a category for the product." });
            return;
        }

        if (!price || Number(price) <= 0) {
            setStatusMsg({ type: "error", text: "Please enter a valid selling price." });
            return;
        }

        if (!description.trim()) {
            setStatusMsg({ type: "error", text: "Detailed description is required." });
            return;
        }

        const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);
        const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
        const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
        const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

        try {
            await createProduct({
                name: name.trim(),
                brand: brand.trim() || undefined,
                category: selectedCategoryId,
                sku: sku.trim() || undefined,
                unit: unit.trim() || undefined,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : undefined,
                discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
                stockQuantity: Number(stockQuantity) || 0,
                shortDescription: shortDescription.trim() || undefined,
                description: description.trim(),
                thumbnail: thumbnail || undefined,
                images: galleryImages.length > 0 ? galleryImages : undefined,
                colors: colors.length > 0 ? colors : undefined,
                sizes: sizes.length > 0 ? sizes : undefined,
                specifications: validSpecs.length > 0 ? validSpecs : undefined,
                weight: weight.trim() || undefined,
                dimensions: dimensions.trim() || undefined,
                warranty: warranty.trim() || undefined,
                returnPolicy: returnPolicy.trim() || undefined,
                tags: tags.length > 0 ? tags : undefined,
                isFeatured,
                isTodayDeal,
                isTrending,
            }).unwrap();

            setStatusMsg({ type: "success", text: "Product published successfully! Redirecting..." });
            setTimeout(() => {
                router.push("/dashboard/products");
            }, 1200);
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to create product." });
        }
    };

    return (
        <div className="space-y-8 w-full font-sans pb-24">
            {/* Header + Back Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push("/dashboard/products")}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#2c1654] transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200/80 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 text-amber-500" /> Back to Products List
                </button>
            </div>

            <DashboardPageHeader
                title="Create New Product"
                subtitle="Publish a comprehensive, high-converting product listing to your marketplace storefront."
            />

            {statusMsg && (
                <div
                    className={`p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm ${
                        statusMsg.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {statusMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Category Selection - Infinite Multi-Level Cascader */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#2c1654] text-amber-400 flex items-center justify-center font-bold">
                                <FolderTree className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">1. Multi-Level Category Selection</h3>
                                <p className="text-xs text-gray-500">Navigate down any depth level (Level 1, 2, 3... 10+) to select category.</p>
                            </div>
                        </div>
                    </div>

                    <MultiLevelCategoryCascader
                        onSelectCategory={(id, pathNames) => {
                            setSelectedCategoryId(id);
                            setSelectedCategoryPath(pathNames);
                        }}
                    />

                    {selectedCategoryPath.length > 0 && (
                        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-2 text-xs font-bold text-[#2c1654]">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Selected Category Path:</span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {selectedCategoryPath.map((part, idx) => (
                                    <React.Fragment key={idx}>
                                        {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                                        <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs font-semibold">
                                            {part}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. General Product Information */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">2. Basic Information</h3>
                            <p className="text-xs text-gray-500">Enter product name, brand, SKU and packaging unit.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Product Title / Name *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Wireless Noise Cancelling Headphones Pro"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Brand Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sony, Apple, Nike, Samsung"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    SKU (Auto Generated if empty)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Auto-generated"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-mono text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Unit Measure
                                </label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                >
                                    <option value="Piece">Piece</option>
                                    <option value="Box">Box</option>
                                    <option value="Pack">Pack</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Liter">Liter</option>
                                    <option value="Pair">Pair</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Pricing & Inventory */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">3. Pricing & Inventory Stock</h3>
                            <p className="text-xs text-gray-500">Configure selling price, original price, discount % and available stock.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Selling Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 199.99"
                                value={price}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Regular / Original Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 249.99"
                                value={originalPrice}
                                onChange={(e) => handleOriginalPriceChange(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 20"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-bold text-emerald-600 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Stock *
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 50"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Product Media & Images (Cloudinary) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">4. Product Photography</h3>
                            <p className="text-xs text-gray-500">Upload main thumbnail & photo gallery. All media is uploaded directly to Cloudinary.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Main Cover Photo (Cloudinary)
                            </label>
                            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 text-center hover:border-[#2c1654] transition-colors relative flex flex-col items-center justify-center min-h-[160px] bg-[#faf9fc]">
                                {isUploadingThumbnail ? (
                                    <div className="space-y-2 flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 text-[#2c1654] animate-spin" />
                                        <p className="text-xs font-bold text-[#2c1654]">Uploading to Cloudinary...</p>
                                    </div>
                                ) : thumbnailPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="max-h-36 rounded-xl object-contain" />
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                                        <p className="text-xs text-gray-600 font-bold">Upload Cover Photo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    disabled={isUploadingThumbnail}
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Gallery Images Upload */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Additional Gallery Photos
                            </label>
                            <div>
                                <label className="px-5 py-3 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-2xl cursor-pointer transition-colors inline-flex items-center gap-2 shadow-md">
                                    {isUploadingGallery ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                    ) : (
                                        <Upload className="w-4 h-4 text-amber-400" />
                                    )}
                                    {isUploadingGallery ? "Uploading Photo to Cloudinary..." : "+ Upload Gallery Photo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGalleryFileUpload}
                                        disabled={isUploadingGallery}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Gallery Preview Grid */}
                            {galleryImages.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-3">
                                    {galleryImages.map((url, idx) => (
                                        <div key={idx} className="relative group border border-purple-100 rounded-xl overflow-hidden bg-purple-50 aspect-square">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 5. Product Descriptions */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">5. Detailed Descriptions</h3>
                            <p className="text-xs text-gray-500">Provide concise short highlights and full detailed specifications.</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Short Summary Description
                            </label>
                            <input
                                type="text"
                                placeholder="Brief 1-2 sentence highlight..."
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Detailed Product Description *
                            </label>
                            <textarea
                                placeholder="Write complete details, features, package contents, and usage instructions..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </div>

                {/* 6. Variants, Specifications & Physical Attributes */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">6. Variants & Dynamic Specifications</h3>
                            <p className="text-xs text-gray-500">Define color options, size options, and key-value specification attributes.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Colors (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Matte Black, Space Gray, Rose Gold"
                                value={colorsInput}
                                onChange={(e) => setColorsInput(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Sizes (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. S, M, L, XL or 41, 42, 43"
                                value={sizesInput}
                                onChange={(e) => setSizesInput(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>

                    {/* Specifications Key-Value rows */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Technical Specifications (Key-Value)
                            </label>
                            <button
                                type="button"
                                onClick={handleAddSpecRow}
                                className="text-xs font-bold text-[#2c1654] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Spec Row
                            </button>
                        </div>

                        {specifications.map((spec, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Property (e.g. Bluetooth)"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                                    className="w-1/2 px-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. 5.3)"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                                    className="w-1/2 px-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                                />
                                {specifications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSpecRow(idx)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Physical Attributes & Policy */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">7. Physical Specs & Warranty</h3>
                            <p className="text-xs text-gray-500">Weight, dimensions, warranty duration and replacement policy.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Weight (e.g. 250g)
                            </label>
                            <input
                                type="text"
                                placeholder="250g"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Dimensions (e.g. 15x10x5 cm)
                            </label>
                            <input
                                type="text"
                                placeholder="15x10x5 cm"
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Warranty Info
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 1 Year Brand Warranty"
                                value={warranty}
                                onChange={(e) => setWarranty(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Return Policy
                            </label>
                            <input
                                type="text"
                                placeholder="7 Days Replacement"
                                value={returnPolicy}
                                onChange={(e) => setReturnPolicy(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </div>

                {/* 8. Marketing Tags & Display Options */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#2c1654] text-amber-400 flex items-center justify-center font-bold">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">8. Storefront Marketing & Badges</h3>
                            <p className="text-xs text-gray-500">Configure search tags and promotional highlight badges.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Search Tags (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. wireless, headphones, bluetooth, audio, pro"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <label className="p-4 rounded-2xl border border-purple-100 bg-[#f8f7fc] flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-5 h-5 accent-[#2c1654] rounded-lg"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-gray-900">Featured Product</span>
                                    <span className="text-[10px] text-gray-500">Show on homepage featured grid</span>
                                </div>
                            </label>

                            <label className="p-4 rounded-2xl border border-purple-100 bg-[#f8f7fc] flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isTodayDeal}
                                    onChange={(e) => setIsTodayDeal(e.target.checked)}
                                    className="w-5 h-5 accent-[#2c1654] rounded-lg"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-gray-900">Today&apos;s Deal</span>
                                    <span className="text-[10px] text-gray-500">Show in flash deal campaign</span>
                                </div>
                            </label>

                            <label className="p-4 rounded-2xl border border-purple-100 bg-[#f8f7fc] flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isTrending}
                                    onChange={(e) => setIsTrending(e.target.checked)}
                                    className="w-5 h-5 accent-[#2c1654] rounded-lg"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-gray-900">Trending Product</span>
                                    <span className="text-[10px] text-gray-500">Show in trending products list</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button Bar */}
                <div className="sticky bottom-6 z-30 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xl flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-gray-500">
                        {selectedCategoryId ? "Category selected cleanly." : "Please choose a category before publishing."}
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/products")}
                            className="px-6 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUploadingThumbnail || isUploadingGallery}
                            className="px-8 py-3.5 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 text-amber-400" />
                            {isCreating ? "Publishing Product..." : "Publish Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

// === Recursive N-Level Dynamic Category Cascader Component ===
interface MultiLevelCategoryCascaderProps {
    onSelectCategory: (id: string, pathNames: string[]) => void;
}

function MultiLevelCategoryCascader({ onSelectCategory }: MultiLevelCategoryCascaderProps) {
    // Array of selected IDs at each level depth [level0Id, level1Id, level2Id, ...]
    const [chain, setChain] = useState<string[]>([]);
    // Array of selected Category Objects at each depth
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

    const handleSelectLevel = (cat: ICategory | null, levelDepth: number) => {
        if (!cat) {
            // Cleared selection at this level
            const newChain = chain.slice(0, levelDepth);
            const newCats = selectedCategories.slice(0, levelDepth);
            setChain(newChain);
            setSelectedCategories(newCats);

            const lastCat = newCats[newCats.length - 1];
            if (lastCat) {
                onSelectCategory(lastCat._id, newCats.map((c) => c.name));
            } else {
                onSelectCategory("", []);
            }
            return;
        }

        const newChain = [...chain.slice(0, levelDepth), cat._id];
        const newCats = [...selectedCategories.slice(0, levelDepth), cat];

        setChain(newChain);
        setSelectedCategories(newCats);
        onSelectCategory(cat._id, newCats.map((c) => c.name));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-start">
                {/* Level 0 (Root Level) */}
                <CascaderLevelSelect
                    parentId={null}
                    levelDepth={0}
                    selectedId={chain[0] || ""}
                    onSelect={(cat) => handleSelectLevel(cat, 0)}
                />

                {/* Render Level 1, 2, 3... 10 dynamically as long as the parent has subcategories */}
                {chain.map((parentId, depth) => (
                    <CascaderLevelSelect
                        key={`${parentId}_${depth}`}
                        parentId={parentId}
                        levelDepth={depth + 1}
                        selectedId={chain[depth + 1] || ""}
                        onSelect={(cat) => handleSelectLevel(cat, depth + 1)}
                    />
                ))}
            </div>
        </div>
    );
}

interface CascaderLevelSelectProps {
    parentId: string | null;
    levelDepth: number;
    selectedId: string;
    onSelect: (cat: ICategory | null) => void;
}

function CascaderLevelSelect({ parentId, levelDepth, selectedId, onSelect }: CascaderLevelSelectProps) {
    // If parentId is null, load root parent categories via GET /categories/parents
    const isRoot = parentId === null;

    // Call endpoints depending on whether root or subcategory
    const { data: parentsRes, isLoading: isLoadingParents } = useGetParentCategoriesQuery(undefined, {
        skip: !isRoot,
    });
    const { data: subsRes, isLoading: isLoadingSubs } = useGetSubcategoriesQuery(parentId || "", {
        skip: isRoot || !parentId,
    });

    const categoriesList: ICategory[] = isRoot ? (parentsRes?.data || []) : (subsRes?.data || []);
    const isLoading = isRoot ? isLoadingParents : isLoadingSubs;

    // Do not render next dropdown if there are no subcategories under selected parent
    if (!isRoot && !isLoading && categoriesList.length === 0) {
        return null;
    }

    return (
        <div className="w-full sm:w-64 space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-1">
                {levelDepth === 0 ? "📁 Main Root Category" : `📂 Level ${levelDepth} Subcategory`}
                {isLoading && <Loader2 className="w-3 h-3 animate-spin text-purple-600" />}
            </label>
            <select
                value={selectedId}
                disabled={isLoading}
                onChange={(e) => {
                    const found = categoriesList.find((c) => c._id === e.target.value);
                    onSelect(found || null);
                }}
                className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654] cursor-pointer disabled:opacity-50"
            >
                <option value="">
                    {isRoot ? "-- Select Main Category --" : `-- Select Level ${levelDepth} Subcategory --`}
                </option>
                {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
