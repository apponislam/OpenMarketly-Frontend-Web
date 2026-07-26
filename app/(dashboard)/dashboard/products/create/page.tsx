"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";
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
} from "lucide-react";

export default function CreateProductPage() {
    const router = useRouter();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const { data: categoriesData } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data || [];

    // Basic Details
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
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
    const [newGalleryInput, setNewGalleryInput] = useState("");

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

    // Tags & Toggles
    const [tagsInput, setTagsInput] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isTodayDeal, setIsTodayDeal] = useState(false);
    const [isTrending, setIsTrending] = useState(false);

    // Messages
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Recursive helper to render infinite multi-level categories in select dropdown
    const getParentId = (c: any) => {
        if (!c.parentCategory) return null;
        return typeof c.parentCategory === "object" ? c.parentCategory._id : c.parentCategory;
    };

    const renderRecursiveCategoryOptions = (parentId: string | null = null, depth: number = 0): React.ReactNode[] => {
        const children = categories.filter((c) => getParentId(c) === parentId);
        let options: React.ReactNode[] = [];

        children.forEach((cat) => {
            const indent = "\u00A0\u00A0".repeat(depth * 3);
            const icon = depth === 0 ? "📁 " : "└── 📂 ";
            options.push(
                <option key={cat._id} value={cat._id}>
                    {indent}{icon}{cat.name}
                </option>
            );

            const subOptions = renderRecursiveCategoryOptions(cat._id, depth + 1);
            options = options.concat(subOptions);
        });

        return options;
    };

    // Image Upload Handlers
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setThumbnailPreview(result);
                setThumbnail(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddGalleryImage = () => {
        if (newGalleryInput.trim()) {
            setGalleryImages([...galleryImages, newGalleryInput.trim()]);
            setNewGalleryInput("");
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    // Specs Handlers
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

    // Calculate discount auto
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

    // Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMsg(null);

        if (!name.trim()) {
            setStatusMsg({ type: "error", text: "Product title/name is required." });
            return;
        }

        if (!category) {
            setStatusMsg({ type: "error", text: "Please select a product category." });
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

        // Process Arrays
        const colors = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);
        const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
        const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
        const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

        try {
            await createProduct({
                name: name.trim(),
                brand: brand.trim() || undefined,
                category,
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

            setStatusMsg({ type: "success", text: "Product created successfully! Redirecting to products list..." });
            setTimeout(() => {
                router.push("/dashboard/products");
            }, 1500);
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to create product." });
        }
    };

    return (
        <div className="space-y-8 w-full font-sans pb-16">
            {/* Header + Back Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push("/dashboard/products")}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#2c1654] transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Products List
                </button>
            </div>

            <DashboardPageHeader
                title="Create New Product"
                subtitle="Fill out all fields below to publish a new inventory listing to the marketplace."
            />

            {statusMsg && (
                <div
                    className={`p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 ${
                        statusMsg.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {statusMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. General Product Information */}
                <DashboardCard title="1. Basic Information" headerRight={<Package className="h-5 w-5 text-[#2c1654]" />}>
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Category / Subcategory *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            >
                                <option value="">-- Select Category / Subcategory --</option>
                                {renderRecursiveCategoryOptions()}
                            </select>
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Stock Keeping Unit (SKU)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. PRD-HEAD-001"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Unit Measure
                            </label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            >
                                <option value="Piece">Piece / Unit</option>
                                <option value="Kg">Kilogram (Kg)</option>
                                <option value="Gram">Gram (g)</option>
                                <option value="Liter">Liter (L)</option>
                                <option value="Pair">Pair</option>
                                <option value="Box">Box / Pack</option>
                                <option value="Set">Set</option>
                            </select>
                        </div>
                    </div>
                </DashboardCard>

                {/* 2. Pricing & Stock Inventory */}
                <DashboardCard title="2. Pricing & Stock Inventory" headerRight={<DollarSign className="h-5 w-5 text-emerald-600" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Selling Price (BDT) *
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 1499"
                                value={price}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Regular Price (MRP)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 1999"
                                value={originalPrice}
                                onChange={(e) => handleOriginalPriceChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Discount (% Off)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 25"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-emerald-600 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 50"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </DashboardCard>

                {/* 3. Product Descriptions */}
                <DashboardCard title="3. Product Descriptions" headerRight={<Layers className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Short Summary Description
                            </label>
                            <input
                                type="text"
                                placeholder="Brief 1-2 sentence highlight of key product benefits..."
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </DashboardCard>

                {/* 4. Product Media & Images */}
                <DashboardCard title="4. Product Media & Photography" headerRight={<ImageIcon className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Main Thumbnail Photo
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-[#2c1654] transition-colors relative flex flex-col items-center justify-center min-h-[160px] bg-gray-50/50">
                                {thumbnailPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="max-h-36 rounded-xl object-contain" />
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                        <p className="text-xs text-gray-500 font-medium">Click to select image file</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Gallery Images URLs */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Gallery Images (Image URLs)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="https://example.com/photo-2.jpg"
                                    value={newGalleryInput}
                                    onChange={(e) => setNewGalleryInput(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGalleryImage}
                                    className="px-4 py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
                                >
                                    Add Image
                                </button>
                            </div>

                            {/* Gallery Preview List */}
                            <div className="flex items-center gap-3 flex-wrap pt-2">
                                {galleryImages.map((img, i) => (
                                    <div key={i} className="relative group w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryImage(i)}
                                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DashboardCard>

                {/* 5. Product Variants (Colors & Sizes) */}
                <DashboardCard title="5. Variants (Colors & Sizes)" headerRight={<Tag className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Colors (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="Black, Midnight Blue, Silver, Rose Gold"
                                value={colorsInput}
                                onChange={(e) => setColorsInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Available Sizes (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="S, M, L, XL, XXL, 42, 44"
                                value={sizesInput}
                                onChange={(e) => setSizesInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </DashboardCard>

                {/* 6. Technical Specifications Key-Value */}
                <DashboardCard title="6. Technical Specifications" headerRight={<Shield className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="space-y-4">
                        {specifications.map((spec, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Attribute (e.g. Material, Battery)"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(i, "key", e.target.value)}
                                    className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. Leather, 5000mAh)"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                                    className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSpecRow(i)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddSpecRow}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-[#2c1654] font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4 text-amber-500" /> Add Specification Row
                        </button>
                    </div>
                </DashboardCard>

                {/* 7. Shipping, Physical & Warranty */}
                <DashboardCard title="7. Physical Attributes & Policy" headerRight={<Package className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Weight
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 450g / 1.2 kg"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Dimensions (LxWxH)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 20 x 15 x 8 cm"
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Warranty Information
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 1 Year Official Warranty"
                                value={warranty}
                                onChange={(e) => setWarranty(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Return Policy
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 7 Days Replacement Policy"
                                value={returnPolicy}
                                onChange={(e) => setReturnPolicy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>
                </DashboardCard>

                {/* 8. SEO Tags & Badges */}
                <DashboardCard title="8. Search Tags & Promotional Badges" headerRight={<Tag className="h-5 w-5 text-[#2c1654]" />}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Search Tags (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="headphones, bluetooth, wireless, bass, noise-cancelling"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 text-[#2c1654] rounded focus:ring-0"
                                />
                                <span className="text-xs font-bold text-gray-800">Featured Product</span>
                            </label>

                            <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={isTodayDeal}
                                    onChange={(e) => setIsTodayDeal(e.target.checked)}
                                    className="w-4 h-4 text-[#2c1654] rounded focus:ring-0"
                                />
                                <span className="text-xs font-bold text-gray-800">Today&apos;s Deal</span>
                            </label>

                            <label className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={isTrending}
                                    onChange={(e) => setIsTrending(e.target.checked)}
                                    className="w-4 h-4 text-[#2c1654] rounded focus:ring-0"
                                />
                                <span className="text-xs font-bold text-gray-800">Trending Product</span>
                            </label>
                        </div>
                    </div>
                </DashboardCard>

                {/* Final Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/products")}
                        className="px-6 py-3 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-8 py-3.5 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#2c1654]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 text-amber-400" />
                        {isCreating ? "Publishing Product..." : "Publish Product Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}
