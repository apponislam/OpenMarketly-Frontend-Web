"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    useGetProductByIdQuery,
    useUpdateProductMutation,
    IProductVariant,
} from "@/redux/features/product/productApi";
import {
    useGetParentCategoriesQuery,
    useGetSubcategoriesQuery,
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
    ImageIcon,
    Loader2,
    FolderTree,
    ChevronRight,
    Sparkles,
    Box,
    X,
    Star,
} from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: productResponse, isLoading: isLoadingProduct } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });
    const product = productResponse?.data;

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    // Selected Final Category ID (at any depth)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);

    // Basic Details
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
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

    // Interactive Badge List for Search Tags
    const [tags, setTags] = useState<string[]>([]);

    // Product Variants Array
    const [variants, setVariants] = useState<IProductVariant[]>([]);

    // Dynamic Specifications Key-Value
    const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
        { key: "Material", value: "" },
    ]);

    // Shipping & Physical Specs
    const [weight, setWeight] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [warranty, setWarranty] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("7 Days Replacement");

    // Upload & Feedback States
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

    // Pre-fill form when product data arrives
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setBrand(product.brand || "");
            setUnit(product.unit || "Piece");
            setPrice(product.price ? String(product.price) : "");
            setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
            setDiscountPercentage(product.discountPercentage ? String(product.discountPercentage) : "");
            setStockQuantity(product.stockQuantity !== undefined ? String(product.stockQuantity) : "0");
            setShortDescription(product.shortDescription || "");
            setDescription(product.description || "");
            setThumbnail(product.thumbnail || "");
            setThumbnailPreview(product.thumbnail || "");
            setGalleryImages(product.images || []);
            setTags(product.tags || []);
            setVariants(product.variants || []);
            setSpecifications(
                product.specifications && product.specifications.length > 0
                    ? product.specifications
                    : [{ key: "Material", value: "" }]
            );
            setWeight(product.weight || "");
            setDimensions(product.dimensions || "");
            setWarranty(product.warranty || "");
            setReturnPolicy(product.returnPolicy || "7 Days Replacement");

            const catId = typeof product.category === "object" ? product.category._id : product.category;
            const catName = typeof product.category === "object" ? product.category.name : "";
            if (catId) {
                setSelectedCategoryId(catId);
                if (catName) setSelectedCategoryPath([catName]);
            }
        }
    }, [product]);

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
                setStatusMsg({ type: "error", text: "Cover photo upload failed: " + (err.message || "Unknown error") });
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
                if (!thumbnail) {
                    setThumbnail(cloudinaryUrl);
                    setThumbnailPreview(cloudinaryUrl);
                }
            } catch (err: any) {
                setStatusMsg({ type: "error", text: "Gallery photo upload failed: " + (err.message || "Unknown error") });
            } finally {
                setIsUploadingGallery(false);
            }
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        const removed = galleryImages[index];
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
        if (thumbnail === removed) {
            const next = galleryImages.find((_, i) => i !== index) || "";
            setThumbnail(next);
            setThumbnailPreview(next);
        }
    };

    const handleSetAsThumbnail = (url: string) => {
        setThumbnail(url);
        setThumbnailPreview(url);
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

    // Variants Builder Handlers
    const handleAddVariantRow = () => {
        setVariants((prev) => [
            ...prev,
            {
                color: "",
                size: "",
                price: Number(price) || 0,
                originalPrice: Number(originalPrice) || 0,
                discountPercentage: Number(discountPercentage) || 0,
                stockQuantity: 10,
                image: "",
            },
        ]);
    };

    const handleRemoveVariantRow = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: keyof IProductVariant, val: any) => {
        const updated = [...variants];
        const item = { ...updated[index], [field]: val };

        if (item.originalPrice && item.price && item.originalPrice > item.price) {
            item.discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
        } else {
            item.discountPercentage = 0;
        }

        updated[index] = item;
        setVariants(updated);
    };

    const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingVariantIndex(index);
            try {
                const cloudinaryUrl = await uploadToCloudinary(file);
                handleVariantChange(index, "image", cloudinaryUrl);
            } catch (err: any) {
                alert("Variant photo upload failed: " + (err.message || "Unknown error"));
            } finally {
                setUploadingVariantIndex(null);
            }
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

        const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

        const derivedColors = Array.from(
            new Set(variants.map((v) => (v.color ? v.color.trim() : "")).filter(Boolean))
        );
        const derivedSizes = Array.from(
            new Set(variants.map((v) => (v.size ? v.size.trim() : "")).filter(Boolean))
        );

        try {
            await updateProduct({
                id: productId,
                body: {
                    name: name.trim(),
                    brand: brand.trim() || undefined,
                    category: selectedCategoryId,
                    unit: unit.trim() || undefined,
                    price: Number(price),
                    originalPrice: originalPrice ? Number(originalPrice) : undefined,
                    discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
                    stockQuantity: Number(stockQuantity) || 0,
                    shortDescription: shortDescription.trim() || undefined,
                    description: description.trim(),
                    thumbnail: thumbnail || undefined,
                    images: galleryImages.length > 0 ? galleryImages : undefined,
                    colors: derivedColors.length > 0 ? derivedColors : undefined,
                    sizes: derivedSizes.length > 0 ? derivedSizes : undefined,
                    variants: variants.length > 0 ? variants : undefined,
                    specifications: validSpecs.length > 0 ? validSpecs : undefined,
                    weight: weight.trim() || undefined,
                    dimensions: dimensions.trim() || undefined,
                    warranty: warranty.trim() || undefined,
                    returnPolicy: returnPolicy.trim() || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                },
            }).unwrap();

            setStatusMsg({ type: "success", text: "Product updated successfully! Redirecting..." });
            setTimeout(() => {
                router.push("/dashboard/products");
            }, 1200);
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to update product." });
        }
    };

    if (isLoadingProduct) {
        return (
            <div className="py-24 text-center text-purple-700 font-bold flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" /> Loading product details...
            </div>
        );
    }

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
                title={`Edit Product: ${product?.name || ""}`}
                subtitle="Update product pricing, images, categories, variants, and specifications."
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
                {/* 1. Category Selection */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#2c1654] text-amber-400 flex items-center justify-center font-bold">
                                <FolderTree className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">1. Category Selection</h3>
                                <p className="text-xs text-gray-500">Select main category and subcategories for your product listing.</p>
                            </div>
                        </div>
                    </div>

                    <MultiLevelCategoryCascader
                        initialCategoryId={selectedCategoryId}
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

                {/* 2. Basic Product Information */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">2. Basic Information</h3>
                            <p className="text-xs text-gray-500">Enter product title, brand name and packaging unit.</p>
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

                {/* 3. Pricing & Inventory Stock */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">3. Base Pricing & Inventory Stock</h3>
                            <p className="text-xs text-gray-500">Configure selling price, original price, discount % and available stock.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 249.99"
                                    value={originalPrice}
                                    onChange={(e) => handleOriginalPriceChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                />
                                {discountPercentage && Number(discountPercentage) > 0 && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                                        ⚡ {discountPercentage}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Base Stock *
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

                {/* 4. Product Media & Photography */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">4. Product Photos & Gallery</h3>
                            <p className="text-xs text-gray-500">Upload primary cover thumbnail and additional product photos.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Cover Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Main Cover Photo
                            </label>
                            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 text-center hover:border-[#2c1654] transition-colors relative flex flex-col items-center justify-center min-h-[160px] bg-[#faf9fc]">
                                {isUploadingThumbnail ? (
                                    <div className="space-y-2 flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 text-[#2c1654] animate-spin" />
                                        <p className="text-xs font-bold text-[#2c1654]">Uploading photo...</p>
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
                                Gallery Photos
                            </label>
                            <div>
                                <label className="px-5 py-3 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-2xl cursor-pointer transition-colors inline-flex items-center gap-2 shadow-md">
                                    {isUploadingGallery ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                    ) : (
                                        <Upload className="w-4 h-4 text-amber-400" />
                                    )}
                                    {isUploadingGallery ? "Uploading Photo..." : "+ Upload Gallery Photo"}
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
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-3">
                                    {galleryImages.map((url, idx) => (
                                        <div key={idx} className="relative group border border-purple-100 rounded-2xl overflow-hidden bg-purple-50 aspect-square">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            {thumbnail === url && (
                                                <span className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-lg text-[9px] font-bold shadow flex items-center gap-0.5">
                                                    <Star className="w-3 h-3 fill-current" /> Cover
                                                </span>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetAsThumbnail(url)}
                                                    className="p-1.5 bg-amber-400 text-[#2c1654] rounded-lg text-[10px] font-bold hover:bg-amber-300 transition-colors shadow"
                                                    title="Set as Main Cover Photo"
                                                >
                                                    Set Cover
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGalleryImage(idx)}
                                                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
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
                            <p className="text-xs text-gray-500">Provide short summary highlights and complete details.</p>
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

                {/* 6. Product Variants & Options Matrix Builder */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#2c1654] text-amber-400 flex items-center justify-center font-bold">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">6. Product Variants & Options</h3>
                                <p className="text-xs text-gray-500">Configure custom price, stock, color, size & photo for individual product variations.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddVariantRow}
                            className="px-4 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:bg-[#3d2073] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                            <Plus className="w-4 h-4 text-amber-400" /> Add Variant Row
                        </button>
                    </div>

                    {variants.length > 0 ? (
                        <div className="space-y-4">
                            {variants.map((variant, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-[#faf9fc] border border-purple-100 space-y-4">
                                    <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                                        <span className="text-xs font-extrabold text-[#2c1654] uppercase tracking-wider">
                                            Variant Row #{idx + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariantRow(idx)}
                                            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Remove Row
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Color Option</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Red, Matte Black"
                                                value={variant.color || ""}
                                                onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2c1654]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Size / Specs Option</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. XL, 128GB"
                                                value={variant.size || ""}
                                                onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2c1654]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Selling Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price"
                                                value={variant.price || ""}
                                                onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Stock Qty</label>
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={variant.stockQuantity ?? 10}
                                                onChange={(e) => handleVariantChange(idx, "stockQuantity", Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Variant Photo</label>
                                            <div className="flex items-center gap-2">
                                                {variant.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={variant.image} alt="Variant" className="w-8 h-8 rounded-lg object-cover border shrink-0" />
                                                ) : null}
                                                <label className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#2c1654] font-bold text-[10px] rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-1 border border-purple-100">
                                                    {uploadingVariantIndex === idx ? (
                                                        <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                                                    ) : (
                                                        <Upload className="w-3 h-3 text-amber-500" />
                                                    )}
                                                    {uploadingVariantIndex === idx ? "Uploading..." : "Upload Photo"}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleVariantImageUpload(idx, e)}
                                                        disabled={uploadingVariantIndex === idx}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border border-dashed border-purple-200 rounded-2xl text-center bg-[#faf9fc] space-y-2">
                            <Package className="w-8 h-8 text-gray-300 mx-auto" />
                            <p className="text-xs text-gray-500 font-semibold">No variant rows added yet.</p>
                            <p className="text-[11px] text-gray-400">Click &quot;+ Add Variant Row&quot; above to configure custom pricing, color, size, and photo options.</p>
                        </div>
                    )}
                </div>

                {/* 7. Technical Key-Value Specifications */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                                <Box className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">7. Technical Specifications</h3>
                                <p className="text-xs text-gray-500">Define technical parameters like Material, Battery Life, Connectivity, etc.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddSpecRow}
                            className="text-xs font-bold text-[#2c1654] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Spec Row
                        </button>
                    </div>

                    <div className="space-y-3">
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

                {/* 8. Physical Attributes & Policy */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#2c1654] flex items-center justify-center font-bold">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">8. Physical Attributes & Shipping Specs</h3>
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

                {/* 9. Storefront Search Keywords */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#2c1654] text-amber-400 flex items-center justify-center font-bold">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">9. Storefront Search Keywords</h3>
                            <p className="text-xs text-gray-500">Add search keywords (press comma `,` to create badges) to help customers find your product.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Search Keywords & Tags</label>
                        <BadgeTagInput items={tags} onChange={setTags} placeholder="Type search keyword and press comma (e.g. wireless, headphones, bluetooth)" colorScheme="purple" />
                    </div>
                </div>

                {/* Sticky Bottom Action Bar */}
                <div className="sticky bottom-6 z-30 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xl flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-gray-500">
                        {selectedCategoryId ? "Category selected cleanly." : "Please choose a category before saving."}
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
                            disabled={isUpdating || isUploadingThumbnail || isUploadingGallery}
                            className="px-8 py-3.5 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 text-amber-400" />
                            {isUpdating ? "Saving Changes..." : "Save Product Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

// === Interactive Badge Tag Input Component ===
interface BadgeTagInputProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder: string;
    colorScheme?: "purple" | "amber";
}

function BadgeTagInput({ items, onChange, placeholder, colorScheme = "purple" }: BadgeTagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/^,|,$/g, "");
        if (trimmed && !items.includes(trimmed)) {
            onChange([...items, trimmed]);
            setInputValue("");
        }
    };

    const handleRemoveTag = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes(",")) {
                            const parts = val.split(",");
                            const newItems = [...items];
                            parts.forEach((p) => {
                                const clean = p.trim();
                                if (clean && !newItems.includes(clean)) {
                                    newItems.push(clean);
                                }
                            });
                            onChange(newItems);
                            setInputValue("");
                        } else {
                            setInputValue(val);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-purple-100 text-[#2c1654] font-bold text-xs rounded-2xl hover:bg-purple-200 transition-colors shrink-0 cursor-pointer"
                >
                    Add
                </button>
            </div>

            {items.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                    {items.map((item, idx) => (
                        <span
                            key={idx}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                colorScheme === "amber"
                                    ? "bg-amber-50 text-amber-900 border-amber-200"
                                    : "bg-purple-50 text-[#2c1654] border-purple-200"
                            }`}
                        >
                            <span>{item}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(idx)}
                                className="p-0.5 rounded-md hover:bg-black/10 transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// === Recursive Dynamic Category Cascader Component ===
interface MultiLevelCategoryCascaderProps {
    initialCategoryId?: string;
    onSelectCategory: (id: string, pathNames: string[]) => void;
}

function MultiLevelCategoryCascader({ initialCategoryId, onSelectCategory }: MultiLevelCategoryCascaderProps) {
    const [chain, setChain] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

    const handleSelectLevel = (cat: ICategory | null, levelDepth: number) => {
        if (!cat) {
            const newChain = chain.slice(0, levelDepth);
            const newCats = selectedCategories.slice(0, levelDepth);
            setChain(newChain);
            setSelectedCategories(newCats);

            const lastCat = newCats[newCats.length - 1];
            if (lastCat) {
                onSelectCategory(
                    lastCat._id,
                    newCats.map((c) => c.name)
                );
            } else {
                onSelectCategory("", []);
            }
            return;
        }

        const newChain = [...chain.slice(0, levelDepth), cat._id];
        const newCats = [...selectedCategories.slice(0, levelDepth), cat];

        setChain(newChain);
        setSelectedCategories(newCats);
        onSelectCategory(
            cat._id,
            newCats.map((c) => c.name)
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-start">
                <CascaderLevelSelect
                    parentId={null}
                    levelDepth={0}
                    selectedId={chain[0] || ""}
                    onSelect={(cat) => handleSelectLevel(cat, 0)}
                />

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
    const isRoot = parentId === null;

    const { data: parentsRes, isLoading: isLoadingParents } = useGetParentCategoriesQuery(undefined, {
        skip: !isRoot,
    });
    const { data: subsRes, isLoading: isLoadingSubs } = useGetSubcategoriesQuery(parentId || "", {
        skip: isRoot || !parentId,
    });

    const categoriesList: ICategory[] = isRoot ? (parentsRes?.data || []) : (subsRes?.data || []);
    const isLoading = isRoot ? isLoadingParents : isLoadingSubs;

    if (!isRoot && !isLoading && categoriesList.length === 0) {
        return null;
    }

    return (
        <div className="w-full sm:w-64 space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-1">
                {levelDepth === 0 ? "📁 Main Category" : `📂 Subcategory (Level ${levelDepth + 1})`}
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
                    {isRoot ? "-- Select Main Category --" : `-- Select Subcategory --`}
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
