"use client";
import React, { useState } from "react";
import { Search, ShoppingCart, Heart, MapPin, Globe, User, Package, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
    onLogoClick: () => void;
    cartCount: number;
    onCartOpen: () => void;
    onShopClick: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export function Header({ onLogoClick, cartCount, onCartOpen, onShopClick, searchQuery, setSearchQuery }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="bg-white border-b border-purple-100/80 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
                <div className="flex items-center gap-3 lg:gap-5">
                    {/* Logo */}
                    <button onClick={onLogoClick} className="flex items-center gap-2.5 shrink-0 cursor-pointer group">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            {/* Glowing back-drop */}
                            <div className="absolute inset-0 bg-[#c8960c]/25 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <svg className="w-10 h-10 transform transition-all group-hover:scale-110 group-hover:rotate-3 duration-300 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2c1654" />
                                        <stop offset="50%" stopColor="#4a2b8c" />
                                        <stop offset="100%" stopColor="#c8960c" />
                                    </linearGradient>
                                </defs>
                                {/* Styled background shield / bag */}
                                <path d="M25 35C25 22 35 12 50 12C65 12 75 22 75 35V72C75 79 69 85 62 85H38C31 85 25 79 25 72V35Z" fill="url(#logoGrad)" />
                                {/* Handle */}
                                <path d="M36 32C36 22 41 18 50 18C59 18 64 22 64 32" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
                                {/* Dynamic abstract overlap letter M */}
                                <path d="M38 52L50 42L62 52V70H55V59L50 54L45 59V70H38V52Z" fill="white" />
                                {/* Sparkle / Star point */}
                                <circle cx="70" cy="30" r="3" fill="#fff" className="animate-pulse" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900 hidden sm:block">
                            Open<span className="bg-gradient-to-r from-[#2c1654] via-[#4a2b8c] to-[#c8960c] bg-clip-text text-transparent">Marketly</span>
                        </span>
                    </button>
                    
                    {/* Search */}
                    <div className="flex-1 flex items-center bg-[#f8f7fc] border border-purple-100 rounded-xl overflow-hidden focus-within:border-[#2c1654] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
                        <input type="text" placeholder="Search for products, brands and more..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none" />
                        <button onClick={onShopClick} className="text-white px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 cursor-pointer" style={{ backgroundColor: "#2c1654" }}>
                            Search
                        </button>
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {[
                            { icon: MapPin, label: "Deliver to", action: undefined },
                            { icon: Globe, label: "EN / BDT", action: undefined },
                            { icon: User, label: "Sign In", action: () => router.push("/auth/login") },
                            { icon: Heart, label: "Wishlist", action: undefined },
                        ].map(({ icon: Icon, label, action }) => (
                            <button key={label} onClick={action} className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors group ${action ? "cursor-pointer" : "cursor-default"}`}>
                                <Icon className="w-5 h-5 text-gray-500 group-hover:text-[#2c1654] transition-colors" />
                                <span className="text-[10px] text-gray-500 group-hover:text-[#2c1654] leading-none transition-colors">{label}</span>
                            </button>
                        ))}
                        <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors group cursor-pointer">
                            <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-[#2c1654] transition-colors" />
                            <span className="text-[10px] text-gray-500 group-hover:text-[#2c1654] leading-none transition-colors">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1.5 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center" style={{ backgroundColor: "#c8960c" }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile */}
                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={onCartOpen} className="relative p-2 cursor-pointer">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center" style={{ backgroundColor: "#c8960c" }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl hover:bg-purple-50 cursor-pointer">
                            {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
                    {[
                        { icon: User, label: "Sign In / Register", action: () => { setMenuOpen(false); router.push("/auth/login"); } },
                        { icon: Heart, label: "Wishlist", action: undefined },
                        { icon: Package, label: "My Orders", action: undefined },
                        { icon: MapPin, label: "Change Location", action: undefined },
                    ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-sm font-semibold text-gray-700 transition-colors ${action ? "cursor-pointer" : "cursor-default"}`}>
                            <Icon className="w-5 h-5 text-[#2c1654]" /> {label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
