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
                    <button onClick={onLogoClick} className="flex items-center gap-2.5 shrink-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #2c1654, #4a2b8c)" }}>
                            <span className="text-white font-black text-xs tracking-tighter">OM</span>
                        </div>
                        <span className="text-lg font-black text-gray-900 hidden sm:block">
                            Open<span style={{ color: "#2c1654" }}>Marketly</span>
                        </span>
                    </button>
                    
                    {/* Search */}
                    <div className="flex-1 flex items-center bg-[#f8f7fc] border border-purple-100 rounded-xl overflow-hidden focus-within:border-[#2c1654] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
                        <input type="text" placeholder="Search for products, brands and more..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none" />
                        <button onClick={onShopClick} className="text-white px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: "#2c1654" }}>
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
                            <button key={label} onClick={action} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors group">
                                <Icon className="w-5 h-5 text-gray-500 group-hover:text-[#2c1654] transition-colors" />
                                <span className="text-[10px] text-gray-500 group-hover:text-[#2c1654] leading-none transition-colors">{label}</span>
                            </button>
                        ))}
                        <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors group">
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
                        <button onClick={onCartOpen} className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center" style={{ backgroundColor: "#c8960c" }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl hover:bg-purple-50">
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
                        <button key={label} onClick={action} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-sm font-semibold text-gray-700 transition-colors">
                            <Icon className="w-5 h-5 text-[#2c1654]" /> {label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
