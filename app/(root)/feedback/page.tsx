"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, MessageSquare, Send, CheckCircle2, AlertCircle, Bug, Lightbulb, HelpCircle } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useCreateFeedbackMutation } from "@/redux/features/feedback/feedbackApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMyCartQuery, useUpdateCartItemQuantityMutation, useRemoveFromCartMutation } from "@/redux/features/cart/cartApi";

export default function SubmitFeedbackPage() {
    const router = useRouter();
    const user = useAppSelector(currentUser);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [feedbackType, setFeedbackType] = useState<"BUG" | "SUGGESTION" | "OTHER">("SUGGESTION");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [createFeedback, { isLoading: isSubmitting }] = useCreateFeedbackMutation();
    const { data: cartData } = useGetMyCartQuery(undefined, { skip: !user });

    const [updateCartQty] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cartItems = cartData?.data?.items || [];
    const cartCount = cartData?.data?.totalQuantity || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMsg(null);

        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (!subject.trim() || !message.trim()) {
            setStatusMsg({ type: "error", text: "Please enter both subject and detailed message." });
            return;
        }

        try {
            await createFeedback({
                feedbackType,
                subject,
                message,
            }).unwrap();

            setStatusMsg({ type: "success", text: "Thank you! Your feedback has been submitted successfully to our team." });
            setSubject("");
            setMessage("");
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || "Failed to submit feedback." });
        }
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
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-3">
                        <nav className="inline-flex items-center gap-2 text-xs font-semibold text-purple-200 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                            <button onClick={() => router.push("/")} className="hover:text-white transition-colors">Home</button>
                            <ChevronRight className="w-3 h-3 text-purple-300" />
                            <span className="text-white font-bold">Submit Feedback</span>
                        </nav>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            We value your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Feedback</span>
                        </h1>
                        <p className="text-purple-200 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                            Report a bug, suggest a new feature, or help us improve OpenMarketly.
                        </p>
                    </div>
                </div>

                {/* Main Content Form Card */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                    <div className="bg-white rounded-3xl border border-purple-100/80 p-6 sm:p-10 shadow-xl shadow-purple-950/5 space-y-6">
                        <div className="flex items-center gap-3.5 pb-5 border-b border-purple-50">
                            <div className="p-3 bg-gradient-to-br from-[#2c1654] to-[#4a2b8c] text-amber-400 rounded-2xl shadow-md">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-gray-900">Feedback & Feature Request</h2>
                                <p className="text-xs text-gray-500">Submitted reports are reviewed directly by our product management team.</p>
                            </div>
                        </div>

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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Feedback Type Selection Cards */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Select Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { label: "Suggestion", value: "SUGGESTION", icon: Lightbulb, desc: "New idea or improvement" },
                                        { label: "Bug Report", value: "BUG", icon: Bug, desc: "Something isn't working" },
                                        { label: "Other", value: "OTHER", icon: HelpCircle, desc: "General feedback" },
                                    ].map((item) => {
                                        const isActive = feedbackType === item.value;
                                        const IconComp = item.icon;
                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => setFeedbackType(item.value as any)}
                                                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-1.5 ${
                                                    isActive
                                                        ? "bg-[#2c1654] text-white border-[#2c1654] shadow-lg shadow-[#2c1654]/15"
                                                        : "bg-white text-gray-700 border-purple-100 hover:border-purple-200 hover:bg-purple-50/50"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <IconComp className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-gray-400"}`} />
                                                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                                </div>
                                                <div className="font-bold text-sm">{item.label}</div>
                                                <p className={`text-[11px] leading-tight ${isActive ? "text-purple-200" : "text-gray-400"}`}>
                                                    {item.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Subject Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Add dark mode option / Bug in cart total"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-[#faf9fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654] focus:bg-white transition-all placeholder:text-gray-400"
                                />
                            </div>

                            {/* Message Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Detailed Message *
                                </label>
                                <textarea
                                    placeholder="Describe your feedback, suggestion, or the steps to reproduce the issue..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3.5 bg-[#faf9fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654] focus:bg-white transition-all placeholder:text-gray-400"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#2c1654]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 text-amber-400" />
                                {isSubmitting ? "Submitting Feedback..." : "Submit Feedback"}
                            </button>
                        </form>
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
