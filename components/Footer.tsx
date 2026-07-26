"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
    onLogoClick: () => void;
}

export function Footer({ onLogoClick }: FooterProps) {
    return (
        <footer className="text-gray-400 pt-16 pb-8" style={{ backgroundColor: "#100828" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    <div className="lg:col-span-2">
                        <button onClick={onLogoClick} className="flex items-center gap-2.5 mb-4 cursor-pointer">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2c1654, #4a2b8c)" }}>
                                <span className="text-white font-black text-xs">OM</span>
                            </div>
                            <span className="text-xl font-black text-white">
                                Open<span style={{ color: "#c8960c" }}>Marketly</span>
                            </span>
                        </button>
                        <p className="text-sm leading-relaxed mb-6 max-w-xs text-gray-500">Everything you need, all in one marketplace. Shop from millions of verified sellers worldwide with confidence.</p>
                        <div className="flex items-center gap-2.5">
                            {["FB", "TW", "IG", "YT"].map((lbl) => (
                                <a key={lbl} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-xs font-black text-gray-500 hover:text-white" style={{ backgroundColor: "#1e1040" }}>
                                    {lbl}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-4 text-sm">Shop</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/shop" className="text-sm text-gray-500 hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=Electronics" className="text-sm text-gray-500 hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="/shop?category=Fashion" className="text-sm text-gray-500 hover:text-white transition-colors">Fashion</Link></li>
                            <li><Link href="/shop?category=Accessories" className="text-sm text-gray-500 hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-4 text-sm">Legal & Policies</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/return-policy" className="text-sm text-gray-500 hover:text-white transition-colors">Return & Refund Policy</Link></li>
                            <li><Link href="/shipping-policy" className="text-sm text-gray-500 hover:text-white transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-4 text-sm">Customer Support</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/faqs" className="text-sm text-gray-500 hover:text-white transition-colors">Help Center & FAQs</Link></li>
                            <li><Link href="/disputes" className="text-sm text-gray-500 hover:text-white transition-colors">Disputes & Tickets</Link></li>
                            <li><Link href="/feedback" className="text-sm text-gray-500 hover:text-white transition-colors">Submit Feedback</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-5" style={{ borderColor: "#1e1040" }}>
                    <p className="text-xs text-gray-600">
                        © 2026 OpenMarketly Inc. All rights reserved. ·{" "}
                        <Link href="/privacy-policy" className="hover:underline">Privacy</Link> ·{" "}
                        <Link href="/terms-and-conditions" className="hover:underline">Terms</Link>
                    </p>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-xs text-gray-600 mr-1">We accept:</span>
                        {["SSLCommerz", "VISA", "Mastercard", "bKash", "Nagad", "Rocket"].map((m) => (
                            <span key={m} className="text-gray-400 text-xs font-bold px-3 py-1.5 rounded-md border" style={{ backgroundColor: "#1a0e30", borderColor: "#2c1654" }}>
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
