import React from "react";
import { Shield, BadgeCheck, Truck, RotateCcw } from "lucide-react";

export function WhyShop() {
    return (
        <section className="py-16" style={{ background: "linear-gradient(135deg, #100828, #2c1654)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#c8960c" }}>
                        Our Promise
                    </p>
                    <h2 className="text-2xl font-black text-white">Why Shop With OpenMarketly</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        {
                            icon: Shield,
                            title: "Secure Payments",
                            desc: "SSL encryption on every transaction. Your payment data stays protected.",
                        },
                        {
                            icon: BadgeCheck,
                            title: "Verified Sellers",
                            desc: "Every seller is vetted and reviewed. Shop from trusted, certified merchants.",
                        },
                        {
                            icon: Truck,
                            title: "Fast Delivery",
                            desc: "Express delivery in most cities. Real-time tracking from checkout to door.",
                        },
                        {
                            icon: RotateCcw,
                            title: "Easy Returns",
                            desc: "30-day hassle-free returns on eligible items. Simple, fast, no questions asked.",
                        },
                    ].map(({ icon: Icon, title, desc }) => {
                        return (
                            <div key={title} className="rounded-2xl p-6 text-center border transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(200,150,12,0.2)" }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl" style={{ background: "linear-gradient(135deg, #c8960c, #e4b034)" }}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-black mb-2 text-sm">{title}</h3>
                                <p className="text-sm leading-relaxed text-purple-300">{desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
