"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    HelpCircle,
    Search,
    ChevronDown,
    MessageSquare,
    Truck,
    CreditCard,
    ShieldCheck,
    RotateCcw,
    Sparkles,
} from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useGetAllFaqsQuery } from "@/redux/features/faq/faqApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMyCartQuery, useUpdateCartItemQuantityMutation, useRemoveFromCartMutation } from "@/redux/features/cart/cartApi";

const CATEGORY_ICONS: Record<string, any> = {
    Shipping: Truck,
    Payments: CreditCard,
    Returns: RotateCcw,
    Account: ShieldCheck,
    General: HelpCircle,
};

export default function HelpCenterFaqsPage() {
    const router = useRouter();
    const user = useAppSelector(currentUser);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [faqSearch, setFaqSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

    const { data: faqsData, isLoading } = useGetAllFaqsQuery();
    const { data: cartData } = useGetMyCartQuery(undefined, { skip: !user });

    const [updateCartQty] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cartItems = cartData?.data?.items || [];
    const cartCount = cartData?.data?.totalQuantity || 0;
    const faqs = faqsData?.data || [];

    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category || "General")))];

    // Filter FAQs
    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
            faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
        const matchesCategory = selectedCategory === "All" || (faq.category || "General") === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFaq = (id: string) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    const handleUpdateCartQty = async (productId: string, color: string, size: string, qty: number) => {
        try { await updateCartQty({ productId, color, size, quantity: qty }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to update quantity"); }
    };

    const handleRemoveCartItem = async (productId: string, color: string, size: string) => {
        try { await removeFromCart({ productId, color, size }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to remove item"); }
    };

    return (
        <div className="min-h-screen bg-[#fcfbfe] text-[#0d0a1a] flex flex-col justify-between font-sans">
            <div>
                {/* Global Navigation */}
                <AnnouncementBar />
                <Header
                    onLogoClick={() => router.push("/")}
                    cartCount={cartCount}
                    onCartOpen={() => setIsCartOpen(true)}
                    onShopClick={() => router.push("/shop")}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <CategoryNav activeCategory="" onCategoryClick={() => router.push("/shop")} />

                {/* Hero Header */}
                <div className="py-14 relative overflow-hidden bg-gradient-to-br from-[#1a0e36] via-[#2c1654] to-[#4a2b8c]">
                    <div className="absolute inset-0 opacity-10 bg-[radial-[#c8960c]_1px,transparent_1px] [background-size:16px_16px]" />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
                        <nav className="inline-flex items-center gap-2 text-xs font-semibold text-purple-200 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                            <button onClick={() => router.push("/")} className="hover:text-white transition-colors">Home</button>
                            <ChevronRight className="w-3 h-3 text-purple-300" />
                            <span className="text-white font-bold">Help Center & FAQs</span>
                        </nav>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">help you?</span>
                        </h1>
                        <p className="text-purple-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                            Search our help base or explore common topics below.
                        </p>

                        {/* Search Input */}
                        <div className="pt-2 max-w-2xl mx-auto">
                            <div className="relative group">
                                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#2c1654] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search questions, shipping rates, refunds, account..."
                                    value={faqSearch}
                                    onChange={(e) => setFaqSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl shadow-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
                    {/* Category Filter Badges */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center sm:text-left">
                            Browse by Category
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                            {categories.map((cat) => {
                                const IconComponent = CATEGORY_ICONS[cat] || HelpCircle;
                                const isActive = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? "bg-[#2c1654] text-white shadow-lg shadow-[#2c1654]/20 scale-105"
                                                : "bg-white text-gray-600 border border-purple-100/80 hover:bg-purple-50 hover:border-purple-200"
                                        }`}
                                    >
                                        <IconComponent className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-gray-400"}`} />
                                        <span>{cat}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQ Accordion Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {selectedCategory === "All" ? "Frequently Asked Questions" : `${selectedCategory} Questions`}
                            </h3>
                            <span className="text-xs text-gray-400 font-semibold">{filteredFaqs.length} results</span>
                        </div>

                        {isLoading ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-purple-100/50 shadow-sm">
                                <div className="w-8 h-8 border-3 border-[#2c1654] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-sm font-semibold text-gray-500">Loading help articles...</p>
                            </div>
                        ) : filteredFaqs.length > 0 ? (
                            <div className="space-y-3">
                                {filteredFaqs.map((faq) => {
                                    const isExpanded = expandedFaqId === faq._id;
                                    return (
                                        <div
                                            key={faq._id}
                                            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                                                isExpanded
                                                    ? "border-[#2c1654]/30 shadow-md shadow-purple-900/5"
                                                    : "border-purple-100/80 hover:border-purple-200 shadow-sm"
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(faq._id)}
                                                className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                                            >
                                                <div className="flex items-start gap-3.5">
                                                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                                        isExpanded ? "bg-[#2c1654] text-amber-400" : "bg-purple-50 text-[#2c1654]"
                                                    }`}>
                                                        <HelpCircle className="w-4 h-4" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="inline-block text-[10px] font-black uppercase text-[#c8960c] tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                                            {faq.category || "General"}
                                                        </span>
                                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                                                            {faq.question}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className={`p-1.5 rounded-xl shrink-0 transition-all ${
                                                    isExpanded ? "bg-purple-100 text-[#2c1654] rotate-180" : "text-gray-400"
                                                }`}>
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-5 pb-5 pt-2 text-sm text-gray-600 border-t border-purple-50 bg-[#faf9fc] leading-relaxed animate-in fade-in duration-150">
                                                    <p className="pl-11">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-purple-100/50 shadow-sm space-y-3">
                                <Sparkles className="w-10 h-10 text-gray-300 mx-auto" />
                                <h4 className="font-bold text-gray-800 text-base">No Matching Questions</h4>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    We couldn&apos;t find any FAQs matching your search query. Feel free to submit your question directly to support.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Support Contact Footer Banner */}
                    <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2c1654] to-[#4a2b8c] flex items-center justify-center text-white shrink-0 shadow-md">
                                <MessageSquare className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-base">Can&apos;t find what you&apos;re looking for?</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Submit feedback or raise a dispute ticket for personal assistance.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => router.push("/feedback")}
                                className="px-5 py-2.5 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                Submit Feedback
                            </button>
                            <button
                                onClick={() => router.push("/disputes")}
                                className="px-5 py-2.5 bg-white border border-purple-200 text-[#2c1654] hover:bg-purple-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Open Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer onLogoClick={() => router.push("/")} />

            {/* Cart Drawer */}
            <CartSidebar
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems as any}
                onUpdateQty={handleUpdateCartQty}
                onRemove={handleRemoveCartItem}
                onCheckout={() => router.push("/checkout")}
            />
        </div>
    );
}
