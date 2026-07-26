"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ShieldCheck, FileText, RotateCcw, Truck, Clock } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useGetPolicyByTypeQuery } from "@/redux/features/policy/policyApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMyCartQuery, useUpdateCartItemQuantityMutation, useRemoveFromCartMutation } from "@/redux/features/cart/cartApi";

interface PolicyPageLayoutProps {
    type: "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS" | "RETURN_POLICY" | "SHIPPING_POLICY";
    title: string;
    description: string;
    defaultContent: string;
}

const POLICY_ICONS = {
    PRIVACY_POLICY: ShieldCheck,
    TERMS_AND_CONDITIONS: FileText,
    RETURN_POLICY: RotateCcw,
    SHIPPING_POLICY: Truck,
};

export function PolicyPageLayout({ type, title, description, defaultContent }: PolicyPageLayoutProps) {
    const router = useRouter();
    const user = useAppSelector(currentUser);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: policyData, isLoading } = useGetPolicyByTypeQuery(type);
    const { data: cartData } = useGetMyCartQuery(undefined, { skip: !user });

    const [updateCartQty] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cartItems = cartData?.data?.items || [];
    const cartCount = cartData?.data?.totalQuantity || 0;

    const policy = policyData?.data;
    const content = policy?.content || defaultContent;
    const updatedAt = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "July 2026";

    const Icon = POLICY_ICONS[type];

    const handleUpdateCartQty = async (productId: string, color: string, size: string, qty: number) => {
        try { await updateCartQty({ productId, color, size, quantity: qty }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to update quantity"); }
    };

    const handleRemoveCartItem = async (productId: string, color: string, size: string) => {
        try { await removeFromCart({ productId, color, size }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to remove item"); }
    };

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-[#0d0a1a] flex flex-col justify-between font-sans">
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

                {/* Banner Gradient Header */}
                <div className="py-10" style={{ background: "linear-gradient(135deg, rgb(44, 22, 84), rgb(74, 43, 140))" }}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <nav className="flex items-center gap-1.5 text-sm text-purple-300 mb-3">
                            <button onClick={() => router.push("/")} className="hover:text-white transition-colors font-medium">Home</button>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-purple-200 font-semibold">{title}</span>
                        </nav>
                        <div className="flex items-center gap-3.5 mt-2">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-amber-400 border border-white/10">
                                <Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white">{policy?.title || title}</h1>
                                <p className="text-purple-200 text-sm mt-1">{description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Document Container */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                    <div className="bg-white rounded-3xl border border-purple-100/50 p-6 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Last updated: {updatedAt}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                Official Policy
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="py-16 text-center text-gray-400 text-sm font-medium">Loading document...</div>
                        ) : (
                            <div
                                className="prose prose-purple max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4"
                                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
                            />
                        )}
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
