import React, { useState } from "react";
import { ChevronRight, ZoomIn, Heart, Share2, Check, Clock, Truck, RotateCcw, Shield, ShoppingCart, ArrowRight } from "lucide-react";
import { StarRating } from "./StarRating";
import { ProductCard } from "./ProductCard";
import { Product, IMGS } from "./types";

interface ProductDetailPageProps {
    onBack: () => void;
    onShopClick: () => void;
    onAddToCart: (p: Product, color: string, size: string) => void;
    onCheckout: (p: Product, color: string, size: string) => void;
    product: Product;
    relatedProducts: Product[];
    onView: (p: Product) => void;
}

export function ProductDetailPage({ onBack, onShopClick, onAddToCart, onCheckout, product, relatedProducts, onView }: ProductDetailPageProps) {
    const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail || IMGS.headphones];
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState("Description");
    const [qty, setQty] = useState(1);
    const [activeColor, setActiveColor] = useState(product.colors?.[0] || "Default");
    const [activeSize, setActiveSize] = useState(product.sizes?.[0] || "Default");
    const [wishlisted, setWishlisted] = useState(false);

    const tabs = ["Description", "Specifications", "Reviews", "Shipping & Returns"];

    const specs = [
        ["Driver Size", "30mm dynamic driver unit"],
        ["Noise Cancellation", "Industry-leading ANC (8 mics)"],
        ["Weight", "250g"],
        ["Connectivity", "Bluetooth 5.2, multipoint"],
    ];

    const ratingDist = [
        { stars: 5, pct: 74 },
        { stars: 4, pct: 16 },
        { stars: 3, pct: 6 },
        { stars: 2, pct: 2 },
        { stars: 1, pct: 2 },
    ];

    return (
        <main>
            {/* Breadcrumb */}
            <div className="bg-[#f8f7fc] border-b border-purple-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                        {["Home", typeof product.category === "string" ? product.category : product.category?.name || "Products", product.name.split(" ").slice(0, 3).join(" ")].map((crumb, i, arr) => (
                            <span key={crumb} className="flex items-center gap-1.5">
                                <button onClick={i === 0 ? onBack : i === 1 ? onShopClick : undefined} className={i < arr.length - 1 ? "hover:text-[#2c1654] transition-colors font-medium cursor-pointer" : "text-gray-900 font-black pointer-events-none truncate max-w-[140px]"}>
                                    {crumb}
                                </button>
                                {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Product Main */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14">
                    {/* Left: Gallery */}
                    <div>
                        <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-4">
                            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <ZoomIn className="w-4.5 h-4.5 text-gray-600" />
                                </button>
                                <button onClick={() => setWishlisted(!wishlisted)} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Heart className={`w-4.5 h-4.5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                                </button>
                                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-4.5 h-4.5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2.5">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "ring-2" : "border-gray-200 hover:border-gray-400"}`} style={activeImage === i ? { borderColor: "#2c1654" } : {}}>
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#2c1654" }}>
                            {product.brand}
                        </p>
                        <h1 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

                        <div className="flex items-center flex-wrap gap-3 mb-4">
                            <StarRating rating={product.rating} size="md" />
                            <span className="text-sm font-black text-gray-800">{product.rating}</span>
                            <span className="text-sm text-gray-400">({(product.reviews || 120).toLocaleString()} reviews)</span>
                            <span className="flex items-center gap-1 text-sm text-emerald-600 font-bold">
                                <Check className="w-4 h-4" /> In Stock
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 mb-5">
                            SKU: <span className="font-mono text-gray-600">OM-PRD-{product._id.slice(-6).toUpperCase()}</span>
                        </p>

                        <p className="text-gray-600 text-sm leading-relaxed mb-5 pb-5 border-b border-gray-100">{product.description || "Experience this premium product, designed to offer high comfort and durability in everyday use."}</p>

                        {/* Price block */}
                        <div className="rounded-2xl p-5 mb-5 border" style={{ backgroundColor: "#f8f7fc", borderColor: "#e8e5f0" }}>
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-3xl font-black text-gray-900">৳{product.price.toLocaleString()}</span>
                                {product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                                        <span className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-full">-{product.discountPercentage || product.discount}%</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="text-xs font-black px-2.5 py-1 rounded-full border flex items-center gap-1"
                                    style={{
                                        color: "#c8960c",
                                        backgroundColor: "rgba(200,150,12,0.08)",
                                        borderColor: "rgba(200,150,12,0.3)",
                                    }}
                                >
                                    <Clock className="w-3 h-3" /> Limited Time Deal
                                </span>
                                {product.originalPrice > product.price && <span className="text-xs font-bold text-emerald-600">You save ৳{(product.originalPrice - product.price).toLocaleString()}!</span>}
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-bold text-gray-700 mb-2.5">
                                    Color: <span className="font-normal text-gray-500">{activeColor}</span>
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setActiveColor(color)}
                                            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                                            style={activeColor === color ? { borderColor: "#2c1654", backgroundColor: "#f5f0ff", color: "#2c1654" } : { borderColor: "#e5e7eb", color: "#4b5563" }}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-bold text-gray-700 mb-2.5">
                                    Size: <span className="font-normal text-gray-500">{activeSize}</span>
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setActiveSize(size)}
                                            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                                            style={activeSize === size ? { borderColor: "#2c1654", backgroundColor: "#f5f0ff", color: "#2c1654" } : { borderColor: "#e5e7eb", color: "#4b5563" }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex gap-3 mb-5 mt-6">
                            <button
                                onClick={() => onAddToCart(product, activeColor, activeSize)}
                                className="flex-1 text-white font-black py-4 rounded-2xl transition-opacity hover:opacity-90 flex items-center justify-center gap-2 text-sm shadow-2xl"
                                style={{ backgroundColor: "#2c1654", boxShadow: "0 8px 32px rgba(44,22,84,0.3)" }}
                            >
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </button>
                            <button onClick={() => onCheckout(product, activeColor, activeSize)} className="flex-1 font-black py-4 rounded-2xl transition-opacity hover:opacity-90 text-white text-sm" style={{ backgroundColor: "#c8960c" }}>
                                Buy Now
                            </button>
                        </div>

                        {/* Delivery info */}
                        <div className="border rounded-2xl p-4 space-y-3" style={{ borderColor: "#e8e5f0", backgroundColor: "#fbfaff" }}>
                            {[
                                {
                                    icon: ChevronRight, // fallbacks
                                    text: (
                                        <>
                                            <span className="font-semibold text-gray-700">Deliver to Dhaka, BD</span> ·{" "}
                                            <button className="font-bold hover:underline" style={{ color: "#2c1654" }}>
                                                Change
                                            </button>
                                        </>
                                    ),
                                },
                                {
                                    icon: Truck,
                                    text: (
                                        <>
                                            <span className="font-bold text-emerald-700">Free shipping</span> over ৳5,000
                                        </>
                                    ),
                                },
                                {
                                    icon: RotateCcw,
                                    text: (
                                        <>
                                            30-day easy returns ·{" "}
                                            <a href="#" className="font-bold" style={{ color: "#2c1654" }}>
                                                Learn more
                                            </a>
                                        </>
                                    ),
                                },
                                { icon: Shield, text: <span className="font-medium text-gray-700">Secure SSLCommerz payment</span> },
                            ].map(({ icon: Icon, text }, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Icon className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                                    <p className="text-sm text-gray-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-14">
                    <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className="px-6 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors" style={activeTab === tab ? { borderColor: "#2c1654", color: "#2c1654" } : { borderColor: "transparent", color: "#6b7280" }}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="pt-8">
                        {activeTab === "Description" && (
                            <div className="max-w-2xl space-y-4 text-gray-600 text-sm leading-relaxed">
                                <p>{product.description || "This high-performance item is crafted to satisfy strict quality control standards. Offering sleek styling and functional attributes that elevate your modern daily routine."}</p>
                                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                                    {["Vetted brand quality protection", "Quick charging and eco-friendly packaging", "Multi-surface adaptability", "Warranty support card included"].map((p) => (
                                        <li key={p}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === "Specifications" && (
                            <div className="max-w-lg overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {specs.map(([key, val], i) => (
                                            <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                <td className="px-5 py-3.5 font-bold text-gray-700 w-44">{key}</td>
                                                <td className="px-5 py-3.5 text-gray-600">{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === "Reviews" && (
                            <div className="max-w-3xl">
                                <div className="flex items-start gap-10 mb-10 p-6 bg-[#f8f7fc] rounded-2xl border border-purple-100">
                                    <div className="text-center shrink-0">
                                        <p className="text-6xl font-black text-gray-900 leading-none mb-2">{product.rating}</p>
                                        <StarRating rating={product.rating} size="md" />
                                        <p className="text-xs text-gray-500 mt-1">{(product.reviews || 120).toLocaleString()} reviews</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {ratingDist.map(({ stars, pct }) => (
                                            <div key={stars} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-600 w-8 text-right">{stars}★</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500 w-8">{pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "Shipping & Returns" && (
                            <div className="max-w-2xl space-y-7 text-sm text-gray-600">
                                {[
                                    {
                                        title: "Shipping Options",
                                        items: [
                                            ["Free standard delivery", "Orders over ৳5,000 · 3–5 business days"],
                                            ["Dhaka Metro shipping", "৳80 · 1–2 business days"],
                                            ["Outside Dhaka shipping", "৳150 · 3–5 business days"],
                                        ],
                                    },
                                ].map((section) => (
                                    <div key={section.title}>
                                        <h3 className="font-black text-gray-900 mb-3 text-base">{section.title}</h3>
                                        <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                            {section.items.map(([label, detail], i) => (
                                                <div key={label} className={`flex items-start justify-between gap-4 px-5 py-3.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                                        <span className="font-semibold text-gray-800">{label}</span>
                                                    </div>
                                                    <span className="text-gray-500 text-xs text-right">{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-14">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c8960c" }}>
                                    Discover
                                </p>
                                <h2 className="text-2xl font-black text-gray-900">You May Also Like</h2>
                            </div>
                            <button onClick={onShopClick} className="hidden sm:flex items-center gap-1.5 font-bold text-sm hover:opacity-70 transition-opacity" style={{ color: "#2c1654" }}>
                                See All <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {relatedProducts.slice(0, 4).map((p) => (
                                <ProductCard key={p._id} product={p} onView={onView} onAddToCart={() => onAddToCart(p, "Default", "Default")} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
