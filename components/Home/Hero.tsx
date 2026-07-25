import React from "react";
import { BadgeCheck, Shield, Truck, Zap } from "lucide-react";

interface HeroProps {
    activeHeroImg: string;
    bannerTitle?: string;
    bannerSubtitle?: string;
    onShopClick: () => void;
}

export function Hero({ activeHeroImg, bannerTitle = "New era of marketplace shopping", bannerSubtitle = "Discover products from trusted sellers, compare options, and shop everything you love.", onShopClick }: HeroProps) {
    return (
        <section className="relative overflow-hidden transition-all duration-700" style={{ background: "linear-gradient(135deg, #100828 0%, #2c1654 50%, #4a2b8c 100%)" }}>
            <div className="absolute inset-0">
                <img src={activeHeroImg} alt="Hero Lifestyle" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(16,8,40,0.95) 40%, rgba(16,8,40,0.6) 100%)" }} />
            </div>

            {/* Decorative gold elements */}
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 opacity-10" style={{ borderColor: "#c8960c" }} />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border opacity-20" style={{ borderColor: "#c8960c" }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
                <div className="max-w-xl">
                    <span
                        className="inline-flex items-center gap-2 border text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
                        style={{
                            borderColor: "#c8960c",
                            color: "#c8960c",
                            backgroundColor: "rgba(200,150,12,0.1)",
                        }}
                    >
                        <Zap className="w-3.5 h-3.5" /> {bannerTitle}
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
                        Everything
                        <br />
                        You Need.
                        <br />
                        <span style={{ color: "#c8960c" }}>
                            One Open
                            <br />
                            Marketplace.
                        </span>
                    </h1>
                    <p className="text-base text-purple-200 mb-9 leading-relaxed max-w-sm">{bannerSubtitle}</p>
                    <div className="flex flex-wrap gap-3 mb-10">
                        <button onClick={onShopClick} className="font-black px-8 py-3.5 rounded-xl transition-opacity hover:opacity-90 shadow-2xl text-sm" style={{ backgroundColor: "#c8960c", color: "#fff" }}>
                            Shop Now
                        </button>
                        <button onClick={onShopClick} className="border font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm text-white" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                            Explore Categories
                        </button>
                    </div>
                    <div className="flex items-center gap-8 flex-wrap">
                        {[
                            { icon: BadgeCheck, label: "Trusted Sellers" },
                            { icon: Shield, label: "Secure Checkout" },
                            { icon: Truck, label: "Fast Delivery" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-purple-300">
                                <Icon className="w-4 h-4" style={{ color: "#c8960c" }} />
                                <span className="text-xs font-semibold">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
