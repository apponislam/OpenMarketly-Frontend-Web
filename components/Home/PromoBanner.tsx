import React from "react";
import { IMGS } from "../types";

interface PromoBannerProps {
    onShopClick: () => void;
}

export function PromoBanner({ onShopClick }: PromoBannerProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
            <div className="relative rounded-3xl overflow-hidden">
                <img src={IMGS.promo} alt="Promotional banner" className="w-full h-64 sm:h-80 object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(16,8,40,0.9) 40%, rgba(16,8,40,0.4) 100%)" }} />
                <div className="absolute inset-0 flex items-center px-8 sm:px-14 lg:px-20">
                    <div>
                        <p className="font-black text-xs mb-2 uppercase tracking-[0.2em]" style={{ color: "#c8960c" }}>
                            Limited Time Offer
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Upgrade Your Everyday</h2>
                        <p className="text-gray-300 mb-6 max-w-sm text-sm leading-relaxed">Find products that make life easier, smarter, and better.</p>
                        <button onClick={onShopClick} className="font-black px-8 py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm" style={{ backgroundColor: "#c8960c", color: "#fff" }}>
                            Explore Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
